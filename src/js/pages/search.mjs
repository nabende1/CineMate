// src\js\pages\search.mjs

import { searchTMDB } from '../api.mjs';
import { renderMovieGrid } from '../components/MovieGrid.mjs';

class SearchPage {
    constructor(filterManager) {
        this.filterManager = filterManager;
        this.query = '';
        this.resultsContainer = document.getElementById('results-container');
        this.searchInfo = document.getElementById('search-info');
        this.loader = document.getElementById('search-loader');
        this.noResults = document.getElementById('no-results');
    }

    async init() {
        // --- STEP 1: Set state from URL and inform the FilterManager ---
        this.setInitialStateFromURL(); 
        
        // --- STEP 2: Wait for genres to load, as they are needed for filtering ---
        await this.filterManager.loadGenres(); 
        
        // --- STEP 3: Run the search with the synchronized filter state ---
        await this.runSearch();
    }

    setInitialStateFromURL() {
        const params = new URLSearchParams(window.location.search);
        this.query = params.get('q') || '';
        
        // Pass the URL parameters directly to the FilterManager
        const urlFilters = {
            genres: params.get('genres')?.split(',').map(g => parseInt(g)).filter(g => !isNaN(g)) || [],
            year: params.get('year') || '',
            rating: params.get('rating') || ''
        };
        
        // Set the active filters in the manager
        this.filterManager.activeFilters = urlFilters;

        // Also, update the main search input field (for visual continuity)
        const desktopSearch = document.getElementById('desktop-search');
        if (desktopSearch) desktopSearch.value = this.query;
    }

    async runSearch() {
        const hasQuery = !!this.query;
        const hasFilters = this.filterManager.hasActiveFilters();

        if (!hasQuery && !hasFilters) {
             this.showNoResults('Enter a search term or apply filters to see results.');
             return;
        }

        this.showLoader();
        
        try {
            // If no query, search for popular/top-rated movies (using a common term like 'a') 
            // to get a large set of movies to filter from.
            const queryToFetch = hasQuery ? this.query : 'a'; 

            const data = await searchTMDB(queryToFetch);
            let movies = data.results || [];
            
            // Apply local filtering 
            movies = this.filterManager.filterMovies(movies);
            
            this.updateInfo(movies.length, data.total_results);
            this.renderResults(movies);
            
        } catch (error) {
            console.error('Search failed:', error);
            this.showError('Search failed to complete. Please try again.');
        } finally {
            this.hideLoader();
        }
    }

    updateInfo(filteredCount, totalCount) {
        if (this.searchInfo) {
            const queryText = this.query ? `&ldquo;<strong>${this.query}</strong>&rdquo;` : 'all movies';
            let text = `Showing ${filteredCount} results for ${queryText}`;
            if (this.filterManager.hasActiveFilters()) {
                text += ` (Filtered from ${totalCount} total results)`;
            }
            this.searchInfo.innerHTML = text;
        }
    }

    renderResults(movies) {
        if (movies.length === 0) {
            this.showNoResults('No movies match your criteria.');
        } else {
            this.hide(this.noResults);
            this.hide(this.loader);
            renderMovieGrid(movies, this.resultsContainer);
        }
    }

    showLoader() {
        this.hide(this.noResults);
        if (this.resultsContainer) this.resultsContainer.innerHTML = '';
        this.show(this.loader);
    }

    showNoResults(message) {
        this.hide(this.loader);
        if (this.resultsContainer) this.resultsContainer.innerHTML = '';
        if (this.noResults) {
             this.noResults.querySelector('h3').textContent = 'No movies found';
             this.noResults.querySelector('p').textContent = message;
        }
        this.show(this.noResults);
    }
    
    showError(message) {
        this.hide(this.loader);
        if (this.resultsContainer) this.resultsContainer.innerHTML = `<div class="error">${message}</div>`;
        this.hide(this.noResults);
    }

    show(el) { if (el) el.style.display = 'block'; }
    hide(el) { if (el) el.style.display = 'none'; }
}

export const runSearchPage = (filterManager) => {
    if (document.querySelector('.search-page')) {
        const page = new SearchPage(filterManager);
        return page.init();
    }
    return Promise.resolve();
};