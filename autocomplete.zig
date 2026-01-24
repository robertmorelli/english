const std = @import("std");

// Embed the pre-built trie data
const trie_data = @embedFile("trie_data.bin");

// Super letter pairs (must match build script)
const super_pairs = [_][]const u8{ "th", "he", "in", "er", "an", "re" };

const CompactNode = extern struct {
    children_mask: u32,
    terminators_mask: u32,
};

const EmbeddedTrie = struct {
    nodes: []const CompactNode,
    checkpoints: []const u32,
    level_basis: [50]u32,

    pub fn init() EmbeddedTrie {
        // Parse header
        const node_count = std.mem.readInt(u32, trie_data[0..4], .little);
        const checkpoint_count = std.mem.readInt(u32, trie_data[4..8], .little);

        var level_basis: [50]u32 = undefined;
        for (0..50) |i| {
            const offset = 8 + i * 4;
            level_basis[i] = std.mem.readInt(u32, trie_data[offset..][0..4], .little);
        }

        const header_size = 8 + 50 * 4; // 208 bytes
        const nodes_size = node_count * 8;

        // Cast nodes data to slice of CompactNode
        const nodes_ptr: [*]const CompactNode = @alignCast(@ptrCast(trie_data[header_size..].ptr));
        const nodes = nodes_ptr[0..node_count];

        // Cast checkpoints data
        const checkpoints_offset = header_size + nodes_size;
        const checkpoints_ptr: [*]const u32 = @alignCast(@ptrCast(trie_data[checkpoints_offset..].ptr));
        const checkpoints = checkpoints_ptr[0..checkpoint_count];

        return EmbeddedTrie{
            .nodes = nodes,
            .checkpoints = checkpoints,
            .level_basis = level_basis,
        };
    }

    fn getChildrenOffset(self: *const EmbeddedTrie, node_idx: u32, level: u32) u32 {
        const level_start = self.level_basis[level];
        var total: u32 = 0;
        var i: u32 = level_start;
        while (i < node_idx) : (i += 1) {
            total += @popCount(self.nodes[i].children_mask);
        }
        return total;
    }

    fn tokenize(word: []const u8, out_buffer: []u8) usize {
        var i: usize = 0;
        var out_idx: usize = 0;
        while (i < word.len and out_idx < out_buffer.len) {
            var matched = false;
            for (super_pairs, 0..) |pair, idx| {
                if (i + 1 < word.len and word[i] == pair[0] and word[i + 1] == pair[1]) {
                    out_buffer[out_idx] = @intCast(26 + idx);
                    out_idx += 1;
                    i += 2;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                if (word[i] >= 'a' and word[i] <= 'z') {
                    out_buffer[out_idx] = word[i] - 'a';
                    out_idx += 1;
                }
                i += 1;
            }
        }
        return out_idx;
    }

    fn untokenize(tokens: []const u8, out_buffer: []u8) usize {
        var out_idx: usize = 0;
        for (tokens) |t| {
            if (t < 26) {
                out_buffer[out_idx] = 'a' + t;
                out_idx += 1;
            } else {
                const pair = super_pairs[t - 26];
                out_buffer[out_idx] = pair[0];
                out_buffer[out_idx + 1] = pair[1];
                out_idx += 2;
            }
        }
        return out_idx;
    }

    /// Navigate to a node given a prefix. Returns (node_idx, level) or null if prefix not found.
    fn navigateToPrefix(self: *const EmbeddedTrie, prefix: []const u8) ?struct { node_idx: u32, level: u32, tokens_used: usize } {
        var token_buf: [128]u8 = undefined;
        const token_len = tokenize(prefix, &token_buf);
        const tokens = token_buf[0..token_len];

        var current_idx: u32 = 0;
        var current_level: u32 = 0;

        for (tokens, 0..) |char_code, i| {
            const is_last = (i == tokens.len - 1);
            const mask = @as(u32, 1) << @intCast(char_code);

            // Check if this character exists as a terminator (complete word here)
            // or as a child (more characters follow)

            // For the last token in prefix, we need to check if it's either:
            // 1. A terminator (word ends here)
            // 2. A child (can continue)
            if (is_last) {
                // Check if there's a child with this character
                if (self.nodes[current_idx].children_mask & mask != 0) {
                    // Navigate to that child
                    const mask_below = mask - 1;
                    const rank = @popCount(self.nodes[current_idx].children_mask & mask_below);
                    const offset_base = self.getChildrenOffset(current_idx, current_level);
                    const level_start = self.level_basis[current_level + 1];
                    current_idx = level_start + offset_base + rank;
                    current_level += 1;
                    return .{ .node_idx = current_idx, .level = current_level, .tokens_used = i + 1 };
                } else if (self.nodes[current_idx].terminators_mask & mask != 0) {
                    // Word terminates here - return current node but mark that we consumed the token
                    // This is a complete word match, no more completions beyond exact match
                    return null; // Exact match, no further completions
                } else {
                    return null; // Character not found
                }
            }

            // Not the last token - must have a child
            if (self.nodes[current_idx].children_mask & mask == 0) {
                return null;
            }

            const mask_below = mask - 1;
            const rank = @popCount(self.nodes[current_idx].children_mask & mask_below);
            const offset_base = self.getChildrenOffset(current_idx, current_level);
            const level_start = self.level_basis[current_level + 1];

            current_idx = level_start + offset_base + rank;
            current_level += 1;
        }

        // Empty prefix - return root
        return .{ .node_idx = 0, .level = 0, .tokens_used = 0 };
    }

    /// Get autocomplete suggestions for a prefix
    pub fn autocomplete(self: *const EmbeddedTrie, prefix: []const u8, results: [][]u8, max_results: usize) usize {
        const nav = self.navigateToPrefix(prefix) orelse return 0;

        var token_buf: [128]u8 = undefined;
        const prefix_token_len = tokenize(prefix, &token_buf);

        var result_count: usize = 0;

        // DFS to find all words from this node
        var stack: [64]struct { node_idx: u32, level: u32, token_depth: usize } = undefined;
        var stack_size: usize = 1;
        stack[0] = .{ .node_idx = nav.node_idx, .level = nav.level, .token_depth = prefix_token_len };

        while (stack_size > 0 and result_count < max_results) {
            stack_size -= 1;
            const current = stack[stack_size];

            const node = self.nodes[current.node_idx];

            // Check all terminators at this node
            var t_mask = node.terminators_mask;
            while (t_mask != 0 and result_count < max_results) {
                const bit: u5 = @intCast(@ctz(t_mask));
                t_mask &= t_mask - 1;

                // Add this complete word
                token_buf[current.token_depth] = bit;
                const word_len = untokenize(token_buf[0 .. current.token_depth + 1], results[result_count]);
                results[result_count] = results[result_count][0..word_len];
                result_count += 1;
            }

            // Add children to stack (in reverse order so we process a-z in order)
            var c_mask = node.children_mask;
            var children_to_add: [32]u5 = undefined;
            var child_count: usize = 0;

            while (c_mask != 0) {
                const bit: u5 = @intCast(@ctz(c_mask));
                c_mask &= c_mask - 1;
                children_to_add[child_count] = bit;
                child_count += 1;
            }

            // Add in reverse order
            var ci: usize = child_count;
            while (ci > 0) {
                ci -= 1;
                const bit = children_to_add[ci];

                if (stack_size >= stack.len or current.token_depth >= token_buf.len - 1) continue;

                const mask_below = (@as(u32, 1) << bit) - 1;
                const rank = @popCount(node.children_mask & mask_below);
                const offset_base = self.getChildrenOffset(current.node_idx, current.level);
                const level_start = self.level_basis[current.level + 1];
                const child_idx = level_start + offset_base + rank;

                token_buf[current.token_depth] = bit;

                stack[stack_size] = .{
                    .node_idx = child_idx,
                    .level = current.level + 1,
                    .token_depth = current.token_depth + 1,
                };
                stack_size += 1;
            }
        }

        return result_count;
    }

    /// Check if a word exists in the trie
    pub fn contains(self: *const EmbeddedTrie, word: []const u8) bool {
        var i: usize = 0;
        var current_idx: u32 = 0;
        var current_level: u32 = 0;

        while (i < word.len) {
            var code: u5 = 0;
            var is_pair = false;

            for (super_pairs, 0..) |pair, p_idx| {
                if (i + 1 < word.len and word[i] == pair[0] and word[i + 1] == pair[1]) {
                    code = @intCast(26 + p_idx);
                    i += 2;
                    is_pair = true;
                    break;
                }
            }
            if (!is_pair) {
                if (word[i] < 'a' or word[i] > 'z') return false;
                code = @intCast(word[i] - 'a');
                i += 1;
            }

            if (i == word.len) {
                const mask = @as(u32, 1) << code;
                return (self.nodes[current_idx].terminators_mask & mask) != 0;
            }

            const mask = @as(u32, 1) << code;
            if (self.nodes[current_idx].children_mask & mask == 0) return false;

            const mask_below = mask - 1;
            const rank = @popCount(self.nodes[current_idx].children_mask & mask_below);

            const offset_base = self.getChildrenOffset(current_idx, current_level);
            const level_start = self.level_basis[current_level + 1];

            current_idx = level_start + offset_base + rank;
            current_level += 1;
        }
        return false;
    }
};

pub fn main() !void {
    // Zig 0.15+ buffered I/O
    var stdout_buf: [4096]u8 = undefined;
    var stdout_writer = std.fs.File.stdout().writer(&stdout_buf);
    const stdout = &stdout_writer.interface;

    var stdin_buf: [4096]u8 = undefined;
    var stdin_reader = std.fs.File.stdin().reader(&stdin_buf);
    const stdin = &stdin_reader.interface;

    const trie = EmbeddedTrie.init();

    try stdout.print("Trie loaded: {} nodes\n", .{trie.nodes.len});
    try stdout.print("Type a prefix and press Enter for suggestions (or 'quit' to exit):\n\n", .{});
    try stdout.flush();

    // Allocate buffers for results
    var result_storage: [20][64]u8 = undefined;
    var result_slices: [20][]u8 = undefined;
    for (0..20) |i| {
        result_slices[i] = &result_storage[i];
    }

    while (true) {
        try stdout.print("> ", .{});
        try stdout.flush();

        const line = stdin.takeDelimiterExclusive('\n') catch |err| switch (err) {
            error.EndOfStream => break,
            else => return err,
        };

        const trimmed = std.mem.trim(u8, line, " \t\r\n");
        if (trimmed.len == 0) continue;
        if (std.mem.eql(u8, trimmed, "quit")) break;

        // Convert to lowercase
        var lower_buf: [256]u8 = undefined;
        var lower_len: usize = 0;
        for (trimmed) |c| {
            if (c >= 'A' and c <= 'Z') {
                lower_buf[lower_len] = c + 32;
            } else {
                lower_buf[lower_len] = c;
            }
            lower_len += 1;
        }
        const prefix = lower_buf[0..lower_len];

        // Reset result slices
        for (0..20) |i| {
            result_slices[i] = &result_storage[i];
        }

        const count = trie.autocomplete(prefix, &result_slices, 20);

        if (count == 0) {
            try stdout.print("  No suggestions for '{s}'\n", .{prefix});
        } else {
            try stdout.print("  Suggestions for '{s}':\n", .{prefix});
            for (0..count) |i| {
                try stdout.print("    {s}\n", .{result_slices[i]});
            }
        }
        try stdout.print("\n", .{});
        try stdout.flush();
    }

    try stdout.print("Goodbye!\n", .{});
    try stdout.flush();
}

// Tests
const testing = std.testing;

test "trie loads correctly" {
    const trie = EmbeddedTrie.init();
    try testing.expect(trie.nodes.len > 0);
}

test "contains common words" {
    const trie = EmbeddedTrie.init();
    try testing.expect(trie.contains("hello"));
    try testing.expect(trie.contains("world"));
    try testing.expect(trie.contains("the"));
    try testing.expect(trie.contains("computer"));
    try testing.expect(!trie.contains("xyzzynotaword"));
}

test "autocomplete works" {
    const trie = EmbeddedTrie.init();

    var result_storage: [10][64]u8 = undefined;
    var result_slices: [10][]u8 = undefined;
    for (0..10) |i| {
        result_slices[i] = &result_storage[i];
    }

    const count = trie.autocomplete("hel", &result_slices, 10);
    try testing.expect(count > 0);
}
