import { fetchTrending } from "../api.mjs";
import { renderMovieGridAppend } from "../components/MovieGrid.mjs";

const grid = document.querySelector("#trending-grid");
const loader = document.querySelector("#loader");
const btns = document.querySelectorAll(".trend-btn");

let category = "day"; // default
let page = 1;
let loading = false;

// Load initial results
loadTrending();

// Handle category switching
btns.forEach(btn => {
  btn.addEventListener("click", () => {
    btns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    category = btn.dataset.type;
    page = 1;
    grid.innerHTML = "";
    loadTrending();
  });
});

// Infinite scrolling
window.addEventListener("scroll", () => {
  if (loading) return;

  const scrollPos = window.innerHeight + window.scrollY;
  const bottom = document.body.offsetHeight - 200;

  if (scrollPos >= bottom) {
    page++;
    loadTrending();
  }
});

async function loadTrending() {
  loading = true;
  loader.classList.remove("hidden");

  const data = await fetchTrending(category, page);
  renderMovieGridAppend(grid, data.results);

  loader.classList.add("hidden");
  loading = false;
}
