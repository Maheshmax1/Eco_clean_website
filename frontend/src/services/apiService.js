const API_URL = import.meta.env.VITE_API_URL || '';

const getHeaders = () => {
  const token = localStorage.getItem('eco_clean_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  // --- AUTH SERVICES ---

  async signUp(email, password, fullName, phone, isAdmin = false) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        phone,
        role: isAdmin ? 'admin' : 'volunteer'
      })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Sign up failed');
    }
    return res.json(); // Returns { access_token, token_type, user, profile }
  },

  async signIn(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Sign in failed');
    }
    return res.json(); // Returns { access_token, token_type, user, profile }
  },

  async getMe() {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch user profile');
    }
    return res.json(); // Returns { user, profile }
  },

  // --- PUBLIC & VOLUNTEER EVENT SERVICES ---

  async fetchEvents(userId = null) {
    const res = await fetch(`${API_URL}/api/events`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch events');
    }
    return res.json();
  },

  async fetchEventById(eventId, userId = null) {
    const res = await fetch(`${API_URL}/api/events/${eventId}`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch event details');
    }
    return res.json();
  },

  async joinEvent(userId, eventId) {
    const res = await fetch(`${API_URL}/api/events/${eventId}/join`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to join event');
    }
    return res.json();
  },

  async leaveEvent(userId, eventId) {
    const res = await fetch(`${API_URL}/api/events/${eventId}/leave`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to leave event');
    }
    return res.json();
  },

  async fetchUserRegistrations(userId) {
    const res = await fetch(`${API_URL}/api/users/me/registrations`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch registrations');
    }
    return res.json();
  },

  // --- CONTACT FORM SUBMISSION ---

  async submitContactMessage(messageData) {
    const res = await fetch(`${API_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to submit message');
    }
    return res.json();
  },

  // --- ADMIN SERVICES ---

  async fetchAdminStats() {
    const res = await fetch(`${API_URL}/api/admin/stats`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch admin stats');
    }
    return res.json();
  },

  async createEvent(eventData) {
    const res = await fetch(`${API_URL}/api/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(eventData)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create event');
    }
    return res.json();
  },

  async updateEvent(eventId, updateData) {
    const res = await fetch(`${API_URL}/api/events/${eventId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to update event');
    }
    return res.json();
  },

  async deleteEvent(eventId) {
    const res = await fetch(`${API_URL}/api/events/${eventId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to delete event');
    }
    return res.status === 204 ? null : res.json();
  },

  async fetchVolunteers() {
    const res = await fetch(`${API_URL}/api/admin/volunteers`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch volunteers list');
    }
    return res.json();
  },

  async fetchContactMessages() {
    const res = await fetch(`${API_URL}/api/messages`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch contact messages');
    }
    return res.json();
  },

  async resolveMessage(messageId) {
    const res = await fetch(`${API_URL}/api/messages/${messageId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to resolve message');
    }
    return res.status === 204 ? null : res.json();
  },

  async fetchEventRegistrations() {
    const res = await fetch(`${API_URL}/api/admin/event-registrations`, {
      headers: getHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to fetch event registrations');
    }
    return res.json();
  }
};
