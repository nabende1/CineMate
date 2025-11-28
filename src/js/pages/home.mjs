import { loadHeaderFooter } from '../ui.mjs';
import { fetchPopularMovies } from '../../api/tmdb.mjs';
import { renderMovieGrid } from '../components/MovieGrid.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  loadHeaderFooter();

  let movies = [];
  try {
    movies = await fetchPopularMovies();
  } catch {
    console.warn('API failed, using local JSON fallback');
    const res = await fetch('json/sample_movies.json');
    movies = await res.json();
  }

  renderMovieGrid(movies, '#movie-grid'); // Pass selector string
});
