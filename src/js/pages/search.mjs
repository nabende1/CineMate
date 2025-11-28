import { loadHeaderFooter } from '../ui.mjs';
import { fetchMovies } from '../fetch.mjs';
import { renderMovieGrid } from '../MovieGrid.mjs';
import { createSearchBar } from '../SearchBar.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  loadHeaderFooter();

  // Container selectors
  const searchContainer = '#search-container';
  const movieGridContainer = '#movie-grid';

  // Fetch all movies from local JSON
  const allMovies = await fetchMovies('/json/sample_movies.json');

  // Render search bar and handle search
  createSearchBar(searchContainer, (query) => {
    const filtered = allMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    renderMovieGrid(filtered, movieGridContainer);
  });

  // Initially show all movies
  renderMovieGrid(allMovies, movieGridContainer);
});
