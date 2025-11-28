import { loadHeaderFooter } from '../ui.mjs';
import { getWatchlist } from '../storage.mjs';
import { renderMovieGrid } from '../MovieGrid.mjs';

document.addEventListener('DOMContentLoaded', () => {
  loadHeaderFooter();

  const movies = getWatchlist();
  renderMovieGrid(movies, '#movie-grid');
});
