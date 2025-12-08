// src/js/utils/partials-manager.mjs
import { initializeHeaderComponents } from "./search-and-filters.mjs";

// Helper function to initialize the mobile menu (Sidebar operation)
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (mobileMenuBtn && mobileSidebar) {
        console.log('📱 Initializing mobile menu...');
        
        const closeMenu = () => {
            mobileSidebar.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        const openMenu = (e) => {
            if(e) e.stopPropagation(); 
            mobileSidebar.classList.add('active');
            if (sidebarOverlay) sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        };

        // Open Menu
        mobileMenuBtn.addEventListener('click', openMenu);
        
        // Close Menu via X or Overlay
        if (closeMobileMenu) closeMobileMenu.addEventListener('click', closeMenu);
        if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMenu);

        // Close menu when clicking nav links
        document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMenu, 100); 
            });
        });

    } else {
        console.warn('❌ Mobile menu elements not yet available for initialization.');
    }
}

// The main function called by the 'partialsLoaded' event on every page
export function initializeComponentsAfterPartials() {
    console.log('🔄 Initializing components after partials load...');
    
    // 1. Initialize Mobile Menu (Universal)
    initializeMobileMenu();
    
    // 2. Initialize Search and Filters (Universal)
    initializeHeaderComponents();
    
    console.log('✅ Components initialization started');
}