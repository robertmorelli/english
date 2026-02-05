const std = @import("std");
const testing = std.testing;

// --- CONFIGURATION ---
const MAX_NODES = 1_500_000;

const SuperLetterMap = struct {
    const pairs = [_][]const u8{ "th", "he", "in", "er", "an", "re" };
    // getBitIndex removed: we handle conversion in tokenize/loops directly
};

const TerminatorSuffixes = struct {
    // Most common endings weighted by token savings vs current encoding
    const tokens = [_][]const u8{ "ess", "ion", "ous", "ly", "ic", "al" };
};

const CompactNode = extern struct {
    children_mask: u32 = 0,
    terminators_mask: u32 = 0,
};

const BuilderNode = struct {
    children_mask: u32 = 0,
    terminators_mask: u32 = 0,
    children_offset: u32 = 0,
};

// --- THE BAKER ---

pub const TrieBuilder = struct {
    nodes: []BuilderNode,
    node_count: usize,
    level_basis: [50]u32,
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) !TrieBuilder {
        const memory = try allocator.alloc(BuilderNode, MAX_NODES);
        memory[0] = BuilderNode{};

        var t = TrieBuilder{
            .nodes = memory,
            .node_count = 1,
            .level_basis = [_]u32{0} ** 50,
            .allocator = allocator,
        };
        for (1..50) |i| t.level_basis[i] = 1;
        return t;
    }

    pub fn deinit(self: *TrieBuilder) void {
        self.allocator.free(self.nodes);
    }

    fn tokenize(word: []const u8, out_buffer: []u8) usize {
        var i: usize = 0;
        var out_idx: usize = 0;
        while (i < word.len) {
            var matched = false;
            for (SuperLetterMap.pairs, 0..) |pair, idx| {
                if (i + 1 < word.len and word[i] == pair[0] and word[i + 1] == pair[1]) {
                    out_buffer[out_idx] = @intCast(26 + idx);
                    out_idx += 1;
                    i += 2;
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                // Ensure we only process valid lowercase letters to prevent underflow
                if (word[i] >= 'a' and word[i] <= 'z') {
                    out_buffer[out_idx] = word[i] - 'a';
                    out_idx += 1;
                }
                i += 1;
            }
        }
        return out_idx;
    }

    fn getTerminatorToken(word: []const u8) ?struct { token: u5, prefix_len: usize } {
        if (word.len == 0) return null;
        // Validate input: lowercase letters only
        for (word) |c| {
            if (c < 'a' or c > 'z') return null;
        }

        if (word.len >= 3) {
            const suffix3 = word[word.len - 3 ..];
            for (TerminatorSuffixes.tokens, 0..) |suffix, idx| {
                if (suffix.len == 3 and std.mem.eql(u8, suffix, suffix3)) {
                    return .{
                        .token = @intCast(26 + idx),
                        .prefix_len = word.len - 3,
                    };
                }
            }
        }

        if (word.len >= 2) {
            const suffix2 = word[word.len - 2 ..];
            for (TerminatorSuffixes.tokens, 0..) |suffix, idx| {
                if (suffix.len == 2 and std.mem.eql(u8, suffix, suffix2)) {
                    return .{
                        .token = @intCast(26 + idx),
                        .prefix_len = word.len - 2,
                    };
                }
            }
        }

        return .{
            .token = @intCast(word[word.len - 1] - 'a'),
            .prefix_len = word.len - 1,
        };
    }

    pub fn addWord(self: *TrieBuilder, word: []const u8) !void {
        const term = getTerminatorToken(word) orelse return;

        var token_buf: [128]u8 = undefined;
        const len = tokenize(word[0..term.prefix_len], &token_buf);
        const tokens = token_buf[0..len];

        var current_level: u32 = 0;
        var current_idx: u32 = 0;

        for (tokens) |char_code| {
            // char_code is already 0-31. No conversion needed.
            const bit: u5 = @intCast(char_code);
            const mask = @as(u32, 1) << bit;

            if (self.nodes[current_idx].children_mask & mask == 0) {
                try self.insertChild(current_idx, current_level, char_code);
            }

            current_idx = self.getChildIndex(current_idx, current_level, char_code);
            current_level += 1;
        }

        self.nodes[current_idx].terminators_mask |= (@as(u32, 1) << term.token);
    }

    fn getChildIndex(self: *TrieBuilder, parent_idx: u32, level: u32, char_code: u8) u32 {
        const parent = self.nodes[parent_idx];
        const start_of_next_level = self.level_basis[level + 1];

        const bit_idx: u5 = @intCast(char_code);
        // Mask below: if bit_idx is 0, we want 0. If 1, we want 1.
        // (1 << 0) - 1 = 0. (1 << 1) - 1 = 1. Correct.
        const mask_below = (@as(u32, 1) << bit_idx) - 1;
        const children_before = @popCount(parent.children_mask & mask_below);

        return start_of_next_level + parent.children_offset + children_before;
    }

    fn insertChild(self: *TrieBuilder, parent_idx: u32, level: u32, char_code: u8) !void {
        if (self.node_count >= MAX_NODES) return error.OutOfMemory;

        const new_node_idx = self.getChildIndex(parent_idx, level, char_code);

        const end_idx = self.node_count;
        if (end_idx > new_node_idx) {
            std.mem.copyBackwards(BuilderNode, self.nodes[new_node_idx + 1 .. end_idx + 1], self.nodes[new_node_idx..end_idx]);
        }

        self.nodes[new_node_idx] = BuilderNode{};
        self.node_count += 1;

        const bit: u5 = @intCast(char_code);
        self.nodes[parent_idx].children_mask |= (@as(u32, 1) << bit);

        var new_node = &self.nodes[new_node_idx];
        if (new_node_idx > self.level_basis[level + 1]) {
            const prev = self.nodes[new_node_idx - 1];
            new_node.children_offset = prev.children_offset + @popCount(prev.children_mask);
        } else {
            new_node.children_offset = 0;
        }

        for ((level + 2)..50) |l| self.level_basis[l] += 1;

        var p = parent_idx + 1;
        const level_end = self.level_basis[level + 1];
        while (p < level_end) : (p += 1) {
            self.nodes[p].children_offset += 1;
        }
    }

    pub fn freeze(self: *TrieBuilder, allocator: std.mem.Allocator) !FrozenTrie {
        const valid_nodes = self.nodes[0..self.node_count];

        var compact_nodes = try allocator.alloc(CompactNode, valid_nodes.len);
        for (valid_nodes, 0..) |node, i| {
            compact_nodes[i] = CompactNode{
                .children_mask = node.children_mask,
                .terminators_mask = node.terminators_mask,
            };
        }

        const num_checkpoints = (valid_nodes.len / 32) + 1;
        var checkpoints = try allocator.alloc(u32, num_checkpoints);

        var running_total: u32 = 0;
        for (valid_nodes, 0..) |node, i| {
            if (i % 32 == 0) {
                checkpoints[i / 32] = running_total;
            }
            running_total += @popCount(node.children_mask);
        }

        return FrozenTrie{
            .nodes = compact_nodes,
            .checkpoints = checkpoints,
            .level_basis = self.level_basis,
            .allocator = allocator,
        };
    }
};

// --- THE READER ---

pub const FrozenTrie = struct {
    nodes: []CompactNode,
    checkpoints: []u32,
    level_basis: [50]u32,
    allocator: std.mem.Allocator,

    pub fn deinit(self: *FrozenTrie) void {
        self.allocator.free(self.nodes);
        self.allocator.free(self.checkpoints);
    }

    fn getChildrenOffset(self: *const FrozenTrie, node_idx: u32, level: u32) u32 {
        const level_start = self.level_basis[level];
        var total: u32 = 0;
        var i: u32 = level_start;
        while (i < node_idx) : (i += 1) {
            total += @popCount(self.nodes[i].children_mask);
        }
        return total;
    }

    pub fn contains(self: *const FrozenTrie, word: []const u8) bool {
        const term = TrieBuilder.getTerminatorToken(word) orelse return false;

        var token_buf: [128]u8 = undefined;
        const len = TrieBuilder.tokenize(word[0..term.prefix_len], &token_buf);
        const tokens = token_buf[0..len];

        var current_idx: u32 = 0;
        var current_level: u32 = 0;

        for (tokens) |char_code| {
            const code: u5 = @intCast(char_code);
            const mask = @as(u32, 1) << code;
            if (self.nodes[current_idx].children_mask & mask == 0) return false;

            const mask_below = mask - 1;
            const rank_in_node = @popCount(self.nodes[current_idx].children_mask & mask_below);

            const offset_base = self.getChildrenOffset(current_idx, current_level);
            const level_start = self.level_basis[current_level + 1];

            current_idx = level_start + offset_base + rank_in_node;
            current_level += 1;
        }

        const term_mask = @as(u32, 1) << term.token;
        return (self.nodes[current_idx].terminators_mask & term_mask) != 0;
    }
};

// --- UNIT TESTS ---

test "basic insert and retrieval" {
    var builder = try TrieBuilder.init(testing.allocator);
    defer builder.deinit();

    try builder.addWord("cat");
    try builder.addWord("cats");
    try builder.addWord("catch");

    var frozen = try builder.freeze(testing.allocator);
    defer frozen.deinit();

    try testing.expect(frozen.contains("cat"));
    try testing.expect(frozen.contains("cats"));
    try testing.expect(frozen.contains("catch"));
    try testing.expect(!frozen.contains("ca"));
    try testing.expect(!frozen.contains("dog"));
}

test "super letters optimization" {
    var builder = try TrieBuilder.init(testing.allocator);
    defer builder.deinit();

    try builder.addWord("the");

    var frozen = try builder.freeze(testing.allocator);
    defer frozen.deinit();

    try testing.expect(frozen.contains("the"));
    try testing.expect(!frozen.contains("th"));
}

test "terminator suffix tokens" {
    var builder = try TrieBuilder.init(testing.allocator);
    defer builder.deinit();

    const words = [_][]const u8{
        "happiness",
        "nation",
        "curious",
        "quickly",
        "basic",
        "final",
        "theic",
        "ly",
        "al",
        "running",
    };

    for (words) |w| try builder.addWord(w);

    var frozen = try builder.freeze(testing.allocator);
    defer frozen.deinit();

    for (words) |w| try testing.expect(frozen.contains(w));

    try testing.expect(!frozen.contains("happines"));
    try testing.expect(!frozen.contains("natio"));
    try testing.expect(!frozen.contains("curiou"));
    try testing.expect(!frozen.contains("quickl"));
    try testing.expect(!frozen.contains("basi"));
    try testing.expect(!frozen.contains("fina"));
    try testing.expect(!frozen.contains("thei"));
    try testing.expect(!frozen.contains("runnin"));
}

test "large number of nodes to trigger checkpoints" {
    var builder = try TrieBuilder.init(testing.allocator);
    defer builder.deinit();

    var buf: [10]u8 = undefined;
    for (0..26) |i| {
        buf[0] = @intCast('a' + i);
        try builder.addWord(buf[0..1]);

        for (0..26) |j| {
            buf[1] = @intCast('a' + j);
            try builder.addWord(buf[0..2]);

            // Add 3-letter words to create more nodes (level 2)
            for (0..26) |k| {
                buf[2] = @intCast('a' + k);
                try builder.addWord(buf[0..3]);
            }
        }
    }

    var frozen = try builder.freeze(testing.allocator);
    defer frozen.deinit();

    // With 3-letter words: 1 root + 26 level-1 + 676 level-2 = 703 nodes
    try testing.expect(frozen.checkpoints.len > 1);
    try testing.expect(frozen.contains("m"));
    try testing.expect(frozen.contains("mx"));
    try testing.expect(frozen.contains("mxy"));
    try testing.expect(!frozen.contains("mxyz"));
}
