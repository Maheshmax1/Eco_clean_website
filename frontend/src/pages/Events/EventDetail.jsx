import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { apiService } from '../../services/apiService';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { MdCalendarToday, MdAccessTime, MdLocationOn, MdPeople, MdArrowBack } from 'react-icons/md';
import { FALLBACK_IMAGE } from '../../utils/constants';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [joining, setJoining] = useState(false);

  // Fetch event details callback
  const fetchDetailCallback = React.useCallback(() => {
    if (!id) return Promise.reject(new Error('No event ID provided'));
    return apiService.fetchEventById(id, user?.id || null);
  }, [id, user]);

  const { data: event, loading, error, execute: refetchDetails } = useFetch(fetchDetailCallback);

  const handleJoinEvent = async () => {
    // If user is not authenticated, redirect to login page, saving this page as redirect target
    if (!user) {
      toast.error('Please login to join this cleanup drive!');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setJoining(true);
    try {
      await apiService.joinEvent(user.id, event.id);
      toast.success('🎉 Success! You have joined the event. See you there!');
      refetchDetails(); // Refresh details to show new volunteer tag and updated button
    } catch (err) {
      toast.error(err.message || 'Failed to join event.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <Loader fullPage={true} text="Retrieving event details..." />;
  }

  if (error || !event) {
    return (
      <div className="py-20 bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center py-10 bg-white border border-slate-100 rounded-2xl max-w-lg w-full shadow-sm">
          <span className="text-4xl">⚠️</span>
          <h3 className="text-lg font-bold text-slate-800 mt-3">Event Not Found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            {error || 'The event you are looking for does not exist or has been removed.'}
          </p>
          <Button variant="primary" size="sm" onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const isUpcoming = event.status === 'upcoming';
  const volunteers = event.registrations || [];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer"
        >
          <MdArrowBack className="h-4 w-4" />
          Back to Events
        </button>

        {/* Event Main Card */}
        <Card hoverEffect={false} className="bg-white border border-slate-100 shadow-lg">
          {/* Header Image */}
          <div className="relative h-80 md:h-[400px] w-full bg-slate-100">
            <img
              src={event.image_url || FALLBACK_IMAGE}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGE;
              }}
            />
            {/* Status Overlay Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md text-white ${
                isUpcoming
                  ? (event.is_registered ? 'bg-primary-500' : 'bg-accent-500')
                  : 'bg-slate-500'
              }`}>
                {isUpcoming ? (event.is_registered ? 'Registered' : 'Upcoming Drive') : 'Completed'}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 md:p-10 flex flex-col gap-6">
            {/* Title */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                ECO-EVENT-{event.id}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-slate-100 py-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                  <MdCalendarToday className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                  <p className="text-sm font-semibold text-slate-700">{event.event_date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                  <MdAccessTime className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</p>
                  <p className="text-sm font-semibold text-slate-700">{event.start_time} - {event.end_time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                  <MdLocationOn className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                  <p className="text-sm font-semibold text-slate-700 truncate">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            {/* Registered Volunteers Section */}
            {volunteers.length > 0 && (
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MdPeople className="h-5 w-5 text-primary-500" />
                  Joined Volunteers ({volunteers.length})
                </h3>
                <ul className="flex flex-wrap gap-2.5">
                  {volunteers.map((reg) => (
                    <li
                      key={reg.id}
                      className="bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full select-none"
                    >
                      {reg.user?.full_name || 'Volunteer'}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-slate-100 pt-6 flex justify-end">
              {isUpcoming ? (
                event.is_registered ? (
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={true}
                    className="bg-emerald-500 hover:bg-emerald-500 text-white cursor-not-allowed opacity-90"
                  >
                    ✓ You are Registered
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    loading={joining}
                    onClick={handleJoinEvent}
                  >
                    Join Cleanup Event
                  </Button>
                )
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  disabled={true}
                  className="opacity-50 cursor-not-allowed"
                >
                  ✓ Clean-up Completed
                </Button>
              )}
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default EventDetail;
