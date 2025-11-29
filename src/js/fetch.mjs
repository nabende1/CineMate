// src/js/fetch.mjs
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE = 'https://api.themoviedb.org/3';

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
  return res.json();
}

function toMovie(m) {
  return {
    id: m.id,
    title: m.title || m.name || 'Untitled',
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '/images/fallback_poster.jpg',
    year: m.release_date ? m.release_date.slice(0,4) : (m.first_air_date ? m.first_air_date.slice(0,4) : ''),
    overview: m.overview || m.description || '',
    rating: m.vote_average ?? null
  };
}

export async function fetchPopularMovies(page = 1) {
  if (!TMDB_KEY) throw new Error('TMDB API key is undefined');
  const url = `${BASE}/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=${page}`;
  const data = await getJson(url);
  return (data.results || []).map(toMovie);
}

export async function fetchMovieById(id) {
  if (!TMDB_KEY) throw new Error('TMDB API key is undefined');
  const url = `${BASE}/movie/${id}?api_key=${TMDB_KEY}&language=en-US`;
  const m = await getJson(url);
  return toMovie(m);
}

export async function searchMovies(query, page = 1) {
  if (!TMDB_KEY) throw new Error('TMDB API key is undefined');
  const url = `${BASE}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${page}`;
  const data = await getJson(url);
  return (data.results || []).map(toMovie);
}

// export async function fetchTrendingMovies(timeWindow = 'week') {
//   if (!TMDB_KEY) throw new Error('TMDB API key is undefined');
//   const url = `${BASE}/trending/movie/${timeWindow}?api_key=${TMDB_KEY}`;
//   const data = await getJson(url);
//   return (data.results || []).map(toMovie);
// }

export async function fetchTrendingMovies(timeWindow = 'week') {
  try {
    console.log('🔍 fetchTrendingMovies called with:', { TMDB_KEY: TMDB_KEY ? 'Loaded' : 'Missing', timeWindow });

    if (!TMDB_KEY) throw new Error('TMDB API key is undefined');

    const url = `${BASE}/trending/movie/${timeWindow}?api_key=${TMDB_KEY}`;
    console.log('📡 Trending API URL:', url);

    const data = await getJson(url);
    console.log('✅ Trending API response:', data);

    const movies = (data.results || []).map(toMovie);
    console.log(`🎬 Processed ${movies.length} trending movies`);

    return movies;
  } catch (error) {
    console.error('❌ fetchTrendingMovies error:', error);
    throw error; // Re-throw to see the exact error in home.mjs
  }
}