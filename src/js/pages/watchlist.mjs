import { fetchMovieById } from '../fetch.mjs';
import { fetchTMDB } from '../api.mjs';
import { getWatchlist, removeFromWatchlist } from '../storage.mjs';
import { setActiveNavigation, loadLayoutPartials } from '../utils/partials.mjs';

const container = document.getElementById('watchlist-container');
const emptyDiv = document.getElementById('watchlist-empty');
const counter = document.getElementById('watchlist-counter');

function updateCounter(count) {
  if (counter) {
    counter.innerHTML = `<span class="count">${count}</span> movie${count !== 1 ? 's' : ''} in your watchlist`;
  }
}

// Override the global removeFromWatchlist to include rendering
function removeFromWatchlistAndUpdate(movieId) {
  removeFromWatchlist(movieId);
  render();
}

async function fetchWatchlistMovies() {
  const watchlist = getWatchlist();
  
  if (watchlist.length === 0) {
    return [];
  }
  
  const firstItem = watchlist[0];
  console.log('🔍 First watchlist item:', firstItem);
  
  // If watchlist contains full movie objects with posters, return them
  if (typeof firstItem === 'object' && firstItem.poster) {
    console.log('✅ Watchlist contains full movie objects');
    return watchlist;
  }
  
  // If watchlist contains only IDs, fetch movie details from TMDB
  if (typeof firstItem === 'number' || (typeof firstItem === 'object' && firstItem.id && !firstItem.poster)) {
    console.log('🔄 Watchlist contains IDs, fetching movie details...');
    
    // Extract movie IDs from watchlist
    const movieIds = watchlist.map(item => {
      if (typeof item === 'number') return item;
      if (typeof item === 'object' && item.id) return item.id;
      return null;
    }).filter(id => id !== null);
    
    console.log('🎬 Movie IDs to fetch:', movieIds);
    
    // Fetch movie details from TMDB API
    const moviePromises = movieIds.map(movieId => 
      fetchMovieById(movieId).catch(error => {
        console.error(`❌ Failed to fetch movie ${movieId}:`, error);
        // Return fallback movie object if API call fails
        return {
          id: movieId,
          title: `Movie ${movieId}`,
          poster: getFallbackPosterUrl(),
          rating: null,
          overview: 'Movie details unavailable'
        };
      })
    );
    
    const movies = await Promise.all(moviePromises);
    console.log(`✅ Fetched ${movies.length} movie details:`, movies);
    
    // Update localStorage with full movie data for future use
    localStorage.setItem('watchlist', JSON.stringify(movies));
    console.log('💾 Updated watchlist with full movie data');
    
    return movies;
  }
  
  console.warn('⚠️ Unexpected watchlist data format:', watchlist);
  return [];
}

// Function to get a reliable fallback poster URL
function getFallbackPosterUrl() {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMjI1QzE2Ny45NTMgMjI1IDE4Mi41IDIxMC40NTMgMTgyLjUgMTkyLjVDMTgyLjUgMTc0LjU0NyAxNjcuOTUzIDE2MCAxNTAgMTYwQzEzMi4wNDcgMTYwIDExNy41IDE3NC41NDcgMTE3LjUgMTkyLjVDMTE3LjUgMjEwLjQ1MyAxMzIuMDQ3IDIyNSAxNTAgMjI1WiIgZmlsbD0iI0Q4RDhEOCIvPgo8cGF0aCBkPSJNODUgMzA1Qzg1IDI4Mi45MSAxMDIuOTEgMjY1IDEyNSAyNjVIMTc1QzE5Ny4wOSAyNjUgMjE1IDI4Mi45MSAyMTUgMzA1VjM1MEMyMTUgMzcyLjA5IDE5Ny4wOSAzOTAgMTc1IDM5MEgxMjVDMTAyLjkxIDM5MCA4NSAzNzIuMDkgODUgMzUwVjMwNVoiIGZpbGw9IiNEOEQ4RDgiLz4KPC9zdmc+';
}

function createWatchlistCard(movie) {
  const card = document.createElement('div');
  card.className = 'movie-card watchlist-card';
  card.setAttribute('data-movie-id', movie.id);
  
  // Ensure poster URL is properly formatted
  let posterUrl = movie.poster;
  
  if (!posterUrl || posterUrl.includes('undefined') || posterUrl === '/images/fallback_poster.jpg') {
    posterUrl = getFallbackPosterUrl();
  }
  
  // If we have a poster_path instead of poster, construct the URL
  if (movie.poster_path && !posterUrl.includes('image.tmdb.org')) {
    posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  }
  
  card.innerHTML = `
    <button class="remove-btn" onclick="removeFromWatchlistAndUpdate(${movie.id})" title="Remove from watchlist">×</button>
    <img src="${posterUrl}" alt="${movie.title}" onerror="this.src='${getFallbackPosterUrl()}'">
    <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-rating">
            <span class="rating-star">⭐</span>
            <span>${movie.rating ? movie.rating.toFixed(1) : 'N/A'}/10</span>
        </div>
        <div class="movie-actions">
            <button class="watch-trailer-btn" onclick="watchTrailer(${movie.id})" title="Watch trailer">
                <span class="btn-text">Watch Trailer</span>
            </button>
            <a href="/movie/?id=${movie.id}" class="view-details">View Details</a>
        </div>
    </div>
  `;
  
  return card;
}

function renderWatchlistGrid(movies, container) {
  container.innerHTML = '';
  
  if (movies.length === 0) {
    container.innerHTML = '<p class="error">No movies to display</p>';
    return;
  }
  
  movies.forEach(movie => {
    const card = createWatchlistCard(movie);
    container.appendChild(card);
  });
}

async function render() {
  console.log('🔄 Rendering watchlist...');
  
  const watchlist = getWatchlist();
  const count = watchlist.length;
  
  updateCounter(count);
  
  if (!count) {
    container.innerHTML = '';
    emptyDiv.style.display = 'block';
    console.log('📭 Watchlist is empty');
    return;
  }
  
  emptyDiv.style.display = 'none';
  
  try {
    console.log(`🎬 Loading ${count} movies from watchlist...`);
    const movies = await fetchWatchlistMovies();
    
    if (movies.length === 0) {
      container.innerHTML = '<p class="error">No movies found in watchlist</p>';
      return;
    }
    
    console.log(`✅ Rendering ${movies.length} movies`);
    const filteredMovies = applySearchAndFilters(movies);
    console.log(`🔎 ${filteredMovies.length} movies after search/filters`);
    renderWatchlistGrid(filteredMovies, container);
    
  } catch (error) {
    console.error('❌ Error rendering watchlist:', error);
    container.innerHTML = '<p class="error">Failed to load watchlist. Please try again.</p>';
  }
}

// Apply search and filters to a list of movies (local watchlist)
function applySearchAndFilters(movies) {
  let result = Array.isArray(movies) ? movies.slice() : [];

  // Search query (set by SearchManager via 'searchPerformed' event)
  const q = (window.currentSearchQuery || '').toString().trim().toLowerCase();
  if (q) {
    result = result.filter(m => {
      const title = (m.title || '').toString().toLowerCase();
      const overview = (m.overview || '').toString().toLowerCase();
      return title.includes(q) || overview.includes(q);
    });
  }

  // Genre filters (FilterManager stores ids in activeFilters.genres)
  const genreIds = window.filterManager?.activeFilters?.genres || [];
  if (Array.isArray(genreIds) && genreIds.length > 0) {
    result = result.filter(m => {
      // TMDB movie objects may include genre_ids array or full genres array
      const gIds = m.genre_ids || (m.genres && m.genres.map(g => g.id)) || [];
      return genreIds.some(id => gIds.includes(id));
    });
  }

  // Year filter
  const year = window.filterManager?.activeFilters?.year;
  if (year) {
    result = result.filter(m => {
      const y = m.release_date ? new Date(m.release_date).getFullYear() : null;
      return y === parseInt(year, 10);
    });
  }

  return result;
}

// Watch Trailer function - tries popout window first, falls back to modal
async function watchTrailer(movieId) {
  try {
    // Fetch videos via TMDB
    const videos = await fetchTMDB(`/movie/${movieId}/videos`);
    const trailer = videos.results && videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

    if (!trailer) {
      alert('No trailer available for this movie.');
      return;
    }

    // Try to open a popout window first (user click should allow this)
    const width = 960;
    const height = 540;
    const left = Math.round((window.screen.width - width) / 2);
    const top = Math.round((window.screen.height - height) / 2);
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=no`;

    const popup = window.open('', `trailer_${movieId}`, features);

    if (popup && !popup.closed) {
      // Write a CineMate-branded page into the popup with the iframe set to autoplay
      const src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1&controls=1`;
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>CineMate - Trailer</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box}html,body{height:100%;background:#131d2e;color:#e5b2a0;font-family:Inter,system-ui,Arial,sans-serif;display:flex;flex-direction:column}.header{background:#0d1420;padding:12px 16px;border-bottom:2px solid #bb4230;display:flex;justify-content:space-between;align-items:center;z-index:10}.logo{font-size:18px;font-weight:700;color:#e5b2a0;letter-spacing:1px}.close-btn{background:#bb4230;color:#fff;border:0;padding:8px 14px;border-radius:4px;font-size:14px;cursor:pointer;font-weight:600;transition:background 0.2s}.close-btn:hover{background:#d65a3f}.video-container{flex:1;position:relative;overflow:hidden;background:#000}.video-container iframe{position:absolute;inset:0;border:0;width:100%;height:100%}</style></head><body><div class="header"><span class="logo">CineMate</span><button class="close-btn" onclick="window.close()">Close</button></div><div class="video-container"><iframe src="${src}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div><script>window.focus();</script></body></html>`;
      try {
        popup.document.open();
        popup.document.write(html);
        popup.document.close();
        popup.focus();
        return;
      } catch (writeErr) {
        // If writing to popup fails (some browsers restrict it), fall back to modal
        console.warn('Could not write to popup, falling back to modal:', writeErr);
        try { popup.close(); } catch (e) {}
      }
    }

    // Fallback: use in-page modal overlay
    const overlay = createTrailerOverlay('');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`;
    iframe.width = '960';
    iframe.height = '540';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;

    const content = overlay.querySelector('.trailer-content');
    content.innerHTML = '';
    content.appendChild(iframe);

    // Add close handler
    overlay.querySelector('.trailer-close').addEventListener('click', () => removeTrailerOverlay(overlay));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) removeTrailerOverlay(overlay);
    });

  } catch (err) {
    console.error('Error loading trailer:', err);
    alert('Failed to load trailer. Please try again later.');
  }
}

function createTrailerOverlay(initialText = '') {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'trailer-modal-overlay';

  const dialog = document.createElement('div');
  dialog.className = 'trailer-modal';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'trailer-close';
  closeBtn.innerHTML = '×';

  const content = document.createElement('div');
  content.className = 'trailer-content';
  content.textContent = initialText;

  dialog.appendChild(closeBtn);
  dialog.appendChild(content);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Prevent body scroll while overlay is open
  document.body.style.overflow = 'hidden';

  return overlay;
}

function removeTrailerOverlay(overlay) {
  if (!overlay) return;
  overlay.remove();
  document.body.style.overflow = '';
}

// Make functions available globally
window.removeFromWatchlistAndUpdate = removeFromWatchlistAndUpdate;
window.watchTrailer = watchTrailer;

// Listen for storage changes (from other tabs) and custom events
window.addEventListener('storage', render);
window.addEventListener('watchlistUpdated', render);

// Initial render
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Watchlist page loaded');

  // Load layout partials (header/sidebar) first so search & filter elements exist
  loadLayoutPartials().then(() => {
    setActiveNavigation();

    // Initialize filter and search managers (exposed globally by their modules)
    const filterManager = window.initializeFilterManager ? window.initializeFilterManager() : window.filterManager || null;
    const searchManager = window.initializeSearchManager ? window.initializeSearchManager() : window.searchManager || null;

    if (filterManager) {
      filterManager.setupEventListeners?.();
      filterManager.loadGenres?.();
    }

    if (searchManager) {
      // SearchManager attaches to header inputs; it emits 'searchPerformed' events
      searchManager.setupEventListeners?.();
    }

    // Re-render when filters or searches change
    document.addEventListener('filtersChanged', () => {
      console.log('Filters changed on watchlist — re-render');
      render();
    });

    document.addEventListener('searchPerformed', (e) => {
      window.currentSearchQuery = e.detail?.query || '';
      console.log('Search performed on watchlist:', window.currentSearchQuery);
      render();
    });

    // Finally render the page
    render();
  });
});