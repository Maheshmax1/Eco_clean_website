/**
 * EcoClean Static Data Service
 * 
 * Provides client-side persistence and full CRUD operations via localStorage,
 * allowing EcoClean to function 100% as a standalone static website without
 * requiring a Python/FastAPI backend server.
 */

const ECO_USERS_KEY = 'eco_clean_users';
const ECO_EVENTS_KEY = 'eco_clean_events';
const ECO_REGISTRATIONS_KEY = 'eco_clean_registrations';
const ECO_MESSAGES_KEY = 'eco_clean_messages';
const ECO_TOKEN_KEY = 'eco_clean_token';
const ECO_CURRENT_USER_KEY = 'eco_clean_current_user_id';

// Default initial users
const DEFAULT_USERS = [
  {
    id: "dc49a8d4-e37b-4408-9b09-dba787733d3e",
    email: "admin@ecoclean.org",
    password: "admin123",
    full_name: "Eco Admin",
    phone: "+91 99999 88888",
    role: "admin",
    user_metadata: { role: "admin", full_name: "Eco Admin" },
    created_at: "2026-06-21T05:58:19.117Z"
  },
  {
    id: "5b044fe3-6341-44ae-9adb-fc72e22205b0",
    email: "volunteer@gmail.com",
    password: "volunteer123",
    full_name: "John Volunteer",
    phone: "+91 88888 77777",
    role: "volunteer",
    user_metadata: { role: "volunteer", full_name: "John Volunteer" },
    created_at: "2026-06-21T05:58:19.117Z"
  },
  {
    id: "db1ebd31-5c00-4d4f-aa6b-027d1cefa16c",
    email: "mahesh@gmail.com",
    password: "password",
    full_name: "Mahesh Maariappan",
    phone: "+91 63790 95634",
    role: "volunteer",
    user_metadata: { role: "volunteer", full_name: "Mahesh Maariappan" },
    created_at: "2026-06-21T06:29:26.996Z"
  }
];

// Default initial events
const DEFAULT_EVENTS = [
  {
    id: 1,
    title: "Marina Beach Coastal Clean Drive",
    description: "Join us in our monthly beach clean drive to remove plastic pollution and restore the beauty of Marina Beach. Meet at Light House. Bags, gloves, and refreshments will be provided!",
    location: "Marina Beach Light House, Chennai",
    event_date: "2026-07-15",
    start_time: "06:30",
    end_time: "09:30",
    image_url: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800",
    status: "upcoming",
    created_at: "2026-06-21T05:58:19.160Z"
  },
  {
    id: 2,
    title: "Bessy Beach Plastics Removal Campaign",
    description: "A special campaign focused on removing microplastics and fishing nets from the Besant Nagar beach sands. Huge success with over 50 volunteers participating!",
    location: "Besant Nagar Beach, Chennai",
    event_date: "2026-06-10",
    start_time: "07:00",
    end_time: "10:00",
    image_url: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=800",
    status: "completed",
    created_at: "2026-06-21T05:58:19.160Z"
  },
  {
    id: 3,
    title: "Adyar Estuary Clean Campaign",
    description: "Protect local marine life by cleaning the Adyar river mouth and estuary area. Focus on removing plastic bottles and debris blocks.",
    location: "Adyar River Estuary Area, Chennai",
    event_date: "2026-08-02",
    start_time: "06:00",
    end_time: "09:00",
    image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
    status: "upcoming",
    created_at: "2026-06-21T05:58:19.160Z"
  },
  {
    id: 4,
    title: "Anna Nagar Tower Park Green Regeneration",
    description: "Community clean-up, native sapling plantation, and segregation of recyclable litter across Anna Nagar Tower Park walkways and gardens.",
    location: "Tower Park, Anna Nagar, Chennai",
    event_date: "2026-08-20",
    start_time: "06:30",
    end_time: "10:00",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    status: "upcoming",
    created_at: "2026-06-21T06:00:00.000Z"
  },
  {
    id: 5,
    title: "Velachery Lake Biodiversity Drive",
    description: "Waterfront cleanup, removing discarded polythene and weeds along Velachery Lake perimeter to support local bird biodiversity.",
    location: "Velachery Lake Bund, Chennai",
    event_date: "2026-05-18",
    start_time: "06:00",
    end_time: "09:30",
    image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
    status: "completed",
    created_at: "2026-05-01T06:00:00.000Z"
  },
  {
    id: 6,
    title: "Semmozhi Poonga Urban Clean & Composting Workshop",
    description: "Hands-on urban botanical clean drive coupled with practical demonstrations on organic waste composting and zero-plastic living.",
    location: "Semmozhi Poonga, Cathedral Road, Chennai",
    event_date: "2026-09-05",
    start_time: "07:30",
    end_time: "11:00",
    image_url: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&q=80&w=800",
    status: "upcoming",
    created_at: "2026-06-21T06:00:00.000Z"
  }
];

// Default initial registrations
const DEFAULT_REGISTRATIONS = [
  {
    id: 1,
    user_id: "5b044fe3-6341-44ae-9adb-fc72e22205b0",
    event_id: 1,
    created_at: "2026-06-21T05:58:19.195Z"
  },
  {
    id: 2,
    user_id: "db1ebd31-5c00-4d4f-aa6b-027d1cefa16c",
    event_id: 1,
    created_at: "2026-06-21T06:31:05.619Z"
  },
  {
    id: 3,
    user_id: "dc49a8d4-e37b-4408-9b09-dba787733d3e",
    event_id: 3,
    created_at: "2026-06-21T06:36:13.933Z"
  },
  {
    id: 4,
    user_id: "5b044fe3-6341-44ae-9adb-fc72e22205b0",
    event_id: 4,
    created_at: "2026-06-21T06:40:00.000Z"
  }
];

// Default initial contact messages
const DEFAULT_MESSAGES = [
  {
    id: 1,
    name: "Sarah Green",
    email: "sarah@eco-lover.org",
    phone: "9876543210",
    category: "partnership",
    subject: "Corporate Volunteering Inquiry",
    message: "Hello! Our software team of 25 people would love to participate in your upcoming beach clean drive as part of our CSR program. Could you please let us know how we can coordinate?",
    priority: "high",
    created_at: "2026-06-21T05:58:19.192Z"
  },
  {
    id: 2,
    name: "Dr. K. Raman",
    email: "raman@chennai-college.edu",
    phone: "+91 94444 12345",
    category: "event",
    subject: "Student Participation for Adyar Cleanup",
    message: "We would like to register 40 environmental science undergraduates for the Adyar River Estuary Drive. Please let us know if certificates of participation can be provided.",
    priority: "medium",
    created_at: "2026-06-21T07:15:00.000Z"
  }
];

// Initialize localStorage with seed data if not already populated
const initStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(ECO_EVENTS_KEY)) {
    localStorage.setItem(ECO_EVENTS_KEY, JSON.stringify(DEFAULT_EVENTS));
  }
  if (!localStorage.getItem(ECO_USERS_KEY)) {
    localStorage.setItem(ECO_USERS_KEY, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(ECO_REGISTRATIONS_KEY)) {
    localStorage.setItem(ECO_REGISTRATIONS_KEY, JSON.stringify(DEFAULT_REGISTRATIONS));
  }
  if (!localStorage.getItem(ECO_MESSAGES_KEY)) {
    localStorage.setItem(ECO_MESSAGES_KEY, JSON.stringify(DEFAULT_MESSAGES));
  }
};

// Run storage initialization
initStorage();

// Storage helper functions
const getStoredUsers = () => {
  try {
    const data = localStorage.getItem(ECO_USERS_KEY);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

const setStoredUsers = (users) => {
  localStorage.setItem(ECO_USERS_KEY, JSON.stringify(users));
};

const getStoredEvents = () => {
  try {
    const data = localStorage.getItem(ECO_EVENTS_KEY);
    return data ? JSON.parse(data) : DEFAULT_EVENTS;
  } catch {
    return DEFAULT_EVENTS;
  }
};

const setStoredEvents = (events) => {
  localStorage.setItem(ECO_EVENTS_KEY, JSON.stringify(events));
};

const getStoredRegistrations = () => {
  try {
    const data = localStorage.getItem(ECO_REGISTRATIONS_KEY);
    return data ? JSON.parse(data) : DEFAULT_REGISTRATIONS;
  } catch {
    return DEFAULT_REGISTRATIONS;
  }
};

const setStoredRegistrations = (regs) => {
  localStorage.setItem(ECO_REGISTRATIONS_KEY, JSON.stringify(regs));
};

const getStoredMessages = () => {
  try {
    const data = localStorage.getItem(ECO_MESSAGES_KEY);
    return data ? JSON.parse(data) : DEFAULT_MESSAGES;
  } catch {
    return DEFAULT_MESSAGES;
  }
};

const setStoredMessages = (msgs) => {
  localStorage.setItem(ECO_MESSAGES_KEY, JSON.stringify(msgs));
};

const getActiveUserId = () => {
  return localStorage.getItem(ECO_CURRENT_USER_KEY) || null;
};

// Format user responses to match the API contract
const toUserResponse = (user) => {
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    phone: user.phone || null,
    role: user.role || 'volunteer',
    user_metadata: { role: user.role || 'volunteer', full_name: user.full_name },
    created_at: user.created_at || new Date().toISOString()
  };
};

const toProfileResponse = (user) => {
  return {
    id: user.id,
    full_name: user.full_name,
    phone: user.phone || null,
    role: user.role || 'volunteer',
    email: user.email,
    created_at: user.created_at || new Date().toISOString()
  };
};

// Micro delay for realistic smooth UI transitions
const asyncDelay = (ms = 40) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // --- AUTH SERVICES ---

  async signUp(email, password, fullName, phone, isAdmin = false) {
    await asyncDelay();
    initStorage();

    const users = getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('Email is already registered. Please sign in instead.');
    }

    const newId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    const role = isAdmin ? 'admin' : 'volunteer';
    const newUser = {
      id: newId,
      email: email.trim().toLowerCase(),
      password: password,
      full_name: fullName.trim(),
      phone: phone ? phone.trim() : null,
      role: role,
      user_metadata: { role, full_name: fullName.trim() },
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    setStoredUsers(users);

    const token = 'token-' + newUser.id + '-' + Date.now();
    localStorage.setItem(ECO_TOKEN_KEY, token);
    localStorage.setItem(ECO_CURRENT_USER_KEY, newUser.id);

    return {
      access_token: token,
      token_type: 'bearer',
      user: toUserResponse(newUser),
      profile: toProfileResponse(newUser)
    };
  },

  async signIn(email, password) {
    await asyncDelay();
    initStorage();

    const users = getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    if (user.password && user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const token = 'token-' + user.id + '-' + Date.now();
    localStorage.setItem(ECO_TOKEN_KEY, token);
    localStorage.setItem(ECO_CURRENT_USER_KEY, user.id);

    return {
      access_token: token,
      token_type: 'bearer',
      user: toUserResponse(user),
      profile: toProfileResponse(user)
    };
  },

  async getMe() {
    await asyncDelay();
    initStorage();

    const token = localStorage.getItem(ECO_TOKEN_KEY);
    if (!token) {
      throw new Error('Not authenticated');
    }

    let userId = localStorage.getItem(ECO_CURRENT_USER_KEY);
    const users = getStoredUsers();
    let user = users.find(u => u.id === userId);

    // If userId not found, try to resolve from token
    if (!user && token.startsWith('token-')) {
      const parts = token.split('-');
      if (parts[1]) {
        user = users.find(u => u.id === parts[1]);
        if (user) {
          localStorage.setItem(ECO_CURRENT_USER_KEY, user.id);
        }
      }
    }

    if (!user) {
      localStorage.removeItem(ECO_TOKEN_KEY);
      localStorage.removeItem(ECO_CURRENT_USER_KEY);
      throw new Error('User session not found or expired');
    }

    return {
      user: toUserResponse(user),
      profile: toProfileResponse(user)
    };
  },

  // --- EVENTS SERVICES ---

  async fetchEvents(userId = null) {
    await asyncDelay();
    initStorage();

    const events = getStoredEvents();
    const currentUserId = userId || getActiveUserId();
    const registrations = getStoredRegistrations();

    const registeredEventIds = new Set(
      currentUserId 
        ? registrations.filter(r => String(r.user_id) === String(currentUserId)).map(r => Number(r.event_id))
        : []
    );

    // Sort by event date ascending
    const sorted = [...events].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

    return sorted.map(e => ({
      ...e,
      is_registered: registeredEventIds.has(Number(e.id))
    }));
  },

  async fetchEventById(eventId, userId = null) {
    await asyncDelay();
    initStorage();

    const events = getStoredEvents();
    const event = events.find(e => String(e.id) === String(eventId));
    if (!event) {
      throw new Error('Event not found');
    }

    const currentUserId = userId || getActiveUserId();
    const registrations = getStoredRegistrations();
    const users = getStoredUsers();

    const isRegistered = currentUserId 
      ? registrations.some(r => String(r.user_id) === String(currentUserId) && String(r.event_id) === String(eventId))
      : false;

    // Attach volunteers who registered for this event
    const eventRegs = registrations.filter(r => String(r.event_id) === String(eventId));
    const registrationsList = eventRegs.map(r => {
      const u = users.find(user => String(user.id) === String(r.user_id));
      return {
        id: r.id,
        user: {
          id: u ? u.id : r.user_id,
          full_name: u ? u.full_name : 'Eco Volunteer',
          email: u ? u.email : '',
          phone: u ? u.phone : ''
        }
      };
    });

    return {
      ...event,
      is_registered: isRegistered,
      registrations: registrationsList
    };
  },

  async joinEvent(userId, eventId) {
    await asyncDelay();
    initStorage();

    const currentUserId = userId || getActiveUserId();
    if (!currentUserId) {
      throw new Error('Please login to join this event');
    }

    const events = getStoredEvents();
    const event = events.find(e => String(e.id) === String(eventId));
    if (!event) {
      throw new Error('Event not found');
    }

    const registrations = getStoredRegistrations();
    const existing = registrations.find(
      r => String(r.user_id) === String(currentUserId) && String(r.event_id) === String(eventId)
    );

    if (existing) {
      return { message: 'Already registered', id: existing.id };
    }

    const newReg = {
      id: Date.now(),
      user_id: currentUserId,
      event_id: Number(eventId),
      created_at: new Date().toISOString()
    };

    registrations.push(newReg);
    setStoredRegistrations(registrations);

    return { message: 'Successfully registered', id: newReg.id };
  },

  async leaveEvent(userId, eventId) {
    await asyncDelay();
    initStorage();

    const currentUserId = userId || getActiveUserId();
    const registrations = getStoredRegistrations();
    const index = registrations.findIndex(
      r => String(r.user_id) === String(currentUserId) && String(r.event_id) === String(eventId)
    );

    if (index === -1) {
      throw new Error('You are not registered for this event');
    }

    registrations.splice(index, 1);
    setStoredRegistrations(registrations);

    return { message: 'Successfully unregistered' };
  },

  async fetchUserRegistrations(userId) {
    await asyncDelay();
    initStorage();

    const currentUserId = userId || getActiveUserId();
    if (!currentUserId) return [];

    const registrations = getStoredRegistrations();
    const events = getStoredEvents();

    const userRegs = registrations.filter(r => String(r.user_id) === String(currentUserId));
    const result = [];

    for (const r of userRegs) {
      const e = events.find(event => String(event.id) === String(r.event_id));
      if (e) {
        result.push({
          id: r.id,
          event: { ...e }
        });
      }
    }

    return result;
  },

  // --- CONTACT FORM SUBMISSION ---

  async submitContactMessage(messageData) {
    await asyncDelay();
    initStorage();

    const messages = getStoredMessages();
    const newMessage = {
      id: Date.now(),
      name: messageData.name,
      email: messageData.email,
      phone: messageData.phone || '',
      category: messageData.category || 'general',
      subject: messageData.subject || '',
      message: messageData.message || '',
      priority: messageData.priority || 'medium',
      created_at: new Date().toISOString()
    };

    messages.unshift(newMessage);
    setStoredMessages(messages);

    return newMessage;
  },

  // --- ADMIN SERVICES ---

  async fetchAdminStats() {
    await asyncDelay();
    initStorage();

    const events = getStoredEvents();
    const upcoming = events.filter(e => e.status === 'upcoming').length;
    const completed = events.filter(e => e.status === 'completed').length;

    return {
      upcoming_events: upcoming,
      completed_events: completed
    };
  },

  async createEvent(eventData) {
    await asyncDelay();
    initStorage();

    const events = getStoredEvents();
    const maxId = events.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0);
    const newId = maxId + 1;

    const newEvent = {
      id: newId,
      title: eventData.title,
      description: eventData.description,
      location: eventData.location,
      event_date: eventData.event_date,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      image_url: eventData.image_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      status: eventData.status || 'upcoming',
      created_at: new Date().toISOString()
    };

    events.unshift(newEvent);
    setStoredEvents(events);

    return newEvent;
  },

  async updateEvent(eventId, updateData) {
    await asyncDelay();
    initStorage();

    const events = getStoredEvents();
    const index = events.findIndex(e => String(e.id) === String(eventId));
    if (index === -1) {
      throw new Error('Event not found');
    }

    events[index] = {
      ...events[index],
      ...updateData
    };

    setStoredEvents(events);
    return events[index];
  },

  async deleteEvent(eventId) {
    await asyncDelay();
    initStorage();

    const events = getStoredEvents();
    const filteredEvents = events.filter(e => String(e.id) !== String(eventId));
    setStoredEvents(filteredEvents);

    // Also clean up registrations for this event
    const registrations = getStoredRegistrations();
    const filteredRegs = registrations.filter(r => String(r.event_id) !== String(eventId));
    setStoredRegistrations(filteredRegs);

    return null;
  },

  async fetchVolunteers() {
    await asyncDelay();
    initStorage();

    const users = getStoredUsers();
    const volunteers = users
      .filter(u => u.role === 'volunteer')
      .map(toProfileResponse)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return volunteers;
  },

  async fetchContactMessages() {
    await asyncDelay();
    initStorage();

    const messages = getStoredMessages();
    return [...messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async resolveMessage(messageId) {
    await asyncDelay();
    initStorage();

    const messages = getStoredMessages();
    const filtered = messages.filter(m => String(m.id) !== String(messageId));
    setStoredMessages(filtered);

    return null;
  },

  async fetchEventRegistrations() {
    await asyncDelay();
    initStorage();

    const events = getStoredEvents();
    const registrations = getStoredRegistrations();
    const users = getStoredUsers();

    const sortedEvents = [...events].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

    return sortedEvents.map(e => {
      const eventRegs = registrations.filter(r => String(r.event_id) === String(e.id));
      const registrationsList = eventRegs.map(r => {
        const u = users.find(user => String(user.id) === String(r.user_id));
        return {
          id: r.id,
          user: {
            id: u ? u.id : r.user_id,
            full_name: u ? u.full_name : 'Eco Volunteer',
            email: u ? u.email : '',
            phone: u ? u.phone : ''
          }
        };
      });

      return {
        ...e,
        registrations: registrationsList
      };
    });
  },

  /**
   * Reset all mock database data back to initial defaults.
   * Useful for development, testing, and live demos.
   */
  resetDataToDefaults() {
    localStorage.setItem(ECO_EVENTS_KEY, JSON.stringify(DEFAULT_EVENTS));
    localStorage.setItem(ECO_USERS_KEY, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(ECO_REGISTRATIONS_KEY, JSON.stringify(DEFAULT_REGISTRATIONS));
    localStorage.setItem(ECO_MESSAGES_KEY, JSON.stringify(DEFAULT_MESSAGES));
    return true;
  }
};
