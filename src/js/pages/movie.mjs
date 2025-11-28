import { loadHeaderFooter } from '../ui.mjs';
import { fetchMovies } from '../fetch.mjs';

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', async () => {
  loadHeaderFooter();

  const title = getQueryParam('title');
  if (!title) {
    document.querySelector('main').innerHTML = '<p>No movie selected.</p>';
    return;
  }

  // Fetch all movies (or use API later)
  const movies = await fetchMovies('/json/sample_movies.json');
  const movie = movies.find(m => m.title === title);

  if (!movie) {
    document.querySelector('main').innerHTML = '<p>Movie not found.</p>';
    return;
  }

  // Render movie details
  const main = document.querySelector('main');
  main.innerHTML = `
    <h1>${movie.title}</h1>
    <img src="${movie.poster}" alt="${movie.title}" />
    <p>Rating: ${movie.rating || 'N/A'}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Add movie description here.</p>
    <a href="/index.html">← Back to Home</a>
  `;
});
