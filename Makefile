.PHONY: all wasm web zip test trie clean

all: wasm zip web

wasm:
	zig build-exe src/wasm.zig -target wasm32-freestanding -fno-entry -rdynamic -O ReleaseFast -femit-bin=docs/english.wasm
	cp src/english.js docs/english.js
	cp src/english.d.ts docs/english.d.ts

zip: wasm
	cd docs && rm -f english.zip && zip -9 english.zip english.wasm english.d.ts english.js

web:
	utu build web/main.utu -o docs
	rm -f docs/sizes.json

test: wasm
	node test/test.js

trie:
	python3 src/build_trie.py

clean:
	rm -f docs/english.wasm docs/english.d.ts docs/english.js docs/english.zip docs/index.html docs/app.js docs/app.wasm
