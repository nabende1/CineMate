import { setupSearchBar } from "../components/SearchBar.mjs";
import { renderSearchResults } from "../components/SearchResults.mjs";
import { searchTMDB } from "../api.mjs";

const barContainer = document.querySelector("#search-bar-container");
const resultsContainer = document.querySelector("#results-container");

setupSearchBar({
  parent: barContainer,
  onSearch: async (query) => {
    if (!query.trim()) {
      resultsContainer.innerHTML = `<p class="placeholder">Start typing to search…</p>`;
      return;
    }

    const data = await searchTMDB(query);
    renderSearchResults(resultsContainer, data.results);
  }
});
