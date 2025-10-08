import type { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'outlineGold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  href,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus-visible:ring-2 ring-brand-600 ring-offset-2 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-white rounded-lg active:scale-95',
    outline: 'border border-brand-600 text-brand-600 hover:bg-brand-50 hover:border-brand-700 hover:text-brand-700 rounded-lg',
    outlineGold: 'rounded-full border-2 border-[#DFC775] text-[#DFC775] bg-white hover:bg-[#FFF5D6] font-semibold px-8 py-3 active:scale-95',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  
  return (
    <button 
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
