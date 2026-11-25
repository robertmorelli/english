# english.wasm

space-optimized trie containing the macOS English dictionary (~234k words) in a single 2.2 MB wasm file.

[live demo](https://robertmorelli.github.io/english/) (written in [wutu](web/main.utu))

## usage

```js
import { EnglishTrie } from "./english.js";

const trie = await new EnglishTrie("./english.wasm");
trie.isWord("hello");              // true
trie.getCompletions("hel", 10);    // ["held", "heli...", ...]
```

## compression

- **bigrams and trigrams**: common mid-word bigrams (`th`, `he`, `in`, `er`, `an`, `re`) are encoded as single tokens; common endings (`ess`, `ion`, `ous`, `ly`, `ic`, `al`) are stored as terminator tokens
- **packed bitsets**: each node stores variable-width `u32` bitsets for child tokens and terminator tokens
- **level-order tree**: child positions are calculated via popcount instead of explicit pointers, with checkpoints every 32 nodes to accelerate offset lookups

## build

```sh
make          # build wasm, zip, and web demo into docs/
make test     # run wasm + bindings tests
make trie     # rebuild src/trie_data.bin from /usr/share/dict/words
```
