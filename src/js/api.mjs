const BASE = "https://api.themoviedb.org/3";

export async function fetchTMDB(endpoint) {
  const url = `${BASE}${endpoint}?api_key=${import.meta.env.VITE_TMDB_KEY}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("TMDB fetch error: " + endpoint);

  return await res.json();
}

export async function searchTMDB(query) {
  const url = `${BASE}/search/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&query=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Search failed.");

  return await res.json();
}

export async function fetchTrending(type = "day", page = 1) {
  const url = `${BASE}/trending/movie/${type}?api_key=${import.meta.env.VITE_TMDB_KEY}&page=${page}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed trending fetch");

  return await res.json();
}

export async function fetchMovieDetails(id) {
  const res = await fetch(`${BASE}/movie/${id}?api_key=${KEY}`);
  return res.json();
}

export async function fetchMovieCredits(id) {
  const res = await fetch(`${BASE}/movie/${id}/credits?api_key=${KEY}`);
  return res.json();
}

export async function fetchSimilarMovies(id) {
  const res = await fetch(`${BASE}/movie/${id}/similar?api_key=${KEY}`);
  return res.json();
}
