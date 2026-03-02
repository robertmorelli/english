#!/usr/bin/env node
/**
 * Test that the TypeScript bindings work correctly with the WASM file
 */
const fs = require('fs');
const path = require('path');

async function testBindings() {
    console.log('Testing WASM bindings...\n');

    // Check files exist
    const wasmPath = path.join(__dirname, 'docs', 'english.wasm');
    const bindingsPath = path.join(__dirname, 'docs', 'english.d.ts');

    if (!fs.existsSync(wasmPath)) {
        console.error('ERROR: english.wasm not found at', wasmPath);
        process.exit(1);
    }

    if (!fs.existsSync(bindingsPath)) {
        console.error('ERROR: english.d.ts not found at', bindingsPath);
        process.exit(1);
    }

    console.log('✓ Found english.wasm');
    console.log('✓ Found english.d.ts');
    console.log('');

    // Validate TypeScript bindings file
    const bindingsContent = fs.readFileSync(bindingsPath, 'utf8');
    const requiredMethods = ['isWord', 'getCompletions'];

    for (const method of requiredMethods) {
        if (!bindingsContent.includes(method)) {
            console.error(`ERROR: Bindings missing method '${method}'`);
            process.exit(1);
        }
    }
    if (!bindingsContent.includes('constructor')) {
        console.error('ERROR: Bindings missing constructor');
        process.exit(1);
    }
    console.log('✓ TypeScript bindings contain all required methods');
    console.log('');

    // Test WASM functionality with high-level API
    const wasmBytes = fs.readFileSync(wasmPath);

    // Inline EnglishTrie class implementation (matches english.js)
    class EnglishTrie {
        constructor(wasmPath) {
            return (async () => {
                const bytes = typeof wasmPath === 'string'
                    ? fs.readFileSync(wasmPath)
                    : wasmPath;

                const result = await WebAssembly.instantiate(bytes, { env: {} });

                this.wasm = result.instance.exports;
                this.encoder = new TextEncoder();
                this.decoder = new TextDecoder();
                this.wasm.init();

                return this;
            })();
        }

        isWord(word) {
            const normalized = word.trim().toLowerCase();
            const bytes = this.encoder.encode(normalized);
            const ptr = this.wasm.getResultBuffer();
            new Uint8Array(this.wasm.memory.buffer).set(bytes, ptr);
            return Boolean(this.wasm.contains(ptr, bytes.length));
        }

        getCompletions(prefix, maxResults = 100) {
            const normalized = prefix.trim().toLowerCase();
            if (!normalized) return [];

            const bytes = this.encoder.encode(normalized);
            const ptr = this.wasm.getResultPtr();
            new Uint8Array(this.wasm.memory.buffer).set(bytes, ptr);

            const resultLength = this.wasm.autocomplete(ptr, bytes.length, maxResults);
            const resultBytes = new Uint8Array(this.wasm.memory.buffer, ptr, resultLength);
            const resultString = this.decoder.decode(resultBytes);

            return resultString.trim().split(/\s+/).filter(Boolean);
        }
    }

    const trie = await new EnglishTrie(wasmPath);

    console.log('✓ Trie initialized successfully');

    // Test isWord function
    const testWords = [
        { word: 'hello', expected: true },
        { word: 'world', expected: true },
        { word: 'asdfghjkl', expected: false },
        { word: 'the', expected: true },
    ];

    for (const { word, expected } of testWords) {
        const result = trie.isWord(word);
        if (result !== expected) {
            console.error(`ERROR: isWord('${word}') = ${result}, expected ${expected}`);
            process.exit(1);
        }
    }
    console.log(`✓ isWord() correctly validates words`);

    // Test getCompletions function
    const completions = trie.getCompletions('hel', 5);
    if (!Array.isArray(completions)) {
        console.error('ERROR: getCompletions did not return an array');
        process.exit(1);
    }
    if (completions.length === 0) {
        console.error('ERROR: getCompletions returned no results');
        process.exit(1);
    }
    console.log(`✓ getCompletions() returns ${completions.length} results for "hel": [${completions.join(', ')}]`);

    console.log('\n✅ All bindings tests passed!');
}

testBindings().catch(err => {
    console.error('\n❌ Test failed:', err.message);
    process.exit(1);
});
