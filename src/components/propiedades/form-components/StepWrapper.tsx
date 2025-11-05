import React from 'react';
import '../../../styles/components/_step-wrapper.scss';

interface StepWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const StepWrapper: React.FC<StepWrapperProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`step-wrapper ${className}`}>
      {(title || description) && (
        <div className="step-wrapper__header">
          {title && <h2 className="step-wrapper__title">{title}</h2>}
          {description && <p className="step-wrapper__description">{description}</p>}
        </div>
      )}
      <div className="step-wrapper__content">
        {children}
      </div>
    </div>
  );
};
