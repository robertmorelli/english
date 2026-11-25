# english

space-optimized trie containing the macOS English dictionary (~234k words) in 2.15 MB, written in [utu](https://github.com/robertmorelli/utu) and Wutu.

[live demo](https://robertmorelli.github.io/english/)

## compression

- **bigrams and trigrams**: common mid-word bigrams (`th`, `he`, `in`, `er`, `an`, `re`) are encoded as single tokens; common endings (`ess`, `ion`, `ous`, `ly`, `ic`, `al`) are stored as terminator tokens
- **packed bitsets**: each node stores variable-width `u32` bitsets for child tokens and terminator tokens
- **level-order tree**: child positions are calculated via `popcnt` with checkpoints every 32 nodes for O(1) offset lookups

## layout

- `src/trie.utu` — compressed trie decoder (`@embed`), `contains`, and `autocomplete`
- `src/build_trie.utu` — level-order BFS trie builder (`/usr/share/dict/words` -> `src/trie_data.bin`)
- `web/main.utu` — interactive Wutu web demo (embeds trie directly into `docs/app.wasm`)
- `test/trie.test.utu` — `utu test` suite

## build

```sh
make          # build src/trie_data.bin and compile self-contained web demo into docs/
make test     # run utu test suite
```

*(the earlier standalone Zig WASM + JS bindings version is preserved on the `zig` branch)*
