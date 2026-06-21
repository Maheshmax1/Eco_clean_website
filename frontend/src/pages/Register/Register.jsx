import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateFullName, validatePhone } from '../../utils/validators';
import { Input } from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import toast from 'react-hot-toast';
import { MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md';

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const nameErr = validateFullName(fullname);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passErr = validatePassword(password);

    if (nameErr || emailErr || phoneErr || passErr) {
      setErrors({
        fullname: nameErr,
        email: emailErr,
        phone: phoneErr,
        password: passErr
      });
      return;
    }

    setLoading(true);
    const { data, error } = await signUp(email, password, fullname, phone);
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Registration failed.');
    } else {
      toast.success('🎉 Registration successful! Please login now.');
      navigate('/login');
    }
  };

  return (
    <div className="py-20 bg-slate-50 min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 sm:p-10 border border-slate-100 bg-white shadow-xl">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold text-slate-800 tracking-tight block mb-2">
            🌿 EcoClean
          </Link>
          <h2 className="text-xl font-bold text-slate-800">Create Account</h2>
          <p className="text-sm text-slate-500 mt-1">Join EcoClean and participate in cleanup events</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            id="fullname"
            required
            placeholder="Enter your full name"
            icon={<MdPerson className="h-5 w-5" />}
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            error={errors.fullname}
          />

          <Input
            label="Email Address"
            id="email"
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
            id="phone"
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
            id="password"
            type="password"
            required
            placeholder="Create a strong password"
            icon={<MdLock className="h-5 w-5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3"
            loading={loading}
          >
            Sign Up
          </Button>

          <p className="text-center text-xs text-slate-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Register;
