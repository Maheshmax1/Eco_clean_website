/**
 * EcoClean – contact.js
 * Handles the "Contact Us" form submission.
 * Sends user inquiries, feedback, and priority issues to the support team.
 */

// Use global API_URL with fallback
const apiBase = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8000';

const contactForm = document.querySelector('.support-form');

if (contactForm) {
    /**
     * Listener for the support form submission.
     * Collects all input fields including category and priority level.
     */
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Maintain single-page app behavior

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const category = document.getElementById('category').value;
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const priority = document.getElementById('priority').value;

        // Easy Validation: Check if all boxes are filled
        if (!name || !email || !phone || !category || !subject || !message || !priority) {
            alert('⚠️ Please fill out all parts of the form before submitting!');
            return;
        }

        // Easy Validation: Simple check for valid email format
        if (!email.includes('@') || !email.includes('.')) {
            alert('⚠️ Please enter a valid email address!');
            return;
        }

        // Consolidate input data into an inquiry payload
        const messageData = {
            name: name,
            email: email,
            phone: phone,
            category: category,
            subject: subject,
            message: message,
            priority: priority
        };

        try {
            // Forward the inquiry to the admin helpdesk endpoint
            const response = await fetch(`${apiBase}/contact/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });

            if (response.ok) {
                alert('✅ Success! Your message has been received. Our team will review it shortly.');
                contactForm.reset(); // Zero-out the form for next use
            } else {
                const error = await response.json();
                alert('❌ Transmission Error: ' + (error.detail || 'Service unavailable. Please retry later.'));
            }
        } catch (err) {
            alert('🌐 Network Error: Connectivity lost. Please check your internet or server status.');
        }
    });
}
