import { fetchTrendingMovies } from "../fetch.mjs";
import { renderMovieGrid, renderMovieGridAppend } from "../components/MovieGrid.mjs";
import { setActiveNavigation } from "../utils/partials.mjs";

class TrendingPage {
    constructor() {
        this.grid = document.getElementById("trending-grid");
        this.loader = document.getElementById("loader");
        this.btns = document.querySelectorAll(".trend-btn");
        this.moviesLoadedCounter = document.getElementById("movies-loaded");
        this.endOfContent = this.createEndOfContentElement();
        
        this.currentCategory = "day";
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMoreMovies = true;
        this.allMovies = [];
        
        this.init();
    }

    init() {
        setActiveNavigation();
        this.setupEventListeners();
        document.addEventListener('filtersChanged', (e) => this.handleFiltersChanged(e));
        document.addEventListener('watchlistUpdated', () => this.updateMoviesLoadedCounter());
        this.loadTrending();
    }

    handleFiltersChanged(e) {
        this.currentPage = 1;
        this.allMovies = [];
        this.hasMoreMovies = true;
        this.grid.innerHTML = '';
        this.endOfContent.classList.add('hidden');
        this.updateMoviesLoadedCounter();
        this.loadTrending();
    }

    createEndOfContentElement() {
        let element = document.getElementById("end-of-content");
        if (!element) {
            element = document.createElement('div');
            element.id = 'end-of-content';
            element.className = 'end-of-content hidden';
            document.querySelector('.trending-page').appendChild(element);
        }
        return element;
    }

    setupEventListeners() {
        // Category switching
        this.btns.forEach(btn => {
            btn.addEventListener("click", () => this.handleCategorySwitch(btn));
        });

        // Infinite scroll with debounce
        let scrollTimeout;
        window.addEventListener("scroll", () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => this.handleScroll(), 100);
        });
    }

    handleCategorySwitch(btn) {
        this.btns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        this.currentCategory = btn.dataset.type;
        this.currentPage = 1;
        this.allMovies = [];
        this.hasMoreMovies = true;
        
        this.endOfContent.classList.add("hidden");
        this.loader.classList.remove("hidden");
        this.loader.textContent = "Loading...";
        
        this.grid.innerHTML = "";
        this.updateMoviesLoadedCounter();
        this.loadTrending();
    }

    handleScroll() {
        if (this.isLoading || !this.hasMoreMovies) return;

        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.documentElement.offsetHeight;
        const threshold = 500;

        if (scrollPosition >= pageHeight - threshold) {
            this.currentPage++;
            this.loadTrending();
        }
    }

    async loadTrending() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.loader.classList.remove("hidden");
        this.loader.textContent = "Loading more movies...";
        this.endOfContent.classList.add("hidden");

        try {
            const response = await fetchTrendingMovies(this.currentCategory, this.currentPage);
            await this.handleTrendingResponse(response);
        } catch (error) {
            this.handleTrendingError(error);
        } finally {
            this.isLoading = false;
            this.loader.classList.add("hidden");
        }
    }

    async handleTrendingResponse(response) {
        let rawMovies = response.results || [];

        const filterManager = window.filterManager;
        if (filterManager && typeof filterManager.filterMovies === 'function') {
            rawMovies = filterManager.filterMovies(rawMovies);
        }

        if (rawMovies.length === 0) {
            this.handleNoMovies();
            return;
        }

        const transformedMovies = this.transformMovies(rawMovies);
        this.allMovies = [...this.allMovies, ...transformedMovies];

        if (this.currentPage === 1) {
            renderMovieGrid(transformedMovies, this.grid);
        } else {
            renderMovieGridAppend(this.grid, transformedMovies);
        }
        
        this.updateMoviesLoadedCounter();

        if (this.currentPage >= (response.total_pages || 1)) {
            this.handleEndOfContent();
        }
    }

    transformMovies(movies) {
        return movies.map(movie => ({
            id: movie.id,
            title: movie.title || 'Untitled',
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '',
            poster_path: movie.poster_path,
            rating: movie.vote_average || 0,
            overview: movie.overview || '',
            year: movie.release_date ? movie.release_date.slice(0, 4) : '',
            release_date: movie.release_date || ''
        }));
    }

    handleNoMovies() {
        this.hasMoreMovies = false;
        this.loader.classList.add("hidden");
        
        if (this.allMovies.length === 0) {
            this.showError("No trending movies found. Please try again later.");
        } else {
            this.showEndOfContent();
        }
    }

    handleEndOfContent() {
        this.hasMoreMovies = false;
        this.showEndOfContent();
    }

    showEndOfContent() {
        this.loader.classList.add("hidden");
        this.endOfContent.classList.remove("hidden");
        const categoryText = this.currentCategory === 'day' ? 'today' : 'this week';
        this.endOfContent.innerHTML = `
            <p>🎉 You've seen all trending movies ${categoryText}!</p>
            <p class="small">Total movies loaded: ${this.allMovies.length}</p>
        `;
    }

    handleTrendingError(error) {
        console.error("❌ Error loading trending movies:", error);
        this.currentPage--;
        
        if (this.allMovies.length === 0) {
            this.showError("Failed to load trending movies. Please check your connection and try again.");
        } else {
            this.showError("Failed to load more movies. Scroll to try again.");
        }
    }

    showError(message) {
        const existingError = document.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <p>${message}</p>
            <button onclick="window.trendingPage.retryLoading()">Retry</button>
        `;
        
        if (this.grid.innerHTML === '' || this.allMovies.length === 0) {
            this.grid.appendChild(errorElement);
        } else {
            this.grid.insertBefore(errorElement, this.loader);
        }
    }

    retryLoading() {
        const errorElement = document.querySelector('.error-message');
        if (errorElement) errorElement.remove();
        this.loadTrending();
    }

    updateMoviesLoadedCounter() {
        if (this.moviesLoadedCounter) {
            const count = this.allMovies.length;
            this.moviesLoadedCounter.textContent = `${count} movie${count !== 1 ? 's' : ''} loaded`;
        }
    }
}

// Initialize trending page
let trendingPage;

export function runTrendingPage() {
    trendingPage = new TrendingPage();
    window.trendingPage = trendingPage;
}

// Fallback initialization if not called from HTML
document.addEventListener('DOMContentLoaded', () => {
    if (!trendingPage) {
        trendingPage = new TrendingPage();
        window.trendingPage = trendingPage;
    }
});