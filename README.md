# Compact English Trie

A space-optimized trie implementation containing the entire English dictionary (~236,000 words) in ~2.15 MB on disk (~4MB in-memory), with WebAssembly support for browser-based autocomplete.

## How It Works

### Data Structure

This trie uses a **bitset-based compact representation** instead of traditional pointer-based nodes. In-memory, each node is only 8 bytes:

```
CompactNode {
    children_mask: u32,      // Bitmask: which characters have child nodes
    terminators_mask: u32,   // Bitmask: which characters complete a word here
}
```

Each bit (0-31) represents a token:
- Bits 0-25: Letters 'a' through 'z'
- Bits 26-31: Super-letter pairs for `children_mask`
- Bits 26-31: Terminator-only suffix tokens for `terminators_mask`

### Super-Letter Optimization

Common two-letter pairs are compressed into single tokens:

| Token | Pair |
|-------|------|
| 26 | "th" |
| 27 | "he" |
| 28 | "in" |
| 29 | "er" |
| 30 | "an" |
| 31 | "re" |

For example, "there" is tokenized as `[26, 29, 4]` (th + er + e) instead of 5 separate characters.

### Terminator Suffix Optimization

The terminator bitset uses a separate suffix table to compress common word endings.
These tokens are **only** used to mark the end of a word; they are never used as child nodes.

| Token | Suffix |
|-------|--------|
| 26 | "ess" |
| 27 | "ion" |
| 28 | "ous" |
| 29 | "ly" |
| 30 | "ic" |
| 31 | "al" |

For example, "happiness" ends at the node for "happin" with terminator token 26 ("ess").

### Level-Based Storage

Nodes are organized by depth (level) rather than scattered in memory:

```
Level 0: [root]
Level 1: [a-node, b-node, c-node, ...]
Level 2: [aa-node, ab-node, ..., ba-node, bb-node, ...]
```

A `level_basis` array stores the starting index for each level, enabling O(1) navigation to any node's children using bit counting (`popcount`).

### Word Storage

Words are stored implicitly through the combination of:
1. **Path**: The sequence of characters traversed to reach a node
2. **Terminator bit**: Set in `terminators_mask` when a character completes a word

For "cat" and "cats":
- Navigate to the node representing "ca"
- Set `terminators_mask` bit 19 ('t') for "cat"
- Navigate to the node representing "cat"
- Set `terminators_mask` bit 18 ('s') for "cats"

## Files

| File | Purpose |
|------|---------|
| `trie.zig` | Core trie builder and frozen reader |
| `autocomplete.zig` | Autocomplete implementation with CLI and WASM support |
| `build_trie.py` | Python script to build trie from `/usr/share/dict/words` |
| `trie_data.bin` | Pre-built serialized trie (~2.15 MB) |
| `docs/` | Web demo with WASM-compiled autocomplete |

## Usage

### CLI

```bash
zig build-exe autocomplete.zig -O ReleaseFast
./autocomplete
```

```
Trie loaded: 514937 nodes
Type a prefix and press Enter for suggestions (or 'quit' to exit):

> hel
  Suggestions for 'hel':
    held
    helen
    helena
    helical
    helicopter
    ...
```

### Programmatic (Zig)

```zig
const trie = EmbeddedTrie.init();

// Check if a word exists
if (trie.contains("hello")) {
    // ...
}

// Get autocomplete suggestions
var results: [10][64]u8 = undefined;
var slices: [10][]u8 = undefined;
for (0..10) |i| slices[i] = &results[i];

const count = trie.autocomplete("hel", &slices, 10);
for (0..count) |i| {
    std.debug.print("{s}\n", .{slices[i]});
}
```

## Binary Format

The serialized format in `trie_data.bin`:

```
Header (208 bytes):
  u32: node_count
  u32: checkpoint_count
  [50]u32: level_basis

Nodes (variable length per node):
  u8: length byte
    - bits 0-1: children_mask byte length minus 1 (1-4 bytes)
    - bits 2-3: terminators_mask byte length minus 1 (1-4 bytes)
  children_mask bytes (little-endian)
  terminators_mask bytes (little-endian)

Checkpoints (4 bytes each):
  u32: cumulative popcount (for faster child offset calculation)

Note: checkpoints start at the end of the file. The packed nodes blob length is:
  file_size - header_size - checkpoint_count * 4
```

## Building the Trie

To rebuild from your system dictionary:

```bash
python3 build_trie.py
```

This reads `/usr/share/dict/words` and produces `trie_data.bin`.

## Algorithm Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Lookup | O(n) | O(1) |
| Autocomplete | O(k) | O(d) stack |
| Insert (build time) | O(n) | O(1) |

Where:
- n = word length in tokens
- k = total characters in output
- d = maximum word depth

## Memory Efficiency

Traditional pointer-based tries can use 64+ bytes per node. This implementation uses only 8 bytes per node, achieving ~5-8x compression while maintaining O(1) child access via bit operations.

Result: 236,000 English words in ~2.15 MB on disk (vs 10-20+ MB for traditional tries).
