// test.js
import fs from "node:fs";
import assert from "node:assert/strict";

const WASM_PATH = new URL("./docs/english.wasm", import.meta.url);

const MAX_RESULT_LEN = 128;
const MAX_COUNT_SANITY = 2000;

async function loadWasm() {
    const bytes = fs.readFileSync(WASM_PATH);
    const mod = await WebAssembly.compile(bytes);
    console.log("WASM exports:", WebAssembly.Module.exports(mod));
    return WebAssembly.instantiate(mod, {});
}

function normalizeInstance(x) {
    if (x && x.exports) return x;
    if (x && x.instance && x.instance.exports) return x.instance;
    throw new Error("Expected WebAssembly.Instance or {instance, module}");
}

function makeApi(maybeInstance) {
    const instance = normalizeInstance(maybeInstance);
    const E = instance.exports;

    if (!(E.memory instanceof WebAssembly.Memory)) throw new Error("WASM must export `memory`");

    for (const name of ["init", "getNodeCount", "getResultPtr", "autocomplete", "contains"]) {
        if (typeof E[name] !== "function") throw new Error(`Missing export: ${name}`);
    }

    const mem = E.memory;
    const enc = new TextEncoder();
    const dec = new TextDecoder("utf-8");

    const u8 = () => new Uint8Array(mem.buffer);

    E.init();
    const inputPtr = Number(E.getResultPtr());
    const INPUT_MAX = 256;

    function writeStr(s) {
        const b = enc.encode(s);
        const len = Math.min(b.length, INPUT_MAX - 1);
        u8().set(b.subarray(0, len), inputPtr);
        u8()[inputPtr + len] = 0;
        return { ptr: inputPtr >>> 0, len: len >>> 0 };
    }

    function getNodeCount() {
        return Number(E.getNodeCount());
    }

    function contains(word) {
        const { ptr, len } = writeStr(word);
        let r;
        try { r = Number(E.contains(ptr, len)); }
        catch { r = Number(E.contains(ptr)); }
        return r !== 0;
    }

    function autocomplete(prefix, maxResults = 50) {
        const { ptr, len } = writeStr(prefix);

        // WASM autocomplete returns total byte length of newline-separated results
        // written back to the input pointer
        const byteLen = Number(E.autocomplete(ptr, len, maxResults));

        if (byteLen < 0 || byteLen > MAX_COUNT_SANITY * MAX_RESULT_LEN) {
            throw new Error(`autocomplete('${prefix}') returned insane byteLen=${byteLen}`);
        }

        if (byteLen === 0) {
            return [];
        }

        // Read the newline-separated results from the input buffer
        const resultBytes = u8().subarray(ptr, ptr + byteLen);
        const resultStr = dec.decode(resultBytes);

        // Split by newline and filter out empty strings
        const results = resultStr.split('\n').filter(w => w.length > 0);
        return results;
    }

    return { getNodeCount, contains, autocomplete };
}

// ---------------- TESTS ----------------

const instantiation = await loadWasm();
const api = makeApi(instantiation);

// trie loads correctly
assert.ok(api.getNodeCount() > 0);

// contains common words
assert.ok(api.contains("hello"));
assert.ok(api.contains("world"));
assert.ok(api.contains("the"));
assert.ok(api.contains("computer"));
assert.ok(!api.contains("xyzzynotaword"));

// autocomplete works
{
    const r = api.autocomplete("hel", 10);
    assert.ok(r.length > 0);
    assert.ok(r.every((w) => w.length > 0), `autocomplete('hel') produced empty entries: ${JSON.stringify(r)}`);
}

// handsome autocomplete has no invalid variants
{
    const res = api.autocomplete("handsome", 50);
    for (const w of res) {
        assert.ok(w.length > 0, `empty suggestion returned for 'handsome'`);
        assert.ok(api.contains(w), `INVALID word from autocomplete('handsome'): '${w}'`);
        assert.notEqual(w, "handsomeiy");
        assert.notEqual(w, "handsomeiess");
        assert.notEqual(w, "handsomeiness");
    }
}

// backtrack on bigrams
{
    const res = api.autocomplete("wort", 50);
    // Zig test checks: navigateToPrefix("wort")[1] != null, count != 0
    assert.ok(res.length > 0, `backtrack on bigrams: expected results for 'wort' but got ${res.length}`);
    console.log(`count: ${res.length}`);
    for (const w of res) {
        console.log(w);
    }
}

// all autocomplete results must be valid words
{
    const prefixes = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
        "u", "v", "w", "x", "y", "z", "th", "he", "in", "er",
        "an", "re", "hand", "hands", "handsome", "hel", "the", "cat", "run", "walk",
        "beau", "quick", "ther", "there", "wh", "qu", "str", "pre",
    ];

    for (const p of prefixes) {
        const res = api.autocomplete(p, 500);
        for (const w of res) {
            assert.ok(w.length > 0, `empty suggestion for prefix '${p}'`);
            assert.ok(api.contains(w), `INVALID from prefix '${p}': '${w}'`);
        }
    }
}

// property: random walk through autocomplete
{
    function mulberry32(seed) {
        let t = seed >>> 0;
        return () => {
            t += 0x6D2B79F5;
            let x = t;
            x = Math.imul(x ^ (x >>> 15), x | 1);
            x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
            return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
        };
    }

    const rnd = mulberry32(12345);
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
            const res = api.autocomplete(prefix, 100).filter((w) => w.length > 0);
            if (res.length > 0) {
                const pick = res[Math.floor(rnd() * res.length)];
                totalChecks++;
                if (!api.contains(pick)) invalidCount++;
                prefix = pick;
            }
        } else {
            const remove = 1 + Math.floor(rnd() * 3);
            prefix = prefix.slice(0, Math.max(0, prefix.length - remove));
        }
    }

    assert.equal(invalidCount, 0, `property test: ${invalidCount} invalid out of ${totalChecks} checked`);
}

console.log("ALL WASM TESTS PASSED");
