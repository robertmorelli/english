const std = @import("std");
const testing = std.testing;

// Embed the pre-built trie data
const trie_data = @embedFile("trie_data.bin");

// Super letter pairs (must match build script)
const super_pairs = [_][]const u8{ "th", "he", "in", "er", "an", "re" };

// Terminator-only suffix tokens (must match build script)
const terminator_suffixes = [_][]const u8{ "ess", "ion", "ous", "ly", "ic", "al" };

const CompactNode = extern struct {
    children_mask: u32,
    terminators_mask: u32,
};

const HeaderSize = 8 + 50 * 4; // 208 bytes

const EmbeddedTrie = struct {
    nodes: []CompactNode,
    checkpoints: []u32,
    level_basis: [50]u32,
    allocator: std.mem.Allocator,

    pub fn init() EmbeddedTrie {
        return EmbeddedTrie.initFromBytes(trie_data, std.heap.page_allocator) catch unreachable;
    }

    pub fn initFromBytes(data: []const u8, allocator: std.mem.Allocator) !EmbeddedTrie {
        if (data.len < HeaderSize) return error.InvalidFormat;

        const node_count = std.mem.readInt(u32, data[0..4], .little);
        const checkpoint_count = std.mem.readInt(u32, data[4..8], .little);

        var level_basis: [50]u32 = undefined;
        for (0..50) |i| {
            const offset = 8 + i * 4;
            level_basis[i] = std.mem.readInt(u32, data[offset..][0..4], .little);
        }

        var nodes = try allocator.alloc(CompactNode, node_count);
        errdefer allocator.free(nodes);
        var checkpoints = try allocator.alloc(u32, checkpoint_count);
        errdefer allocator.free(checkpoints);

        const fixed_nodes_size = @as(usize, node_count) * 8;
        const fixed_total_size = HeaderSize + fixed_nodes_size + @as(usize, checkpoint_count) * 4;

        if (data.len == fixed_total_size) {
            // Legacy fixed-width format (8 bytes per node).
            var offset: usize = HeaderSize;
            for (0..node_count) |i| {
                const children_mask = std.mem.readInt(u32, data[offset..][0..4], .little);
                const terminators_mask = std.mem.readInt(u32, data[offset + 4 ..][0..4], .little);
                nodes[i] = .{
                    .children_mask = children_mask,
                    .terminators_mask = terminators_mask,
                };
                offset += 8;
            }

            var cp_offset: usize = HeaderSize + fixed_nodes_size;
            for (0..checkpoint_count) |i| {
                checkpoints[i] = std.mem.readInt(u32, data[cp_offset..][0..4], .little);
                cp_offset += 4;
            }
        } else {
            // Packed variable-width format.
            const checkpoints_bytes = @as(usize, checkpoint_count) * 4;
            if (data.len < HeaderSize + checkpoints_bytes) return error.InvalidFormat;
            const nodes_end = data.len - checkpoints_bytes;

            var offset: usize = HeaderSize;
            for (0..node_count) |i| {
                if (offset >= nodes_end) return error.InvalidFormat;
                const len_byte = data[offset];
                offset += 1;

                const children_len: usize = @as(usize, (len_byte & 0b11)) + 1;
                const terminators_len: usize = @as(usize, ((len_byte >> 2) & 0b11)) + 1;

                const children_mask = try readMask(data, &offset, nodes_end, children_len);
                const terminators_mask = try readMask(data, &offset, nodes_end, terminators_len);

                nodes[i] = .{
                    .children_mask = children_mask,
                    .terminators_mask = terminators_mask,
                };
            }

            if (offset != nodes_end) return error.InvalidFormat;

            var cp_offset: usize = nodes_end;
            for (0..checkpoint_count) |i| {
                checkpoints[i] = std.mem.readInt(u32, data[cp_offset..][0..4], .little);
                cp_offset += 4;
            }
        }

        return EmbeddedTrie{
            .nodes = nodes,
            .checkpoints = checkpoints,
            .level_basis = level_basis,
            .allocator = allocator,
        };
    }

    pub fn deinit(self: *EmbeddedTrie) void {
        self.allocator.free(self.nodes);
        self.allocator.free(self.checkpoints);
    }

    fn readMask(data: []const u8, offset: *usize, end: usize, len: usize) !u32 {
        if (len == 0 or len > 4) return error.InvalidFormat;
        if (offset.* + len > end) return error.InvalidFormat;

        var value: u32 = 0;
        for (0..len) |i| {
            const shift: u5 = @intCast(i * 8);
            value |= @as(u32, data[offset.* + i]) << shift;
        }
        offset.* += len;
        return value;
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

    fn getTerminatorToken(word: []const u8) ?struct { token: u5, prefix_len: usize } {
        if (word.len == 0) return null;
        for (word) |c| {
            if (c < 'a' or c > 'z') return null;
        }

        if (word.len >= 3) {
            const suffix3 = word[word.len - 3 ..];
            for (terminator_suffixes, 0..) |suffix, idx| {
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
            for (terminator_suffixes, 0..) |suffix, idx| {
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

    fn appendTerminatorToken(out_buffer: []u8, out_idx: *usize, token: u5) bool {
        if (token < 26) {
            if (out_idx.* + 1 > out_buffer.len) return false;
            out_buffer[out_idx.*] = @as(u8, 'a') + @as(u8, token);
            out_idx.* += 1;
            return true;
        }

        const suffix = terminator_suffixes[@as(usize, @intCast(token - 26))];
        if (out_idx.* + suffix.len > out_buffer.len) return false;
        @memcpy(out_buffer[out_idx.* ..][0..suffix.len], suffix);
        out_idx.* += suffix.len;
        return true;
    }

    //need two of these for the return in case of bigram
    const prefixLocation = ?struct { node_idx: u32, level: u32, tokens_used: usize };

    /// Navigate to a node given a prefix. Returns up to 2 starting locations:
    /// [0] = normal tokenization path
    /// [1] = backtrack path when the last typed char could be the first char of a super-pair
    fn navigateToPrefix(self: *const EmbeddedTrie, prefix: []const u8) [2]prefixLocation {
        var token_buf: [128]u8 = undefined;
        const token_len = tokenize(prefix, &token_buf);
        const tokens = token_buf[0..token_len];

        var current_idx: u32 = 0;
        var current_level: u32 = 0;

        if (tokens.len == 0) {
            return [2]prefixLocation{
                .{ .node_idx = 0, .level = 0, .tokens_used = 0 },
                null,
            };
        }

        for (tokens, 0..) |char_code, i| {
            const is_last = (i == tokens.len - 1);

            const prev_idx = current_idx;
            const prev_level = current_level;

            const mask = @as(u32, 1) << @intCast(char_code);

            if (is_last) {
                var alt: prefixLocation = null;

                // Slot-2 if last token is single letter that can start a super-pair (e.g. 't' -> "th")
                if (char_code < 26) {
                    const first_char: u8 = @as(u8, 'a') + @as(u8, @intCast(char_code));
                    for (super_pairs) |pair| {
                        if (pair[0] == first_char) {
                            alt = .{ .node_idx = prev_idx, .level = prev_level, .tokens_used = i };
                            break;
                        }
                    }
                }

                // Normal path: consume as child if possible
                if ((self.nodes[current_idx].children_mask & mask) != 0) {
                    const mask_below = mask - 1;
                    const rank = @popCount(self.nodes[current_idx].children_mask & mask_below);
                    const offset_base = self.getChildrenOffset(current_idx, current_level);
                    const level_start = self.level_basis[current_level + 1];

                    current_idx = level_start + offset_base + rank;
                    current_level += 1;

                    return [2]prefixLocation{
                        .{ .node_idx = current_idx, .level = current_level, .tokens_used = i + 1 },
                        alt,
                    };
                }

                // Exact-word match: keep old "no further completions" semantics for slot 0,
                // BUT still return slot-2 if it exists (this is the bug fix).
                if ((self.nodes[current_idx].terminators_mask & mask) != 0) {
                    if (alt) |a| return [2]prefixLocation{ null, a };
                    return [2]prefixLocation{ null, null };
                }

                // Not found: maybe slot-2 salvage
                if (alt) |a| return [2]prefixLocation{ null, a };
                return [2]prefixLocation{ null, null };
            }

            // Not last token: must exist as child
            if ((self.nodes[current_idx].children_mask & mask) == 0) {
                return [2]prefixLocation{ null, null };
            }

            const mask_below = mask - 1;
            const rank = @popCount(self.nodes[current_idx].children_mask & mask_below);
            const offset_base = self.getChildrenOffset(current_idx, current_level);
            const level_start = self.level_basis[current_level + 1];

            current_idx = level_start + offset_base + rank;
            current_level += 1;
        }

        return [2]prefixLocation{
            .{ .node_idx = 0, .level = 0, .tokens_used = 0 },
            null,
        };
    }

    inline fn childMatchesDangling(dangling_tok: u8, child_tok: u5) bool {
        // dangling_tok is always a single-letter token (0..25)
        const dangling_ch: u8 = @as(u8, 'a') + dangling_tok;

        if (child_tok < 26) {
            return (@as(u8, 'a') + @as(u8, @intCast(child_tok))) == dangling_ch;
        } else {
            const pair = super_pairs[@as(usize, @intCast(child_tok - 26))];
            return pair[0] == dangling_ch;
        }
    }

    pub fn autocomplete(self: *const EmbeddedTrie, prefix: []const u8, results: [][]u8, max_results: usize) usize {
        const navs = self.navigateToPrefix(prefix);

        var token_buf: [128]u8 = undefined;
        const full_prefix_token_len = tokenize(prefix, &token_buf);

        var result_count: usize = 0;

        // Try both navigation starts: normal and backtrack (if present).
        for (navs, 0..) |maybe_nav, nav_slot| {
            if (maybe_nav) |nav| {
                if (result_count >= max_results) continue;

                const base_depth: usize = nav.tokens_used;
                if (base_depth > full_prefix_token_len) continue;

                const is_backtrack = (nav_slot == 1);

                // If backtracking, the "dangling" token is the next token in the fully-tokenized prefix
                // (e.g. prefix="wort" tokenizes as [w,o,r,th]; slot-2 base_depth=3, dangling='t').
                const dangling_tok: u8 =
                    if (is_backtrack and base_depth < full_prefix_token_len)
                        token_buf[base_depth]
                    else
                        0;

                // DFS stack
                var stack: [64]struct { node_idx: u32, level: u32, token_depth: usize, token: u8 } = undefined;
                var stack_size: usize = 1;
                stack[0] = .{ .node_idx = nav.node_idx, .level = nav.level, .token_depth = base_depth, .token = 0 };

                while (stack_size > 0 and result_count < max_results) {
                    stack_size -= 1;
                    const current = stack[stack_size];

                    // Restore the token buffer for this path
                    if (current.token_depth > base_depth) {
                        token_buf[current.token_depth - 1] = current.token;
                    }

                    const node = self.nodes[current.node_idx];

                    // For the backtrack start node, do NOT emit terminators yet (we haven't consumed
                    // the dangling last typed character). This prevents bogus results like "wor*".
                    if (!(is_backtrack and current.token_depth == base_depth)) {
                        // Emit terminators
                        var t_mask = node.terminators_mask;
                        while (t_mask != 0 and result_count < max_results) {
                            const bit: u5 = @intCast(@ctz(t_mask));
                            t_mask &= t_mask - 1;

                            // Build candidate
                            var tmp: [64]u8 = undefined;
                            var out_idx = untokenize(token_buf[0..current.token_depth], &tmp);
                            if (!appendTerminatorToken(tmp[0..], &out_idx, bit)) continue;
                            const cand = tmp[0..out_idx];
                            const word_len = cand.len;

                            // MUST start with the original user prefix (this makes slot-2 correct)
                            if (!std.mem.startsWith(u8, cand, prefix)) continue;

                            // De-dupe across both nav passes
                            var dup = false;
                            for (0..result_count) |j| {
                                if (std.mem.eql(u8, results[j], cand)) {
                                    dup = true;
                                    break;
                                }
                            }
                            if (dup) continue;

                            @memcpy(results[result_count][0..word_len], cand);
                            results[result_count] = results[result_count][0..word_len];
                            result_count += 1;
                        }
                    }

                    // Children (reverse order so a-z order pops first)
                    var c_mask = node.children_mask;
                    var children_to_add: [32]u5 = undefined;
                    var child_count: usize = 0;

                    while (c_mask != 0) {
                        const bit: u5 = @intCast(@ctz(c_mask));
                        c_mask &= c_mask - 1;
                        children_to_add[child_count] = bit;
                        child_count += 1;
                    }

                    var ci: usize = child_count;
                    while (ci > 0) {
                        ci -= 1;
                        const bit = children_to_add[ci];

                        if (stack_size >= stack.len or current.token_depth >= token_buf.len - 1) continue;

                        // Slot-2 backtrack: first expansion MUST match the dangling letter
                        // (e.g. from "wor" the next token must start with 't' -> 't' or 'th').
                        if (is_backtrack and current.token_depth == base_depth) {
                            if (!childMatchesDangling(dangling_tok, bit)) continue;
                        }

                        const mask_below = (@as(u32, 1) << bit) - 1;
                        const rank = @popCount(node.children_mask & mask_below);
                        const offset_base = self.getChildrenOffset(current.node_idx, current.level);
                        const level_start = self.level_basis[current.level + 1];
                        const child_idx = level_start + offset_base + rank;

                        token_buf[current.token_depth] = @intCast(bit);

                        stack[stack_size] = .{
                            .node_idx = child_idx,
                            .level = current.level + 1,
                            .token_depth = current.token_depth + 1,
                            .token = @intCast(bit),
                        };
                        stack_size += 1;
                    }
                }
            }
        }

        return result_count;
    }

    /// Check if a word exists in the trie
    pub fn contains(self: *const EmbeddedTrie, word: []const u8) bool {
        const term = getTerminatorToken(word) orelse return false;

        var token_buf: [128]u8 = undefined;
        const len = tokenize(word[0..term.prefix_len], &token_buf);
        const tokens = token_buf[0..len];

        var current_idx: u32 = 0;
        var current_level: u32 = 0;

        for (tokens) |char_code| {
            const code: u5 = @intCast(char_code);
            const mask = @as(u32, 1) << code;
            if (self.nodes[current_idx].children_mask & mask == 0) return false;

            const mask_below = mask - 1;
            const rank = @popCount(self.nodes[current_idx].children_mask & mask_below);

            const offset_base = self.getChildrenOffset(current_idx, current_level);
            const level_start = self.level_basis[current_level + 1];

            current_idx = level_start + offset_base + rank;
            current_level += 1;
        }

        const term_mask = @as(u32, 1) << term.token;
        return (self.nodes[current_idx].terminators_mask & term_mask) != 0;
    }
};

// Global state for WASM
var global_trie: ?EmbeddedTrie = null;
var query_buffer: [256]u8 = undefined;
var result_buffer: [4096]u8 = undefined;

// WASM exports
export fn init() void {
    if (global_trie == null) {
        global_trie = EmbeddedTrie.init();
    }
}

export fn getNodeCount() u32 {
    if (global_trie) |trie| {
        return @intCast(trie.nodes.len);
    }
    return 0;
}

export fn getResultPtr() [*]u8 {
    return &query_buffer;
}

export fn autocomplete(input_ptr: [*]u8, input_len: usize, max_results: usize) usize {
    const trie = global_trie orelse return 0;

    // Copy query to temporary buffer since we'll overwrite input_ptr with results
    var query_copy: [256]u8 = undefined;
    const query_len = @min(input_len, query_copy.len);
    @memcpy(query_copy[0..query_len], input_ptr[0..query_len]);
    const query = query_copy[0..query_len];

    // Set up result slices
    var result_slices: [100][64]u8 = undefined;
    var slice_ptrs: [100][]u8 = undefined;
    for (0..100) |i| {
        slice_ptrs[i] = &result_slices[i];
    }

    const count = trie.autocomplete(query, &slice_ptrs, @min(max_results, 100));

    // Pack results into input_ptr buffer as newline-separated strings
    // (HTML reads from the same pointer it passed in)
    var offset: usize = 0;
    for (0..count) |i| {
        const word = slice_ptrs[i];
        if (offset + word.len + 1 >= query_buffer.len) break;
        @memcpy(input_ptr[offset..][0..word.len], word);
        input_ptr[offset + word.len] = '\n';
        offset += word.len + 1;
    }

    // Return total byte length (not count) - this is what HTML expects
    return offset;
}

export fn getResultBuffer() [*]u8 {
    return &result_buffer;
}

export fn contains(input_ptr: [*]u8, input_len: usize) bool {
    const trie = global_trie orelse return false;
    const query = input_ptr[0..input_len];
    return trie.contains(query);
}

fn maskByteLen(mask: u32) u8 {
    if (mask == 0) return 1;
    var m = mask;
    var len: u8 = 0;
    while (m != 0) : (len += 1) {
        m >>= 8;
    }
    return len;
}

fn appendU32LE(list: *std.ArrayList(u8), gpa: std.mem.Allocator, value: u32) !void {
    var buf: [4]u8 = undefined;
    std.mem.writeInt(u32, buf[0..], value, .little);
    try list.appendSlice(gpa, buf[0..]);
}

fn appendMaskBytes(list: *std.ArrayList(u8), gpa: std.mem.Allocator, mask: u32, len: u8) !void {
    var i: u8 = 0;
    while (i < len) : (i += 1) {
        const shift: u5 = @intCast(i * 8);
        const byte = @as(u8, @intCast((mask >> shift) & 0xFF));
        try list.append(gpa, byte);
    }
}

fn appendPackedNode(list: *std.ArrayList(u8), gpa: std.mem.Allocator, children_mask: u32, terminators_mask: u32) !void {
    const c_len = maskByteLen(children_mask);
    const t_len = maskByteLen(terminators_mask);
    const length_byte: u8 = ((t_len - 1) << 2) | (c_len - 1);
    try list.append(gpa, length_byte);
    try appendMaskBytes(list, gpa, children_mask, c_len);
    try appendMaskBytes(list, gpa, terminators_mask, t_len);
}

fn appendFixedNode(list: *std.ArrayList(u8), gpa: std.mem.Allocator, children_mask: u32, terminators_mask: u32) !void {
    try appendU32LE(list, gpa, children_mask);
    try appendU32LE(list, gpa, terminators_mask);
}

test "packed format simple trie contains" {
    var data = std.ArrayList(u8).empty;
    defer data.deinit(testing.allocator);

    const node_count: u32 = 3;
    const checkpoint_count: u32 = 1;

    try appendU32LE(&data, testing.allocator, node_count);
    try appendU32LE(&data, testing.allocator, checkpoint_count);

    var level_basis = [_]u32{0} ** 50;
    level_basis[1] = 1;
    level_basis[2] = 3;
    for (3..50) |i| level_basis[i] = 3;
    for (level_basis) |lb| try appendU32LE(&data, testing.allocator, lb);

    try appendPackedNode(&data, testing.allocator, 0b11, 0b11); // root
    try appendPackedNode(&data, testing.allocator, 0, 0b10); // "a" node (terminates "ab")
    try appendPackedNode(&data, testing.allocator, 0, 0); // "b" node
    try appendU32LE(&data, testing.allocator, 0); // checkpoint[0]

    var trie = try EmbeddedTrie.initFromBytes(data.items, testing.allocator);
    defer trie.deinit();

    try testing.expect(trie.contains("a"));
    try testing.expect(trie.contains("ab"));
    try testing.expect(trie.contains("b"));
    try testing.expect(!trie.contains("ba"));
    try testing.expect(!trie.contains("aa"));
}

test "fixed format simple trie contains" {
    var data = std.ArrayList(u8).empty;
    defer data.deinit(testing.allocator);

    const node_count: u32 = 3;
    const checkpoint_count: u32 = 1;

    try appendU32LE(&data, testing.allocator, node_count);
    try appendU32LE(&data, testing.allocator, checkpoint_count);

    var level_basis = [_]u32{0} ** 50;
    level_basis[1] = 1;
    level_basis[2] = 3;
    for (3..50) |i| level_basis[i] = 3;
    for (level_basis) |lb| try appendU32LE(&data, testing.allocator, lb);

    try appendFixedNode(&data, testing.allocator, 0b11, 0b11); // root
    try appendFixedNode(&data, testing.allocator, 0, 0b10); // "a" node (terminates "ab")
    try appendFixedNode(&data, testing.allocator, 0, 0); // "b" node
    try appendU32LE(&data, testing.allocator, 0); // checkpoint[0]

    var trie = try EmbeddedTrie.initFromBytes(data.items, testing.allocator);
    defer trie.deinit();

    try testing.expect(trie.contains("a"));
    try testing.expect(trie.contains("ab"));
    try testing.expect(trie.contains("b"));
    try testing.expect(!trie.contains("ba"));
    try testing.expect(!trie.contains("aa"));
}

test "packed format decodes 1-4 byte masks" {
    var data = std.ArrayList(u8).empty;
    defer data.deinit(testing.allocator);

    const node_count: u32 = 2;
    const checkpoint_count: u32 = 1;

    try appendU32LE(&data, testing.allocator, node_count);
    try appendU32LE(&data, testing.allocator, checkpoint_count);

    const level_basis = [_]u32{0} ** 50;
    for (level_basis) |lb| try appendU32LE(&data, testing.allocator, lb);

    const n0_children: u32 = 0x00000001; // 1 byte
    const n0_terms: u32 = 0x00000100; // 2 bytes
    const n1_children: u32 = 0x00010000; // 3 bytes
    const n1_terms: u32 = 0x80000000; // 4 bytes

    try appendPackedNode(&data, testing.allocator, n0_children, n0_terms);
    try appendPackedNode(&data, testing.allocator, n1_children, n1_terms);
    try appendU32LE(&data, testing.allocator, 0);

    var trie = try EmbeddedTrie.initFromBytes(data.items, testing.allocator);
    defer trie.deinit();

    try testing.expectEqual(n0_children, trie.nodes[0].children_mask);
    try testing.expectEqual(n0_terms, trie.nodes[0].terminators_mask);
    try testing.expectEqual(n1_children, trie.nodes[1].children_mask);
    try testing.expectEqual(n1_terms, trie.nodes[1].terminators_mask);
}

test "initFromBytes rejects truncated packed data" {
    var data = std.ArrayList(u8).empty;
    defer data.deinit(testing.allocator);

    const node_count: u32 = 1;
    const checkpoint_count: u32 = 1;

    try appendU32LE(&data, testing.allocator, node_count);
    try appendU32LE(&data, testing.allocator, checkpoint_count);

    const level_basis = [_]u32{0} ** 50;
    for (level_basis) |lb| try appendU32LE(&data, testing.allocator, lb);

    // No node data, only checkpoint: should fail.
    try appendU32LE(&data, testing.allocator, 0);

    try testing.expectError(error.InvalidFormat, EmbeddedTrie.initFromBytes(data.items, testing.allocator));
}

test "initFromBytes rejects extra packed bytes" {
    var data = std.ArrayList(u8).empty;
    defer data.deinit(testing.allocator);

    const node_count: u32 = 1;
    const checkpoint_count: u32 = 1;

    try appendU32LE(&data, testing.allocator, node_count);
    try appendU32LE(&data, testing.allocator, checkpoint_count);

    const level_basis = [_]u32{0} ** 50;
    for (level_basis) |lb| try appendU32LE(&data, testing.allocator, lb);

    try appendPackedNode(&data, testing.allocator, 0, 0);
    try data.append(testing.allocator, 0xAA); // stray byte that should not belong to nodes
    try appendU32LE(&data, testing.allocator, 0);

    try testing.expectError(error.InvalidFormat, EmbeddedTrie.initFromBytes(data.items, testing.allocator));
}

test "terminator suffix tokens in packed trie" {
    var data = std.ArrayList(u8).empty;
    defer data.deinit(testing.allocator);

    const node_count: u32 = 3;
    const checkpoint_count: u32 = 1;

    try appendU32LE(&data, testing.allocator, node_count);
    try appendU32LE(&data, testing.allocator, checkpoint_count);

    var level_basis = [_]u32{0} ** 50;
    level_basis[1] = 1;
    level_basis[2] = 2;
    for (3..50) |i| level_basis[i] = 3;
    for (level_basis) |lb| try appendU32LE(&data, testing.allocator, lb);

    const tok_ion: u5 = @intCast(26 + 1);
    const tok_ly: u5 = @intCast(26 + 3);
    const root_terms: u32 = (@as(u32, 1) << tok_ion) | (@as(u32, 1) << tok_ly);
    const node2_terms: u32 = (@as(u32, 1) << tok_ly);

    // root: terminators for "ion" and "ly", child 'a'
    try appendPackedNode(&data, testing.allocator, @as(u32, 1) << @as(u5, 0), root_terms);
    // node 'a': child 'l'
    try appendPackedNode(&data, testing.allocator, @as(u32, 1) << @as(u5, 11), 0);
    // node 'al': terminator "ly"
    try appendPackedNode(&data, testing.allocator, 0, node2_terms);

    try appendU32LE(&data, testing.allocator, 0);

    var trie = try EmbeddedTrie.initFromBytes(data.items, testing.allocator);
    defer trie.deinit();

    try testing.expect(trie.contains("ly"));
    try testing.expect(trie.contains("ion"));
    try testing.expect(trie.contains("ally"));
    try testing.expect(!trie.contains("al"));
    try testing.expect(!trie.contains("l"));
}

test "maskByteLen boundaries" {
    try testing.expectEqual(@as(u8, 1), maskByteLen(0));
    try testing.expectEqual(@as(u8, 1), maskByteLen(0xFF));
    try testing.expectEqual(@as(u8, 2), maskByteLen(0x100));
    try testing.expectEqual(@as(u8, 2), maskByteLen(0xFFFF));
    try testing.expectEqual(@as(u8, 3), maskByteLen(0x1_0000));
    try testing.expectEqual(@as(u8, 3), maskByteLen(0xFF_FFFF));
    try testing.expectEqual(@as(u8, 4), maskByteLen(0x1_000000));
    try testing.expectEqual(@as(u8, 4), maskByteLen(0x8000_0000));
}
