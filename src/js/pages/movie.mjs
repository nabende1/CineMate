import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchSimilarMovies,
} from "../api.mjs";

import { addToWatchlist, isInWatchlist } from "../storage.mjs";
import { createMovieBanner } from "../components/MovieBanner.mjs";
import { renderMovieGrid } from "../components/MovieGrid.mjs";

const hero = document.getElementById("movie-hero");
const info = document.getElementById("movie-info");
const castList = document.getElementById("cast-list");
const similarGrid = document.getElementById("similar-grid");

const id = new URLSearchParams(window.location.search).get("id");

if (!id) {
  hero.innerHTML = "<p class='error'>Movie not found.</p>";
  throw new Error("No movie ID provided.");
}

init();

function renderHero(movie) {
  hero.innerHTML = createMovieBanner(movie);
}
function renderInfo(movie) {
  const watchlistActive = isInWatchlist(movie.id);

  info.innerHTML = `
    <h1>${movie.title}</h1>

    <div class="movie-meta">
      <span>${movie.release_date?.slice(0, 4)}</span>
      <span>•</span>
      <span>${movie.runtime} min</span>
      <span>•</span>
      <span>${movie.vote_average.toFixed(1)} ⭐</span>
    </div>

    <p class="overview">${movie.overview}</p>

    <button id="watchlist-btn" class="watch-btn ${watchlistActive ? "active" : ""}">
      ${watchlistActive ? "✓ Added to Watchlist" : "+ Add to Watchlist"}
    </button>
  `;

  document.getElementById("watchlist-btn").onclick = () => {
    addToWatchlist(movie);
    renderInfo(movie); // re-render shows toggle change
  };
}
function renderCast(cast) {
  castList.innerHTML = cast
    .slice(0, 12)
    .map(
      (actor) => `
      <div class="cast-card">
        <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" />
        <p class="cast-name">${actor.name}</p>
        <p class="cast-role">${actor.character}</p>
      </div>
    `
    )
    .join("");
}


async function init() {
  const details = await fetchMovieDetails(id);
  const credits = await fetchMovieCredits(id);
  const similar = await fetchSimilarMovies(id);

  renderHero(details);
  renderInfo(details);
  renderCast(credits.cast);
  renderMovieGrid(similar.results, similarGrid);
}
