cli:
	bun cli.js

wasm:
	zig build-exe wasm.zig -target wasm32-freestanding -fno-entry -rdynamic -O ReleaseFast -femit-bin=docs/english.wasm
	cp english.js docs/english.js

test-bindings: wasm
	cp english.d.ts docs/english.d.ts
	cp english.js docs/english.js
	node test_bindings.js

zip: test-bindings
	cd docs && zip -9 english.zip english.wasm english.d.ts english.js
	@echo "✓ Created docs/english.zip"

test:
	node test.js

rebuild-trie:
	python3 build_trie.py

clean:
	rm -f docs/english.wasm docs/english.d.ts docs/english.js docs/english.zip
