/**
 * JavaScript implementation for english.wasm bindings
 */

export class EnglishTrie {
    constructor(wasmPath) {
        return (async () => {
            const bytes = typeof wasmPath === 'string'
                ? await fetch(wasmPath).then(r => r.arrayBuffer())
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
