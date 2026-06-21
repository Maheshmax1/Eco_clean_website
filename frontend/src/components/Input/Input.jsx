import React from 'react';

// Reusable Input Field
export const Input = ({
  label,
  id,
  type = 'text',
  error = '',
  required = false,
  className = '',
  icon = null,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 bg-white
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            ${error 
              ? 'border-danger focus:ring-red-200 focus:border-danger' 
              : 'border-slate-200 focus:ring-primary-100 focus:border-primary-500'
            }
          `}
          required={required}
          {...props}
        />
      </div>
      
      {error && <span className="text-xs text-danger font-medium animate-fade-in">{error}</span>}
    </div>
  );
};

// Reusable Dropdown Select Field
export const Select = ({
  label,
  id,
  options = [],
  error = '',
  required = false,
  className = '',
  icon = null,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <select
          id={id}
          className={`w-full rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 bg-white appearance-none
            ${icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5
            ${error 
              ? 'border-danger focus:ring-red-200 focus:border-danger' 
              : 'border-slate-200 focus:ring-primary-100 focus:border-primary-500'
            }
          `}
          required={required}
          {...props}
        >
          {props.placeholder && <option value="">{props.placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom select arrow dropdown indicator */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && <span className="text-xs text-danger font-medium animate-fade-in">{error}</span>}
    </div>
  );
};

// Reusable Textarea Form Field
export const Textarea = ({
  label,
  id,
  error = '',
  required = false,
  className = '',
  rows = 4,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      
      <textarea
        id={id}
        rows={rows}
        className={`w-full rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 bg-white px-4 py-2.5
          ${error 
            ? 'border-danger focus:ring-red-200 focus:border-danger' 
            : 'border-slate-200 focus:ring-primary-100 focus:border-primary-500'
          }
        `}
        required={required}
        {...props}
      />
      
      {error && <span className="text-xs text-danger font-medium animate-fade-in">{error}</span>}
    </div>
  );
};
