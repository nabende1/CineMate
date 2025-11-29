import { fetchTMDB } from "../js/api.mjs";
import { qs } from "../js/utils.mjs";

async function initMoviePage() {
  const container = qs("#movie-details");

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  if (!movieId) {
    container.innerHTML = `<p class="error">Movie not found.</p>`;
    return;
  }

  try {
    const movie = await fetchTMDB(`/movie/${movieId}`);
    const credits = await fetchTMDB(`/movie/${movieId}/credits`);
    const videos = await fetchTMDB(`/movie/${movieId}/videos`);
    const similar = await fetchTMDB(`/movie/${movieId}/similar`);

    renderMovie(container, movie, credits, videos, similar);
  } catch (err) {
    container.innerHTML = `<p class="error">Unable to load movie details.</p>`;
    console.error(err);
  }
}

function renderMovie(container, movie, credits, videos, similar) {
  const cast = credits.cast.slice(0, 10);
  const trailer = videos.results.find(v => v.type === "Trailer" && v.site === "YouTube");

  container.innerHTML = `
    <section class="movie-header">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="movie-poster">
      <div class="movie-info">
        <h1>${movie.title}</h1>
        <p class="meta">${movie.release_date} • ⭐ ${movie.vote_average.toFixed(1)}</p>
        <p class="overview">${movie.overview}</p>

        <h3>Genres</h3>
        <ul class="genres">
          ${movie.genres.map(g => `<li>${g.name}</li>`).join("")}
        </ul>

        <button class="watchlist-btn" data-id="${movie.id}">
          Add to Watchlist
        </button>
      </div>
    </section>

    <section class="movie-cast">
      <h2>Top Cast</h2>
      <div class="cast-grid">
        ${cast
          .map(
            actor => `
          <div class="actor-card">
            <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" alt="${actor.name}">
            <p>${actor.name}</p>
            <small>${actor.character}</small>
          </div>`
          )
          .join("")}
      </div>
    </section>

    ${
      trailer
        ? `
    <section class="movie-trailer">
      <h2>Trailer</h2>
      <iframe 
        src="https://www.youtube.com/embed/${trailer.key}" 
        frameborder="0" 
        allowfullscreen>
      </iframe>
    </section>`
        : ""
    }

    <section class="movie-similar">
      <h2>Similar Movies</h2>
      <div class="similar-grid">
        ${similar.results
          .slice(0, 12)
          .map(
            m => `
          <a href="/movie/?id=${m.id}" class="similar-card">
            <img src="https://image.tmdb.org/t/p/w300${m.poster_path}">
            <p>${m.title}</p>
          </a>`
          )
          .join("")}
      </div>
    </section>
  `;

  qs(".watchlist-btn").addEventListener("click", () => addToWatchlist(movie));
}

function addToWatchlist(movie) {
  const saved = JSON.parse(localStorage.getItem("watchlist")) || [];

  if (!saved.find(m => m.id === movie.id)) {
    saved.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(saved));
    alert("Added to watchlist!");
  } else {
    alert("Already in watchlist.");
  }
}

initMoviePage();
