const WATCHLIST_KEY = 'cine_watchlist';

export function getWatchlist() {
  try {
    const data = JSON.parse(localStorage.getItem(WATCHLIST_KEY));
    return data || [];
  } catch {
    return [];
  }
}

export function saveWatchlist(list) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
}

export function addToWatchlist(movie) {
  const list = getWatchlist();
  if (!list.find(m => m.id === movie.id)) {
    list.push(movie);
    saveWatchlist(list);
  }
}

export function removeFromWatchlist(id) {
  let list = getWatchlist();
  list = list.filter(m => m.id !== id);
  saveWatchlist(list);
}

export function isInWatchlist(id) {
  const list = getWatchlist();
  return list.some(m => m.id === id);
}
