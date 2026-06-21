import React from 'react';

const Card = ({
  children,
  className = '',
  hoverEffect = true,
  onClick = null,
  ...props
}) => {
  const baseStyle = 'bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-premium';
  const hoverStyle = hoverEffect ? 'transition-all duration-300 hover:shadow-premium-hover hover:-translate-y-1' : '';
  const clickStyle = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyle} ${hoverStyle} ${clickStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
