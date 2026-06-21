import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { apiService } from '../../services/apiService';
import Card from '../../components/Card/Card';
import Loader from '../../components/Loader/Loader';
import { MdCalendarToday, MdAccessTime, MdLocationOn } from 'react-icons/md';
import { FALLBACK_IMAGE } from '../../utils/constants';

const Events = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Query events on mount, passing user ID to resolve registration status
  const fetchEventsCallback = React.useCallback(() => {
    return apiService.fetchEvents(user?.id || null);
  }, [user]);

  const { data: events, loading, error, execute: refetchEvents } = useFetch(fetchEventsCallback);

  // Separate events
  const upcomingEvents = events ? events.filter(e => e.status === 'upcoming') : [];
  const completedEvents = events ? events.filter(e => e.status === 'completed') : [];

  const renderEventCard = (event, isUpcoming) => {
    const detailLink = `/events/${event.id}`;
    const showRegistered = isUpcoming && event.is_registered;

    return (
      <Card key={event.id} className="relative flex flex-col border border-slate-100 bg-white group">
        {/* Card Header Image */}
        <div className="relative h-48 overflow-hidden bg-slate-100">
          <img
            src={event.image_url || FALLBACK_IMAGE}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = FALLBACK_IMAGE;
            }}
          />
          {/* Status Pills */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
              isUpcoming 
                ? (event.is_registered ? 'bg-primary-500 text-white' : 'bg-accent-500 text-white')
                : 'bg-slate-500 text-white'
            }`}>
              {isUpcoming ? (event.is_registered ? 'Registered' : 'Upcoming') : 'Completed'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex-grow flex flex-col gap-4">
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            ECO-EVENT-{event.id}
          </span>
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight leading-snug line-clamp-1">
            {event.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {event.description}
          </p>

          <div className="border-t border-slate-50 pt-4 flex flex-col gap-2 text-xs text-slate-600 mt-auto">
            <div className="flex items-center gap-1.5 font-medium">
              <MdCalendarToday className="text-primary-500 h-4 w-4" />
              <span>{event.event_date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MdAccessTime className="text-primary-500 h-4 w-4" />
              <span>{event.start_time} - {event.end_time}</span>
            </div>
            <div className="flex items-center gap-1.5 block truncate">
              <MdLocationOn className="text-primary-500 h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="pt-2">
            {isUpcoming ? (
              <Link
                to={detailLink}
                className={`w-full block text-center py-2 rounded-lg text-xs font-bold transition-all ${
                  event.is_registered
                    ? 'bg-primary-50 text-primary-600 border border-primary-100 hover:bg-primary-100'
                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:-translate-y-0.5'
                }`}
              >
                {event.is_registered ? '✓ Already Registered' : 'Know More & Register'}
              </Link>
            ) : (
              <span className="w-full block text-center py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 cursor-not-allowed">
                ✓ Drive Finished
              </span>
            )}
          </div>
        </div>

        {/* Volunteer Registered Overlay (matches original design) */}
        {showRegistered && (
          <div className="absolute inset-0 bg-primary-950/80 backdrop-blur-xs z-20 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
            <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center text-white mb-2 text-xl font-bold animate-pulse shadow-md">
              ✓
            </div>
            <h4 className="text-white font-bold text-sm">YOU ARE REGISTERED</h4>
            <p className="text-primary-200 text-xs mt-1 mb-4 leading-relaxed">
              We look forward to seeing you at {event.location}!
            </p>
            <Link
              to={detailLink}
              className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold px-4 py-2 rounded-lg shadow transition-all hover:scale-105"
            >
              View Details
            </Link>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO VIDEO HEADER */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute z-0 min-w-full min-h-full object-cover opacity-75"
        >
          <source src="/assets/volunteervedio (1).mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/80 z-10" />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Join Our Cleanup Events
          </h1>
          <p className="text-sm sm:text-base text-slate-200 mt-2 font-medium drop-shadow-sm">
            Together We Make a Difference 🌍
          </p>
        </div>
      </section>

      {/* 2. TABBED OR SPLIT EVENTS GALLERIES */}
      <section className="py-16 bg-slate-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tab Selection */}
          <div className="flex justify-center gap-2 mb-12 bg-slate-200/50 p-1 rounded-xl w-fit mx-auto border border-slate-200/60">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🌟 Upcoming Drives ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ✅ Completed Archive ({completedEvents.length})
            </button>
          </div>

          {/* Loading States */}
          {loading && <Loader size="lg" text="Fetching cleanup campaigns..." />}
          
          {/* Error States */}
          {error && (
            <div className="text-center py-10 bg-white border border-slate-100 rounded-2xl max-w-lg mx-auto">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-lg font-bold text-slate-800 mt-3">Failed to load events</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">{error}</p>
              <button
                onClick={refetchEvents}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {/* Content display */}
          {!loading && !error && (
            <>
              {activeTab === 'upcoming' ? (
                upcomingEvents.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl max-w-lg mx-auto shadow-sm">
                    <span className="text-4xl">🌿</span>
                    <h3 className="text-lg font-bold text-slate-800 mt-3">No Upcoming Drives</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      We are currently organizing new campaigns. Check back soon or contact us to suggest a cleanup site!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                    {upcomingEvents.map(event => renderEventCard(event, true))}
                  </div>
                )
              ) : (
                completedEvents.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl max-w-lg mx-auto shadow-sm">
                    <span className="text-4xl">📚</span>
                    <h3 className="text-lg font-bold text-slate-800 mt-3">Archive is Empty</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      No completed events listed in our archive yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                    {completedEvents.map(event => renderEventCard(event, false))}
                  </div>
                )
              )}
            </>
          )}

        </div>
      </section>
    </div>
  );
};

export default Events;
