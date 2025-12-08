export async function loadPartial(partialName, container, data = null) {
    try {
        const response = await fetch(`/partials/${partialName}.html`);
        let html = await response.text();
        
        // Replace template variables if data is provided
        if (data) {
            Object.keys(data).forEach(key => {
                const placeholder = new RegExp(`{{${key}}}`, 'g');
                html = html.replace(placeholder, data[key] || '');
            });
        }
        
        container.innerHTML = html;
        
        // Dispatch event when the header partial (containing the menu/search) is loaded
        if (partialName === 'header') {
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('partialsLoaded'));
            }, 100);
        }
        
        return true;
    } catch (error) {
        console.error(`Error loading partial ${partialName}:`, error);
        return false;
    }
}

export async function loadLayoutPartials() {
    try {
        console.log('🔄 Loading layout partials...');
        
        // Load header first (contains search bar, mobile menu, and filters)
        const headerContainer = document.getElementById('header-partial');
        if (headerContainer) {
            await loadPartial('header', headerContainer);
            console.log('✅ Header partial loaded');
        }
        
        // Load sidebar (if separate desktop sidebar partial exists)
        const sidebarContainer = document.getElementById('sidebar-partial');
        if (sidebarContainer) {
            await loadPartial('sidebar', sidebarContainer);
            console.log('✅ Sidebar partial loaded');
        }
        
        // Load footer
        const footerContainer = document.getElementById('footer-partial');
        if (footerContainer) {
            await loadPartial('footer', footerContainer);
            console.log('✅ Footer partial loaded');
        }
        
        // Set active navigation (runs after links are loaded)
        setActiveNavigation();
        
        console.log('✅ All partials loaded successfully');
        return true;
    } catch (error) {
        console.error('❌ Error loading partials:', error);
        return false;
    }
}

// Set active navigation based on current page
export function setActiveNavigation() {
    const currentPage = window.location.pathname;
    
    // Set active state in desktop menu and mobile sidebar links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        // Use endsWith for exact page match or includes for simpler check
        if (link.getAttribute('href') === currentPage || currentPage.includes(link.dataset.page)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}