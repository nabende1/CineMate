import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchSimilarMovies,
} from "../api.mjs";

import { addToWatchlist, isInWatchlist } from "../storage.mjs";
import { renderMovieGrid } from "../components/MovieGrid.mjs";
import { setActiveNavigation } from "../utils/partials.mjs";

const hero = document.getElementById("movie-hero");
const castList = document.getElementById("cast-list");
const similarGrid = document.getElementById("similar-grid");

// Get elements from the reorganized HTML structure
const moviePoster = document.getElementById("movie-poster");
const movieTitle = document.getElementById("movie-title");
const movieYear = document.getElementById("movie-year");
const movieRuntime = document.getElementById("movie-runtime");
const movieRating = document.getElementById("movie-rating");
const movieGenres = document.getElementById("movie-genres");
const movieOverview = document.getElementById("movie-overview");
const watchlistBtn = document.querySelector(".watch-btn");

const id = new URLSearchParams(window.location.search).get("id");

if (!id) {
  hero.innerHTML = "<p class='error'>Movie not found.</p>";
  throw new Error("No movie ID provided.");
}

init();

function renderHero(movie) {
  // Use backdrop image for hero section, or poster if no backdrop
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : movie.poster_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}`
    : '/images/fallback_poster.jpg';

  hero.style.backgroundImage = `url('${backdropUrl}')`;
  hero.innerHTML = `
    <div class="hero-content">
      <h1 class="hero-title">${movie.title}</h1>
      <div class="hero-meta">
        <span>${movie.release_date?.slice(0, 4) || 'N/A'}</span>
        <span>•</span>
        <span>${movie.runtime} min</span>
        <span>•</span>
        <span>${movie.vote_average?.toFixed(1) || 'N/A'} ⭐</span>
      </div>
    </div>
  `;
}

function transformMovieForStorage(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/images/fallback_poster.jpg',
    poster_path: movie.poster_path,
    rating: movie.vote_average,
    release_date: movie.release_date,
    overview: movie.overview,
    runtime: movie.runtime,
    genres: movie.genres,
    vote_average: movie.vote_average
  };
}

function renderMovieDetails(movie) {
  // Update movie poster
  if (movie.poster_path) {
    moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    moviePoster.alt = movie.title;
  } else {
    moviePoster.src = '/images/fallback_poster.jpg';
  }

  // Update movie title and info
  movieTitle.textContent = movie.title;
  movieYear.textContent = movie.release_date?.slice(0, 4) || 'N/A';
  movieRuntime.textContent = `${movie.runtime} min`;
  movieRating.textContent = `${movie.vote_average?.toFixed(1) || 'N/A'} ⭐`;
  movieOverview.textContent = movie.overview || 'No overview available.';

  // Update genres
  if (movie.genres && movie.genres.length > 0) {
    movieGenres.innerHTML = movie.genres
      .map(genre => `<li>${genre.name}</li>`)
      .join('');
  } else {
    movieGenres.innerHTML = '<li>No genres</li>';
  }

  // Update watchlist button
  const watchlistActive = isInWatchlist(movie.id);
  updateWatchlistButton(watchlistActive);

  // Update watchlist button click handler
  watchlistBtn.onclick = () => {
    const movieForStorage = transformMovieForStorage(movie);
    addToWatchlist(movieForStorage);
    updateWatchlistButton(!watchlistActive);
  };
}

function updateWatchlistButton(isActive) {
  watchlistBtn.textContent = isActive ? "✓ Added to Watchlist" : "+ Add to Watchlist";
  watchlistBtn.className = `watch-btn ${isActive ? "active" : ""}`;
}

function renderCast(cast) {
  if (!cast || cast.length === 0) {
    castList.innerHTML = '<p class="no-cast">No cast information available.</p>';
    return;
  }

  castList.innerHTML = cast
    .slice(0, 12)
    .map(
      (actor) => `
      <div class="cast-card">
        <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/images/placeholder-person.jpg'}" 
             alt="${actor.name}"
             onerror="this.src='/images/placeholder-person.jpg'">
        <h4>${actor.name}</h4>
        <p>${actor.character || 'Unknown role'}</p>
      </div>
    `
    )
    .join("");
}

function renderSimilarMovies(similarMovies) {
  if (!similarMovies || similarMovies.length === 0) {
    similarGrid.innerHTML = '<p class="no-similar">No similar movies found.</p>';
    return;
  }

  // Transform the data to match what MovieGrid expects
  const transformedMovies = similarMovies.map(movie => ({
    ...movie,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/images/fallback_poster.jpg',
    rating: movie.vote_average
  }));

  renderMovieGrid(transformedMovies, similarGrid);
}

async function init() {
  try {
    console.log('🎬 Loading movie details for ID:', id);
    
    const [details, credits, similar] = await Promise.all([
      fetchMovieDetails(id),
      fetchMovieCredits(id),
      fetchSimilarMovies(id)
    ]);

    console.log('✅ Movie data loaded:', details.title);
    
    renderHero(details);
    renderMovieDetails(details);
    renderCast(credits.cast);
    renderSimilarMovies(similar.results);
    
  } catch (error) {
    console.error('❌ Error loading movie details:', error);
    hero.innerHTML = `
      <div class="error-state">
        <h3>Failed to load movie details</h3>
        <p>Please check your connection and try again.</p>
        <button class="watch-btn" onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

// Set active navigation
document.addEventListener('DOMContentLoaded', () => {
  setActiveNavigation();
});