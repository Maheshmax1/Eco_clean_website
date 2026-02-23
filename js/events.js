const API_URL = 'http://localhost:8001';

async function fetchPublicEvents() {
    try {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/events/`, { headers });
        if (response.ok) {
            const events = await response.json();
            const upcomingList = document.getElementById('upcoming-events-list');
            const completedList = document.getElementById('completed-events-list');

            if (upcomingList) upcomingList.innerHTML = '';
            if (completedList) completedList.innerHTML = '';

            const upcomingEvents = events.filter(e => e.status === 'upcoming');
            const completedEvents = events.filter(e => e.status === 'completed');

            if (upcomingEvents.length === 0 && upcomingList) {
                upcomingList.innerHTML = '<p style="text-align: center; width: 100%;">No upcoming events at the moment.</p>';
            }

            upcomingEvents.forEach(event => {
                const card = createEventCard(event, true);
                if (upcomingList) upcomingList.appendChild(card);
            });

            completedEvents.forEach(event => {
                const card = createEventCard(event, false);
                if (completedList) completedList.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}


function createEventCard(event, isUpcoming) {
    const div = document.createElement('div');
    div.className = 'event-card';
    if (isUpcoming && event.is_registered) {
        div.classList.add('registered');
    }

    let statusText = isUpcoming ? 'Know more' : `✓ Completed`;
    let statusClass = isUpcoming ? 'status-upcoming' : 'status-completed';

    if (isUpcoming && event.is_registered) {
        statusText = '✓ Registered';
        statusClass = 'status-registered'; // New class for registered status
    }

    const link = isUpcoming ? `./about-event.html?id=${event.id}` : '#';

    div.innerHTML = `
        <img src="${event.image_url}" alt="${event.title}" onerror="this.src='https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80'" />
        <div class="event-content">
          <span class="event-id">ECO-2025-${event.id}</span>
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <div class="event-details">
            <div class="event-detail-item">${event.event_date}</div>
            <div class="event-detail-item time">${event.start_time} - ${event.end_time}</div>
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



if (window.location.pathname.includes('events.html')) {
    fetchPublicEvents();
}
