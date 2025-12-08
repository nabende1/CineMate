// src/js/filters.mjs

class FilterManager {
    constructor() {
        this.activeFilters = {
            genres: [],
            year: '',
            rating: ''
        };
        this.genres = [];
        this.genresLoaded = false;
        this.genrePromise = null;
    }

    setupEventListeners() {
        // --- 1. Toggle Buttons ---
        const desktopFilterBtn = document.querySelector('.desktop-filter-btn');
        const desktopFilterOptions = document.querySelector('.desktop-filter-options');
        const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
        const mobileFilterOptions = document.querySelector('.mobile-filter-options');

        [desktopFilterBtn, mobileFilterBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const options = btn.classList.contains('desktop-filter-btn') ? desktopFilterOptions : mobileFilterOptions;
                    options?.classList.toggle('active');

                    const otherOptions = btn.classList.contains('desktop-filter-btn') ? mobileFilterOptions : desktopFilterOptions;
                    otherOptions?.classList.remove('active');
                });
            }
        });

        // --- 2. Close on Click Outside ---
        document.addEventListener('click', (e) => {
            if (desktopFilterOptions && !e.target.closest('.desktop-filters')) {
                desktopFilterOptions.classList.remove('active');
            }
            if (mobileFilterOptions && !e.target.closest('.mobile-filters')) {
                mobileFilterOptions.classList.remove('active');
            }
        });

        // --- 3. Apply/Clear Buttons ---
        document.querySelectorAll('.apply-filters').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyFilters();
                document.querySelectorAll('.filter-options').forEach(options => options.classList.remove('active'));
            });
        });

        document.querySelectorAll('.clear-filters').forEach(btn => {
            btn.addEventListener('click', () => {
                this.clearFilters();
                document.querySelectorAll('.filter-options').forEach(options => options.classList.remove('active'));
            });
        });
        
        // --- 4. Select Changes (to update button indicator) ---
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', () => this.updateFilterButtonState());
        });
    }
    
    // --- Data & Rendering ---

    async loadGenres() {
        if (this.genresLoaded) {
            return this.genrePromise;
        }

        if (!this.genrePromise) {
            this.genrePromise = (async () => {
                try {
                    // Assuming VITE_BASE_URL is defined in your environment config
                    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_KEY}`);
                    const data = await response.json();
                    this.genres = data.genres || [];
                    this.genresLoaded = true;
                } catch (error) {
                    console.error('Error loading genres:', error);
                    // Fallback: expanded list of common TMDB movie genres
                    this.genres = [
                        { id: 28, name: 'Action' },
                        { id: 12, name: 'Adventure' },
                        { id: 16, name: 'Animation' },
                        { id: 35, name: 'Comedy' },
                        { id: 80, name: 'Crime' },
                        { id: 99, name: 'Documentary' },
                        { id: 18, name: 'Drama' },
                        { id: 10751, name: 'Family' },
                        { id: 14, name: 'Fantasy' },
                        { id: 36, name: 'History' },
                        { id: 27, name: 'Horror' },
                        { id: 10402, name: 'Music' },
                        { id: 9648, name: 'Mystery' },
                        { id: 10749, name: 'Romance' },
                        { id: 878, name: 'Science Fiction' },
                        { id: 10770, name: 'TV Movie' },
                        { id: 53, name: 'Thriller' },
                        { id: 10752, name: 'War' },
                        { id: 37, name: 'Western' }
                    ];
                    this.genresLoaded = true;
                }
                this.renderGenreFilters(); // Render genres sorted alphabetically
                this.renderYearOptions(1950); // Populate year selects dynamically
                // After rendering, sync UI to match URL state if applicable
                this.syncFilterUIs(); 
            })();
        }
        return this.genrePromise;
    }

    renderGenreFilters() {
        // Render all genres (sorted alphabetically) so users can select any available genre
        const sorted = [...this.genres].sort((a, b) => a.name.localeCompare(b.name));
        const genreHTML = sorted.map(genre => `
                <label class="filter-checkbox">
                    <input type="checkbox" value="${genre.id}" data-genre="${genre.name}">
                    ${genre.name}
                </label>
            `).join('');

        document.querySelectorAll('.filter-checkboxes').forEach(container => {
            container.innerHTML = genreHTML;
        });

        // Add event listeners to newly rendered checkboxes
        document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateGenreFilters());
        });
    }

    renderYearOptions(startYear = 1950) {
        const current = new Date().getFullYear();
        let html = '<option value="">All Years</option>';
        for (let y = current; y >= startYear; y--) {
            html += `<option value="${y}">${y}</option>`;
        }

        document.querySelectorAll('.year-filter').forEach(select => {
            select.innerHTML = html;
        });
    }

    // --- State Management ---

    updateGenreFilters() {
        // Collect checked boxes from both desktop and mobile containers
        const genreCheckboxes = document.querySelectorAll('.filter-checkboxes input[type="checkbox"]:checked');
        this.activeFilters.genres = Array.from(genreCheckboxes).map(cb => parseInt(cb.value));
        this.updateFilterButtonState();
    }
    
    applyFilters() {
        // Apply select box values 
        this.activeFilters.year = document.querySelector('.desktop-year-filter')?.value || document.querySelector('.mobile-year-filter')?.value || '';
        this.activeFilters.rating = document.querySelector('.desktop-rating-filter')?.value || document.querySelector('.mobile-rating-filter')?.value || '';
        this.updateGenreFilters(); 
        
        this.updateFilterButtonState();
        this.syncFilterUIs();

        // Notify the search manager
        document.dispatchEvent(new CustomEvent('filtersChanged', {
            detail: this.activeFilters
        }));
    }

    clearFilters() {
        this.activeFilters = {
            genres: [],
            year: '',
            rating: ''
        };

        // Reset UI elements immediately
        document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(cb => { cb.checked = false; });
        document.querySelectorAll('.filter-select').forEach(select => { select.value = ''; });

        this.updateFilterButtonState();
        this.syncFilterUIs(); 
        
        // Notify the search manager
        document.dispatchEvent(new CustomEvent('filtersChanged', {
            detail: this.activeFilters
        }));
    }

    syncFilterUIs() {
        const { year, rating, genres } = this.activeFilters;
        
        // Sync select boxes
        document.querySelectorAll('.filter-select').forEach(select => {
            if (select.classList.contains('year-filter')) {
                 select.value = year; 
            } else if (select.classList.contains('rating-filter')) {
                 select.value = rating;
            }
        });

        // Sync genre checkboxes
        document.querySelectorAll('.filter-checkbox input[type="checkbox"]').forEach(checkbox => {
            const genreId = parseInt(checkbox.value);
            checkbox.checked = genres.includes(genreId);
        });
        
        this.updateFilterButtonState();
    }

    updateFilterButtonState() {
        const hasActiveFilters = this.hasActiveFilters();

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('has-filters', hasActiveFilters);
        });
    }

    hasActiveFilters() {
        return this.activeFilters.genres.length > 0 || 
               this.activeFilters.year !== '' || 
               this.activeFilters.rating !== '';
    }
    
    getActiveFilters() {
        return { ...this.activeFilters };
    }
    
    filterMovies(movies) {
        if (!this.hasActiveFilters()) {
            return movies;
        }

        return movies.filter(movie => {
            // Genre filter
            if (this.activeFilters.genres.length > 0) {
                const movieGenres = movie.genre_ids || [];
                const hasMatchingGenre = this.activeFilters.genres.some(genreId => 
                    movieGenres.includes(genreId)
                );
                if (!hasMatchingGenre) return false;
            }

            // Year filter
            if (this.activeFilters.year && movie.release_date) {
                const movieYear = new Date(movie.release_date).getFullYear().toString();
                if (movieYear !== this.activeFilters.year) return false;
            }

            // Rating filter
            if (this.activeFilters.rating && movie.vote_average) {
                if (movie.vote_average < parseFloat(this.activeFilters.rating)) return false;
            }

            return true;
        });
    }
}

let filterManager;

export const initializeFilterManager = () => {
    if (!filterManager) {
        filterManager = new FilterManager();
        window.filterManager = filterManager;
    }
    return filterManager;
};