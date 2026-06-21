/**
 * EcoClean – edit-event.js
 * Logic for updating existing events, including marking them as completed.
 * Features data pre-fetching, image replacement, and delete capabilities.
 */

// Use global API_URL with fallback
const apiBase = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8000';
const token = localStorage.getItem('token'); // Admin session token

// Retrieve Event ID from the browser's URL query string
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

let selectedImageBase64 = null; // Stores new image data if original is replaced

/**
 * fetchEventToEdit - Populates the form with current event data from the server.
 */
async function fetchEventToEdit() {
    if (!eventId) return;

    try {
        const response = await fetch(`${apiBase}/events/${eventId}`);
        if (response.ok) {
            const event = await response.json();

            // Populate form fields with existing information
            document.getElementById('title').value = event.title;
            document.getElementById('description').value = event.description;
            document.getElementById('location').value = event.location;
            document.getElementById('event_date').value = event.event_date;
            document.getElementById('start_time').value = event.start_time;
            document.getElementById('end_time').value = event.end_time;

            // Handle existing image display
            if (event.image_url) {
                const preview = document.getElementById('image-preview');
                const placeholder = document.getElementById('upload-placeholder');
                if (preview && placeholder) {
                    preview.src = event.image_url;
                    preview.style.display = 'block';
                    placeholder.style.display = 'none';
                }
            }

            // UI State change: Hide loading skeletons and show the form
            document.getElementById('form-skeleton').style.display = 'none';
            document.getElementById('form-content').style.display = 'block';

            // Show a status banner if the event is already finished
            if (event.status === 'completed') {
                document.getElementById('completed-banner').style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Error fetching event data:', error);
        alert(' Connection Error: Could not load event data.');
    }
}

/**
 * handleImageUpload - Handles picking a new event image and generating a preview.
 */
function handleImageUpload(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        selectedImageBase64 = e.target.result;
        const preview = document.getElementById('image-preview');
        const placeholder = document.getElementById('upload-placeholder');
        if (preview && placeholder) {
            preview.src = selectedImageBase64;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
}

/**
 * removeImage - Resets the image preview to its default state.
 */
function removeImage() {
    selectedImageBase64 = null;
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('upload-placeholder');
    if (preview && placeholder) {
        preview.src = '';
        preview.style.display = 'none';
        placeholder.style.display = 'flex';
    }
}

/**
 * handleEditEvent - Validates and sends updated event information to the server.
 */
async function handleEditEvent(event) {
    event.preventDefault();

    // Retrieve fresh token from storage
    const currentToken = localStorage.getItem('token');

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const location = document.getElementById('location').value.trim();
    const event_date = document.getElementById('event_date').value;
    const start_time = document.getElementById('start_time').value;
    const end_time = document.getElementById('end_time').value;

    // --- Beginner-Friendly Validation ---
    if (!title || !description || !location || !event_date || !start_time || !end_time) {
        alert('⚠️ Every box must be filled! Please check Title, Description, Location, and Times.');
        return;
    }

    if (title.length < 5) {
        alert('⚠️ Title is too short! Use at least 5 characters.');
        return;
    }

    if (end_time <= start_time) {
        alert('⚠️ The End Time must be LATER than the Start Time.');
        return;
    }

    const eventData = {
        title: title,
        description: description,
        location: location,
        event_date: event_date,
        start_time: start_time,
        end_time: end_time,
        // Prioritize the new Base64 image if uploaded; otherwise preserve current URI
        image_url: selectedImageBase64 || document.getElementById('image-preview').src,
        status: "upcoming"
    };

    try {
        const response = await fetch(`${apiBase}/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(eventData)
        });

        if (response.status === 401) {
            handleAuthError();
            return;
        }

        if (response.ok) {
            alert(' Success! Your changes have been saved.');
            window.location.href = 'admin.html';
        } else {
            const error = await response.json();
            alert(' Failed to update: ' + (error.detail || 'Please check all inputs.'));
        }
    } catch (error) {
        alert(' Connection Error: Is the backend server running?');
    }
}

/**
 * handleAuthError - Clears expired session and redirects to HOME login
 */
function handleAuthError() {
    alert(' Session Expired: Please login again from the home page.');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.replace('../index.html');
}


// Check admin credentials before allowing access to editing features
if (window.location.pathname.includes('edit-event.html')) {
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
        window.location.href = '../index.html';
    } else {
        fetchEventToEdit();
    }
}
