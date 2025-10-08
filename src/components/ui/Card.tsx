import type { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export default function Card({ children, className = '', hover = true, style }: CardProps) {
  const baseClasses = 'bg-white rounded-2xl border border-gray-100 shadow-soft';
  const hoverClasses = hover ? 'motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg transition-transform duration-300 ease-out' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} style={style}>
      {children}
    </div>
  );
}
