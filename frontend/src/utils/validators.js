// Form Validation Helpers

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return '';
};

export const validateFullName = (name) => {
  if (!name || name.trim().length === 0) return 'Full name is required';
  if (name.trim().length < 3) return 'Full name must be at least 3 characters';
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  // Check for digits, +, -, and spaces
  const phoneRegex = /^[+]?[0-9\s\-]{7,15}$/;
  if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
  return '';
};

export const validateEventDate = (dateStr) => {
  if (!dateStr) return 'Event date is required';
  const selectedDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part for date comparison
  
  if (selectedDate < today) {
    return 'Event date cannot be in the past';
  }
  return '';
};

export const validateEventTimes = (startTime, endTime) => {
  if (!startTime) return 'Start time is required';
  if (!endTime) return 'End time is required';
  
  if (endTime <= startTime) {
    return 'End time must be later than the start time';
  }
  return '';
};
