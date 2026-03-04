/**
 * EcoClean – events_manage.js
 * Redundant/Legacy event management logic for tracking registrations.
 * NOTE: Most of these features are now integrated directly into admin.js.
 */

// Use global API_URL with fallback
const apiBase = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8000';
const token = localStorage.getItem('token'); // Authentication token

/**
 * fetchEventRegistrations - Fetches categorized registration data for all events.
 * Intended for the admin dashboard list.
 */
async function fetchEventRegistrations() {
    try {
        const response = await fetch(`${apiBase}/admin/event-registrations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const events = await response.json();
            const container = document.querySelector('.registrations-container');
            if (!container) return;

            container.innerHTML = ''; // Clean slate for rendering

            // Check if there are any events to report on
            if (events.length === 0) {
                container.innerHTML = '<p style="padding: 20px; text-align: center;">No events recorded in system.</p>';
                return;
            }

            // Iterate through each event and build its corresponding volunteer table
            events.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'registration-event-card';

                let volunteersTable = '';
                if (event.registrations && event.registrations.length > 0) {
                    volunteersTable = `
                        <div class="registration-volunteers-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${event.registrations.map(reg => `
                                        <tr>
                                            <td>${reg.user.full_name}</td>
                                            <td>${reg.user.email}</td>
                                            <td>${reg.user.phone || 'N/A'}</td>
                                            <td><span class="status-badge">✅ Joined</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                } else {
                    volunteersTable = `<p style="padding: 15px; color: #666;">No registrations recorded for this event.</p>`;
                }

                // Construct full event reporting card
                eventCard.innerHTML = `
                    <div class="registration-event-header" style="background: #f8f9fa; padding: 15px; border-bottom: 2px solid #eee;">
                        <h3>${event.title}</h3>
                        <p style="margin: 5px 0; color: #555;">📍 ${event.location} | 📅 ${event.event_date}</p>
                        <p><strong>Total Registrations: ${event.registrations.length}</strong></p>
                    </div>
                    ${volunteersTable}
                `;
                container.appendChild(eventCard);
            });
        }
    } catch (error) {
        console.error('Error in fetchEventRegistrations:', error);
    }
}

// Logic to initiate data load if session is valid
if (token) {
    fetchEventRegistrations();
} else {
    // Basic security redirect
    window.location.href = '../index.html';
}
