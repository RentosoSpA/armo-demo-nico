import React from 'react';
import { Spin } from 'antd';
import RentosoIcon from '../../assets/RentosoIcon';
import '../../styles/components/_loading-splash.scss';

export interface LoadingSplashProps {
  /**
   * Variant of the loading splash
   * - full: Full screen with aurora background
   * - inline: Inside a container
   * - minimal: Just a spinner
   */
  variant?: 'full' | 'inline' | 'minimal';
  
  /**
   * Optional message to display
   */
  message?: string;
  
  /**
   * Size of the spinner
   */
  size?: 'small' | 'default' | 'large';
}

/**
 * LoadingSplash Component
 * 
 * A reusable loading component with consistent RentOso styling.
 * 
 * @example
 * // Full screen loading
 * <LoadingSplash variant="full" message="Cargando datos..." />
 * 
 * @example
 * // Inline loading in a container
 * <LoadingSplash variant="inline" message="Cargando tabla..." />
 * 
 * @example
 * // Minimal spinner only
 * <LoadingSplash variant="minimal" size="small" />
 */
const LoadingSplash: React.FC<LoadingSplashProps> = ({
  variant = 'full',
  message = 'Cargando...',
  size = 'large',
}) => {
  if (variant === 'minimal') {
    return (
      <div className="loading-splash loading-splash--minimal">
        <Spin size={size} />
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="loading-splash loading-splash--inline">
        <div className="loading-splash__content">
          <div className="loading-splash__icon">
            <RentosoIcon size={48} color="var(--rentoso-green)" />
          </div>
          <Spin size={size} />
          {message && <div className="loading-splash__text">{message}</div>}
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className="loading-splash loading-splash--full">
      <div className="loading-splash__content">
        <div className="loading-splash__logo">
          <RentosoIcon size={60} color="var(--rentoso-green)" />
        </div>
        <div className="loading-splash__spinner">
          <Spin size={size} />
        </div>
        {message && <div className="loading-splash__text">{message}</div>}
      </div>
    </div>
  );
};

export default LoadingSplash;
