import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateFullName, validatePhone } from '../../utils/validators';
import { Input } from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import toast from 'react-hot-toast';
import { MdEmail, MdLock, MdPerson, MdPhone, MdWater, MdCleaningServices, MdForest, MdOutlineRecycling } from 'react-icons/md';
import { HiOutlineSparkles, HiOutlineUserGroup, HiOutlineGlobeAlt } from 'react-icons/hi2';

const Home = () => {
  const { signIn, signUp, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');

  // Form errors
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setEmail('');
    setPassword('');
    setFullname('');
    setPhone('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setProcessing(true);
    const { data, error } = await signIn(email, password);
    setProcessing(false);

    if (error) {
      toast.error(error.message || 'Incorrect email or password.');
    } else {
      toast.success('Welcome back to EcoClean!');
      // Fetch metadata profiles to check roles
      const sessionUser = data?.user;
      const isAdminUser = sessionUser?.user_metadata?.role === 'admin';
      navigate(isAdminUser ? '/admin' : '/profile');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const nameErr = validateFullName(fullname);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passErr = validatePassword(password);

    if (nameErr || emailErr || phoneErr || passErr) {
      setErrors({ fullname: nameErr, email: emailErr, phone: phoneErr, password: passErr });
      return;
    }

    setProcessing(true);
    const { data, error } = await signUp(email, password, fullname, phone);
    setProcessing(false);

    if (error) {
      toast.error(error.message || 'Registration failed.');
    } else {
      toast.success('Account created successfully! Check your email or try logging in.');
      setIsLogin(true);
      setErrors({});
      setPassword('');
    }
  };

  const scrollToAuth = () => {
    const authElement = document.getElementById('auth-section');
    if (authElement) {
      authElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/10 to-slate-50">
      {/* 1. HERO VIDEO HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute z-0 min-w-full min-h-full object-cover opacity-85"
        >
          <source src="/assets/main_vedio.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80 z-10" />

        {/* Hero Copy Content */}
        <div className="relative z-20 text-center max-w-4xl px-4 flex flex-col items-center gap-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-4 py-1.5 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-wider animate-pulse">
            <HiOutlineSparkles className="h-4 w-4" /> Act locally, impact globally
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
            Keep Our <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-500 bg-clip-text text-transparent">Planet Clean</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 font-medium max-w-2xl drop-shadow-sm leading-relaxed">
            Join hands in restoring nature's beauty. We organize volunteer cleaning campaigns across beaches, rivers, parks, and communities.
          </p>
          <div className="flex flex-wrap gap-4 mt-2 justify-center">
            {user ? (
              <Button
                variant="primary"
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 scale-105 hover:scale-110 duration-300 font-bold"
                onClick={() => navigate(isAdmin ? '/admin' : '/profile')}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 scale-105 hover:scale-110 duration-300 font-bold" 
                onClick={scrollToAuth}
              >
                Become a Volunteer
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC IMPACT STATISTICS BAR (Overlapping the Hero) */}
      <section className="relative z-30 px-4 -mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/95 backdrop-blur-xl p-8 rounded-3xl border border-slate-100 shadow-premium">
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-emerald-50/50 transition-colors duration-300">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <HiOutlineGlobeAlt className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-slate-800">12,450 kg</h3>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">Waste Collected</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-emerald-50/50 transition-colors duration-300 border-y md:border-y-0 md:border-x border-slate-100">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <HiOutlineUserGroup className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-slate-800">750+</h3>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">Active Volunteers</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-emerald-50/50 transition-colors duration-300">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <MdCleaningServices className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-slate-800">54 Drives</h3>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">Completed Events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AUTHENTICATION (LOGIN & REGISTRATION) PORTAL */}
      {!user && (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4" id="auth-section">
          <Card className="w-full max-w-lg p-8 sm:p-10 border border-slate-100 shadow-premium hover:shadow-premium-hover">
            {/* Header Tabs */}
            <div className="flex border-b border-slate-100 mb-8">
              <button
                className={`w-1/2 pb-4 text-base font-bold border-b-2 transition-all cursor-pointer ${
                  isLogin ? 'text-primary-600 border-primary-600 scale-105' : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
                onClick={() => !isLogin && handleToggle()}
              >
                Login
              </button>
              <button
                className={`w-1/2 pb-4 text-base font-bold border-b-2 transition-all cursor-pointer ${
                  !isLogin ? 'text-primary-600 border-primary-600 scale-105' : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
                onClick={() => isLogin && handleToggle()}
              >
                Register as Volunteer
              </button>
            </div>

            {isLogin ? (
              // LOGIN FORM
              <form onSubmit={handleLoginSubmit} className="space-y-6 animate-fade-in">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                  <p className="text-sm text-slate-500 mt-1">Login to view your events and profile</p>
                </div>

                <Input
                  label="Email Address"
                  id="login-email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  icon={<MdEmail className="h-5 w-5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />

                <Input
                  label="Password"
                  id="login-password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  icon={<MdLock className="h-5 w-5" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                />

                <Button type="submit" variant="primary" className="w-full py-3 hover:translate-y-[-2px] active:translate-y-0 shadow-md font-bold" loading={processing}>
                  Login
                </Button>
              </form>
            ) : (
              // SIGNUP FORM
              <form onSubmit={handleSignupSubmit} className="space-y-5 animate-fade-in">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
                  <p className="text-sm text-slate-500 mt-1">Join EcoClean and participate in clean & green events</p>
                </div>

                <Input
                  label="Full Name"
                  id="signup-fullname"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  icon={<MdPerson className="h-5 w-5" />}
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  error={errors.fullname}
                />

                <Input
                  label="Email Address"
                  id="signup-email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  icon={<MdEmail className="h-5 w-5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  id="signup-phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  icon={<MdPhone className="h-5 w-5" />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                />

                <Input
                  label="Create Password"
                  id="signup-password"
                  type="password"
                  required
                  placeholder="Create a strong password"
                  icon={<MdLock className="h-5 w-5" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                />

                <Button type="submit" variant="primary" className="w-full py-3 hover:translate-y-[-2px] active:translate-y-0 shadow-md font-bold" loading={processing}>
                  Sign Up
                </Button>
              </form>
            )}
          </Card>
        </section>
      )}

      {/* 4. THE CORE PILLARS / SERVICES GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full w-max">
              What We Do
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Our Core Conservation Focus
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              We focus on areas where public awareness and volunteer effort make the most immediate impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="group bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-500/20 shadow-sm hover:shadow-premium transition-all duration-300 hover:-translate-y-2">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-max group-hover:scale-110 transition-transform duration-300">
                <MdWater className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-4 group-hover:text-emerald-700 transition-colors duration-300">River Cleanup</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Clearing surface debris, plastic blocking, and restoring the natural flow of river tributaries.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-500/20 shadow-sm hover:shadow-premium transition-all duration-300 hover:-translate-y-2">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-max group-hover:scale-110 transition-transform duration-300">
                <HiOutlineGlobeAlt className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-4 group-hover:text-emerald-700 transition-colors duration-300">Beach Restoration</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Removing microplastics and ghost nets from sandy shores, preserving fragile coastal marine life.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-500/20 shadow-sm hover:shadow-premium transition-all duration-300 hover:-translate-y-2">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl w-max group-hover:scale-110 transition-transform duration-300">
                <MdForest className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-4 group-hover:text-emerald-700 transition-colors duration-300">Park Revitalization</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Transforming public community areas, planting local tree saplings, and cleaning play areas.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-emerald-500/20 shadow-sm hover:shadow-premium transition-all duration-300 hover:-translate-y-2">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-max group-hover:scale-110 transition-transform duration-300">
                <MdOutlineRecycling className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-4 group-hover:text-emerald-700 transition-colors duration-300">Waste Segregation</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Educating the public on segregating organic and recyclable garbage during our clean campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT SUMMARY */}
      <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-premium border border-slate-100 h-96 group">
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
                alt="About EcoClean"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>
            <div className="flex flex-col gap-6 lg:pl-6">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full w-max">
                Who We Are
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                About Our Mission
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-base">
                <p>
                  EcoClean is dedicated to spreading awareness about pollution and encouraging community cleaning initiatives.
                </p>
                <p>
                  We organize events to clean rivers, beaches, parks, and public spaces, returning nature to its pristine state.
                </p>
                <p>
                  Our goal is to create a cleaner, healthier, and more sustainable environment for everyone.
                </p>
              </div>
              <Button
                variant="outline"
                size="md"
                className="w-max mt-2 border-emerald-500/30 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 transition-colors shadow-sm font-semibold"
                onClick={() => navigate('/about')}
              >
                Learn More About Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EVENTS TEASER */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6 lg:pr-6 order-2 lg:order-1">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full w-max">
                Get Involved
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                Join Cleaning Drives
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-base">
                <p>
                  <strong>"Clean surroundings, healthy living."</strong> Our upcoming campaigns bring the community together to create a greener tomorrow.
                </p>
                <p>
                  <strong>"Be the change you wish to see."</strong> Help us collect plastic waste, segregating recyclable garbage and educating passersby.
                </p>
                <p>
                  <strong>"A clean city reflects a clean mindset."</strong> Participate in our weekend drives. We provide gloves, bags, safety vests, and refreshments!
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-max mt-2 shadow-md hover:translate-y-[-2px] duration-300 font-semibold"
                onClick={() => navigate('/events')}
              >
                Explore Upcoming Events
              </Button>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-premium border border-slate-100 h-96 group order-1 lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80"
                alt="Cleaning Event"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. VOLUNTEER IMPACT SECTION */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-premium border border-slate-100 h-96 group">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80"
                alt="Volunteers"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>
            <div className="flex flex-col gap-6 lg:pl-6">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full w-max">
                Our Movement
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                Our Volunteer Family
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-base">
                <p>
                  Become a part of our active volunteer family. We plan, execute, and inspect environmental drives across Chennai.
                </p>
                <p>
                  By joining, you gain certificate honors, meet fantastic green activists, and make an immediate, visual impact on public beaches and parks.
                </p>
              </div>
              {!user && (
                <Button variant="primary" size="md" className="w-max mt-2 shadow-md hover:translate-y-[-2px] duration-300 font-semibold" onClick={scrollToAuth}>
                  Sign Up Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
