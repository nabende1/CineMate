const API_KEY = import.meta.env.VITE_OMDB_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

export async function fetchOMDbMovie(title) {
  try {
    const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`);
    const data = await res.json();
    if (data.Response === 'True') {
      return {
        title: data.Title,
        poster: data.Poster,
        rating: data.imdbRating,
        description: data.Plot
      };
    }
    return null;
  } catch (err) {
    console.error('OMDb fetch error:', err);
    return null;
  }
}
