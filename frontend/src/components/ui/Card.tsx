import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'inverted' | 'subtle';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'white',
}) => {
  const baseClasses = 'rounded-3xl transition-all duration-200';
  
  const variantClasses = {
    white: 'bg-card border border-border-light shadow-card text-textDark',
    inverted: 'bg-inverted border border-inverted-border shadow-card text-white',
    subtle: 'bg-gray-50/80 border border-border-light text-textDark',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};
