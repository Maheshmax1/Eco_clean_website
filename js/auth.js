// User session token is not needed here as this is for login/signup

// Ensure API_URL is available
const apiBase = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8000';

//  * handleSignup - Processes the account creation form submission.
async function handleSignup(event) {
    // Prevent the browser's default 
    event.preventDefault();
    const form = event.target;

    // Check if all boxes are filled
    const fullname = form.fullname.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const password = form.password.value;

    if (!fullname || !email || !phone || !password) {
        alert('⚠️ Please fill in all the fields!');
        return;
    }

    // password validation
    if (password.length < 6) {
        alert('⚠️ Password must be at least 6 characters long!');
        return;
    }

    // email validation
    if (!email.includes('@') || !email.includes('.')) {
        alert('⚠️ Please enter a valid email address!');
        return;
    }

    const userData = {
        full_name: fullname,
        email: email,
        phone: phone,
        password: password
    };

    try {
        const response = await fetch(`${apiBase}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert('✅ Account created successfully! Please login now.');
            location.reload(); // Refresh to show login state if needed
        } else {
            const error = await response.json().catch(() => ({}));
            alert('❌ Signup failed: ' + (error.detail || 'User might already exist.'));
        }
    } catch (err) {
        console.error('Signup Error:', err);
        alert('🌐 Connection Error: Could not reach the server at ' + apiBase);
    }
}


//  * handleLogin Processes 
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
        alert('⚠️ Please enter both your email and password!');
        return;
    }

    const credentials = { email, password };

    try {
        const response = await fetch(`${apiBase}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);

            alert('✅ Login successful!');

            if (data.role === 'admin') {
                window.location.href = 'pages/admin.html';
            } else {
                window.location.href = 'pages/profile.html';
            }
        } else {
            const error = await response.json().catch(() => ({}));
            alert('❌ Login failed: ' + (error.detail || 'Incorrect email or password.'));
        }
    } catch (err) {
        console.error('Login Error:', err);
        alert('🌐 Connection Error: Is the backend running at ' + apiBase + '?');
    }
}
