export function setupSearchBar({ parent, onSearch }) {
  parent.innerHTML = `
    <div class="search-bar">
      <input type="text" id="search-input" placeholder="Search movies…">
    </div>
  `;

  const input = parent.querySelector("#search-input");

  let typingTimer;
  input.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => onSearch(input.value), 400); // debounce 400ms
  });
}
