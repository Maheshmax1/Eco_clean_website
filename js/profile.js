const API_URL = 'http://localhost:8001';
const token = localStorage.getItem('token');

async function fetchProfile() {
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const user = await response.json();
            document.querySelector('.profile-text h1').textContent = `Welcome, ${user.full_name}!`;
            document.getElementById('vol-id').textContent = `ECO-VOL-${user.id}`;
            document.getElementById('vol-email').textContent = user.email;

            fetchMyEvents();
        } else {
            localStorage.removeItem('token');
            window.location.href = '../index.html';
        }
    } catch (e) {
        console.error('Error fetching profile:', e);
    }
}

async function fetchMyEvents() {
    try {
        const response = await fetch(`${API_URL}/users/me/events`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const registrations = await response.json();
            const list = document.getElementById('registered-events-list');
            list.innerHTML = '';

            if (registrations.length === 0) {
                list.innerHTML = '<p style="text-align: center; width: 100%;">You haven\'t registered for any events yet. <a href="events.html">Browse events</a></p>';
                return;
            }

            registrations.forEach(reg => {
                const event = reg.event;
                const card = document.createElement('a');
                card.href = `about-event.html?id=${event.id}`;
                card.className = 'event-card';
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
        }
    } catch (e) {
        console.error('Error fetching registered events:', e);
    }
}

if (window.location.pathname.includes('profile.html')) {
    fetchProfile();
}
