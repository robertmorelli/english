# english.wasm

space-optimized trie containing the entire English dictionary (macos dictionary) in 2.3 mb, in one wasm file.

## compression techniques

- **bigrams and trigrams**: common mid-word bigrams (`th`, `he`, `in`, `er`, `an`, `re`) are encoded as single tokens. common word endings (`ess`, `ion`, `ous`, `ly`, `ic`, `al`) are stored as terminator tokens
- **bitset of tokens**: u32 bitset of continue tokens and terminator tokens (8 bytes per node)
- **level-order tree**: child positions calculated via popcount instead of explicit pointers. checkpoints are stored every 32 nodes to accelerate offset calculations as the child offset is the sum of previous bitsets of the current level.
