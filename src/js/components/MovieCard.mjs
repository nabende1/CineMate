import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../storage.mjs';

export function createMovieCard(movie, options = { showWatchlistBtn: true }) {
  const card = document.createElement('div');
  card.classList.add('movie-card');

  let isInWatchlist = getWatchlist().some(m => m.title === movie.title);
  const watchBtnText = isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist';

  card.innerHTML = `
    <a href="/movie/index.html?title=${encodeURIComponent(movie.title)}">
      <img src="${movie.poster}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>Rating: ${movie.rating || 'N/A'}</p>
    </a>
  `;

  if (options.showWatchlistBtn) {
    const btn = document.createElement('button');
    btn.textContent = watchBtnText;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isInWatchlist) {
        removeFromWatchlist(movie.title);
        btn.textContent = 'Add to Watchlist';
        isInWatchlist = false;
      } else {
        addToWatchlist(movie);
        btn.textContent = 'Remove from Watchlist';
        isInWatchlist = true;
      }
    });
    card.appendChild(btn);
  }

  return card;
}
