import { fetchPopularMovies, fetchTrendingMovies } from "../fetch.mjs";
import { renderMovieGrid } from "../components/MovieGrid.mjs";
import { createMovieBanner } from "../components/MovieBanner.mjs";

// DOM targets
const trendingBanner = document.getElementById("trending-banner");
const popularGrid = document.getElementById("popular-grid");

// LOAD POPULAR MOVIES
async function loadPopularMovies() {
  try {
    console.log('🟢 Loading popular movies...');
    const movies = await fetchPopularMovies();
    renderMovieGrid(movies, popularGrid);
  } catch (err) {
    console.error("🔴 Popular load error:", err);
    popularGrid.innerHTML = '<p class="error">Failed to load popular movies</p>';
  }
}

// LOAD TRENDING MOVIES WITH CAROUSEL
async function loadTrendingMovies() {
  try {
    const movies = await fetchTrendingMovies();

    if (!movies || movies.length === 0) {
      trendingBanner.innerHTML = '<p class="error">No trending movies available</p>';
      return;
    }

    // Use the first 5 movies
    const bannerMovies = movies.slice(0, 5);

    // Clear wrapper
    trendingBanner.innerHTML = "";

    // Create banners
    bannerMovies.forEach((movie, index) => {
      const banner = createMovieBanner(movie);
      if (index === 0) banner.classList.add("active"); // show first
      trendingBanner.appendChild(banner);
    });

    // Start carousel rotation
    startBannerCarousel(trendingBanner);

  } catch (err) {
    console.error("🔴 Trending load error:", err);
    trendingBanner.innerHTML = '<p class="error">Failed to load trending movies</p>';
  }
}

// CAROUSEL LOGIC
function startBannerCarousel(wrapper) {
  const banners = wrapper.querySelectorAll(".banner-item");
  let current = 0;

  if (banners.length <= 1) return; // no need for rotation

  setInterval(() => {
    banners[current].classList.remove("active");

    current = (current + 1) % banners.length;

    banners[current].classList.add("active");
  }, 5000); // 5 secs
}



// LOAD BOTH SECTIONS
loadTrendingMovies();
loadPopularMovies();
