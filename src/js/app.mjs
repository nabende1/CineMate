// src/js/pages/app.mjs
import { fetchPopularMovies, fetchTrendingMovies } from "./fetch.mjs";
import { renderMovieGrid } from "./components/MovieGrid.mjs";
import { createMovieBanner } from "./components/MovieBanner.mjs";

// Initialize mobile menu and filters
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (mobileMenuBtn && mobileSidebar) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileSidebar.classList.add('active');
            if (sidebarOverlay) sidebarOverlay.classList.add('active');
        });

        if (closeMobileMenu) {
            closeMobileMenu.addEventListener('click', () => {
                mobileSidebar.classList.remove('active');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                mobileSidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
        }
    }
}

function initializeFilters() {
    // Desktop filters
    const desktopFilterBtn = document.querySelector('.desktop-filter-btn');
    const desktopFilterOptions = document.querySelector('.desktop-filter-options');
    
    if (desktopFilterBtn && desktopFilterOptions) {
        desktopFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            desktopFilterOptions.classList.toggle('active');
        });
    }

    // Mobile filters
    const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
    const mobileFilterOptions = document.querySelector('.mobile-filter-options');
    
    if (mobileFilterBtn && mobileFilterOptions) {
        mobileFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileFilterOptions.classList.toggle('active');
        });
    }

    // Close filters when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.filter-options').forEach(options => {
            options.classList.remove('active');
        });
    });

    // Prevent filter close when clicking inside
    document.querySelectorAll('.filter-options').forEach(options => {
        options.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// Load homepage content
document.addEventListener("DOMContentLoaded", async () => {
    // Initialize mobile menu and filters FIRST
    initializeMobileMenu();
    initializeFilters();
    
    // Then setup search and load movies
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

// Re-initialize when partials are loaded
document.addEventListener('partialsLoaded', () => {
    initializeMobileMenu();
    initializeFilters();
});