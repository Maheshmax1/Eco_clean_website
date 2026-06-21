import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HiMenu, HiX } from 'react-icons/hi';
import {
  MdDashboard,
  MdCalendarToday,
  MdPeople,
  MdMessage,
  MdListAlt,
  MdArrowBack,
  MdExitToApp,
  MdPerson
} from 'react-icons/md';
import toast from 'react-hot-toast';

const DashboardLayout = ({ children }) => {
  const { profile, isAdmin, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Define sidebar links based on the user's role
  const adminLinks = [
    { path: '/admin', label: 'Dashboard Overview', icon: <MdDashboard className="h-5 w-5" />, hash: '' },
    { path: '/admin', label: 'Manage Events', icon: <MdCalendarToday className="h-5 w-5" />, hash: '#events' },
    { path: '/admin', label: 'Volunteer Applications', icon: <MdPeople className="h-5 w-5" />, hash: '#volunteers' },
    { path: '/admin', label: 'Event Registrations', icon: <MdListAlt className="h-5 w-5" />, hash: '#registrations' },
    { path: '/admin', label: 'Contact Messages', icon: <MdMessage className="h-5 w-5" />, hash: '#messages' },
  ];

  const volunteerLinks = [
    { path: '/profile', label: 'My Registered Events', icon: <MdCalendarToday className="h-5 w-5" />, hash: '' },
    { path: '/events', label: 'Browse Events', icon: <MdListAlt className="h-5 w-5" />, hash: '' },
  ];

  const sidebarLinks = isAdmin ? adminLinks : volunteerLinks;

  const handleLinkClick = (hash) => {
    setSidebarOpen(false);
    if (hash) {
      navigate(`${isAdmin ? '/admin' : '/profile'}${hash}`);
      // Smooth scroll to the section
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(isAdmin ? '/admin' : '/profile');
    }
  };

  const isLinkActive = (link) => {
    if (link.hash) {
      return location.hash === link.hash;
    }
    return location.pathname === link.path && location.hash === '';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white flex items-center justify-between px-4 py-3 sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-1.5 text-lg font-bold text-white tracking-tight">
          🌿 EcoClean {isAdmin ? 'Admin' : ''}
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 text-white focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar Navigation Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform md:relative md:translate-x-0 transition-transform duration-350 ease-in-out flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Brand Title */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/" className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="text-primary-400">🌿</span> EcoClean {isAdmin ? 'Admin' : ''}
          </Link>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-grow py-6 px-4 space-y-1.5 overflow-y-auto">
          {sidebarLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => handleLinkClick(link.hash)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer
                ${
                  isLinkActive(link)
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
          
          <div className="pt-6 border-t border-slate-800 space-y-1.5">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <MdArrowBack className="h-5 w-5" />
              View Website
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg text-danger hover:bg-red-950 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <MdExitToApp className="h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg select-none">
            {profile?.full_name ? profile.full_name[0].toUpperCase() : <MdPerson />}
          </div>
          <div className="min-w-0 flex-grow">
            <p className="text-sm font-bold text-white truncate">{profile?.full_name || 'Volunteer'}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{profile?.role || 'Volunteer'}</p>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Pane */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-100 px-8 items-center justify-between sticky top-0 z-20 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              {isAdmin ? '🛡️ Administration Control Panel' : '👤 Volunteer Workspace'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600 capitalize">
              Role: {profile?.role || 'volunteer'}
            </span>
          </div>
        </header>

        {/* Page Content viewport */}
        <div className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
