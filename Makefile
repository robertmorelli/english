# Makefile for the Compact English Trie project

# --- Variables ---
ZIG := zig
PYTHON := python3
ZIG_BUILD_FLAGS := -O ReleaseFast
SRC_AUTOCOMPLETE := autocomplete.zig
SRC_TRIE := trie.zig
SRC_WASM := wasm.zig
WASM_OUTPUT := docs/english.wasm
CLI_OUTPUT := autocomplete
TRIE_DATA := trie_data.bin

# --- Targets ---

.PHONY: all wasm cli test clean rebuild-trie

all: cli wasm

# Build the CLI
cli: $(CLI_OUTPUT)

$(CLI_OUTPUT): $(SRC_AUTOCOMPLETE) $(SRC_TRIE) $(TRIE_DATA)
	$(ZIG) build-exe $(SRC_AUTOCOMPLETE) $(ZIG_BUILD_FLAGS) -femit-bin=$(CLI_OUTPUT)

# Build WASM for browser
wasm: $(WASM_OUTPUT)

$(WASM_OUTPUT): $(SRC_WASM) $(SRC_TRIE) $(TRIE_DATA)
	$(ZIG) build-exe $(SRC_WASM) -target wasm32-freestanding -fno-entry -rdynamic $(ZIG_BUILD_FLAGS) -femit-bin=$(WASM_OUTPUT)

# Run tests
test:
	$(ZIG) test $(SRC_AUTOCOMPLETE)
	$(ZIG) test $(SRC_TRIE)

# Rebuild trie data from system dictionary
rebuild-trie:
	$(PYTHON) build_trie.py

clean:
	@rm -f $(CLI_OUTPUT) $(WASM_OUTPUT)

