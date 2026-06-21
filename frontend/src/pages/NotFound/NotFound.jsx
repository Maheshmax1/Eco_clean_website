import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="py-24 bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <Card hoverEffect={false} className="p-8 sm:p-10 text-center max-w-md w-full border border-slate-100 bg-white shadow-xl flex flex-col items-center">
        <span className="text-6xl animate-bounce" role="img" aria-label="tree">
          🌿
        </span>
        <h1 className="text-5xl font-extrabold text-primary-600 mt-6 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mt-2">Page Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back to cleanup campaigns!
        </p>
        <Button
          variant="primary"
          size="md"
          className="w-full py-2.5"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
