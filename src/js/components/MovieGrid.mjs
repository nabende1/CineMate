import { createMovieCard } from './MovieCard.mjs';

/**
 * Render a grid of movies into a container.
 * @param {Array} movies - Array of movie objects
 * @param {string|HTMLElement} container - Optional container (selector or DOM element)
 */
export function renderMovieGrid(movies, container = '#movie-grid') {
  // If container is a string selector, query the DOM
  if (typeof container === 'string') {
    container = document.querySelector(container);
  }

  if (!container) return;

  container.innerHTML = '';

  if (!movies.length) {
    container.innerHTML = '<p>No movies found.</p>';
    return;
  }

  movies.forEach(movie => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}
