// src/js/pages/watchlist.mjs
import { loadHeaderFooter } from '../ui.mjs';
import { renderMovieGrid } from '../components/MovieGrid.mjs';

loadHeaderFooter();

const container = document.getElementById('watchlist-container');
const emptyDiv = document.getElementById('watchlist-empty');

function getWatchlist() {
  try { return JSON.parse(localStorage.getItem('watchlist')) || []; } catch { return []; }
}

function render() {
  const list = getWatchlist();
  if (!list.length) {
    container.innerHTML = '';
    emptyDiv && (emptyDiv.style.display = 'block');
    return;
  }
  emptyDiv && (emptyDiv.style.display = 'none');
  renderMovieGrid(list, '#watchlist-container');
}

window.addEventListener('storage', render);
render();
