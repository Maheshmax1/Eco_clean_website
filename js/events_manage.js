const API_URL = 'http://localhost:8001';
const token = localStorage.getItem('token');

async function fetchEventRegistrations() {
    try {
        const response = await fetch(`${API_URL}/admin/event-registrations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const events = await response.json();
            const container = document.querySelector('.registrations-container');
            if (!container) return;
            container.innerHTML = '';

            if (events.length === 0) {
                container.innerHTML = '<p style="padding: 20px; text-align: center;">No events found</p>';
                return;
            }

            events.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'registration-event-card';

                let volunteersHtml = '';
                if (event.registrations && event.registrations.length > 0) {
                    volunteersHtml = `
                        <div class="registration-volunteers-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Registration Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${event.registrations.map(reg => `
                                        <tr>
                                            <td>${reg.user.full_name}</td>
                                            <td>${reg.user.email}</td>
                                            <td>${reg.user.phone || 'N/A'}</td>
                                            <td>${new Date(reg.registration_date).toLocaleDateString()}</td>
                                            <td>
                                                <span class="status-badge status-registered">${reg.status}</span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                } else {
                    volunteersHtml = `
                        <div class="registration-volunteers-table">
                            <p class="no-volunteers-message">
                                No volunteers have registered for this event yet.
                            </p>
                        </div>
                    `;
                }

                eventCard.innerHTML = `
                    <div class="registration-event-header">
                        <div class="registration-event-info">
                            <h3 class="registration-event-title">${event.title}</h3>
                            <p class="registration-event-meta">
                                ${event.event_date} | ${event.start_time} - ${event.end_time} | ${event.location}
                            </p>
                            <p class="registration-volunteer-count">
                                <strong>${event.registrations.length} Volunteers Registered</strong>
                            </p>
                        </div>
                    </div>
                    ${volunteersHtml}
                `;
                container.appendChild(eventCard);
            });
        } else {
            console.error('Failed to fetch registrations');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Global handleLogout for consistent behavior


// Initialize
if (token) {
    fetchEventRegistrations();
} else {
    alert('Admin login required');
    window.location.href = '../index.html';
}
