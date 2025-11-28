import { loadHeaderFooter } from './ui.mjs';
import { fetchPopularMovies } from '../api/tmdb.mjs';
import { renderMovieGrid } from './components/MovieGrid.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  loadHeaderFooter();

  let movies = [];

  try {
    movies = await fetchPopularMovies();
    console.log('Movies loaded:', movies);
  } catch (err) {
    console.error('Failed to fetch movies:', err);

    // Fallback to local JSON
    try {
      const res = await fetch('/json/sample_movies.json');
      movies = await res.json();
    } catch (jsonErr) {
      console.error('Failed to load fallback JSON:', jsonErr);
    }
  }

  renderMovieGrid(movies, '#movie-grid');
});
