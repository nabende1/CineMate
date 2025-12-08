import { fetchPopularMovies, fetchTrendingMovies } from "../fetch.mjs";
import { renderMovieGrid } from "../components/MovieGrid.mjs";
import { createMovieBanner } from "../components/MovieBanner.mjs";
import { setActiveNavigation } from "../utils/partials.mjs";

class HomePage {
    constructor() {
        this.trendingBanner = document.getElementById("trending-banner");
        this.popularGrid = document.getElementById("popular-grid");
        
        this.init();
    }

    init() {
        setActiveNavigation();
        this.initMobileMenu();
        this.loadSections();
        setTimeout(this.initWatchlistButtons, 1000);
    }

    async loadSections() {
        await Promise.all([
            this.loadTrendingMovies(),
            this.loadPopularMovies()
        ]);
    }

    // LOAD POPULAR MOVIES - EXACT COUNTS PER SCREEN SIZE
    async loadPopularMovies() {
        try {
            const movies = await fetchPopularMovies();
            const movieCount = this.getPopularMovieCount();
            const moviesToShow = movies.slice(0, movieCount);
            
            this.popularGrid.className = "movie-row";
            renderMovieGrid(moviesToShow, this.popularGrid);
        } catch (err) {
            console.error("Popular load error:", err);
            this.popularGrid.innerHTML = '<p class="error">Failed to load popular movies</p>';
        }
    }

    getPopularMovieCount() {
        const screenSize = this.getScreenSize();
        const counts = {
            mobile: 20,        // 1 per row × 20 rows
            smallTablet: 20,   // 2 per row × 10 rows
            tablet: 20,        // 2 per row × 10 rows
            desktop: 18,       // 3 per row × 6 rows
            largeDesktop: 20   // 4 per row × 5 rows
        };
        return counts[screenSize];
    }

    // LOAD TRENDING MOVIES - EXACT SPECIFICATIONS
    async loadTrendingMovies() {
        try {
            const response = await fetchTrendingMovies();
            const movies = response.results || [];

            if (movies.length === 0) {
                this.trendingBanner.innerHTML = '<p class="error">No trending movies available</p>';
                return;
            }

            // Transform movies for the banner (convert raw API response to movie format)
            const transformedMovies = movies.map(movie => ({
                id: movie.id,
                title: movie.title || 'Untitled',
                poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/images/fallback_poster.jpg',
                rating: movie.vote_average || 0,
                overview: movie.overview || '',
                year: movie.release_date ? movie.release_date.slice(0, 4) : ''
            }));

            const screenSize = this.getScreenSize();
            
            if (screenSize === 'mobile' || screenSize === 'smallTablet') {
                const movieCount = screenSize === 'mobile' ? 2 : 4;
                const gridMovies = transformedMovies.slice(0, movieCount);
                this.loadTrendingGrid(gridMovies, screenSize);
            } else {
                const carouselMovies = transformedMovies.slice(0, 5);
                this.loadTrendingCarousel(carouselMovies);
            }

        } catch (err) {
            console.error("Trending load error:", err);
            this.trendingBanner.innerHTML = '<p class="error">Failed to load trending movies</p>';
        }
    }

    getScreenSize() {
        const width = window.innerWidth;
        if (width < 480) return 'mobile';
        if (width < 768) return 'smallTablet';
        if (width < 1024) return 'tablet';
        if (width < 1440) return 'desktop';
        return 'largeDesktop';
    }

    // LOAD TRENDING AS CAROUSEL (TABLET & DESKTOP)
    loadTrendingCarousel(movies) {
        this.trendingBanner.innerHTML = "";

        movies.forEach((movie, index) => {
            const banner = createMovieBanner(movie);
            if (index === 0) banner.classList.add("active");
            this.trendingBanner.appendChild(banner);
        });

        this.startBannerCarousel();
    }

    // LOAD TRENDING AS GRID (MOBILE & SMALL TABLET)
    loadTrendingGrid(movies, screenSize) {
        this.trendingBanner.innerHTML = "";

        movies.forEach(movie => {
            const banner = createMovieBanner(movie);
            this.trendingBanner.appendChild(banner);
        });
    }

    // CAROUSEL LOGIC FOR DESKTOP/TABLET
    startBannerCarousel() {
        const banners = this.trendingBanner.querySelectorAll(".banner-item");
        let current = 0;

        if (banners.length <= 1) return;

        // Clear any existing navigation
        const existingNav = this.trendingBanner.querySelector('.trending-nav');
        if (existingNav) existingNav.remove();

        // Create navigation dots
        const navDots = document.createElement('div');
        navDots.className = 'trending-nav';
        
        banners.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `trending-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.showTrendingMovie(index));
            navDots.appendChild(dot);
        });
        
        this.trendingBanner.appendChild(navDots);

        // Auto-rotate every 5 seconds
        const carouselInterval = setInterval(() => {
            const screenSize = this.getScreenSize();
            if (screenSize === 'tablet' || screenSize === 'desktop' || screenSize === 'largeDesktop') {
                current = (current + 1) % banners.length;
                this.showTrendingMovie(current);
            } else {
                clearInterval(carouselInterval);
            }
        }, 5000);

        // Cleanup on resize
        window.addEventListener('resize', () => {
            const screenSize = this.getScreenSize();
            if (screenSize === 'mobile' || screenSize === 'smallTablet') {
                clearInterval(carouselInterval);
            }
        });
    }

    showTrendingMovie(index) {
        const banners = this.trendingBanner.querySelectorAll(".banner-item");
        const dots = this.trendingBanner.querySelectorAll('.trending-dot');
        
        banners.forEach(banner => banner.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        banners[index].classList.add('active');
        dots[index].classList.add('active');
    }

    handleResize = () => {
        this.loadTrendingMovies();
        this.loadPopularMovies();
    }

    // WATCHLIST FUNCTIONALITY
    toggleWatchlist(movie, button) {
        let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        
        const existingIndex = watchlist.findIndex(item => {
            if (typeof item === 'number') return item === movie.id;
            if (typeof item === 'object' && item.id) return item.id === movie.id;
            return false;
        });
        
        if (existingIndex > -1) {
            watchlist = watchlist.filter(item => {
                if (typeof item === 'number') return item !== movie.id;
                if (typeof item === 'object' && item.id) return item.id !== movie.id;
                return true;
            });
            button.classList.remove('added');
        } else {
            const movieData = {
                id: movie.id,
                title: movie.title,
                poster: movie.poster,
                rating: movie.rating,
                overview: movie.overview,
                year: movie.year
            };
            watchlist.push(movieData);
            button.classList.add('added');
        }
        
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }

    // Global function for watchlist toggling from cards
    initWatchlistButtons = () => {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        const watchlistButtons = document.querySelectorAll('.watchlist-btn');
        
        watchlistButtons.forEach(button => {
            const movieCard = button.closest('.movie-card');
            if (movieCard) {
                const movieId = parseInt(movieCard.dataset.movieId);
                if (watchlist.includes(movieId)) {
                    button.classList.add('added');
                }
            }
        });
    }

    // MOBILE MENU FUNCTIONALITY
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const body = document.body;
        const overlay = document.querySelector('.sidebar-overlay');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                body.classList.toggle('sidebar-open');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                body.classList.remove('sidebar-open');
            });
        }

        // Add resize listener for layout changes
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(this.handleResize, 250);
        });
    }
}

// Global functions for watchlist
window.toggleWatchlistFromCard = function(button, movieDataString) {
    const movie = JSON.parse(movieDataString.replace(/&quot;/g, '"'));
    if (window.homePage) {
        window.homePage.toggleWatchlist(movie, button);
    }
};

window.toggleWatchlist = function(movie, button) {
    if (window.homePage) {
        window.homePage.toggleWatchlist(movie, button);
    }
};

// Initialize home page
let homePage;
document.addEventListener('DOMContentLoaded', () => {
    homePage = new HomePage();
    window.homePage = homePage;
});