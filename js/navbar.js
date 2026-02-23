document.addEventListener('DOMContentLoaded', updateNavbar);

function updateNavbar() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const navMenu = document.getElementById('nav-menu');

    if (!navMenu) return;

    if (token) {
        // Find existing Login link
        const loginLink = Array.from(navMenu.querySelectorAll('a')).find(a =>
            a.textContent.toLowerCase().includes('login') ||
            a.href.includes('auth-section')
        );

        if (loginLink) {
            const isIndex = window.location.pathname.endsWith('index.html') ||
                window.location.pathname.endsWith('/') ||
                (!window.location.pathname.includes('.html') && !window.location.pathname.includes('pages/'));

            let profilePath;
            if (role === 'admin') {
                profilePath = isIndex ? 'pages/admin.html' : 'admin.html';
            } else {
                profilePath = isIndex ? 'pages/profile.html' : 'profile.html';
            }

            // Replace Login with Profile
            loginLink.textContent = 'Profile';
            loginLink.href = profilePath;

            // REMOVED: Auto-adding logout button to global navbar
            // if (!navMenu.querySelector('.logout-btn')) { ... }
        }
    }
}

// Global logout function for use in dashboards
function logout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    const isIndex = window.location.pathname.endsWith('index.html') ||
        window.location.pathname.endsWith('/') ||
        (!window.location.pathname.includes('.html') && !window.location.pathname.includes('pages/'));

    window.location.href = isIndex ? 'index.html' : '../index.html';
}

window.logout = logout;
