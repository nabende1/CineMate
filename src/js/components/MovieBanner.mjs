// src/js/components/MovieBanner.mjs
export function createMovieBanner(movie) {
  try {
    console.log('🎨 Creating banner for:', movie.title);
    
    const el = document.createElement("div");
    el.className = "banner-item";

    // Use the correct property from your toMovie function
    const imageUrl = movie.poster || '/images/fallback_poster.jpg';
    console.log('🖼️ Banner image URL:', imageUrl);

    const title = movie.title || "Unknown Title";
    const overview = movie.overview?.slice(0, 150) || "No description available.";

    el.innerHTML = `
      <img src="${imageUrl}" alt="${title}" class="banner-image" onerror="this.src='/images/fallback_poster.jpg'">
      <div class="banner-info">
        <h3>${title}</h3>
        <p>${overview}${movie.overview?.length > 150 ? '...' : ''}</p>
        <button class="banner-btn" data-movie-id="${movie.id}">View Details</button>
      </div>
    `;

    // Add event listener
    const button = el.querySelector('.banner-btn');
    button.addEventListener('click', () => {
      window.location.href = `/movie/index.html?id=${movie.id}`;
    });

    console.log('✅ Banner created successfully');
    return el;
    
  } catch (error) {
    console.error('❌ Error creating banner:', error);
    // Return a simple fallback banner
    const fallback = document.createElement("div");
    fallback.className = "banner-item error";
    fallback.innerHTML = `<p>Error creating banner for ${movie.title}</p>`;
    return fallback;
  }
}