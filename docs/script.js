

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
    const queryBytes = encoder
      .encode(
        input.value
          .trim()
          .toLowerCase());

    if (!queryBytes) return;

    const resultPtr = wasm.getResultPtr();
    const memView = new Uint8Array(memory.buffer);
    memView.set(queryBytes, resultPtr);

    document.querySelectorAll('form ~ span')
      .forEach(
        (el) =>
          el.remove());
  
    decoder
      .decode(
        new Uint8Array(
          memory.buffer,
          resultPtr,
          wasm
            .autocomplete(
              resultPtr,
              queryBytes.length,
              10)))
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(
        (word) =>
          Object.update(
            document.createElement('span'),
            {textContent: word}))
      .forEach(
        (span) =>
          document.body.appendChild(span));
  };

  input.addEventListener('input', update);
  document.getElementById('search-box').addEventListener('reset', () => setTimeout(update));
};
