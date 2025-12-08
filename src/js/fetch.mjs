const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE = 'https://api.themoviedb.org/3';

class MovieAPI {
    async getJson(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
        return res.json();
    }

    toMovie(m) {
        return {
            id: m.id,
            title: m.title || m.name || 'Untitled',
            poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '/images/fallback_poster.jpg',
            year: m.release_date ? m.release_date.slice(0,4) : (m.first_air_date ? m.first_air_date.slice(0,4) : ''),
            overview: m.overview || m.description || '',
            rating: m.vote_average ?? null
        };
    }

    async fetchPopularMovies(page = 1) {
        if (!TMDB_KEY) throw new Error('TMDB API key is undefined');
        const url = `${BASE}/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=${page}`;
        const data = await this.getJson(url);
        return (data.results || []).map(m => this.toMovie(m));
    }

    async fetchMovieById(id) {
        if (!TMDB_KEY) throw new Error('TMDB API key is undefined');
        const url = `${BASE}/movie/${id}?api_key=${TMDB_KEY}&language=en-US`;
        const m = await this.getJson(url);
        return this.toMovie(m);
    }

    async searchMovies(query, page = 1) {
        if (!TMDB_KEY) throw new Error('TMDB API key is undefined');
        const url = `${BASE}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${page}`;
        const data = await this.getJson(url);
        return (data.results || []).map(m => this.toMovie(m));
    }

    async fetchTrendingMovies(timeWindow = 'week', page = 1) {
        if (!TMDB_KEY) throw new Error('TMDB API key is undefined');
        const url = `${BASE}/trending/movie/${timeWindow}?api_key=${TMDB_KEY}&page=${page}`;
        return await this.getJson(url);
    }
}

// Create singleton instance
const movieAPI = new MovieAPI();


// Export functions
export const fetchPopularMovies = (page) => movieAPI.fetchPopularMovies(page);
export const fetchMovieById = (id) => movieAPI.fetchMovieById(id);
export const searchMovies = (query, page) => movieAPI.searchMovies(query, page);
export const fetchTrendingMovies = (timeWindow, page) => movieAPI.fetchTrendingMovies(timeWindow, page);