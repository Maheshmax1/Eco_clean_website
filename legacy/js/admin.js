/**
 * EcoClean – admin.js
 * Main logic for the Admin Dashboard including statistics, event management, 
 * volunteer lists, message handling, and event registrations.
 */

// --- Initial Setup ---
const apiBase = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8000';
const token = localStorage.getItem('token'); // Retrieve admin session token

/**
 * fetchStats - Fetches summary statistics for the dashboard cards.
 * Updates "Upcoming Events" and "Completed Events" with a count-up animation.
 */
/**
 * fetchStats - Gets the numbers (total events, etc.) for the dashboard
 */
async function fetchStats() {
    try {
        const response = await fetch(`${apiBase}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            handleAuthError();
            return;
        }

        if (response.ok) {
            const stats = await response.json();
            document.getElementById('stat-upcoming-detail').textContent = '';
            document.getElementById('stat-completed-detail').textContent = '';
            animateValue("stat-upcoming-count", 0, stats.upcoming_events, 1000);
            animateValue("stat-completed-count", 0, stats.completed_events, 1000);
        }
    } catch (error) {
        console.error('Error fetching admin statistics:', error);
    }
}

// ... other functions ...

/**
 * animateValue - Creates a smooth "count-up" animation for numbers.
 */
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * handleAuthError - Clears expired session and redirects to login
 */
function handleAuthError() {
    alert('🔐 Session Expired: Please login again to continue.');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.replace('../index.html');
}

/**
 * fetchAdminEvents - Gets the list of events so the admin can Edit or Delete them
 */
async function fetchAdminEvents() {
    try {
        const response = await fetch(`${apiBase}/events/`);

        // This is a public route, so 401 is unlikely here, 
        // but it's good practice to handle it if the backend changes.
        if (response.status === 401) {
            handleAuthError();
            return;
        }

        if (response.ok) {
            const events = await response.json();
            const list = document.getElementById('admin-events-list');
            if (!list) return;

            list.innerHTML = '';

            if (events.length === 0) {
                list.innerHTML = '<p style="padding: 20px; text-align: center;">No events yet. Go create some!</p>';
                return;
            }

            events.forEach(event => {
                const isUpcoming = event.status === 'upcoming';
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.style.borderLeft = isUpcoming ? '4px solid #4CAF50' : '4px solid #888';

                eventItem.innerHTML = `
                    <div class="event-details">
                        <p class="event-name">
                            <strong>${event.title}</strong> 
                            <span class="status-pill" style="font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; background: ${isUpcoming ? '#e8f5e9' : '#eee'}; color: ${isUpcoming ? '#2e7d32' : '#666'}; margin-left: 8px;">
                                ${event.status.toUpperCase()}
                            </span>
                        </p>
                        <p class="event-time">${event.event_date} | ${event.start_time}</p>
                    </div>
                    <div class="event-actions">
                        ${isUpcoming ? `
                            <button class="action-btn" style="background: #2e7d32; color: white;" onclick="markEventCompleted(${event.id})">✅ Done</button>
                        ` : ''}
                        <button class="action-btn edit-btn" onclick="window.location.href='edit-event.html?id=${event.id}'">✏️ Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteEvent(${event.id})">🗑️ Delete</button>
                    </div>
                `;
                list.appendChild(eventItem);
            });
        }
    } catch (error) {
        console.error('Error fetching admin events:', error);
    }
}

/**
 * markEventCompleted - Updates an event status to "completed"
 */
async function markEventCompleted(id) {
    if (!confirm('Mark this event as completed and move it to history?')) return;

    const currentToken = localStorage.getItem('token');
    try {
        const response = await fetch(`${apiBase}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${currentToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'completed' })
        });

        if (response.ok) {
            alert('🎉 Event marked as completed!');
            fetchAdminEvents();
            fetchStats();
        } else {
            alert('❌ Failed to update event status.');
        }
    } catch (error) {
        console.error('Error marking event as completed:', error);
    }
}

/**
 * fetchVolunteers - Gets the list of volunteer accounts
 */
async function fetchVolunteers() {
    try {
        const response = await fetch(`${apiBase}/admin/volunteers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            handleAuthError();
            return;
        }

        if (response.ok) {
            const volunteers = await response.json();
            const list = document.getElementById('volunteer-applications-list');
            if (!list) return;

            list.innerHTML = '';

            if (volunteers.length === 0) {
                list.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">No volunteer applications found.</td></tr>';
                return;
            }

            volunteers.forEach(v => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${v.full_name}</td>
                    <td>${v.email}</td>
                    <td>General</td>
                    <td>Regular</td>
                `;
                list.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error fetching volunteer list:', error);
    }
}

/**
 * fetchMessages - Gets the messages from the contact form
 */
async function fetchMessages() {
    try {
        const response = await fetch(`${apiBase}/admin/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            handleAuthError();
            return;
        }

        if (response.ok) {
            const messages = await response.json();
            const list = document.getElementById('admin-messages-list');
            if (!list) return;

            list.innerHTML = '';

            if (messages.length === 0) {
                list.innerHTML = '<p style="padding: 20px; text-align: center;">No messages yet.</p>';
                return;
            }

            messages.forEach(m => {
                const msgBox = document.createElement('div');
                msgBox.className = 'message-card';
                msgBox.style.cssText = 'background: white; border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 10px; cursor: pointer; transition: 0.3s;';
                msgBox.onmouseover = () => msgBox.style.background = '#f9f9f9';
                msgBox.onmouseout = () => msgBox.style.background = 'white';

                msgBox.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;" onclick='showMessageDetail(${JSON.stringify(m).replace(/'/g, "&apos;")})'>
                        <div>
                            <strong style="font-size: 1.1rem; color: #333;">${m.name}</strong>
                            <p style="margin: 0; color: #666; font-size: 0.9rem;">Subject: ${m.subject}</p>
                        </div>
                        <span style="background: ${getPriorityColor(m.priority)}; color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; text-transform: uppercase; font-weight: bold;">
                            ${m.priority}
                        </span>
                    </div>
                `;
                list.appendChild(msgBox);
            });
        }
    } catch (error) {
        console.error('Error fetching contact messages:', error);
    }
}

/**
 * getPriorityColor - Helper to determine badge color based on message priority.
 * @param {string} priority - The priority level (High, Medium, Low).
 */
function getPriorityColor(priority) {
    switch (priority?.toLowerCase()) {
        case 'high': return '#f44336'; // Red
        case 'medium': return '#ff9800'; // Orange
        case 'low': return '#4CAF50'; // Green
        default: return '#888';       // Grey fallback
    }
}

/**
 * showMessageDetail - Populates and opens the message details modal.
 * @param {Object} msg - The message object to display.
 */
function showMessageDetail(msg) {
    document.getElementById('modal-subject').innerText = msg.subject;
    document.getElementById('modal-name').innerText = msg.name;
    document.getElementById('modal-email').innerText = msg.email;
    document.getElementById('modal-category').innerText = msg.category;
    document.getElementById('modal-priority').innerText = msg.priority;
    document.getElementById('modal-priority').style.color = getPriorityColor(msg.priority);
    document.getElementById('modal-message').innerText = msg.message;

    // Link the "Mark as Solved" button to this specific message ID
    const solveBtn = document.getElementById('solve-btn');
    solveBtn.onclick = () => markMessageSolved(msg.id);

    document.getElementById('message-modal').style.display = 'block';
}

/**
 * closeMessageModal - Closes the message details modal.
 */
function closeMessageModal() {
    document.getElementById('message-modal').style.display = 'none';
}

/**
 * markMessageSolved - Performs a DELETE request to remove a solved message.
 * @param {number} id - The ID of the message to delete.
 */
async function markMessageSolved(id) {
    if (!confirm('Mark this message as solved and remove it?')) return;

    const currentToken = localStorage.getItem('token');
    try {
        const response = await fetch(`${apiBase}/admin/messages/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        if (response.ok) {
            alert('✅ Message marked as solved!');
            closeMessageModal();
            fetchMessages(); // Refresh the list after deletion
        } else {
            alert('❌ Failed to update message.');
        }
    } catch (error) {
        console.error('Error solving message:', error);
    }
}

/**
 * fetchEventRegistrations - Lists all events with their corresponding volunteers.
 */
async function fetchEventRegistrations() {
    try {
        const response = await fetch(`${apiBase}/admin/event-registrations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const events = await response.json();
            const container = document.getElementById('registrations-container');
            if (!container) return;

            container.innerHTML = '';

            if (events.length === 0) {
                container.innerHTML = '<p style="padding: 20px; text-align: center;">No events created yet.</p>';
                return;
            }

            // Render a card for each event showing the table of registered users
            events.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'registration-event-card';
                eventCard.style.cssText = 'background: white; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden;';

                let volunteersTable = '';
                if (event.registrations && event.registrations.length > 0) {
                    volunteersTable = `
                        <div class="registration-volunteers-table">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead style="background: #f1f1f1;">
                                    <tr>
                                        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Name</th>
                                        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Email</th>
                                        <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${event.registrations.map(reg => `
                                        <tr>
                                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${reg.user.full_name}</td>
                                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${reg.user.email}</td>
                                            <td style="padding: 10px; border-bottom: 1px solid #eee; color: #2e7d32;">Joined</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                } else {
                    volunteersTable = `<p style="padding: 15px; color: #666;">No volunteers have joined this event yet.</p>`;
                }

                eventCard.innerHTML = `
                    <div class="registration-event-header" style="background: #f8f9fa; padding: 15px; border-bottom: 1px solid #eee;">
                        <h3 style="margin: 0; color: #4CAF50;">${event.title}</h3>
                        <p style="margin: 5px 0; color: #555; font-size: 0.9rem;">📍 ${event.location} | 📅 ${event.event_date}</p>
                        <p style="margin: 0; font-weight: bold;">Total Volunteers: ${event.registrations.length}</p>
                    </div>
                    ${volunteersTable}
                `;
                container.appendChild(eventCard);
            });
        }
    } catch (error) {
        console.error('Error fetching event registrations:', error);
    }
}

/**
 * deleteEvent - Permanently removes an event from the database.
 * @param {number} id - The ID of the event to delete.
 */
async function deleteEvent(id) {
    if (!confirm('🛑 Are you sure? This will delete the event forever!')) return;

    const currentToken = localStorage.getItem('token');
    try {
        const response = await fetch(`${apiBase}/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        if (response.ok) {
            alert('✅ Event deleted successfully!');
            fetchAdminEvents(); // Refresh UI components
            fetchEventRegistrations();
            fetchStats();
        } else {
            alert('❌ Failed to delete event.');
        }
    } catch (error) {
        alert('🌐 Connection Error: Is the backend running?');
    }
}

/**
 * Sidebar Navigation Logic - Manages active state of UI sections.
 */
document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.addEventListener('click', function () {
        document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active-page'));
        this.classList.add('active-page');
    });
});

/**
 * logout - Clears local storage and redirects to login page.
 */
function logout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '../index.html';
}

// --- Initialization Logic ---
if (window.location.pathname.includes('admin.html')) {
    const role = localStorage.getItem('role');

    // Authorization check
    if (token && role === 'admin') {
        fetchStats();
        fetchAdminEvents();
        fetchVolunteers();
        fetchMessages();
        fetchEventRegistrations();
    } else {
        // Force redirect if not authenticated as admin
        window.location.replace('../index.html');
    }
}
