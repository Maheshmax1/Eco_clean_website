import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Loader from '../components/Loader/Loader';

// Lazy loading pages for optimized performance
const Home = lazy(() => import('../pages/Home/Home'));
const About = lazy(() => import('../pages/About/About'));
const Events = lazy(() => import('../pages/Events/Events'));
const EventDetail = lazy(() => import('../pages/Events/EventDetail'));
const Contact = lazy(() => import('../pages/Contact/Contact'));
const Services = lazy(() => import('../pages/Services/Services'));
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const AddEvent = lazy(() => import('../pages/Dashboard/AddEvent'));
const EditEvent = lazy(() => import('../pages/Dashboard/EditEvent'));
const Greet = lazy(() => import('../pages/NotFound/Greet')); // Greet (thank you page)
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader fullPage={true} text="Loading page..." />}>
      <Routes>
        {/* Main Website Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="thank-you" element={<Greet />} />
        </Route>

        {/* Protected Volunteer Dashboard Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-event"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AddEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-event/:id"
          element={
            <ProtectedRoute requireAdmin={true}>
              <EditEvent />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found Catch-all Route */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
