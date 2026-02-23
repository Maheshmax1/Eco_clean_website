const API_URL = 'http://localhost:8001';
const token = localStorage.getItem('token');

async function fetchStats() {
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const stats = await response.json();
            document.getElementById('stat-upcoming-count').textContent = stats.upcoming_events;
            document.getElementById('stat-upcoming-detail').textContent = `${stats.upcoming_events} Future Events`;
            document.getElementById('stat-completed-count').textContent = stats.completed_events;
            document.getElementById('stat-completed-detail').textContent = `Total Completed: ${stats.completed_events}`;
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

async function fetchAdminEvents() {
    try {
        const response = await fetch(`${API_URL}/events/`);
        if (response.ok) {
            const events = await response.json();
            const list = document.getElementById('admin-events-list');
            if (!list) return;
            list.innerHTML = '';

            if (events.length === 0) {
                list.innerHTML = '<p style="padding: 20px; text-align: center;">No events found. Create one!</p>';
                return;
            }

            events.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.innerHTML = `
                    <div class="event-details">
                        <p class="event-id">ECO-2025-${event.id}</p>
                        <p class="event-name">${event.title}</p>
                        <p class="event-time">${event.event_date} | ${event.start_time} - ${event.end_time}</p>
                    </div>
                    <div class="event-actions">
                        <button class="action-btn edit-btn" onclick="window.location.href='edit-event.html?id=${event.id}'"> Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteEvent(${event.id})"> Delete</button>
                    </div>
                `;
                list.appendChild(eventItem);
            });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

async function fetchVolunteers() {
    try {
        const response = await fetch(`${API_URL}/admin/volunteers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const volunteers = await response.json();
            const list = document.getElementById('volunteer-applications-list');
            if (!list) return;
            list.innerHTML = '';

            if (volunteers.length === 0) {
                list.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No volunteers found</td></tr>';
                return;
            }

            volunteers.forEach(v => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${v.full_name}</td>
                    <td>${v.email}</td>
                    <td>Volunteer</td>
                    <td>${v.phone || 'N/A'}</td>
                    <td>
                        <button class="action-btn edit-btn" style="padding: 5px 10px; font-size: 12px;">View</button>
                    </td>
                `;
                list.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error fetching volunteers:', error);
    }
}

async function fetchMessages() {
    try {
        const response = await fetch(`${API_URL}/admin/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const messages = await response.json();
            const list = document.getElementById('admin-messages-list');
            if (!list) return;
            list.innerHTML = '';

            if (messages.length === 0) {
                list.innerHTML = '<p style="padding: 20px; text-align: center;">No messages found</p>';
                return;
            }

            messages.forEach(m => {
                const msgItem = document.createElement('div');
                msgItem.className = 'message-card';
                msgItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                        <div>
                            <strong style="font-size: 1.15rem; color: #1f2937; display: block; margin-bottom: 2px;">${m.name}</strong>
                            <p style="margin: 0; color: #6b7280; font-size: 0.85rem; font-weight: 500;">
                                <i class="fas fa-envelope"></i> ${m.email}
                            </p>
                            <p style="margin: 0; color: #6b7280; font-size: 0.85rem; font-weight: 500;">
                                <i class="fas fa-phone"></i> ${m.phone || 'N/A'}
                            </p>
                        </div>
                        <span class="priority-badge priority-${m.priority.toLowerCase()}">${m.priority}</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <span class="message-category-tag">${m.category.toUpperCase()}</span>
                        <h4 style="margin: 0; color: #059669; font-size: 1rem; font-weight: 700;">${m.subject}</h4>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 15px; border-radius: 10px; border: 1px solid #f3f4f6; margin-bottom: 15px; flex-grow: 1;">
                        <p style="margin: 0; color: #374151; font-size: 0.95rem; line-height: 1.6;">${m.message}</p>
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; align-items: center; border-top: 1px solid #f3f4f6; pt-10; margin-top: auto;">
                        <span style="font-size: 0.75rem; color: #9ca3af; font-weight: 600;">
                            <i class="far fa-clock"></i> ${new Date(m.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                `;
                list.appendChild(msgItem);
            });
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}


async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert('Event deleted successfully');
            fetchAdminEvents();
            fetchStats();
        } else {
            alert('Error deleting event');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



// Initialize Admin Dashboard
if (window.location.pathname.includes('admin.html')) {
    const role = localStorage.getItem('role');
    if (token && role === 'admin') {
        fetchStats();
        fetchAdminEvents();
        fetchVolunteers();
        fetchMessages();
    } else {
        alert('Admin access only. Please login as administrator.');
        window.location.href = '../index.html';
    }
}
