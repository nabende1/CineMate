export function createMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card';

  // Load watchlist from localStorage
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  const isInWatchlist = watchlist.some(m => m.id === movie.id);

  card.innerHTML = `
    <img src="${movie.poster}" alt="${movie.title}">
    <h3>${movie.title}</h3>
    <p>Rating: ${movie.rating || 'N/A'}</p>
    <button class="watchlist-btn">${isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</button>
    <a href="/movie/index.html?id=${movie.id}">View Details</a>
  `;

  const btn = card.querySelector('.watchlist-btn');
  btn.addEventListener('click', () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    if (isInWatchlist) {
      const newList = watchlist.filter(m => m.id !== movie.id);
      localStorage.setItem('watchlist', JSON.stringify(newList));
      btn.textContent = 'Add to Watchlist';
    } else {
      watchlist.push(movie);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      btn.textContent = 'Remove from Watchlist';
    }
  });

  return card;
}
