import React from 'react';

const Loader = ({
  fullPage = false,
  text = 'Loading details...',
  size = 'md',
  className = ''
}) => {
  const spinnerSizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4'
  };

  const containerStyle = fullPage
    ? 'fixed inset-0 bg-slate-50/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center p-8 w-full';

  return (
    <div className={`${containerStyle} ${className}`}>
      <div
        className={`animate-spin rounded-full border-primary-100 border-t-primary-600 ${spinnerSizes[size]}`}
        role="status"
        aria-label="loading"
      />
      {text && (
        <p className="mt-3 text-sm font-medium text-slate-500 animate-pulse tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
