// src/js/components/MovieGrid.mjs
import { createMovieCard } from "./MovieCard.mjs";

export function renderMovieGrid(movies, container) {
    if (!container) return console.warn("Popular grid container missing");
    container.innerHTML = "";

    movies.forEach(movie => {
        const card = createMovieCard(movie);
        container.appendChild(card);
    });
}

export function renderMovieGridAppend(parent, movies) {
  parent.innerHTML += movies
    .map(movie => `
      <a class="movie-card" href="/movie/?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="">
        <p>${movie.title}</p>
      </a>
    `)
    .join("");
}
