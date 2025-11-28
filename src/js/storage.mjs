const WATCHLIST_KEY = 'cinemate_watchlist';

export function getWatchlist() {
  const data = localStorage.getItem(WATCHLIST_KEY);
  return data ? JSON.parse(data) : [];
}

export function addToWatchlist(movie) {
  const watchlist = getWatchlist();
  if (!watchlist.some(m => m.title === movie.title)) {
    watchlist.push(movie);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }
}

export function removeFromWatchlist(title) {
  let watchlist = getWatchlist();
  watchlist = watchlist.filter(m => m.title !== title);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
}
