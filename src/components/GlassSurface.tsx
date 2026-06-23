import React from 'react';
import './GlassSurface.css';

export interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
  contentClassName?: string;
  style?: React.CSSProperties;
  backgroundOpacity?: number;
}

const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  width = '100%',
  height = '100%',
  borderRadius = 20,
  className = '',
  contentClassName = '',
  style = {},
  backgroundOpacity = 0.03
}) => {
  const containerStyle: React.CSSProperties = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    ['--glass-bg-opacity' as any]: backgroundOpacity,
  };

  return (
    <div
      className={`glass-surface glass-surface--fallback ${className}`}
      style={containerStyle}
    >
      <div className={`glass-surface__content ${contentClassName}`}>{children}</div>
    </div>
  );
};

export default GlassSurface;
