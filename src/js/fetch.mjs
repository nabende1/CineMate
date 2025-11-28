// src/js/fetch.mjs

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

// Universal fetch wrapper
async function getJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
}

/** Fetch POPULAR Movies */
export async function fetchPopularMovies() {
  if (!TMDB_KEY) throw new Error("TMDB API key is undefined");

  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`;

  const data = await getJson(url);

  return data.results.map((m) => ({
    id: m.id,
    title: m.title,
    poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
    year: m.release_date?.slice(0, 4),
    overview: m.overview,
    rating: m.vote_average
  }));
}

/** Fetch MOVIE by ID */
export async function fetchMovieById(id) {
  if (!TMDB_KEY) throw new Error("TMDB API key is undefined");

  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=en-US`;

  const m = await getJson(url);

  return {
    id: m.id,
    title: m.title,
    poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
    year: m.release_date?.slice(0, 4),
    overview: m.overview,
    rating: m.vote_average
  };
}

/** 🔥 SEARCH Movies */
export async function searchMovies(query) {
  if (!TMDB_KEY) throw new Error("TMDB API key is undefined");

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(
    query
  )}&language=en-US&page=1`;

  const data = await getJson(url);

  return data.results.map((m) => ({
    id: m.id,
    title: m.title,
    poster: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : "/public/images/placeholder.jpg",
    year: m.release_date?.slice(0, 4),
    overview: m.overview,
    rating: m.vote_average
  }));
}
