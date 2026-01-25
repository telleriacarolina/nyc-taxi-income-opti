import React from 'react';
import './Button.css';
import { colors } from '../../theme/colors';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'destructive';

interface ButtonProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const bgColor = colors[variant] || colors.primary;
  const fgColor = colors[`${variant}Foreground` as keyof typeof colors] || colors.primaryForeground;

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      style={{
        background: bgColor,
        color: fgColor,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
