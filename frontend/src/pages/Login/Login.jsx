import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validators';
import { Input } from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import toast from 'react-hot-toast';
import { MdEmail, MdLock } from 'react-icons/md';

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target
  const from = location.state?.from || '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setLoading(true);
    const { data, error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      toast.error(error.message || 'Incorrect email or password.');
    } else {
      toast.success('Successfully logged in!');
      const sessionUser = data?.user;
      const isAdminUser = sessionUser?.user_metadata?.role === 'admin';
      
      // If the target page is the general volunteer profile, and they are admin, send to admin instead
      if (from === '/profile' && isAdminUser) {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="py-20 bg-slate-50 min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 sm:p-10 border border-slate-100 bg-white shadow-xl">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold text-slate-800 tracking-tight block mb-2">
            🌿 EcoClean
          </Link>
          <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Login to view your events and profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            label="Password"
            id="password"
            type="password"
            required
            placeholder="Enter your password"
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
            Login
          </Button>

          <p className="text-center text-xs text-slate-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-bold hover:underline">
              Register as Volunteer
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Login;
