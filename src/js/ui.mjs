// src/js/ui.mjs
export function loadHeaderFooter() {
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');

  if (header) {
    header.innerHTML = `
      <h2>CineMate</h2>
      <nav>
        <a href="/index.html">Home</a> |
        <a href="/search/index.html">Search</a> |
        <a href="/watchlist/index.html">Watchlist</a>
      </nav>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <p>&copy; ${new Date().getFullYear()} CineMate</p>
    `;
  }
}
