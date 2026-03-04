// User session token
const token = localStorage.getItem('token');

/**
 * fetchProfile - Retrieves and displays user's personal details correctly.
 */
async function fetchProfile() {
    //  Guard: Redirect if not logged in
    if (!token) {
        console.warn('No authentication token found! Redirecting to login...');
        window.location.href = '../index.html';
        return;
    }

    // Ensure API_URL is available from config.js
    const apiBase = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8000';

    try {
        console.log('Fetching user profile from:', `${apiBase}/users/me`);
        const response = await fetch(`${apiBase}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            console.log('Profile data received:', user);

            // Populate the user name and UI details
            const welcomeText = document.querySelector('.profile-text h1');
            if (welcomeText) welcomeText.textContent = `Welcome, ${user.full_name}!`;

            const volId = document.getElementById('vol-id');
            if (volId) volId.textContent = `ECO-VOL-${user.id}`;

            const volEmail = document.getElementById('vol-email');
            if (volEmail) volEmail.textContent = user.email;

            // Load registered events list
            fetchMyEvents();
        }
        else if (response.status === 401) {
            console.error('Unauthorized! Token might be expired.');
            alert('🔐 Session Expired: Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '../index.html';
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Failed to load profile:', errorData);
            alert('❌ Failed to load profile: ' + (errorData.detail || 'Server error occurred'));
        }
    } catch (err) {
        console.error('Failed to connect to backend:', err);
        const list = document.getElementById('registered-events-list');
        if (list) list.innerHTML = `<p style="color: red; text-align: center; padding: 20px;">🌐 Connection Error: Backend server not reached at ${apiBase}</p>`;
    }
}

/**
 * fetchMyEvents - Fetches and renders events the user has joined.
 */
async function fetchMyEvents() {
    const list = document.getElementById('registered-events-list');
    if (!list) return;

    // Ensure API_URL is available from config.js
    const apiBase = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8000';

    try {
        console.log('Fetching user events list...');
        const response = await fetch(`${apiBase}/users/me/events`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const registrations = await response.json();

            list.innerHTML = ''; // Clear loading placeholder

            if (registrations.length === 0) {
                list.innerHTML = `
                    <p style="text-align: center; width: 100%; padding: 20px;">
                        You haven't joined any events yet. 
                        <a href="events.html" style="color: #2e7d32; font-weight: bold;">Browse events!</a>
                    </p>`;
                return;
            }

            registrations.forEach(reg => {
                const event = reg.event;
                if (!event) return; // Skip if event details missing

                const card = document.createElement('a');
                card.href = `about-event.html?id=${event.id}`;
                card.className = 'event-card';
                card.style.textDecoration = 'none';

                // Fixed image tag syntax and restored fallback
                card.innerHTML = `
                    <div class="card-image-wrapper">
                        <img src="${event.image_url}" alt="${event.title}" class="card-image" onerror="this.src='https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80'">
                        <span class="status-badge upcoming">Registered</span>
                    </div>
                    <div class="card-content">
                        <h3>${event.title}</h3>
                        <p class="location">📍 ${event.location}</p>
                        <p class="date">📅 ${event.event_date}</p>
                    </div>
                `;
                list.appendChild(card);
            });
        } else {
            list.innerHTML = `<p style="text-align: center; padding: 20px;">Failed to load events. Status: ${response.status}</p>`;
        }
    } catch (err) {
        console.error('Failed to load registered events:', err);
        list.innerHTML = `<p style="text-align: center; color: red; padding: 20px;">Failed to fetch registered events. Check your connection.</p>`;
    }
}

// Only run initialization if we are actually on the profile page
if (window.location.pathname.includes('profile.html')) {
    fetchProfile();
}
