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

                            token_buf[current.token_depth] = @intCast(bit);

                            // Build candidate
                            var tmp: [64]u8 = undefined;
                            const word_len = untokenize(token_buf[0 .. current.token_depth + 1], &tmp);
                            const cand = tmp[0..word_len];

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

// Global state for WASM
var global_trie: ?EmbeddedTrie = null;
var query_buffer: [256]u8 = undefined;
var result_buffer: [4096]u8 = undefined;

// WASM exports
export fn init() void {
    global_trie = EmbeddedTrie.init();
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
