//! English Dictionary Trie - Rust Wrapper
//!
//! Usage:
//! ```rust
//! use english::EnglishDictionary;
//!
//! let dict = EnglishDictionary::load("english.wasm")?;
//! let suggestions = dict.autocomplete("hel", 10);
//! let is_word = dict.contains("hello");
//! ```
//!
//! Add to Cargo.toml:
//! ```toml
//! [dependencies]
//! wasmtime = "19"
//! ```

use std::path::Path;
use wasmtime::*;

pub struct EnglishDictionary {
    store: Store<()>,
    memory: Memory,
    init: TypedFunc<(), ()>,
    get_node_count: TypedFunc<(), i32>,
    get_result_ptr: TypedFunc<(), i32>,
    autocomplete: TypedFunc<(i32, i32, i32), i32>,
    contains: TypedFunc<(i32, i32), i32>,
}

impl EnglishDictionary {
    /// Load the dictionary from a WASM file.
    pub fn load<P: AsRef<Path>>(wasm_path: P) -> Result<Self> {
        let engine = Engine::default();
        let mut store = Store::new(&engine, ());

        let module = Module::from_file(&engine, wasm_path)?;
        let instance = Instance::new(&mut store, &module, &[])?;

        let memory = instance.get_memory(&mut store, "memory")
            .ok_or_else(|| anyhow::anyhow!("memory export not found"))?;

        let init = instance.get_typed_func::<(), ()>(&mut store, "init")?;
        let get_node_count = instance.get_typed_func::<(), i32>(&mut store, "getNodeCount")?;
        let get_result_ptr = instance.get_typed_func::<(), i32>(&mut store, "getResultPtr")?;
        let autocomplete = instance.get_typed_func::<(i32, i32, i32), i32>(&mut store, "autocomplete")?;
        let contains = instance.get_typed_func::<(i32, i32), i32>(&mut store, "contains")?;

        // Initialize the trie
        init.call(&mut store, ())?;

        Ok(Self {
            store,
            memory,
            init,
            get_node_count,
            get_result_ptr,
            autocomplete,
            contains,
        })
    }

    /// Get the number of nodes in the trie.
    pub fn node_count(&mut self) -> Result<i32> {
        self.get_node_count.call(&mut self.store, ())
    }

    /// Check if a word exists in the dictionary.
    pub fn contains(&mut self, word: &str) -> Result<bool> {
        let query = word.to_lowercase();
        let query_bytes = query.as_bytes();
        let ptr = self.get_result_ptr.call(&mut self.store, ())?;

        // Write query to memory
        self.memory.write(&mut self.store, ptr as usize, query_bytes)?;

        let result = self.contains.call(&mut self.store, (ptr, query_bytes.len() as i32))?;
        Ok(result != 0)
    }

    /// Get autocomplete suggestions for a prefix.
    pub fn autocomplete(&mut self, prefix: &str, max_results: i32) -> Result<Vec<String>> {
        let query = prefix.to_lowercase();
        let query_bytes = query.as_bytes();
        let ptr = self.get_result_ptr.call(&mut self.store, ())?;

        // Write query to memory
        self.memory.write(&mut self.store, ptr as usize, query_bytes)?;

        let result_len = self.autocomplete.call(
            &mut self.store,
            (ptr, query_bytes.len() as i32, max_results),
        )?;

        if result_len == 0 {
            return Ok(Vec::new());
        }

        // Read results from memory
        let mut result_bytes = vec![0u8; result_len as usize];
        self.memory.read(&self.store, ptr as usize, &mut result_bytes)?;

        let result_text = String::from_utf8(result_bytes)?;
        let words: Vec<String> = result_text
            .split('\n')
            .filter(|w| !w.is_empty())
            .map(String::from)
            .collect();

        Ok(words)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_load_and_query() -> Result<()> {
        let mut dict = EnglishDictionary::load("english.wasm")?;

        // Test node count
        let count = dict.node_count()?;
        assert!(count > 0);

        // Test contains
        assert!(dict.contains("hello")?);
        assert!(!dict.contains("xyznotaword")?);

        // Test autocomplete
        let results = dict.autocomplete("hel", 5)?;
        assert!(!results.is_empty());

        Ok(())
    }
}
