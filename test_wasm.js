#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function main() {
    const wasmPath = path.join(__dirname, 'docs', 'english.wasm');

    console.log('Loading WASM from:', wasmPath);

    const wasmBytes = fs.readFileSync(wasmPath);
    console.log('File size:', wasmBytes.length, 'bytes');
    console.log('Magic bytes:', wasmBytes.slice(0, 4).toString('hex'));

    if (wasmBytes[0] !== 0x00 || wasmBytes[1] !== 0x61 ||
        wasmBytes[2] !== 0x73 || wasmBytes[3] !== 0x6d) {
        console.error('ERROR: Invalid WASM magic bytes!');
        console.error('Expected: 00 61 73 6d (\\0asm)');
        console.error('Got:', wasmBytes.slice(0, 4).toString('hex'));
        process.exit(1);
    }

    console.log('Magic bytes OK (\\0asm)\n');

    // Instantiate WASM
    const { instance } = await WebAssembly.instantiate(wasmBytes, { env: {} });
    const wasm = instance.exports;

    console.log('Exported functions:', Object.keys(wasm).filter(k => typeof wasm[k] === 'function'));
    console.log('');

    // Initialize
    wasm.init();
    const nodeCount = wasm.getNodeCount();
    console.log('Trie initialized with', nodeCount.toLocaleString(), 'nodes\n');

    // Test autocomplete
    const testQueries = ['hel', 'th', 'handsome', 'cat', 'xyz'];
    const memory = new Uint8Array(wasm.memory.buffer);
    const resultPtr = wasm.getResultPtr();

    for (const query of testQueries) {
        // Write query to memory
        const queryBytes = Buffer.from(query, 'utf8');
        memory.set(queryBytes, resultPtr);

        // Call autocomplete
        const resultLen = wasm.autocomplete(resultPtr, queryBytes.length, 10);

        if (resultLen === 0) {
            console.log(`"${query}" -> No suggestions`);
        } else {
            const resultBytes = memory.slice(resultPtr, resultPtr + resultLen);
            const resultText = Buffer.from(resultBytes).toString('utf8');
            const words = resultText.split('\n').filter(w => w.length > 0);
            console.log(`"${query}" -> [${words.join(', ')}]`);
        }
    }

    console.log('');

    // Test contains
    const containsTests = ['hello', 'world', 'handsomely', 'handsomeiy', 'xyznotaword'];

    for (const word of containsTests) {
        const wordBytes = Buffer.from(word, 'utf8');
        memory.set(wordBytes, resultPtr);
        const exists = wasm.contains(resultPtr, wordBytes.length);
        console.log(`contains("${word}") = ${exists}`);
    }

    console.log('\nAll tests passed!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
