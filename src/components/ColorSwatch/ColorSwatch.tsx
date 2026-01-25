import React from 'react';
import './ColorSwatch.css';

interface ColorSwatchProps {
  name: string;
  color: string;
  className?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  name,
  color,
  className = '',
}) => {
  return (
    <div className={`swatch-card ${className}`}>
      <div className="color-name">{name}</div>
      <div
        className="color-swatch"
        style={{ background: color }}
      >
        {name}
      </div>
      <div className="color-code">{color}</div>
    </div>
  );
};
