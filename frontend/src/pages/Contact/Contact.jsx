import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { validateEmail, validatePhone } from '../../utils/validators';
import { SUPPORT_CATEGORIES, PRIORITY_LEVELS } from '../../utils/constants';
import { Input, Select, Textarea } from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import toast from 'react-hot-toast';
import { MdEmail, MdPhone, MdPerson, MdAssignment, MdInfo, MdOutlinePriorityHigh } from 'react-icons/md';

const Contact = () => {
  const navigate = useNavigate();

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('');

  // Validation States
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Client side validations
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const nameErr = name.trim() ? '' : 'Name is required';
    const catErr = category ? '' : 'Support category is required';
    const subErr = subject.trim() ? '' : 'Subject is required';
    const msgErr = message.trim() ? '' : 'Detailed message is required';
    const priErr = priority ? '' : 'Priority level is required';

    if (emailErr || phoneErr || nameErr || catErr || subErr || msgErr || priErr) {
      setErrors({
        name: nameErr,
        email: emailErr,
        phone: phoneErr,
        category: catErr,
        subject: subErr,
        message: msgErr,
        priority: priErr
      });
      toast.error('⚠️ Please fill out all required fields correctly!');
      return;
    }

    setSubmitting(true);
    try {
      const messageData = {
        name,
        email,
        phone,
        category,
        subject,
        message,
        priority
      };

      await apiService.submitContactMessage(messageData);
      toast.success('✅ Success! Your message has been received.');
      
      // Navigate to Greet/Thank-you page
      navigate('/thank-you');
    } catch (err) {
      toast.error(err.message || 'Transmission Error: Could not save message.');
    } finally {
      setSubmitting(false);
    }
  };

  const supportCards = [
    { icon: '💬', title: 'Live Chat Support', desc: 'Connect with our team instantly through live chat', response: 'Under 2 minutes', badge: 'AVAILABLE 24/7' },
    { icon: '📞', title: 'Phone Support', desc: 'Speak directly with our support specialists', response: '+91 98765 43210', badge: 'ROUND THE CLOCK' },
    { icon: '📧', title: 'Email Support', desc: 'Send us detailed inquiries via email', response: 'Within 24 hours', badge: 'ALWAYS ACTIVE' },
    { icon: '🤝', title: 'Emergency Support', desc: 'Urgent environmental concerns? We are here', response: '+91 99999 88888', badge: 'INSTANT RESPONSE' }
  ];

  const contactMethods = [
    { icon: '📍', title: 'Visit Us', text: '123 Green Street, Chennai, Tamil Nadu, India - 600001' },
    { icon: '📧', title: 'Email Us', text: 'info@cleanawareness.com\nsupport@cleanawareness.com' },
    { icon: '📞', title: 'Call Us', text: '+91 98765 43210\n+91 99999 88888 (Emergency)' },
    { icon: '⏰', title: 'Office Hours', text: 'Mon - Fri: 9:00 AM - 6:00 PM\nSupport: 24/7 Available' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 text-white py-20 text-center px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-md">
          Get in Touch With Us
        </h1>
        <p className="text-slate-300 mt-3 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
          We are here to answer your questions and support your eco-journey!
        </p>
      </section>

      {/* 2. SUMMARY / EXPLANATORY BLOCK */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-4">
          We are Here to Help You
        </h2>
        <p className="text-slate-600 leading-relaxed max-w-4xl mx-auto text-sm sm:text-base">
          At <strong>EcoClean</strong>, we truly care about our community and the environment. Whether you want to join a clean-up drive, start a plantation event, or simply learn how to reduce waste — we are always here to guide you. Your feedback, questions, and suggestions inspire us to make our city greener and healthier every day. Reach out to us anytime — our team is happy to connect, support, and work together for a cleaner, better tomorrow.
        </p>
      </section>

      {/* 3. 24/7 SUPPORT SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200/60">
        <h2 className="text-2xl font-extrabold text-slate-800 text-center tracking-tight mb-10">
          🌟 24/7 Customer Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportCards.map((card, idx) => (
            <Card key={idx} className="p-6 bg-white border border-slate-100 flex flex-col items-center text-center gap-3">
              <span className="text-3xl select-none">{card.icon}</span>
              <h3 className="font-bold text-slate-800 text-sm">{card.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{card.desc}</p>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                <strong>Detail:</strong> {card.response}
              </p>
              <span className="text-[9px] font-bold tracking-widest text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-0.5 rounded-full mt-2">
                {card.badge}
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. CONTACT METHODS DETAILS */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, idx) => (
            <Card key={idx} className="p-6 bg-white border border-slate-100 flex flex-col items-center text-center gap-2">
              <span className="text-2xl select-none">{method.icon}</span>
              <h3 className="font-bold text-slate-800 text-sm">{method.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
                {method.text}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. SUPPORT REQUEST FORM */}
      <section className="max-w-3xl mx-auto px-4 py-16" id="contact-form">
        <Card className="p-8 sm:p-10 bg-white border border-slate-100 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Customer Support Request</h2>
            <p className="text-slate-500 text-xs mt-1">
              Fill out the form below and we will get back to you as soon as possible
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                id="name"
                required
                placeholder="John Doe"
                icon={<MdPerson className="h-5 w-5" />}
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
              <Input
                label="Email Address"
                id="email"
                type="email"
                required
                placeholder="john@example.com"
                icon={<MdEmail className="h-5 w-5" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                id="phone"
                type="tel"
                required
                placeholder="+91 98765 43210"
                icon={<MdPhone className="h-5 w-5" />}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
              />
              <Select
                label="Support Category"
                id="category"
                required
                placeholder="Select a category"
                options={SUPPORT_CATEGORIES}
                icon={<MdInfo className="h-5 w-5" />}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                error={errors.category}
              />
            </div>

            {/* Subject */}
            <Input
              label="Subject"
              id="subject"
              required
              placeholder="Brief description of your inquiry"
              icon={<MdAssignment className="h-5 w-5" />}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              error={errors.subject}
            />

            {/* Message */}
            <Textarea
              label="Detailed Message"
              id="message"
              required
              placeholder="Please provide as much detail as possible about your inquiry..."
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={errors.message}
            />

            {/* Priority */}
            <Select
              label="Priority Level"
              id="priority"
              required
              placeholder="Select priority"
              options={PRIORITY_LEVELS}
              icon={<MdOutlinePriorityHigh className="h-5 w-5" />}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              error={errors.priority}
            />

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3"
              loading={submitting}
            >
              Submit Support Request
            </Button>
          </form>
        </Card>
      </section>

    </div>
  );
};

export default Contact;
