import React from 'react';
import './Typography.css';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'mono';

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'p', 
  children,
  className = '' 
}) => {
  const isMono = variant === 'mono';
  const Tag = (isMono ? 'p' : variant) as keyof JSX.IntrinsicElements;
  const classes = `${variant} ${className}`.trim();
  
  return <Tag className={classes}>{children}</Tag>;
};

