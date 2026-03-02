
import { EnglishTrie } from './english.js';

window.onload = async () => {
  const input = document.getElementById('search');
  const trie = await new EnglishTrie('english.wasm');

  input.disabled = false;
  input.focus();

  const update = () => {
    document.querySelectorAll('form ~ span')
      .forEach(
        (el) =>
          el.remove());

    const query = input.value.trim().toLowerCase();
    if (!query) return;

    const wordExists = trie.isWord(query);
    document.body.className = wordExists ? "word-exists" : ""

    trie
      .getCompletions(query, 1000)
      .map(
        (word) =>
          Object.assign(
            document.createElement('span'),
            { textContent: word }))
      .forEach(
        (span) =>
          document.body.appendChild(span));
  };

  input.addEventListener('input', update);
  document.getElementById('search-box').addEventListener('reset', () => setTimeout(update));

  document.getElementById('download').addEventListener('click', () => {
    window.location.href = './english.zip';
  });
};
