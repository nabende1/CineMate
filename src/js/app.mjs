// src/js/pages/app.mjs
import { fetchPopularMovies, fetchTrendingMovies } from "./fetch.mjs";
import { renderMovieGrid } from "./components/MovieGrid.mjs";
import { createMovieBanner } from "./components/MovieBanner.mjs";
import { setupSearch } from "./components/Search.mjs";

// DOM elements
const trendingBanner = document.getElementById("trending-banner");
const popularGrid = document.getElementById("popular-grid");

// Load homepage content
document.addEventListener("DOMContentLoaded", async () => {
    setupSearch();

    try {
        /** --- TRENDING MOVIES --- **/
        const trending = await fetchTrendingMovies();
        if (Array.isArray(trending) && trending.length) {
            trendingBanner.innerHTML = "";
            trendingBanner.appendChild(createMovieBanner(trending[0]));
        } else {
            trendingBanner.innerHTML = "<p>No trending movies found</p>";
        }

        /** --- POPULAR MOVIES --- **/
        const popular = await fetchPopularMovies();
        if (Array.isArray(popular) && popular.length) {
            renderMovieGrid(popular, popularGrid);
        } else {
            popularGrid.innerHTML = "<p>No popular movies found</p>";
        }

    } catch (err) {
        console.error("HOME LOAD ERROR:", err);
        trendingBanner.innerHTML = "<p>Error loading movies</p>";
        popularGrid.innerHTML = "<p>Error loading movies</p>";
    }
});



export function initMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const sidebar = document.getElementById("sidebar");

  if (!btn || !sidebar) return;

  btn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}
