// src/js/utils/initialize-app.mjs
import { initializeComponentsAfterPartials } from './partials-manager.mjs';
import { initializeFilterManager } from '../filters.mjs';
import { initializeSearchManager } from '../search.mjs';

export async function initializeApp() {
    console.log('🚀 Initializing app...');
    
    // Initialize components (mobile menu, search, filters)
    initializeComponentsAfterPartials();
    
    // Initialize filter manager
    const filterManager = initializeFilterManager();
    filterManager.setupEventListeners();
    await filterManager.loadGenres();
    
    // Initialize search manager
    initializeSearchManager();
    
    console.log('✅ App initialized');
    return { filterManager };
}