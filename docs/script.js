

window.onload = async () => {
  const input = document.getElementById('search');
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const response = await fetch('english.wasm');
  const bytes = await response.arrayBuffer();
  const result = await WebAssembly.instantiate(bytes, { env: {} });

  wasm = result.instance.exports;
  memory = wasm.memory;
  wasm.init();

  input.disabled = false;
  input.focus();

  const update = () => {
    document.querySelectorAll('form ~ span')
      .forEach(
        (el) =>
          el.remove());

    const queryBytes = encoder
      .encode(
        input.value
          .trim()
          .toLowerCase());

    if (!queryBytes.length) return;

    
    const existsPtr = wasm.getResultBuffer();
    new Uint8Array(memory.buffer)
      .set(queryBytes, existsPtr);
    const wordExists = wasm.contains(existsPtr, queryBytes.length);
    document.body.className = wordExists ? "word-exists" : ""

    const resultPtr = wasm.getResultPtr();
    const memView = new Uint8Array(memory.buffer);
    memView.set(queryBytes, resultPtr);
  
    decoder
      .decode(
        new Uint8Array(
          memory.buffer,
          resultPtr,
          wasm
            .autocomplete(
              resultPtr,
              queryBytes.length,
              1000)))
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(
        (word) =>
          Object.assign(
            document.createElement('span'),
            {textContent: word}))
      .forEach(
        (span) =>
          document.body.appendChild(span));
  };

  input.addEventListener('input', update);
  document.getElementById('search-box').addEventListener('reset', () => setTimeout(update));
};
