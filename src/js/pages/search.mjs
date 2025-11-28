import { searchMovies } from "../fetch.mjs";
import { renderMovieGrid } from "../components/MovieGrid.mjs";
import { loadHeaderFooter } from '../ui.mjs';
loadHeaderFooter();


const searchInput = document.getElementById("search-input");
const suggestionsBox = document.getElementById("suggestions");
const searchButton = document.getElementById("search-button");
const resultsGrid = document.getElementById("search-results");

let localMovies = [];

/** Load fallback JSON */
async function loadLocalMovies() {
  try {
    const res = await fetch("/json/sample_movies.json");
    localMovies = await res.json();
  } catch (err) {
    console.error("Failed to load local fallback movies:", err);
  }
}
loadLocalMovies();

/** Handle typing → suggestions */
searchInput.addEventListener("input", async (e) => {
  const query = e.target.value.trim().toLowerCase();

  if (!query) {
    suggestionsBox.innerHTML = "";
    return;
  }

  let apiMovies = [];
  try {
    apiMovies = await searchMovies(query);
  } catch (err) {
    apiMovies = []; // API down → ignore
  }

  const fallbackMovies = localMovies.filter((m) =>
    m.title.toLowerCase().includes(query)
  );

  const movies = apiMovies.length ? apiMovies : fallbackMovies;

  showSuggestions(movies.slice(0, 8), query);
});

/** Show suggestion dropdown */
function showSuggestions(movies, query) {
  if (!movies.length) {
    suggestionsBox.innerHTML = "";
    return;
  }

  suggestionsBox.style.display = "block";

  suggestionsBox.innerHTML = movies
    .map(
      (movie) => `
      <li data-id="${movie.id}">
        <img src="${movie.poster}" />
        <div class="info">
          <span class="title">${highlight(movie.title, query)}</span>
          <span class="year">${movie.year || ""}</span>
        </div>
      </li>
    `
    )
    .join("");

  document.querySelectorAll(".suggestions li").forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;
      window.location.href = `/movie/index.html?id=${id}`;
    });
  });
}

/** Highlight typed letters */
function highlight(text, match) {
  const regex = new RegExp(`(${match})`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
}

/** Handle Search button click */
searchButton.addEventListener("click", async () => {
  runSearch();
});

/** Handle Enter key */
searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") runSearch();
});

/** Perform search (API → fallback) */
async function runSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  suggestionsBox.innerHTML = "";

  let movies = [];

  try {
    movies = await searchMovies(query);
  } catch {
    movies = [];
  }

  if (!movies.length) {
    movies = localMovies.filter((m) =>
      m.title.toLowerCase().includes(query)
    );
  }

  renderMovieGrid(movies, resultsGrid);
}
