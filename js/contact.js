const API_URL = 'http://localhost:8001';

document.querySelector('.support-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        category: document.getElementById('category').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        priority: document.getElementById('priority').value
    };

    try {
        const response = await fetch(`${API_URL}/contact/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Your message has been sent successfully! We will get back to you soon.');
            e.target.reset();
        } else {
            const data = await response.json();
            alert(data.detail || 'Failed to send message. Please try again later.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Could not connect to the server. Please check your connection.');
    }
});
