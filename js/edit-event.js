const API_URL = 'http://localhost:8001';
const token = localStorage.getItem('token');
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

async function fetchEventToEdit() {
    if (!eventId) return;
    try {
        const response = await fetch(`${API_URL}/events/${eventId}`);
        if (response.ok) {
            const event = await response.json();
            document.getElementById('title').value = event.title;
            document.getElementById('description').value = event.description;
            document.getElementById('location').value = event.location;
            document.getElementById('event_date').value = event.event_date;
            document.getElementById('start_time').value = event.start_time;
            document.getElementById('end_time').value = event.end_time;
            document.getElementById('image_url').value = event.image_url;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleEditEvent(event) {
    event.preventDefault();
    if (!eventId) return;

    const form = event.target;
    const formData = new FormData(form);

    const eventData = {
        title: formData.get('title'),
        description: formData.get('description'),
        location: formData.get('location'),
        event_date: formData.get('event_date'),
        start_time: formData.get('start_time'),
        end_time: formData.get('end_time'),
        image_url: formData.get('image_url'),
        status: "upcoming"
    };

    if (!token) {
        alert('You must be logged in as admin.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(eventData)
        });

        if (response.ok) {
            alert('Event updated successfully!');
            window.location.href = 'admin.html';
        } else {
            const errorData = await response.json();
            alert(`Error updating event: ${errorData.detail || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

if (window.location.pathname.includes('edit-event.html')) {
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
        alert('Admin access only.');
        window.location.href = '../index.html';
    } else {
        fetchEventToEdit();
    }
}
