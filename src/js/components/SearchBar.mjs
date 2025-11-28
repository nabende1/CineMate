export function createSearchBar(containerSelector, onSearch) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const form = document.createElement('form');
  form.innerHTML = `
    <input type="text" placeholder="Search movies..." id="search-input" />
    <button type="submit">Search</button>
  `;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.querySelector('#search-input').value.trim();
    onSearch(query);
  });

  container.appendChild(form);
}
