export async function fetchMovies(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch movies:', err);
    return [];
  }
}
