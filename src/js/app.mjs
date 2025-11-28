import { loadHeaderFooter } from './ui.mjs';
import { fetchMovies } from './fetch.mjs';
import { renderMovieGrid } from './components/MovieGrid.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  loadHeaderFooter();

  const movies = await fetchMovies('/json/sample_movies.json');
  renderMovieGrid(movies, '#movie-grid');
});
