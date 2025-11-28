// src/api/tmdb.mjs
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_KEY;

if (!API_KEY) {
  console.warn('TMDB API key is not defined!');
}

export async function fetchPopularMovies() {
  if (!API_KEY) throw new Error('TMDB API key is undefined');

  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);
    const data = await response.json();

    // Map to simplified format for your project
    return data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/images/fallback_poster.jpg',
      rating: movie.vote_average,
      description: movie.overview
    }));
  } catch (err) {
    console.error('TMDB fetch error:', err);
    throw err; // Let caller know it failed so fallback can be used
  }
}

// Optional: fetch movie details by ID
export async function fetchMovieDetails(id) {
  if (!API_KEY) throw new Error('TMDB API key is undefined');

  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) throw new Error(`TMDB fetch error: ${response.status}`);
    const movie = await response.json();
    return {
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/images/fallback_poster.jpg',
      rating: movie.vote_average,
      description: movie.overview
    };
  } catch (err) {
    console.error('TMDB fetch error:', err);
    throw err;
  }
}
