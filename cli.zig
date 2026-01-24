const autocomplete = @import("autocomplete.zig");
const std = @import("std");

pub fn main() !void {
    // Zig 0.15+ buffered I/O
    var stdout_buf: [4096]u8 = undefined;
    var stdout_writer = std.fs.File.stdout().writer(&stdout_buf);
    const stdout = &stdout_writer.interface;

    var stdin_buf: [4096]u8 = undefined;
    var stdin_reader = std.fs.File.stdin().reader(&stdin_buf);
    const stdin = &stdin_reader.interface;

    const trie = autocomplete.EmbeddedTrie.init();

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
