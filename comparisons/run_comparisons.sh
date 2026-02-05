#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMP="$ROOT/comparisons"
VENDOR="$COMP/vendor"
BUILD="$COMP/build"
OUT="$COMP/out"
DATA="$COMP/data"

mkdir -p "$VENDOR" "$BUILD" "$OUT" "$DATA"

DICT="${DICT:-/usr/share/dict/words}"
if [[ ! -f "$DICT" ]]; then
  echo "DICT not found: $DICT"
  exit 1
fi

clean_words="$DATA/words.txt"
python3 - "$DICT" "$clean_words" <<'PY'
import sys

src = sys.argv[1]
dst = sys.argv[2]

words = set()
with open(src, "r", encoding="utf-8", errors="ignore") as f:
    for line in f:
        w = line.strip().lower()
        if w.isalpha() and w.islower():
            words.add(w)

with open(dst, "w", encoding="utf-8") as f:
    for w in sorted(words):
        f.write(w)
        f.write("\n")
PY

filesize() {
  if stat -f%z "$1" >/dev/null 2>&1; then
    stat -f%z "$1"
  else
    stat -c%s "$1"
  fi
}

RAW_BYTES="$(filesize "$clean_words")"

results_tsv="$OUT/results.tsv"
echo -e "name\tbytes\tratio_to_raw" > "$results_tsv"

add_result() {
  local name="$1"
  local file="$2"
  if [[ ! -f "$file" ]]; then
    echo "skip: $name (missing $file)"
    return
  fi
  local bytes
  bytes="$(filesize "$file")"
  local ratio
  ratio="$(python3 - <<PY "$bytes" "$RAW_BYTES"
import sys
print(f"{int(sys.argv[1]) / int(sys.argv[2]):.4f}")
PY
)"
  echo -e "${name}\t${bytes}\t${ratio}" >> "$results_tsv"
}

if [[ "${BUILD_OUR_TRIE:-1}" == "1" ]]; then
  if [[ "$DICT" != "/usr/share/dict/words" ]]; then
    echo "skip: our trie (build_trie.py is fixed to /usr/share/dict/words)"
  else
    (cd "$ROOT" && python3 build_trie.py)
    cp "$ROOT/trie_data.bin" "$OUT/our_trie.bin"
    add_result "our_trie" "$OUT/our_trie.bin"
  fi
fi

if [[ "${BUILD_MARISA:-1}" == "1" ]]; then
  if [[ ! -d "$VENDOR/marisa-trie" ]]; then
    git clone https://github.com/s-yata/marisa-trie.git "$VENDOR/marisa-trie"
  fi
  cmake -S"$VENDOR/marisa-trie" -B"$BUILD/marisa-build" \
    -DCMAKE_BUILD_TYPE=Release \
    -DENABLE_NATIVE_CODE=ON \
    -DBUILD_TESTING=OFF \
    -DCMAKE_INSTALL_PREFIX="$BUILD/marisa"
  cmake --build "$BUILD/marisa-build"
  cmake --install "$BUILD/marisa-build" --component Binaries

  "$BUILD/marisa/bin/marisa-build" < "$clean_words" > "$OUT/marisa.dic"
  add_result "marisa-trie" "$OUT/marisa.dic"
fi

if [[ "${BUILD_DARTS_CLONE_RS:-1}" == "1" ]]; then
  if command -v cargo >/dev/null 2>&1; then
    DCRS_DIR="$BUILD/darts-clone-rs"
    if [[ ! -f "$DCRS_DIR/Cargo.toml" ]]; then
      mkdir -p "$DCRS_DIR/src"
      cat > "$DCRS_DIR/Cargo.toml" <<'TOML'
[package]
name = "darts_clone_build"
version = "0.1.0"
edition = "2021"

[dependencies]
darts = { package = "darts-clone-rs", version = "0.2" }
TOML
      cat > "$DCRS_DIR/src/main.rs" <<'RS'
use std::env;
use std::fs;

use darts::darts::DoubleArrayTrie;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        eprintln!("usage: darts_clone_build <words.txt> <out.dic>");
        std::process::exit(1);
    }
    let input = &args[1];
    let output = &args[2];

    let content = fs::read_to_string(input).expect("read input");
    let mut keys: Vec<String> = content.lines().map(|s| s.to_string()).collect();
    keys.sort();
    keys.dedup();

    let dic = DoubleArrayTrie::new();
    dic.build(keys.len(), &keys, None, None, None)
        .expect("build darts-clone");
    dic.save(output, "wb", 0).expect("save darts-clone");
}
RS
    fi

    (cd "$DCRS_DIR" && cargo build --release)
    "$DCRS_DIR/target/release/darts_clone_build" "$clean_words" "$OUT/darts_clone.dic"
    add_result "darts-clone-rs" "$OUT/darts_clone.dic"
  else
    echo "skip: darts-clone-rs (cargo not found)"
  fi
fi

if [[ -n "${TX_TRIE_URL:-}" ]]; then
  echo "TX_TRIE_URL is set to $TX_TRIE_URL"
  echo "NOTE: tx-trie build is not automated. Add build steps here after cloning."
else
  echo "skip: tx-trie (no TX_TRIE_URL provided; original code.google.com links are defunct)"
fi

echo
echo "Results written to: $results_tsv"
column -t "$results_tsv" || cat "$results_tsv"

python3 "$COMP/render_results.py" --results "$results_tsv" --words "$clean_words" --output "$OUT/REPORT.md"
echo "Markdown report written to: $OUT/REPORT.md"
