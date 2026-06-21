import React, { createContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth on app mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('eco_clean_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiService.getMe();
        if (data && data.user) {
          setUser(data.user);
          setProfile(data.profile);
        } else {
          // Token invalid or malformed
          localStorage.removeItem('eco_clean_token');
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        // Clean up on check failure (e.g. expired token)
        localStorage.removeItem('eco_clean_token');
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign Up method
  const signUp = async (email, password, fullName, phone, isAdmin = false) => {
    setLoading(true);
    try {
      const data = await apiService.signUp(email, password, fullName, phone, isAdmin);
      if (data && data.access_token) {
        localStorage.setItem('eco_clean_token', data.access_token);
        setUser(data.user);
        setProfile(data.profile);
        return { data, error: null };
      }
      throw new Error('Invalid sign up response from server');
    } catch (error) {
      console.error('Sign Up error:', error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign In method
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiService.signIn(email, password);
      if (data && data.access_token) {
        localStorage.setItem('eco_clean_token', data.access_token);
        setUser(data.user);
        setProfile(data.profile);
        return { data, error: null };
      }
      throw new Error('Invalid sign in response from server');
    } catch (error) {
      console.error('Sign In error:', error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign Out method
  const signOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('eco_clean_token');
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign Out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
