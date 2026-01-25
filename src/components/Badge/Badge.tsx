import React from 'react';
import './Badge.css';
import { colors } from '../../theme/colors';

type BadgeVariant = 'primary' | 'accent' | 'success' | 'warning' | 'destructive' | 'secondary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'primary', 
  children,
  className = '' 
}) => {
  const bgColor = colors[variant] || colors.primary;
  const fgColor = colors[`${variant}Foreground` as keyof typeof colors] || colors.primaryForeground;

  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={{
        background: bgColor,
        color: fgColor,
      }}
    >
      {children}
    </span>
  );
};
