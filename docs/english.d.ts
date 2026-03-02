/**
 * TypeScript bindings for english.wasm
 * A compact English dictionary trie compiled to WebAssembly
 */

interface WasmExports {
  init(): void;
  getResultPtr(): number;
  getResultBuffer(): number;
  autocomplete(input_ptr: number, input_len: number, max_results: number): number;
  contains(input_ptr: number, input_len: number): boolean;
  memory: WebAssembly.Memory;
}

export class EnglishTrie {
  private wasm: WasmExports;
  private encoder: TextEncoder;
  private decoder: TextDecoder;

  /**
   * Create and initialize an English trie from a WASM file
   * @param wasmPath Path to the english.wasm file or ArrayBuffer
   * @returns Initialized EnglishTrie instance
   */
  constructor(wasmPath: string | ArrayBuffer): Promise<EnglishTrie>;

  /**
   * Check if a word exists in the dictionary.
   * @param word The word to check (case-insensitive)
   * @returns True if the word exists, false otherwise
   */
  isWord(word: string): boolean;

  /**
   * Get autocomplete suggestions for a word prefix.
   * @param prefix The prefix to complete (case-insensitive)
   * @param maxResults Maximum number of completions to return
   * @returns Array of word completions
   */
  getCompletions(prefix: string, maxResults?: number): string[];
}
