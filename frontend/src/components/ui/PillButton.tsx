import React from 'react';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const PillButton: React.FC<PillButtonProps> = ({
  variant = 'outline',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'rounded-full font-medium inline-flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-sm px-6 py-2.5 gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-brand-orange text-white hover:bg-brand-orangeHover shadow-orange-glow border border-transparent',
    outline:
      'bg-white text-textDark border border-gray-200 hover:bg-gray-50 shadow-soft',
    dark: 'bg-textDark text-white hover:bg-gray-800 border border-transparent shadow-sm',
    ghost: 'bg-transparent text-textMuted hover:text-textDark hover:bg-gray-100',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
