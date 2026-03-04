
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve  the data in local storage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;



    //  *Changes Login into Profile/Dashboard

    if (token) {
        //  ensure correct relative linking
        const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');

        //  user permission level
        let profilePath = role === 'admin' ? 'pages/admin.html' : 'pages/profile.html';

        // Adjust path if the user is already within the /pages/ directory
        if (window.location.pathname.includes('/pages/')) {
            profilePath = role === 'admin' ? 'admin.html' : 'profile.html';
        }

        const loginLinks = navMenu.querySelectorAll('a');
        loginLinks.forEach(link => {
            const text = link.textContent.toLowerCase();

            // profile link chnage here
            if (text.includes('login') || text.includes('sign up')) {
                link.textContent = role === 'admin' ? 'Dashboard' : 'Profile';
                link.href = profilePath;
            }
        });

        // the user is already in
        const authSection = document.getElementById('auth-section');
        if (authSection) {
            authSection.style.display = 'none';
        }
    }
});

/**
 * logout button navigate to home.
 * @param {Event} event - The click event from the logout button.
 */
function logout(event) {
    if (event) event.preventDefault(); // Stop default 

    // Permanently clear credentials
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    alert('Logged out successfully');

    // Redirect to the main homepage
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    window.location.href = isIndex ? 'index.html' : '../index.html';
}

// Expose the logout function globally so it can be called from onclick attributes in any file
window.logout = logout;
