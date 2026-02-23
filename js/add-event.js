const API_URL = 'http://localhost:8001';
const token = localStorage.getItem('token');

async function handleAddEvent(event) {
    event.preventDefault();

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
        alert('You must be logged in as admin to create an event.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/events/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(eventData)
        });

        if (response.ok) {
            alert('Event created successfully!');
            window.location.href = 'admin.html';
        } else {
            const errorData = await response.json();
            alert(`Error creating event: ${errorData.detail || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Failed to connect to the server.');
    }
}
if (window.location.pathname.includes('add-event.html')) {
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
        alert('Admin access only.');
        window.location.href = '../index.html';
    }
}
