import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Global Navigation Header */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main className="flex-grow animate-fade-in">
        <Outlet />
      </main>

      {/* Global Directory Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
