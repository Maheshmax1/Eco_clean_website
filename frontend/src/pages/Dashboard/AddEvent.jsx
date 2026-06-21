import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { validateEventDate, validateEventTimes } from '../../utils/validators';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import { Input, Textarea } from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import toast from 'react-hot-toast';
import { MdTitle, MdLocationOn, MdCalendarToday, MdAccessTime, MdImage, MdArrowBack } from 'react-icons/md';
import { IoMdCloudUpload } from 'react-icons/io';

const AddEvent = () => {
  const navigate = useNavigate();

  // Form Fields State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  // Validation States
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [todayStr, setTodayStr] = useState('');

  // Set min date constraints on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTodayStr(today);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('❌ Error: Image is too large! Please choose a file smaller than 5MB.');
      e.target.value = '';
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImageBase64(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImageBase64(null);
    const fileInput = document.getElementById('image_file');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Client validators
    const titleErr = title.trim().length >= 5 ? '' : 'Title must be at least 5 characters long';
    const descErr = description.trim() ? '' : 'Description is required';
    const locErr = location.trim() ? '' : 'Location is required';
    const dateErr = validateEventDate(eventDate);
    const timeErr = validateEventTimes(startTime, endTime);

    if (titleErr || descErr || locErr || dateErr || timeErr) {
      setErrors({
        title: titleErr,
        description: descErr,
        location: locErr,
        event_date: dateErr,
        time: timeErr
      });
      toast.error('⚠️ Please fix validation errors before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const eventData = {
        title,
        description,
        location,
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        image_url: imageBase64 || null,
        status: 'upcoming'
      };

      await apiService.createEvent(eventData);
      toast.success('🎉 Success! Your new event has been created.');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto animate-slide-up">
        {/* Back navigation */}
        <Link
          to="/admin"
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <MdArrowBack className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Page title */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Create Cleaning Campaign</h1>
          <p className="text-slate-500 text-xs mt-1">Configure a new cleanup drive. Ensure times and dates are future-valid. 🌱</p>
        </div>

        {/* Form Card */}
        <Card hoverEffect={false} className="bg-white border border-slate-100 p-8 shadow-premium">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <Input
              label="Event Title"
              id="title"
              required
              placeholder="e.g. Marina Beach Cleanup Drive"
              icon={<MdTitle className="h-5 w-5" />}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />

            {/* Description */}
            <Textarea
              label="Description"
              id="description"
              required
              placeholder="Describe the cleanup activity, local goals, meeting points, and what volunteers should wear..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
            />

            {/* Location */}
            <Input
              label="Location"
              id="location"
              required
              placeholder="e.g. Marina Beach, North End bank"
              icon={<MdLocationOn className="h-5 w-5" />}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={errors.location}
            />

            {/* Date + Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Event Date"
                id="event_date"
                type="date"
                required
                min={todayStr}
                icon={<MdCalendarToday className="h-5 w-5" />}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                error={errors.event_date}
              />
              <Input
                label="Start Time"
                id="start_time"
                type="time"
                required
                icon={<MdAccessTime className="h-5 w-5" />}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                error={errors.time}
              />
              <Input
                label="End Time"
                id="end_time"
                type="time"
                required
                icon={<MdAccessTime className="h-5 w-5" />}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                error={errors.time}
              />
            </div>

            {/* Image upload area */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Event Image <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              
              {!imageBase64 ? (
                <div
                  onClick={() => document.getElementById('image_file').click()}
                  className="border-2 border-dashed border-slate-200 hover:border-primary-400 bg-slate-50/50 hover:bg-slate-55 p-8 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                >
                  <IoMdCloudUpload className="h-10 w-10 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-600">Click to upload or drag & drop</p>
                  <p className="text-xs text-slate-400">JPG, PNG, WEBP files up to 5MB</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-100 shadow-sm max-h-60 bg-slate-50">
                  <img src={imageBase64} alt="Upload Preview" className="w-full h-full object-contain max-h-60" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md cursor-pointer"
                  >
                    Delete Image
                  </button>
                </div>
              )}
              
              <input
                type="file"
                id="image_file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Link to="/admin">
                <Button variant="outline" size="md">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={submitting}
              >
                Create Event
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddEvent;
