/**
 * EcoClean – event-detail.js
 * Manages the "Event Details" page where users can view specific event info
 * and join events as volunteers.
 */

// Use global API_URL with fallback
const apiBase = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8000';
const token = localStorage.getItem('token'); // User session token (if logged in)

// Extract the Event ID from the URL (e.g., about-event.html?id=12)
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

/**
 * fetchEventDetails - Retrieves and displays comprehensive information about the selected event.
 * Also handles the registration status check and volunteer list rendering.
 */
async function fetchEventDetails() {
    // If no ID is present, redirect to the main events list as a fallback
    if (!eventId) {
        alert('No event selected. Redirecting...');
        window.location.href = 'events.html';
        return;
    }

    try {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Fetch single event data including registration status
        const response = await fetch(`${apiBase}/events/${eventId}`, { headers });

        if (response.ok) {
            const event = await response.json();

            // Update Page Metadata and Header
            document.title = `${event.title} - EcoClean`;
            document.getElementById('event-title').textContent = event.title;
            document.getElementById('event-date').textContent = `📅 Date: ${event.event_date}`;
            document.getElementById('event-time').textContent = `⏰ Time: ${event.start_time} - ${event.end_time}`;
            document.getElementById('event-location').textContent = `📍 Location: ${event.location}`;

            // Render Event Hero Image
            const img = document.getElementById('event-image');
            if (img) {
                img.src = event.image_url;
                // Handle broken image links with a fallback placeholder
                img.onerror = () => {
                    img.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80';
                };
            }

            // Populate the description block
            const descContainer = document.getElementById('event-description');
            if (descContainer) descContainer.innerHTML = `<p>${event.description}</p>`;

            // Render the "Who's Coming" section for registered volunteers
            const volunteersSection = document.getElementById('registered-volunteers-section');
            const volunteersList = document.getElementById('volunteers-list');

            if (event.registrations && event.registrations.length > 0) {
                if (volunteersSection) volunteersSection.style.display = 'block';
                if (volunteersList) {
                    volunteersList.innerHTML = '';
                    event.registrations.forEach(reg => {
                        const li = document.createElement('li');
                        li.style = 'background: #e8f5e9; color: #2e7d32; padding: 5px 12px; border-radius: 15px; font-size: 0.9rem; font-weight: 600; border: 1px solid #c8e6c9;';
                        li.textContent = reg.user.full_name;
                        volunteersList.appendChild(li);
                    });
                }
            } else {
                if (volunteersSection) volunteersSection.style.display = 'none';
            }


            // Update the "Join" button state if the user is already signed up
            const joinBtn = document.querySelector('.btn');
            if (joinBtn) {
                if (event.is_registered) {
                    joinBtn.textContent = '✓ Already Registered';
                    joinBtn.style.backgroundColor = '#4caf50';
                    joinBtn.style.pointerEvents = 'none'; // Disable clicking
                } else {
                    joinBtn.onclick = (e) => {
                        e.preventDefault();
                        joinEvent(event.id);
                    };
                }
            }
        }
    } catch (err) {
        console.error('Error in fetchEventDetails:', err);
    }
}

/**
 * joinEvent - Submits a registration request to the server for the current user.
 * @param {number} id - The ID of the event to join.
 */
async function joinEvent(id) {
    // Ensure authentication before allowing participation
    if (!token) {
        alert('Please login to join this event!');
        window.location.href = '../index.html#auth-section';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/events/${id}/join`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('🎉 Success! You have joined the event. See you there!');
            window.location.href = 'profile.html'; // Go to user dashboard
        } else {
            const data = await response.json();
            alert('❌ Oops: ' + (data.detail || 'Failed to join event'));
        }
    } catch (err) {
        alert('🌐 Connection Error: Is the server running?');
    }
}

// Global initialization: auto-run logic if on the details page
if (window.location.pathname.includes('about-event.html')) {
    fetchEventDetails();
}
