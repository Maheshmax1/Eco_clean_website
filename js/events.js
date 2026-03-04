// Use global API_URL with fallback
const apiBase = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8000';

// Displays "Upcoming" events and "Completed" history separately.
async function fetchPublicEvents() {
    try {
        const token = localStorage.getItem('token');
        const headers = { 'Accept': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('Fetching public events from:', `${apiBase}/events/`);
        const response = await fetch(`${apiBase}/events/`, { headers });

        if (response.status === 401) {
            // Token expired or invalid
            console.warn('Unauthorized! Attempting to load public data without token...');
            const publicResponse = await fetch(`${apiBase}/events/`, { headers: { 'Accept': 'application/json' } });
            if (publicResponse.ok) {
                renderEvents(await publicResponse.json());
                return;
            }
        }

        if (response.ok) {
            const events = await response.json();
            renderEvents(events);
        } else {
            console.error('Server error fetching events:', response.status);
            showError('Could not load events. Server error: ' + response.status);
        }
    } catch (error) {
        console.error('Failed to load events gallery:', error);
        showError('Network Error: Is the backend server running at ' + apiBase + '?');
    }
}

/**
 * renderEvents - Helper to distribute events into UI sections.
 * @param {Array} events - List of event objects.
 */
function renderEvents(events) {
    const upcomingList = document.getElementById('upcoming-events-list');
    const completedList = document.getElementById('completed-events-list');

    // Reset containers
    if (upcomingList) upcomingList.innerHTML = '';
    if (completedList) completedList.innerHTML = '';

    // Separate events by current status
    const upcomingEvents = events.filter(e => e.status === 'upcoming');
    const completedEvents = events.filter(e => e.status === 'completed');

    // Handle empty states
    if (upcomingEvents.length === 0 && upcomingList) {
        upcomingList.innerHTML = '<p style="text-align: center; width: 100%; padding: 20px;">No upcoming events at the moment. Check back soon!</p>';
    }

    // Render Upcoming Event Gallery
    upcomingEvents.forEach(event => {
        const card = createEventCard(event, true);
        if (upcomingList) upcomingList.appendChild(card);
    });

    // Render Completed Event Archive
    if (completedEvents.length === 0 && completedList) {
        completedList.innerHTML = '<p style="text-align: center; width: 100%; padding: 20px;">No completed events in our archive yet.</p>';
    } else {
        completedEvents.forEach(event => {
            const card = createEventCard(event, false);
            if (completedList) completedList.appendChild(card);
        });
    }
}

/**
 * showError - Simple UI feedback for failures.
 * @param {string} msg 
 */
function showError(msg) {
    const list = document.getElementById('upcoming-events-list');
    if (list) list.innerHTML = `<p style="color: red; text-align: center; width: 100%; padding: 20px;">⚠️ ${msg}</p>`;
}

/**
 * createEventCard - Factory function to generate HTML cards for events.
 * @param {Object} event - Individual event data from API.
 * @param {boolean} isUpcoming - Logic flag to determine action buttons and badges.
 */


function createEventCard(event, isUpcoming) {
    const div = document.createElement('div');
    div.className = 'event-card';

    // Dynamic UI elements based on status
    let statusText = isUpcoming ? 'Know more' : `✓ Completed`;
    let statusClass = isUpcoming ? 'status-upcoming' : 'status-completed';

    // Personalization: Show registered badge if the user is already part of the project
    if (isUpcoming && event.is_registered) {
        div.classList.add('registered');
        statusText = '✓ Registered';
        statusClass = 'status-registered';
    }
    // ternary operator
    const link = isUpcoming ? `./about-event.html?id=${event.id}` : '#';

    // Build the Card Interior
    div.innerHTML = `
        <img src="${event.image_url}" alt="${event.title}" />
        <div class="event-content">
          <span class="event-id">ECO-EVENT-${event.id}</span>
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <div class="event-details">
            <div class="event-detail-item">📅 ${event.event_date}</div>
            <div class="event-detail-item time">⏰ ${event.start_time} - ${event.end_time}</div>
          </div>
          ${isUpcoming ? `<a href="${link}"><span class="event-status ${statusClass}">${statusText}</span></a>` : `<span class="event-status ${statusClass}">${statusText}</span>`}
        </div>
        ${isUpcoming && event.is_registered ? `
        <div class="registration-overlay">
            <div class="registered-badge">✓ REGISTERED</div>
            <a href="${link}" class="view-details-link">View Event Details</a>
        </div>
        ` : ''}
    `;

    return div;
}

// Auto-trigger gallery loading on appropriate page
if (window.location.pathname.includes('events.html')) {
    fetchPublicEvents();
}
