// src/js/utils/search-and-filters.mjs

function setupSearch() {
    console.log('🔍 Search setup initiated.');
    const mobileSearchInput = document.getElementById('mobile-search');
    const desktopSearchInput = document.getElementById('desktop-search');
    const desktopSuggestions = document.getElementById('desktop-suggestions');

    // Example logic for search button click
    const handleSearch = (input) => {
        const query = input.value;
        if (query) {
            console.log(`Searching for: ${query}`);
            // Add your navigation or search API call logic here
        }
    };

    if (mobileSearchInput) {
        document.getElementById('mobile-search-btn').addEventListener('click', () => {
            handleSearch(mobileSearchInput);
        });
    }

    if (desktopSearchInput) {
        document.getElementById('desktop-search-btn').addEventListener('click', () => {
            handleSearch(desktopSearchInput);
        });
        
        // Example: Hide suggestions when clicking outside
        if (desktopSuggestions) {
            document.addEventListener('click', (e) => {
                 if (!desktopSearchInput.contains(e.target) && !desktopSuggestions.contains(e.target)) {
                     desktopSuggestions.classList.remove('active');
                 }
            });
        }
    }
}

function initializeFilters() {
    console.log('🎛️ Filters initialized.');

    // Desktop filters
    const desktopFilterBtn = document.querySelector('.desktop-filter-btn');
    const desktopFilterOptions = document.querySelector('.desktop-filter-options');
    
    // Mobile filters
    const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
    const mobileFilterOptions = document.querySelector('.mobile-filter-options');
    
    // Helper function to close all filter dropdowns
    const closeAllFilters = () => {
        // Targets both mobile and desktop filter options
        document.querySelectorAll('.filter-options').forEach(options => {
            options.classList.remove('active');
        });
    }

    // Toggle Desktop Filters
    if (desktopFilterBtn && desktopFilterOptions) {
        desktopFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllFilters(); 
            desktopFilterOptions.classList.toggle('active');
        });
    }
    
    // Toggle Mobile Filters
    if (mobileFilterBtn && mobileFilterOptions) {
        mobileFilterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllFilters(); 
            mobileFilterOptions.classList.toggle('active');
        });
    }

    // Close filters when clicking outside of any filter dropdown or button
    document.addEventListener('click', closeAllFilters);

    // Prevent filter close when clicking inside filter options
    document.querySelectorAll('.filter-options').forEach(options => {
        options.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// Export the combined initialization function
export function initializeHeaderComponents() {
    setupSearch();
    initializeFilters();
}