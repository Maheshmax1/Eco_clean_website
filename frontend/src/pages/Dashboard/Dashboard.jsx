import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { apiService } from '../../services/apiService';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import Modal from '../../components/Modal/Modal';
import toast from 'react-hot-toast';
import { FALLBACK_IMAGE } from '../../utils/constants';
import {
  MdEvent,
  MdLocationOn,
  MdCalendarToday,
  MdDoneAll,
  MdEdit,
  MdDelete,
  MdAdd,
  MdPeople,
  MdEmail,
  MdPhone,
  MdMessage,
  MdInfo,
  MdAssignment
} from 'react-icons/md';

const Dashboard = () => {
  const { user, profile, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- VOLUNTEER PERSPECTIVE STATE ---
  const fetchMyRegs = React.useCallback(() => {
    if (!user) return Promise.resolve([]);
    return apiService.fetchUserRegistrations(user.id);
  }, [user]);
  
  const { data: myRegistrations, loading: regLoading, execute: refetchMyRegs } = useFetch(fetchMyRegs, !isAdmin);

  // --- ADMIN PERSPECTIVE STATE ---
  const [stats, setStats] = useState({ upcoming_events: 0, completed_events: 0 });
  const [adminEvents, setAdminEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  
  const [adminLoading, setAdminLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Message details modal state
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);

  // Load admin details
  const fetchAdminData = async () => {
    if (!isAdmin) return;
    setAdminLoading(true);
    try {
      const [statsData, eventsData, volunteersData, messagesData, regsData] = await Promise.all([
        apiService.fetchAdminStats(),
        apiService.fetchEvents(),
        apiService.fetchVolunteers(),
        apiService.fetchContactMessages(),
        apiService.fetchEventRegistrations(),
      ]);

      setStats(statsData);
      setAdminEvents(eventsData);
      setVolunteers(volunteersData);
      setMessages(messagesData);
      setEventRegistrations(regsData);
    } catch (err) {
      toast.error('Failed to load dashboard data: ' + err.message);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  // Handle hash scrolling on page load/hash change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, [location]);

  // --- ADMIN ACTIONS ---

  // Mark event as completed
  const handleMarkCompleted = async (eventId) => {
    if (!window.confirm('Mark this event as completed and move it to history?')) return;
    setActionLoading(true);
    try {
      await apiService.updateEvent(eventId, { status: 'completed' });
      toast.success('🎉 Event marked as completed!');
      fetchAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to update event.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('🛑 Are you sure? This will delete the event and all registrations forever!')) return;
    setActionLoading(true);
    try {
      await apiService.deleteEvent(eventId);
      toast.success('✅ Event deleted successfully!');
      fetchAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete event.');
    } finally {
      setActionLoading(false);
    }
  };

  // Solve support message
  const handleSolveMessage = async (messageId) => {
    if (!window.confirm('Mark this inquiry as solved and archive it?')) return;
    setActionLoading(true);
    try {
      await apiService.resolveMessage(messageId);
      toast.success('✅ Message marked as solved!');
      setIsMsgModalOpen(false);
      setSelectedMessage(null);
      fetchAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to resolve message.');
    } finally {
      setActionLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const openMessageModal = (msg) => {
    setSelectedMessage(msg);
    setIsMsgModalOpen(true);
  };

  // Renders loaders if auth context is checking user
  if (authLoading) {
    return <Loader fullPage={true} text="Verifying dashboard access..." />;
  }

  // --- RENDERING VOLUNTEER DASHBOARD ---
  const renderVolunteerDashboard = () => {
    const registrations = myRegistrations || [];

    return (
      <div className="space-y-8 animate-slide-up">
        {/* Profile Card Banner */}
        <Card hoverEffect={false} className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-8 text-white relative overflow-hidden border-none shadow-xl">
          <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 h-64 w-64 rounded-full bg-primary-600/10" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="h-16 w-16 rounded-full bg-primary-500 flex items-center justify-center text-3xl font-extrabold shadow-md border-2 border-white select-none">
              👤
            </div>
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome, {profile?.full_name}!
              </h1>
              <p className="text-sm text-slate-300">
                <strong>Volunteer ID:</strong> ECO-VOL-{profile?.id ? profile.id.substring(0, 8).toUpperCase() : 'N/A'}
              </p>
              <p className="text-sm text-slate-300">
                <strong>Email:</strong> {profile?.email}
              </p>
            </div>
          </div>
        </Card>

        {/* Registered Events list */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <MdEvent className="text-primary-500 h-6 w-6" />
              My Registered Cleanup Drives
            </h2>
            <Link
              to="/events"
              className="text-xs font-bold text-primary-600 hover:text-primary-700 underline"
            >
              Browse Events
            </Link>
          </div>

          {regLoading ? (
            <Loader size="md" text="Loading your registrations..." />
          ) : registrations.length === 0 ? (
            <Card hoverEffect={false} className="p-12 text-center bg-white border border-slate-100 shadow-sm max-w-lg mx-auto flex flex-col items-center gap-4">
              <span className="text-4xl select-none">🌿</span>
              <h3 className="text-base font-bold text-slate-800">No Events Registered Yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                You haven't joined any eco campaigns. Explore our upcoming cleanup drives and start making a change today!
              </p>
              <Button variant="primary" size="md" onClick={() => navigate('/events')}>
                Browse Events
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map((reg) => {
                const event = reg.event;
                if (!event) return null;

                return (
                  <Card
                    key={reg.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="bg-white border border-slate-100 cursor-pointer flex flex-col p-4 group"
                  >
                    <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-slate-100">
                      <img
                        src={event.image_url || FALLBACK_IMAGE}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                      />
                      <span className="absolute top-2 left-2 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 bg-emerald-500 text-white rounded shadow-sm">
                        Registered
                      </span>
                    </div>
                    <div className="flex-grow flex flex-col gap-2">
                      <h3 className="font-extrabold text-sm text-slate-800 group-hover:text-primary-600 transition-colors leading-tight line-clamp-1">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 block truncate">
                        <MdLocationOn className="h-4 w-4 text-slate-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MdCalendarToday className="h-4 w-4 text-slate-400" />
                        <span>{event.event_date}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  };

  // --- RENDERING ADMIN DASHBOARD ---
  const renderAdminDashboard = () => {
    return (
      <div className="space-y-12 animate-slide-up">
        {/* Welcome Text */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Admin Dashboard Overview</h1>
          <p className="text-slate-500 text-xs mt-1">Welcome back! Manage your EcoClean community, cleanup campaigns, and volunteers. 🌱</p>
        </div>

        {/* 1. STATISTICS COUNTERS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="dashboard">
          <Card hoverEffect={false} className="p-6 bg-white border border-slate-100 flex items-center justify-between shadow-premium relative">
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Upcoming Cleanups</h3>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.upcoming_events}</p>
              <span className="text-[10px] text-slate-500 mt-2 block">Drives scheduled</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center text-2xl shadow-sm">
              📅
            </div>
          </Card>

          <Card hoverEffect={false} className="p-6 bg-white border border-slate-100 flex items-center justify-between shadow-premium relative">
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Completed Archives</h3>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.completed_events}</p>
              <span className="text-[10px] text-slate-500 mt-2 block">Successful projects</span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl shadow-sm">
              ✅
            </div>
          </Card>
        </section>

        {/* Loading/Action Scrim overlay */}
        {(adminLoading || actionLoading) && <Loader size="lg" text="Processing dashboard update..." />}

        {!adminLoading && (
          <>
            {/* 2. MANAGE EVENTS SECTION */}
            <section id="events" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <MdEvent className="h-5 w-5 text-primary-500" />
                  Manage Cleaning Events
                </h2>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<MdAdd className="h-4 w-4" />}
                  onClick={() => navigate('/admin/add-event')}
                >
                  Add New Event
                </Button>
              </div>

              <Card hoverEffect={false} className="bg-white border border-slate-100 shadow-premium overflow-hidden">
                {adminEvents.length === 0 ? (
                  <p className="p-8 text-center text-slate-500 text-sm">No events listed. Create one above!</p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {adminEvents.map((evt) => {
                      const isUpcoming = evt.status === 'upcoming';
                      return (
                        <div key={evt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-sm font-bold text-slate-800">{evt.title}</strong>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full select-none ${
                                isUpcoming ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {evt.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              📍 {evt.location} | 📅 {evt.event_date} | ⏰ {evt.start_time}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {isUpcoming && (
                              <Button
                                variant="primary"
                                size="sm"
                                icon={<MdDoneAll className="h-3.5 w-3.5" />}
                                onClick={() => handleMarkCompleted(evt.id)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                Done
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<MdEdit className="h-3.5 w-3.5" />}
                              onClick={() => navigate(`/admin/edit-event/${evt.id}`)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              icon={<MdDelete className="h-3.5 w-3.5" />}
                              onClick={() => handleDeleteEvent(evt.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </section>

            {/* 3. VOLUNTEER LIST TABLE */}
            <section id="volunteers" className="scroll-mt-20">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2 mb-4">
                <MdPeople className="h-5 w-5 text-primary-500" />
                Volunteer Applications
              </h2>
              
              <Card hoverEffect={false} className="bg-white border border-slate-100 shadow-premium overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm divide-y divide-slate-100">
                    <thead className="bg-slate-50 text-left font-bold text-slate-600 uppercase tracking-wider text-xs">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Phone</th>
                        <th className="px-6 py-4">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {volunteers.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-6 text-center text-slate-500">No volunteers found.</td>
                        </tr>
                      ) : (
                        volunteers.map((vol) => (
                          <tr key={vol.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-slate-800">{vol.full_name}</td>
                            <td className="px-6 py-4">{vol.email}</td>
                            <td className="px-6 py-4">{vol.phone || 'N/A'}</td>
                            <td className="px-6 py-4 text-xs text-slate-500">
                              {vol.created_at ? new Date(vol.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>

            {/* 4. EVENT REGISTRATIONS TABLE */}
            <section id="registrations" className="scroll-mt-20">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2 mb-4">
                <MdAssignment className="h-5 w-5 text-primary-500" />
                Event Registrations List
              </h2>

              <div className="space-y-6">
                {eventRegistrations.length === 0 ? (
                  <Card hoverEffect={false} className="p-6 text-center text-slate-500 bg-white border border-slate-100">
                    No cleaning drives created yet.
                  </Card>
                ) : (
                  eventRegistrations.map((evt) => {
                    const driveRegs = evt.registrations || [];

                    return (
                      <Card key={evt.id} hoverEffect={false} className="bg-white border border-slate-100 shadow-premium overflow-hidden">
                        <div className="bg-slate-50/70 border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-primary-700 text-sm">{evt.title}</h3>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              📍 {evt.location} | 📅 {evt.event_date}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-slate-700 bg-slate-200/60 px-3 py-1 rounded-full w-max">
                            Total Volunteers: {driveRegs.length}
                          </span>
                        </div>

                        {driveRegs.length === 0 ? (
                          <p className="px-6 py-4 text-xs text-slate-500">No volunteers have joined this event yet.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs text-left divide-y divide-slate-100">
                              <thead className="bg-slate-50/20 text-slate-500 uppercase font-semibold">
                                <tr>
                                  <th className="px-6 py-3">Name</th>
                                  <th className="px-6 py-3">Email</th>
                                  <th className="px-6 py-3">Phone</th>
                                  <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700">
                                {driveRegs.map((reg) => (
                                  <tr key={reg.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-3 font-semibold text-slate-800">{reg.user?.full_name}</td>
                                    <td className="px-6 py-3">{reg.user?.email}</td>
                                    <td className="px-6 py-3">{reg.user?.phone || 'N/A'}</td>
                                    <td className="px-6 py-3 text-right text-emerald-600 font-semibold">Joined</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </Card>
                    );
                  })
                )}
              </div>
            </section>

            {/* 5. CONTACT MESSAGES SECTION */}
            <section id="messages" className="scroll-mt-20">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2 mb-4">
                <MdMessage className="h-5 w-5 text-primary-500" />
                Contact Helpdesk Messages
              </h2>

              <Card hoverEffect={false} className="bg-white border border-slate-100 p-6 shadow-premium space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm">No support tickets or feedback messages yet.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => openMessageModal(msg)}
                        className="bg-white hover:bg-slate-50/50 border border-slate-150 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200"
                      >
                        <div className="min-w-0">
                          <strong className="text-slate-800 font-bold text-sm block truncate">{msg.name}</strong>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">Subject: {msg.subject}</p>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm select-none ${getPriorityColor(msg.priority)}`}>
                          {msg.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>
          </>
        )}

        {/* Message details modal */}
        <Modal
          isOpen={isMsgModalOpen}
          onClose={() => setIsMsgModalOpen(false)}
          title="Support Request Details"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMsgModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleSolveMessage(selectedMessage?.id)}
              >
                🗑️ Mark as Solved
              </Button>
            </>
          }
        >
          {selectedMessage && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
                <p><strong>From:</strong> {selectedMessage.name} (<a href={`mailto:${selectedMessage.email}`} className="text-primary-600 underline">{selectedMessage.email}</a>)</p>
                <p><strong>Phone:</strong> {selectedMessage.phone}</p>
                <p><strong>Category:</strong> <span className="capitalize">{selectedMessage.category}</span></p>
                <p>
                  <strong>Priority:</strong>{' '}
                  <span className={`font-semibold px-2 py-0.5 rounded capitalize ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority}
                  </span>
                </p>
              </div>
              <hr className="border-slate-100" />
              <div className="space-y-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Subject</p>
                <p className="text-sm font-bold text-slate-800">{selectedMessage.subject}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Message Details</p>
                <p className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  };

  return (
    <DashboardLayout>
      {isAdmin ? renderAdminDashboard() : renderVolunteerDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
