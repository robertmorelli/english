.PHONY: all trie web test clean

all: trie web

trie:
	utu src/build_trie.utu

web:
	utu build web/main.utu -o docs

test:
	utu test test/trie.test.utu

clean:
	rm -f docs/index.html docs/app.js docs/app.wasm
