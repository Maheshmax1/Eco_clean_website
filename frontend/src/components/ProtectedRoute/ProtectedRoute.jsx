import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../Loader/Loader';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, profile, loading, isAdmin } = useAuth();

  // Show a full-screen loading skeleton while checking the auth session
  if (loading) {
    return <Loader fullPage={true} text="Verifying session..." />;
  }

  // If the user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If this is an admin-only page and the logged-in user is not an admin, redirect
  if (requireAdmin && !isAdmin) {
    console.warn('Unauthorized access attempt: user is not an administrator.');
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
