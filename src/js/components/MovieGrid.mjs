import { createMovieCard } from './MovieCard.mjs';

export function renderMovieGrid(movies, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = ''; // Clear existing content

  movies.forEach(movie => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}
