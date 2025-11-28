import { loadHeaderFooter } from '../ui.mjs';
import { fetchMovieDetails } from '../../api/tmdb.mjs';

function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

document.addEventListener('DOMContentLoaded', async () => {
  loadHeaderFooter();
  const container = document.getElementById('movie-details');
  const movieId = getQueryParam('id');
  if (!movieId) return container.innerHTML = '<p>No movie selected.</p>';

  let movie = null;

  try {
    movie = await fetchMovieDetails(movieId);
  } catch {
    const res = await fetch('/json/sample_movies.json');
    const localMovies = await res.json();
    movie = localMovies.find(m => m.id.toString() === movieId);
  }

  if (!movie) return container.innerHTML = '<p>Movie not found.</p>';

  container.innerHTML = `
    <div class="movie-card-details">
      <img src="${movie.poster}" alt="${movie.title}">
      <div class="movie-info">
        <h1>${movie.title}</h1>
        <p>Rating: ${movie.rating || 'N/A'}</p>
        <p>${movie.description || 'No description available.'}</p>
        <a href="/index.html">← Back to Home</a>
      </div>
    </div>
  `;
});
