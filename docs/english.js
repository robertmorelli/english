/**
 * English Dictionary Trie - JavaScript Wrapper
 *
 * Usage (Browser):
 *   const dict = await EnglishDictionary.load('english.wasm');
 *   const suggestions = dict.autocomplete('hel', 10);
 *   const isWord = dict.contains('hello');
 *
 * Usage (Node.js):
 *   const { EnglishDictionary } = require('./english.js');
 *   const dict = await EnglishDictionary.load('./english.wasm');
 */

class EnglishDictionary {
    constructor(wasm) {
        this._wasm = wasm;
        this._memory = wasm.memory;
        this._encoder = new TextEncoder();
        this._decoder = new TextDecoder();
    }

    /**
     * Load the dictionary from a WASM file
     * @param {string} wasmPath - Path or URL to english.wasm
     * @returns {Promise<EnglishDictionary>}
     */
    static async load(wasmPath) {
        let bytes;

        if (typeof fetch !== 'undefined') {
            // Browser environment
            const response = await fetch(wasmPath);
            bytes = await response.arrayBuffer();
        } else {
            // Node.js environment
            const fs = require('fs');
            bytes = fs.readFileSync(wasmPath);
        }

        const { instance } = await WebAssembly.instantiate(bytes, { env: {} });
        instance.exports.init();
        return new EnglishDictionary(instance.exports);
    }

    /**
     * Get the number of nodes in the trie
     * @returns {number}
     */
    get nodeCount() {
        return this._wasm.getNodeCount();
    }

    /**
     * Check if a word exists in the dictionary
     * @param {string} word - Word to check
     * @returns {boolean}
     */
    contains(word) {
        const query = word.toLowerCase();
        const queryBytes = this._encoder.encode(query);
        const ptr = this._wasm.getResultPtr();

        const memView = new Uint8Array(this._memory.buffer);
        memView.set(queryBytes, ptr);

        return Boolean(this._wasm.contains(ptr, queryBytes.length));
    }

    /**
     * Get autocomplete suggestions for a prefix
     * @param {string} prefix - Prefix to search for
     * @param {number} [maxResults=10] - Maximum number of results
     * @returns {string[]}
     */
    autocomplete(prefix, maxResults = 10) {
        const query = prefix.toLowerCase();
        const queryBytes = this._encoder.encode(query);
        const ptr = this._wasm.getResultPtr();

        const memView = new Uint8Array(this._memory.buffer);
        memView.set(queryBytes, ptr);

        const resultLen = this._wasm.autocomplete(ptr, queryBytes.length, maxResults);

        if (resultLen === 0) {
            return [];
        }

        const resultBytes = new Uint8Array(this._memory.buffer, ptr, resultLen);
        const resultText = this._decoder.decode(resultBytes);
        return resultText.split('\n').filter(w => w.length > 0);
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnglishDictionary };
}
