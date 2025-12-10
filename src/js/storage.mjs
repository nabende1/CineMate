const WATCHLIST_KEY = 'cinemate-watchlist';

export function getWatchlist() {
    try {
        const data = localStorage.getItem(WATCHLIST_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading watchlist:', error);
        return [];
    }
}

export function saveWatchlist(list) {
    try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
    } catch (error) {
        console.error('Error saving watchlist:', error);
    }
}

export function addToWatchlist(movie) {
    const list = getWatchlist();
    if (!list.find(m => m.id === movie.id)) {
        list.push(movie);
        saveWatchlist(list);
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('watchlistUpdated', { detail: { action: 'add', movie } }));
        
        // Update watchlist count in UI
        updateWatchlistCount();
        
        return true;
    }
    return false;
}

export function removeFromWatchlist(movieId) {
    let list = getWatchlist();
    const movie = list.find(m => m.id === movieId);
    const initialLength = list.length;
    
    list = list.filter(m => m.id !== movieId);
    saveWatchlist(list);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('watchlistUpdated', { 
        detail: { action: 'remove', movieId, movie } 
    }));
    
    // Update watchlist count in UI
    updateWatchlistCount();
    
    return initialLength !== list.length;
}

export function isInWatchlist(movieId) {
    const list = getWatchlist();
    return list.some(m => m.id === movieId);
}

export function updateWatchlistCount() {
    const list = getWatchlist();
    const count = list.length;
    
    // Update sidebar count
    const sidebarCounts = document.querySelectorAll('.sidebar-watchlist-count, .watchlist-count');
    sidebarCounts.forEach(element => {
        element.textContent = `(${count})`;
    });
    
    // Update header count if exists
    const headerCount = document.querySelector('.header-watchlist-count');
    if (headerCount) {
        headerCount.textContent = count;
    }
    
    return count;
}

// Initialize watchlist count on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        updateWatchlistCount();
    });
}