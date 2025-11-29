// src/js/ui.mjs
export function loadHeaderFooter() {
  const header = document.getElementById('header') || document.getElementById('mobile-header');
  const footer = document.getElementById('footer');

  // Theme
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Header: responsive content
  if (header) {
    header.innerHTML = `
      <div class="site-header">
        <div class="brand"><a href="/index.html">CineMate</a></div>
        <nav class="nav-links">
          <a href="/index.html">Home</a>
          <a href="/trending/index.html">Trending</a>
          <a href="/watchlist/index.html">Watchlist</a>
        </nav>
        <div class="header-actions">
          <button id="theme-toggle" class="theme-toggle">${currentTheme === 'dark' ? '🌙' : '☀️'}</button>
        </div>
      </div>
    `;
    const btn = document.getElementById('theme-toggle');
    btn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      btn.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }

  if (footer) {
    footer.innerHTML = `<p>&copy; ${new Date().getFullYear()} CineMate</p>`;
  }
}
