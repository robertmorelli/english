#!/usr/bin/env bun
import fs from "node:fs";
import readline from "node:readline";

const WASM_PATH = new URL("./docs/english.wasm", import.meta.url);

async function loadWasm() {
    const bytes = fs.readFileSync(WASM_PATH);
    const mod = await WebAssembly.compile(bytes);
    return WebAssembly.instantiate(mod, {});
}

function makeApi(instance) {
    const E = instance.exports;
    const mem = E.memory;
    const enc = new TextEncoder();
    const dec = new TextDecoder("utf-8");
    const u8 = () => new Uint8Array(mem.buffer);

    // bump allocator - start after WASM data
    let bump = 6 << 20;
    function alloc(n) {
        const p = bump;
        bump = (bump + n + 7) & ~7;
        if (bump > mem.buffer.byteLength) {
            mem.grow(Math.ceil((bump - mem.buffer.byteLength) / 65536));
        }
        return p >>> 0;
    }

    function writeStr(s) {
        const b = enc.encode(s);
        const p = alloc(b.length + 1);
        u8().set(b, p);
        u8()[p + b.length] = 0;
        return { ptr: p, len: b.length };
    }

    E.init();

    return {
        getNodeCount() {
            return Number(E.getNodeCount());
        },
        contains(word) {
            const { ptr, len } = writeStr(word);
            return Number(E.contains(ptr, len)) !== 0;
        },
        autocomplete(prefix, maxResults = 20) {
            const { ptr, len } = writeStr(prefix);
            const byteLen = Number(E.autocomplete(ptr, len, maxResults));
            if (byteLen === 0) return [];
            const resultBytes = u8().subarray(ptr, ptr + byteLen);
            return dec.decode(resultBytes).split('\n').filter(w => w.length > 0);
        }
    };
}

const instance = await loadWasm();
const api = makeApi(instance);

console.log(`Trie loaded: ${api.getNodeCount()} nodes`);
console.log("Type a prefix and press Enter for suggestions (or 'quit' to exit):\n");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.setPrompt("> ");
rl.prompt();

rl.on("line", (line) => {
    const trimmed = line.trim().toLowerCase();
    if (!trimmed) {
        rl.prompt();
        return;
    }
    if (trimmed === "quit") {
        console.log("Goodbye!");
        rl.close();
        return;
    }

    const results = api.autocomplete(trimmed, 20);
    if (results.length === 0) {
        console.log(`  No suggestions for '${trimmed}'`);
    } else {
        console.log(`  Suggestions for '${trimmed}':`);
        for (const word of results) {
            console.log(`    ${word}`);
        }
    }
    console.log();
    rl.prompt();
});

rl.on("close", () => {
    process.exit(0);
});
