import { getWatchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } from '../storage.mjs';

class MovieGrid {
    constructor() {
        this.setupEventListeners();
    }

    getFallbackPosterUrl() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMjI1QzE2Ny45NTMgMjI1IDE4Mi41IDIxMC40NTMgMTgyLjUgMTkyLjVDMTgyLjUgMTc0LjU0NyAxNjcuOTUzIDE2MCAxNTAgMTYwQzEzMi4wNDcgMTYwIDExNy41IDE3NC41NDcgMTE3LjUgMTkyLjVDMTE3LjUgMjEwLjQ1MyAxMzIuMDQ3IDIyNSAxNTAgMjI1WiIgZmlsbD0iI0Q4RDhEOCIvPgo8cGF0aCBkPSJNODUgMzA1Qzg1IDI4Mi45MSAxMDIuOTEgMjY1IDEyNSAyNjVIMTc1QzE5Ny4wOSAyNjUgMjE1IDI4Mi45MSAyMTUgMzA1VjM1MEMyMTUgMzcyLjA5IDE5Ny4wOSAzOTAgMTc1IDM5MEgxMjVDMTAyLkxMSAzOTAgODUgMzcyLjA5IDg1IDM1MFYzMDVaIiBmaWxsPSIjRDhEOEQ4Ii8+Cjwvc3ZnPg==';
    }

    setupEventListeners() {
        // Event delegation for watchlist buttons
        document.addEventListener('click', (e) => {
            const watchlistBtn = e.target.closest('.watchlist-btn');
            if (watchlistBtn) {
                e.preventDefault();
                e.stopPropagation();
                this.handleWatchlistClick(watchlistBtn);
            }
        });
    }

    handleWatchlistClick(button) {
        const card = button.closest('.movie-card');
        if (!card) return;
        
        const movieId = parseInt(card.dataset.movieId);
        const movieTitle = card.dataset.movieTitle || card.querySelector('.movie-title')?.textContent || '';
        const moviePoster = card.querySelector('img')?.src || '';
        
        if (isInWatchlist(movieId)) {
            removeFromWatchlist(movieId);
            this.updateButtonState(button, false);
        } else {
            const movieData = {
                id: movieId,
                title: movieTitle,
                poster: moviePoster,
                rating: parseFloat(card.querySelector('.movie-rating span:last-child')?.textContent?.split('/')[0]) || 0,
                release_date: card.dataset.movieYear ? `${card.dataset.movieYear}-01-01` : ''
            };
            addToWatchlist(movieData);
            this.updateButtonState(button, true);
        }
    }

    updateButtonState(button, isAdded) {
        const btnText = button.querySelector('.btn-text');
        const addedText = button.querySelector('.added-text');
        
        if (isAdded) {
            button.classList.add('added');
            if (btnText) btnText.style.display = 'none';
            if (addedText) addedText.style.display = '';
        } else {
            button.classList.remove('added');
            if (btnText) btnText.style.display = '';
            if (addedText) addedText.style.display = 'none';
        }
    }

    renderMovieGrid(movies, container) {
        if (!container) {
            console.warn("Movie grid container missing");
            return;
        }
        
        container.innerHTML = "";
        const fragment = document.createDocumentFragment();
        
        movies.forEach(movie => {
            const card = this.createMovieCard(movie);
            fragment.appendChild(card);
        });
        
        container.appendChild(fragment);
    }

    renderMovieGridAppend(container, movies) {
        if (!container) {
            console.warn("Movie grid container missing for append");
            return;
        }

        const fragment = document.createDocumentFragment();
        
        movies.forEach(movie => {
            const card = this.createMovieCard(movie);
            fragment.appendChild(card);
        });
        
        container.appendChild(fragment);
    }

    createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-movie-id', movie.id);
        card.setAttribute('data-movie-title', movie.title);
        if (movie.year) card.setAttribute('data-movie-year', movie.year);
        
        const isInList = isInWatchlist(movie.id);
        const watchlistClass = isInList ? 'added' : '';
        const displayStyle = isInList ? 'style="display: none;"' : '';
        const addedDisplayStyle = isInList ? '' : 'style="display: none;"';
        
        let posterUrl = movie.poster;
        if (!posterUrl && movie.poster_path) {
            posterUrl = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        } else if (!posterUrl) {
            posterUrl = this.getFallbackPosterUrl();
        }
        
        card.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}" onerror="this.src='${this.getFallbackPosterUrl()}'">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-rating">
                    <span class="rating-star">⭐</span>
                    <span>${movie.rating ? movie.rating.toFixed(1) : 'N/A'}/10</span>
                </div>
                <div class="movie-actions">
                    <button class="watchlist-btn ${watchlistClass}" 
                            data-movie-id="${movie.id}"
                            data-movie-title="${movie.title}">
                        <span class="btn-text" ${displayStyle}>Add to Watchlist</span>
                        <span class="added-text" ${addedDisplayStyle}>Added</span>
                    </button>
                    <a href="/movie/index.html?id=${movie.id}" class="view-details">View Details</a>
                </div>
            </div>
        `;
        
        return card;
    }
}

// Create singleton instance and initialize it
const movieGrid = new MovieGrid();

// Export functions
export const renderMovieGrid = (movies, container) => movieGrid.renderMovieGrid(movies, container);
export const renderMovieGridAppend = (container, movies) => movieGrid.renderMovieGridAppend(container, movies);
export const createMovieCard = (movie) => movieGrid.createMovieCard(movie);