// src/js/pages/app.mjs
import { fetchPopularMovies, fetchTrendingMovies } from "./fetch.mjs";
import { renderMovieGrid } from "./components/MovieGrid.mjs";
import { createMovieBanner } from "./components/MovieBanner.mjs";
import { initializeComponentsAfterPartials } from "../utils/partials-manager.mjs"; // Universal Initializer
// NOTE: Must also ensure loadLayoutPartials from partials.mjs is called on the page

// Assuming these elements exist in the main body HTML:
const trendingBanner = document.getElementById('trending-banner');
const popularGrid = document.getElementById('popular-grid');

// Load homepage content
document.addEventListener("DOMContentLoaded", async () => {
    // NOTE: loadLayoutPartials() must be called early on the page load (e.g., in a script tag 
    // before this module runs, or imported and called here if that's the setup)
    
    // No direct calls to initializeMobileMenu, initializeFilters, or setupSearch here.

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
        if (trendingBanner) trendingBanner.innerHTML = "<p>Error loading movies</p>";
        if (popularGrid) popularGrid.innerHTML = "<p>Error loading movies</p>";
    }
});

// Universal trigger for component initialization
document.addEventListener('partialsLoaded', () => {
    initializeComponentsAfterPartials();
});