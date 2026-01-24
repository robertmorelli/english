"""
English Dictionary Trie - Python Wrapper

Usage:
    from english import EnglishDictionary

    dict = EnglishDictionary.load('english.wasm')
    suggestions = dict.autocomplete('hel', max_results=10)
    is_word = dict.contains('hello')

Requirements:
    pip install wasmtime
"""

from pathlib import Path
from typing import List, Optional
from wasmtime import Store, Module, Instance, Memory


class EnglishDictionary:
    """A compressed English dictionary using a WebAssembly trie."""

    def __init__(self, instance: Instance, store: Store, memory: Memory):
        self._instance = instance
        self._store = store
        self._memory = memory
        self._exports = instance.exports(store)

    @classmethod
    def load(cls, wasm_path: str) -> "EnglishDictionary":
        """
        Load the dictionary from a WASM file.

        Args:
            wasm_path: Path to english.wasm

        Returns:
            EnglishDictionary instance
        """
        store = Store()
        module = Module.from_file(store.engine, wasm_path)
        instance = Instance(store, module, [])

        exports = instance.exports(store)
        memory = exports["memory"]

        # Initialize the trie
        init_fn = exports["init"]
        init_fn(store)

        return cls(instance, store, memory)

    @property
    def node_count(self) -> int:
        """Get the number of nodes in the trie."""
        get_node_count = self._exports["getNodeCount"]
        return get_node_count(self._store)

    def contains(self, word: str) -> bool:
        """
        Check if a word exists in the dictionary.

        Args:
            word: Word to check

        Returns:
            True if the word exists, False otherwise
        """
        query = word.lower().encode('utf-8')
        ptr = self._exports["getResultPtr"](self._store)

        # Write query to memory
        mem_data = self._memory.data_ptr(self._store)
        for i, b in enumerate(query):
            mem_data[ptr + i] = b

        result = self._exports["contains"](self._store, ptr, len(query))
        return bool(result)

    def autocomplete(self, prefix: str, max_results: int = 10) -> List[str]:
        """
        Get autocomplete suggestions for a prefix.

        Args:
            prefix: Prefix to search for
            max_results: Maximum number of results (default: 10)

        Returns:
            List of matching words
        """
        query = prefix.lower().encode('utf-8')
        ptr = self._exports["getResultPtr"](self._store)

        # Write query to memory
        mem_data = self._memory.data_ptr(self._store)
        for i, b in enumerate(query):
            mem_data[ptr + i] = b

        result_len = self._exports["autocomplete"](
            self._store, ptr, len(query), max_results
        )

        if result_len == 0:
            return []

        # Read results from memory
        result_bytes = bytes(mem_data[ptr:ptr + result_len])
        result_text = result_bytes.decode('utf-8')
        return [w for w in result_text.split('\n') if w]


if __name__ == "__main__":
    import sys

    wasm_path = sys.argv[1] if len(sys.argv) > 1 else "english.wasm"

    print(f"Loading dictionary from {wasm_path}...")
    dictionary = EnglishDictionary.load(wasm_path)
    print(f"Loaded {dictionary.node_count:,} nodes")

    # Test autocomplete
    test_prefixes = ["hel", "th", "cat"]
    for prefix in test_prefixes:
        results = dictionary.autocomplete(prefix, 5)
        print(f"\n'{prefix}' -> {results}")

    # Test contains
    test_words = ["hello", "world", "xyznotaword"]
    for word in test_words:
        exists = dictionary.contains(word)
        print(f"\ncontains('{word}') = {exists}")
