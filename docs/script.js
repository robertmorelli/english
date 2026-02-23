

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
    const query = input.value.trim().toLowerCase();
    const queryBytes = encoder.encode(query);
    const resultPtr = wasm.getResultPtr();
    const memView = new Uint8Array(memory.buffer);
    memView.set(queryBytes, resultPtr);

    const resultLen = wasm.autocomplete(resultPtr, queryBytes.length, 10);

    document.querySelectorAll('form ~ span').forEach(el => el.remove());
    const resultBytes = new Uint8Array(memory.buffer, resultPtr, resultLen);
    const words = decoder.decode(resultBytes).trim().split(/\s+/).filter(Boolean);
    words.forEach((word) => {
      const span = document.createElement('span');
      span.textContent = word;
      document.body.appendChild(span);
    });
  };

  input.addEventListener('input', update);
  document.getElementById('search-box').addEventListener('reset', () => setTimeout(update));
};