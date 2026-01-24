# Makefile for the Compact English Trie project

# --- Variables ---
ZIG := zig
ZIG_BUILD_FLAGS := -O ReleaseFast
SRC_AUTOCOMPLETE := autocomplete.zig
SRC_TRIE := trie.zig
WASM_OUTPUT := docs/autocomplete_wasm.wasm
CLI_OUTPUT := autocomplete

# --- Targets ---

.PHONY: all build cli clean

all: build cli

build: $(WASM_OUTPUT)

$(WASM_OUTPUT): $(SRC_AUTOCOMPLETE) $(SRC_TRIE) trie_data.bin
	$(ZIG) build-lib $(SRC_AUTOCOMPLETE) -target wasm32-freestanding $(ZIG_BUILD_FLAGS) -femit-bin=$(WASM_OUTPUT)

cli: $(CLI_OUTPUT)

$(CLI_OUTPUT): $(SRC_AUTOCOMPLETE) $(SRC_TRIE)
	$(ZIG) build-exe $(SRC_AUTOCOMPLETE) $(ZIG_BUILD_FLAGS)
	@mv autocomplete $(CLI_OUTPUT)

clean:
	@rm -f $(CLI_OUTPUT) $(WASM_OUTPUT)

