// src/js/components/Search.mjs
import { searchMovies } from "../fetch.mjs";

export function setupSearch({
    mobileInput,
    desktopInput,
    suggestionBox,
    resultGrid
}) {
    async function handleSearch(event) {
        const query = event.target.value.trim();

        if (!query) {
            suggestionBox.innerHTML = "";
            resultGrid.innerHTML = "";
            return;
        }

        let results = [];
        try {
            results = await searchMovies(query);
        } catch (err) {
            console.error("Search failed:", err);
            return;
        }

        // SUGGESTIONS
        suggestionBox.innerHTML = results
            .slice(0, 6)
            .map(movie => `<div class="suggestion-item">${movie.title}</div>`)
            .join("");

        // SEARCH RESULTS GRID
        resultGrid.innerHTML = results
            .map(movie => `
                <div class="movie-card-small">
                    <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" />
                    <p>${movie.title}</p>
                </div>
            `)
            .join("");
    }

    if (mobileInput) mobileInput.addEventListener("input", handleSearch);
    if (desktopInput) desktopInput.addEventListener("input", handleSearch);
}
