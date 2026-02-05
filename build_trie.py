#!/usr/bin/env python3
"""
Build a trie from dictionary words and serialize it for embedding in Zig.

The serialization format:
  Header (208 bytes):
    - u32: node_count
    - u32: checkpoint_count
    - [50]u32: level_basis
  Nodes (variable length per node):
    - u8: length byte
      - bits 0-1: children_mask byte length minus 1 (1-4 bytes)
      - bits 2-3: terminators_mask byte length minus 1 (1-4 bytes)
    - children_mask bytes (little-endian)
    - terminators_mask bytes (little-endian)
  Checkpoints (4 bytes each):
    - u32: cumulative popcount
"""

import struct
import sys
from typing import List, Tuple

# Super letter pairs (same as in trie.zig)
SUPER_PAIRS = ["th", "he", "in", "er", "an", "re"]

# Terminator-only suffix tokens (most common weighted by token savings)
TERMINATOR_SUFFIXES = ["ess", "ion", "ous", "ly", "ic", "al"]
TERM_SUFFIX_3 = {s: i for i, s in enumerate(TERMINATOR_SUFFIXES) if len(s) == 3}
TERM_SUFFIX_2 = {s: i for i, s in enumerate(TERMINATOR_SUFFIXES) if len(s) == 2}

class BuilderNode:
    __slots__ = ['children_mask', 'terminators_mask', 'children_offset']

    def __init__(self):
        self.children_mask: int = 0
        self.terminators_mask: int = 0
        self.children_offset: int = 0

class TrieBuilder:
    MAX_NODES = 1_500_000

    def __init__(self):
        self.nodes: List[BuilderNode] = [BuilderNode()]
        self.node_count: int = 1
        self.level_basis: List[int] = [0] * 50
        for i in range(1, 50):
            self.level_basis[i] = 1

    @staticmethod
    def tokenize(word: str) -> List[int]:
        """Convert word to token codes (0-31)."""
        tokens = []
        i = 0
        while i < len(word):
            matched = False
            for idx, pair in enumerate(SUPER_PAIRS):
                if i + 1 < len(word) and word[i:i+2] == pair:
                    tokens.append(26 + idx)
                    i += 2
                    matched = True
                    break
            if not matched:
                c = word[i]
                if 'a' <= c <= 'z':
                    tokens.append(ord(c) - ord('a'))
                i += 1
        return tokens

    def get_child_index(self, parent_idx: int, level: int, char_code: int) -> int:
        parent = self.nodes[parent_idx]
        start_of_next_level = self.level_basis[level + 1]

        mask_below = (1 << char_code) - 1
        children_before = bin(parent.children_mask & mask_below).count('1')

        return start_of_next_level + parent.children_offset + children_before

    def insert_child(self, parent_idx: int, level: int, char_code: int):
        if len(self.nodes) >= self.MAX_NODES:
            raise MemoryError("Out of memory")

        new_node_idx = self.get_child_index(parent_idx, level, char_code)

        # Insert new node at position
        self.nodes.insert(new_node_idx, BuilderNode())
        self.node_count += 1

        # Set the bit in parent's children mask
        self.nodes[parent_idx].children_mask |= (1 << char_code)

        # Calculate children_offset for new node
        new_node = self.nodes[new_node_idx]
        if new_node_idx > self.level_basis[level + 1]:
            prev = self.nodes[new_node_idx - 1]
            new_node.children_offset = prev.children_offset + bin(prev.children_mask).count('1')
        else:
            new_node.children_offset = 0

        # Update level_basis for all levels after
        for l in range(level + 2, 50):
            self.level_basis[l] += 1

        # Update children_offset for siblings after parent
        p = parent_idx + 1
        level_end = self.level_basis[level + 1]
        while p < level_end:
            self.nodes[p].children_offset += 1
            p += 1

    def add_word(self, word: str):
        if not word:
            return

        # Determine terminator token (longest suffix match)
        term_token = None
        prefix_len = len(word) - 1
        if len(word) >= 3:
            suffix3 = word[-3:]
            if suffix3 in TERM_SUFFIX_3:
                term_token = 26 + TERM_SUFFIX_3[suffix3]
                prefix_len = len(word) - 3
        if term_token is None and len(word) >= 2:
            suffix2 = word[-2:]
            if suffix2 in TERM_SUFFIX_2:
                term_token = 26 + TERM_SUFFIX_2[suffix2]
                prefix_len = len(word) - 2
        if term_token is None:
            term_token = ord(word[-1]) - ord('a')

        tokens = self.tokenize(word[:prefix_len])

        current_level = 0
        current_idx = 0

        for char_code in tokens:
            mask = 1 << char_code

            if (self.nodes[current_idx].children_mask & mask) == 0:
                self.insert_child(current_idx, current_level, char_code)

            current_idx = self.get_child_index(current_idx, current_level, char_code)
            current_level += 1

        self.nodes[current_idx].terminators_mask |= (1 << term_token)

    def serialize(self) -> bytes:
        """Serialize the trie to binary format."""
        valid_nodes = self.nodes[:self.node_count]

        # Calculate checkpoints
        num_checkpoints = (len(valid_nodes) // 32) + 1
        checkpoints = []
        running_total = 0
        for i, node in enumerate(valid_nodes):
            if i % 32 == 0:
                checkpoints.append(running_total)
            running_total += bin(node.children_mask).count('1')

        # Build binary data
        data = bytearray()

        # Header
        data.extend(struct.pack('<I', self.node_count))  # node_count
        data.extend(struct.pack('<I', num_checkpoints))  # checkpoint_count
        for lb in self.level_basis:
            data.extend(struct.pack('<I', lb))  # level_basis[50]

        def mask_bytes(mask: int) -> bytes:
            if mask == 0:
                return b"\x00"
            length = (mask.bit_length() + 7) // 8
            return mask.to_bytes(length, "little")

        # Nodes (packed)
        for node in valid_nodes:
            c_bytes = mask_bytes(node.children_mask)
            t_bytes = mask_bytes(node.terminators_mask)
            c_len = len(c_bytes)
            t_len = len(t_bytes)
            if not (1 <= c_len <= 4 and 1 <= t_len <= 4):
                raise ValueError(f"Invalid mask byte length: c={c_len}, t={t_len}")
            length_byte = ((t_len - 1) << 2) | (c_len - 1)
            data.append(length_byte)
            data.extend(c_bytes)
            data.extend(t_bytes)

        # Checkpoints
        for cp in checkpoints:
            data.extend(struct.pack('<I', cp))

        return bytes(data)


def main():
    words_file = "/usr/share/dict/words"
    output_file = "trie_data.bin"

    print(f"Reading words from {words_file}...")

    with open(words_file, 'r') as f:
        words = [line.strip().lower() for line in f]

    # Filter to only lowercase alphabetic words
    valid_words = [w for w in words if w.isalpha() and w.islower()]
    print(f"Found {len(valid_words)} valid words (lowercase alpha only)")

    print("Building trie...")
    builder = TrieBuilder()

    for i, word in enumerate(valid_words):
        if i % 50000 == 0:
            print(f"  Added {i} words, {builder.node_count} nodes...")
        builder.add_word(word)

    print(f"Trie built with {builder.node_count} nodes")

    print(f"Serializing to {output_file}...")
    data = builder.serialize()

    with open(output_file, 'wb') as f:
        f.write(data)

    print(f"Written {len(data)} bytes ({len(data) / 1024 / 1024:.2f} MB)")

    # Also write some stats
    print("\nStatistics:")
    print(f"  Node count: {builder.node_count}")
    print(f"  Level basis (first 20): {builder.level_basis[:20]}")


if __name__ == "__main__":
    main()
