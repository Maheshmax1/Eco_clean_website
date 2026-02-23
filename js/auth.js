const API_URL = 'http://localhost:8001';

async function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const userData = {
        full_name: formData.get('fullname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert('Account created! Please login.');
            document.getElementById('auth-toggle').checked = false;
        } else {
            const err = await response.json();
            alert(err.detail || 'Signup failed');
        }
    } catch (e) {
        alert('Could not connect to backend');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const credentials = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);

            if (data.role === 'admin') {
                window.location.href = 'pages/admin.html';
            } else {
                window.location.href = 'pages/profile.html';
            }
        } else {
            const err = await response.json();
            alert(err.detail || 'Login failed');
        }
    } catch (e) {
        alert('Could not connect to backend');
    }
}
