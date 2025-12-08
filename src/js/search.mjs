// src\js\search.mjs

import { searchTMDB } from './api.mjs';

class SearchManager {
    constructor() {
        this.searchTimeout = null;
        this.filterManager = window.filterManager;
        this.currentQuery = this.getInitialQueryFromURL();
        this.init();
    }

    init() {
        this.setupSearch();
        document.addEventListener('filtersChanged', () => this.handleFiltersChanged());
        this.setupClickOutsideHandler();
    }
    
    // --- Setup and Event Handling ---

    setupSearch() {
        this.desktopSearch = document.getElementById('desktop-search');
        this.mobileSearch = document.getElementById('mobile-search');
        this.desktopSuggestions = document.getElementById('desktop-suggestions');
        
        this.desktopSearchBtn = document.getElementById('desktop-search-btn');
        this.mobileSearchBtn = document.getElementById('mobile-search-btn');
        
        if (this.desktopSearch) {
             this.desktopSearch.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value.trim());
            });
            this.desktopSearch.addEventListener('focus', (e) => {
                 this.handleSearchInput(e.target.value.trim(), true);
            });
            this.desktopSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(this.desktopSearch.value.trim());
                }
            });
        }
        
        if (this.mobileSearch) {
            this.mobileSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(this.mobileSearch.value.trim());
                }
            });
        }
        
        // Event listeners for the search buttons
        if (this.desktopSearchBtn && this.desktopSearch) {
            this.desktopSearchBtn.addEventListener('click', () => {
                this.performSearch(this.desktopSearch.value.trim());
            });
        }

        if (this.mobileSearchBtn && this.mobileSearch) {
            this.mobileSearchBtn.addEventListener('click', () => {
                this.performSearch(this.mobileSearch.value.trim());
            });
        }
    }

    setupClickOutsideHandler() {
        document.addEventListener('click', (e) => {
            const suggestionsContainer = document.getElementById('desktop-suggestions');
            const searchWrapper = document.querySelector('.desktop-search-area');
            
            if (suggestionsContainer && searchWrapper && !searchWrapper.contains(e.target)) {
                suggestionsContainer.classList.remove('active');
            }
        });
    }
    
    handleSearchInput(query, forceShow = false) {
        clearTimeout(this.searchTimeout);

        if (query.length < 2) {
            this.closeSuggestions();
            return;
        }

        this.currentQuery = query;
        
        if (forceShow) {
             this.fetchSuggestions(query);
        } else {
            this.searchTimeout = setTimeout(() => this.fetchSuggestions(query), 300);
        }
    }

    // --- Search Logic ---

    async fetchSuggestions(query) {
        try {
            const results = await searchTMDB(query);
            this.showSuggestions(results.results.slice(0, 5));
        } catch (error) {
            console.error('Search suggestions error:', error);
            this.closeSuggestions();
        }
    }

    showSuggestions(movies) {
        const container = document.getElementById('desktop-suggestions');
        if (!container) return;
        
        if (!movies || movies.length === 0) {
            this.closeSuggestions();
            return;
        }

        container.innerHTML = movies.map(movie => this.createSuggestionHTML(movie)).join('');
        container.classList.add('active');
    }

    createSuggestionHTML(movie) {
        const posterUrl = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` 
            : '/images/fallback_poster.jpg';
        
        const year = movie.release_date 
            ? new Date(movie.release_date).getFullYear() 
            : 'N/A';

        return `
            <li onclick="window.searchManager.selectSuggestion(${movie.id})">
                <img src="${posterUrl}" alt="${movie.title}">
                <div class="info">
                    <div class="title">${movie.title}</div>
                    <div class="year">${year}</div>
                </div>
            </li>
        `;
    }

    selectSuggestion(movieId) {
        window.location.href = `/movie/index.html?id=${movieId}`;
        this.closeSuggestions();
    }

    // --- URL and Redirection ---

    performSearch(query) {
        if (!query.trim() && !this.filterManager.hasActiveFilters()) {
            // Do not search if query is empty and no filters are set
            return; 
        }

        this.currentQuery = query.trim();
        const url = this.buildSearchURL(this.currentQuery);
        
        // Always navigate to the search page with new parameters
        window.location.href = url;
        this.closeSuggestions();
    }
    
    buildSearchURL(query) {
        const queryParam = query ? `q=${encodeURIComponent(query)}` : '';
        // If query is empty, we must ensure there's a "?" for the filters to append correctly
        let baseURL = `/search/index.html?${queryParam}`;
        
        const activeFilters = this.filterManager?.getActiveFilters();
        if (activeFilters && this.filterManager.hasActiveFilters()) {
            const filterParams = this.buildFilterParams(activeFilters);
            // Append filters. If queryParam was empty, filterParams will start with '&'
            if (queryParam === '') {
                // If no query, base is `/search/index.html?` and we need to remove the first '&' from filterParams
                 baseURL = `/search/index.html?${filterParams.substring(1)}`;
            } else {
                 baseURL += filterParams;
            }
        }
        
        return baseURL;
    }

    buildFilterParams(filters) {
        const params = [];
        
        if (filters.genres.length > 0) {
            params.push(`genres=${filters.genres.join(',')}`);
        }
        if (filters.year) {
            params.push(`year=${filters.year}`);
        }
        if (filters.rating) {
            params.push(`rating=${filters.rating}`);
        }
        
        return params.length > 0 ? `&${params.join('&')}` : '';
    }

    handleFiltersChanged() {
        // Only re-search if we are currently on the search page
        if (window.location.pathname.includes('/search/index.html')) {
            // Read the current search query from the input field
            const currentQuery = document.getElementById('desktop-search')?.value.trim() || 
                                 document.getElementById('mobile-search')?.value.trim() || 
                                 '';
                                 
            this.currentQuery = currentQuery;
            this.performSearch(currentQuery);
        }
    }
    
    getInitialQueryFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('q') || '';
    }

    closeSuggestions() {
        document.getElementById('desktop-suggestions')?.classList.remove('active');
    }
}

let searchManager = null;

export const initializeSearchManager = () => {
    if (!searchManager) {
        searchManager = new SearchManager();
        window.searchManager = searchManager;
    }
    return searchManager;
};