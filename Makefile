cli:
	bun cli.js

wasm:
	zig build-exe wasm.zig -target wasm32-freestanding -fno-entry -rdynamic -O ReleaseFast -femit-bin=docs/english.wasm

test:
	node test.js

rebuild-trie:
	python3 build_trie.py

clean:
	rm -f docs/english.wasm
