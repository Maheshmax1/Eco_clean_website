const API_URL = 'http://localhost:8001';
const token = localStorage.getItem('token');
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

async function fetchEventDetails() {
    if (!eventId) {
        alert('No event selected');
        window.location.href = 'events.html';
        return;
    }

    try {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/events/${eventId}`, { headers });
        if (response.ok) {
            const event = await response.json();

            document.title = `${event.title} - EcoClean`;
            document.getElementById('event-title').textContent = event.title;
            document.getElementById('event-date').textContent = ` Date: ${event.event_date}`;
            document.getElementById('event-time').textContent = ` Time: ${event.start_time} - ${event.end_time}`;
            document.getElementById('event-location').textContent = `📍 Location: ${event.location}`;

            const img = document.getElementById('event-image');
            img.src = event.image_url;
            img.onerror = () => { img.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'; };

            const descContainer = document.getElementById('event-description');
            descContainer.innerHTML = `<p>${event.description}</p>`;

            // Handle volunteers list
            const volunteersSection = document.getElementById('registered-volunteers-section');
            const volunteersList = document.getElementById('volunteers-list');

            if (event.registrations && event.registrations.length > 0) {
                volunteersSection.style.display = 'block';
                volunteersList.innerHTML = '';
                event.registrations.forEach(reg => {
                    const li = document.createElement('li');
                    li.style = 'background: #e8f5e9; color: #2e7d32; padding: 5px 12px; border-radius: 15px; font-size: 0.9rem; font-weight: 600; border: 1px solid #c8e6c9;';
                    li.textContent = reg.user.full_name;
                    volunteersList.appendChild(li);
                });
            } else {
                volunteersSection.style.display = 'none';
            }

            const joinBtn = document.querySelector('.btn');
            if (event.is_registered) {
                joinBtn.textContent = '✓ Already Registered';
                joinBtn.style.backgroundColor = '#4caf50';
                joinBtn.style.pointerEvents = 'none';
            } else {
                joinBtn.onclick = (e) => {
                    e.preventDefault();
                    joinEvent(event.id);
                };
            }
        }
    } catch (e) {
        console.error('Error:', e);
    }
}


async function joinEvent(id) {
    if (!token) {
        alert('Please login to join this event');
        window.location.href = '../index.html#auth-section';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/events/${id}/join`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Successfully joined the event!');
            window.location.href = 'profile.html';
        } else {
            const data = await response.json();
            alert(data.detail || 'Failed to join event');
        }
    } catch (e) {
        alert('Error connecting to server');
    }
}

if (window.location.pathname.includes('about-event.html')) {
    fetchEventDetails();
}
