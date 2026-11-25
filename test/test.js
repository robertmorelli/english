import fs from "node:fs";
import assert from "node:assert/strict";
import { EnglishTrie } from "../src/english.js";

const WASM_PATH = new URL("../docs/english.wasm", import.meta.url);
const wasmBytes = fs.readFileSync(WASM_PATH);

// Bindings API tests
const trie = await new EnglishTrie(wasmBytes);

assert.equal(trie.isWord("hello"), true);
assert.equal(trie.isWord("world"), true);
assert.equal(trie.isWord("the"), true);
assert.equal(trie.isWord("computer"), true);
assert.equal(trie.isWord("HELLO"), true);
assert.equal(trie.isWord("xyzzynotaword"), false);
assert.equal(trie.isWord(""), false);

{
    const r = trie.getCompletions("hel", 10);
    assert.ok(r.length > 0);
    assert.ok(r.every((w) => w.length > 0));
}

// Handsome autocomplete has no invalid variants
{
    const res = trie.getCompletions("handsome", 50);
    for (const w of res) {
        assert.ok(w.length > 0, "empty suggestion returned for 'handsome'");
        assert.ok(trie.isWord(w), `invalid word from autocomplete('handsome'): '${w}'`);
        assert.notEqual(w, "handsomeiy");
        assert.notEqual(w, "handsomeiess");
        assert.notEqual(w, "handsomeiness");
    }
}

// Backtrack on bigrams
{
    const res = trie.getCompletions("wort", 50);
    assert.ok(res.length > 0, `expected results for 'wort' but got ${res.length}`);
}

// All autocomplete results must be valid words
{
    const prefixes = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
        "u", "v", "w", "x", "y", "z", "th", "he", "in", "er",
        "an", "re", "hand", "hands", "handsome", "hel", "the", "cat", "run", "walk",
        "beau", "quick", "ther", "there", "wh", "qu", "str", "pre",
    ];

    for (const p of prefixes) {
        const res = trie.getCompletions(p, 500);
        for (const w of res) {
            assert.ok(w.length > 0, `empty suggestion for prefix '${p}'`);
            assert.ok(trie.isWord(w), `invalid word from prefix '${p}': '${w}'`);
        }
    }
}

// Property test: random walk through autocomplete
{
    let t = 12345 >>> 0;
    const rnd = () => {
        t += 0x6D2B79F5;
        let x = t;
        x = Math.imul(x ^ (x >>> 15), x | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };

    const letters = "abcdefghijklmnopqrstuvwxyz";
    let prefix = "";
    let invalidCount = 0;
    let totalChecks = 0;

    for (let iter = 0; iter < 500; iter++) {
        const action = Math.floor(rnd() * 11);

        if (prefix.length === 0 || action < 3) {
            if (prefix.length < 60) {
                prefix += letters[Math.floor(rnd() * letters.length)];
            }
        } else if (action < 7) {
            const res = trie.getCompletions(prefix, 100);
            if (res.length > 0) {
                const pick = res[Math.floor(rnd() * res.length)];
                totalChecks++;
                if (!trie.isWord(pick)) invalidCount++;
                prefix = pick;
            }
        } else {
            const remove = 1 + Math.floor(rnd() * 3);
            prefix = prefix.slice(0, Math.max(0, prefix.length - remove));
        }
    }

    assert.equal(invalidCount, 0, `property test: ${invalidCount} invalid out of ${totalChecks} checked`);
}

console.log("All tests passed.");
