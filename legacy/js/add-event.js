/**
 * EcoClean – add-event.js
 * Handles the creation of new cleaning events by administrators.
 * Includes image upload handling, data validation, and authentication checks.
 */

// Use global API_URL with fallback
const apiBase = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8000';
const token = localStorage.getItem('token'); // Retrieve admin session token

/**
 * Security Middleware - Self-executing function to ensure admin-only access.
 * Redirects unauthorized users before they can interact with the form.
 */
(function checkAdmin() {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (!token || role !== 'admin') {
        window.location.replace('../index.html');
    }
})();

// Holds the Base64 data of the selected image for API transmission
let selectedImageBase64 = null;

/**
 * handleImageUpload - Processes the selected file and converts it to Base64.
 * Includes basic file size validation and live preview update.
 */
function handleImageUpload(input) {
    const file = input.files[0];
    if (!file) return;

    // Reject files larger than 5MB to preserve performance
    if (file.size > 5 * 1024 * 1024) {
        alert('❌ Error: Image is too big! Please pick a smaller one.');
        input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        selectedImageBase64 = e.target.result;
        const preview = document.getElementById('image-preview');
        if (preview) {
            preview.src = selectedImageBase64;
            preview.style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

/**
 * handleAddEvent - Collects form data and submits it to the backend.
 * Includes improved beginner-friendly validation feedback.
 */
async function handleAddEvent(event) {
    event.preventDefault(); // Stop page reload

    // Retrieve fresh token from storage at the moment of submission
    const currentToken = localStorage.getItem('token');

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const location = document.getElementById('location').value.trim();
    const event_date = document.getElementById('event_date').value;
    const start_time = document.getElementById('start_time').value;
    const end_time = document.getElementById('end_time').value;

    // --- Beginner-Friendly Validation Checks ---

    // 1. Check if any fields are empty
    if (!title || !description || !location || !event_date || !start_time || !end_time) {
        alert('⚠️ Please fill in all the boxes! (Title, Description, Location, Date, and Times are all required)');
        return;
    }

    // 2. Check title length
    if (title.length < 5) {
        alert('⚠️ The Title is a bit too short. Please use at least 5 letters.');
        return;
    }

    // 3. Check if the date is in the past
    // Direct string comparison works perfectly for YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];
    if (event_date < todayStr) {
        alert('⚠️ You cannot host an event in the past! Please pick today or a future date.');
        return;
    }

    // 4. Check if end time is after start time
    if (end_time <= start_time) {
        alert('⚠️ The End Time must be later than the Start Time!');
        return;
    }

    // Prepare the data for the server
    const eventData = {
        title: title,
        description: description,
        location: location,
        event_date: event_date,
        start_time: start_time,
        end_time: end_time,
        image_url: selectedImageBase64 || null,
        status: 'upcoming'
    };

    try {
        const response = await fetch(`${apiBase}/events/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(eventData)
        });

        // Handle expired login
        if (response.status === 401) {
            handleAuthError();
            return;
        }

        if (response.ok) {
            alert('🎉 Success! Your new event has been created.');
            window.location.href = 'admin.html';
        } else {
            const error = await response.json();
            alert('❌ Could not save: ' + (error.detail || 'Check if all fields are correct.'));
        }
    } catch (err) {
        alert('🌐 Connection Error: Is your backend running? Please check your server.');
    }
}

/**
 * handleAuthError - Clears expired session and redirects back to HOME login
 */
function handleAuthError() {
    alert('🔐 Session Expired: Please login again from the home page.');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.replace('../index.html');
}

/**
 * logout - Terminates the admin session and returns to login.
 */
function logout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '../index.html';
}
