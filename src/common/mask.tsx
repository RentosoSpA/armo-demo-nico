import React from 'react';
import './mask.scss';

interface UnderConstructionMaskProps {
  children: React.ReactNode;
  message?: string;
  isVisible?: boolean;
  blurIntensity?: number;
  backgroundColor?: string;
  textColor?: string;
}

const UnderConstructionMask: React.FC<UnderConstructionMaskProps> = ({
  children,
  message = 'Under Construction',
  isVisible = true,
  blurIntensity = 4,
  backgroundColor = 'rgba(255, 255, 255, 0.9)',
  textColor = '#666',
}) => {
  if (!isVisible) {
    return <>{children}</>;
  }

  return (
    <div className="under-construction-mask">
      {/* Original content with blur */}
      <div
        className="under-construction-mask__content"
        style={{ filter: `blur(${blurIntensity}px)` }}
      >
        {children}
      </div>

      {/* Overlay */}
      <div
        className="under-construction-mask__overlay"
        style={{ backgroundColor }}
      >
        <div className="under-construction-mask__message-box">
          <div
            className="under-construction-mask__title"
            style={{ color: textColor }}
          >
            🚧 {message} 🚧
          </div>
          <div className="under-construction-mask__subtitle">
            Coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionMask;
