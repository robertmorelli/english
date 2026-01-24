/**
 * English Dictionary Trie - TypeScript Wrapper
 *
 * Usage:
 *   import { EnglishDictionary } from './english';
 *
 *   const dict = await EnglishDictionary.load('english.wasm');
 *   const suggestions: string[] = dict.autocomplete('hel', 10);
 *   const isWord: boolean = dict.contains('hello');
 */

interface WasmExports {
    memory: WebAssembly.Memory;
    init: () => void;
    getNodeCount: () => number;
    getResultPtr: () => number;
    autocomplete: (ptr: number, len: number, max: number) => number;
    contains: (ptr: number, len: number) => number;
}

export class EnglishDictionary {
    private wasm: WasmExports;
    private memory: WebAssembly.Memory;
    private encoder: TextEncoder;
    private decoder: TextDecoder;

    private constructor(wasm: WasmExports) {
        this.wasm = wasm;
        this.memory = wasm.memory;
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }

    /**
     * Load the dictionary from a WASM file
     * @param wasmPath - Path or URL to english.wasm
     */
    static async load(wasmPath: string): Promise<EnglishDictionary> {
        let bytes: ArrayBuffer;

        if (typeof fetch !== 'undefined') {
            const response = await fetch(wasmPath);
            bytes = await response.arrayBuffer();
        } else {
            // Node.js environment
            const fs = await import('fs');
            const buffer = fs.readFileSync(wasmPath);
            bytes = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        }

        const { instance } = await WebAssembly.instantiate(bytes, { env: {} });
        const exports = instance.exports as unknown as WasmExports;
        exports.init();
        return new EnglishDictionary(exports);
    }

    /**
     * Get the number of nodes in the trie
     */
    get nodeCount(): number {
        return this.wasm.getNodeCount();
    }

    /**
     * Check if a word exists in the dictionary
     * @param word - Word to check
     */
    contains(word: string): boolean {
        const query = word.toLowerCase();
        const queryBytes = this.encoder.encode(query);
        const ptr = this.wasm.getResultPtr();

        const memView = new Uint8Array(this.memory.buffer);
        memView.set(queryBytes, ptr);

        return Boolean(this.wasm.contains(ptr, queryBytes.length));
    }

    /**
     * Get autocomplete suggestions for a prefix
     * @param prefix - Prefix to search for
     * @param maxResults - Maximum number of results (default: 10)
     */
    autocomplete(prefix: string, maxResults: number = 10): string[] {
        const query = prefix.toLowerCase();
        const queryBytes = this.encoder.encode(query);
        const ptr = this.wasm.getResultPtr();

        const memView = new Uint8Array(this.memory.buffer);
        memView.set(queryBytes, ptr);

        const resultLen = this.wasm.autocomplete(ptr, queryBytes.length, maxResults);

        if (resultLen === 0) {
            return [];
        }

        const resultBytes = new Uint8Array(this.memory.buffer, ptr, resultLen);
        const resultText = this.decoder.decode(resultBytes);
        return resultText.split('\n').filter((w: string) => w.length > 0);
    }
}
