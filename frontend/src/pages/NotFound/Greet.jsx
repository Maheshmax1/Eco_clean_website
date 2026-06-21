import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';

const Greet = () => {
  const navigate = useNavigate();

  return (
    <div className="py-24 bg-slate-50 min-h-[80vh] flex items-center justify-center px-4">
      <Card hoverEffect={false} className="p-8 sm:p-12 text-center max-w-lg w-full border border-slate-100 bg-white shadow-xl flex flex-col items-center gap-4">
        {/* Animated Celebration Icon */}
        <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl animate-bounce mb-2">
          🎉
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Congratulations!
        </h1>
        
        <div className="space-y-3 text-slate-600 leading-relaxed text-sm">
          <p>
            Your request has been successfully submitted.
          </p>
          <p>
            Our support helpdesk is currently reviewing your inquiry, and your request status is <strong className="text-primary-600 font-bold">in process</strong>.
          </p>
          <p className="text-xs text-slate-400">
            You will be notified soon with further details via email or phone. Thank you for your interest, commitment, and patience!
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full mt-6 py-2.5"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Card>
    </div>
  );
};

export default Greet;
