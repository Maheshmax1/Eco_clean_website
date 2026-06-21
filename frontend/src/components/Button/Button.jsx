import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon = null,
  ...props
}) => {
  // Base styling
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size options
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  // Variant styling
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-premium hover:shadow-premium-hover focus:ring-primary-500 border border-transparent',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400 border border-transparent',
    outline: 'bg-transparent border border-slate-300 hover:bg-slate-100 text-slate-700 focus:ring-slate-400',
    danger: 'bg-danger hover:bg-red-700 text-white shadow-premium hover:shadow-premium-hover focus:ring-red-500 border border-transparent',
    link: 'bg-transparent text-primary-600 hover:text-primary-700 underline focus:ring-transparent p-0 border-none',
  };

  // Loading/Disabled states
  const isDisabled = disabled || loading;
  const opacityStyle = isDisabled ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${opacityStyle} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
