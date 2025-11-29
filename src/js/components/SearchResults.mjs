export function renderSearchResults(parent, movies) {
  if (!movies || movies.length === 0) {
    parent.innerHTML = `<p class="placeholder">No movies found.</p>`;
    return;
  }

  parent.innerHTML = `
    <div class="search-results-grid">
      ${movies
        .map(
          movie => `
        <a href="/movie/?id=${movie.id}" class="movie-card">
          <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
          <p>${movie.title}</p>
        </a>
      `
        )
        .join("")}
    </div>
  `;
}
