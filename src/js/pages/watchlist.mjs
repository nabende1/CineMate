import { loadHeaderFooter } from '../ui.mjs';
import { renderMovieGrid } from '../components/MovieGrid.mjs';

document.addEventListener('DOMContentLoaded', () => {
  loadHeaderFooter();

  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  renderMovieGrid(watchlist, '#watchlist-container'); // Use selector string
});
