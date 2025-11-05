import React from 'react';
import { Tooltip } from 'antd';
import '../../styles/components/_bear-progress-bar.scss';

interface Step {
  key: string;
  title: string;
}

interface BearProgressBarProps {
  steps: Step[];
  currentStepKey: string;
  completedSteps: string[];
  onStepClick?: (stepKey: string) => void;
}

const BearPawIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main paw pad */}
    <ellipse cx="12" cy="16" rx="4" ry="3.5" />
    
    {/* Toe pads */}
    <circle cx="7" cy="10" r="2" />
    <circle cx="11" cy="8" r="2" />
    <circle cx="15" cy="8" r="2" />
    <circle cx="18" cy="11" r="1.8" />
  </svg>
);

const BearProgressBar: React.FC<BearProgressBarProps> = ({
  steps,
  currentStepKey,
  completedSteps,
  onStepClick,
}) => {
  const currentIndex = steps.findIndex(s => s.key === currentStepKey);

  return (
    <div className="bear-progress-bar">
      <div className="bear-progress-bar__container">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.key);
          const isCurrent = step.key === currentStepKey;
          const isPending = !isCompleted && !isCurrent;
          const isClickable = isCompleted || index < currentIndex;

          return (
            <React.Fragment key={step.key}>
              {/* Trail line before each step (except first) */}
              {index > 0 && (
                <div 
                  className={`bear-progress-bar__trail ${
                    completedSteps.includes(steps[index - 1].key) || index <= currentIndex
                      ? 'bear-progress-bar__trail--active'
                      : ''
                  }`}
                />
              )}

              {/* Paw print step */}
              <Tooltip title={`Paso ${index + 1}: ${step.title}`} placement="bottom">
                <button
                  className={`bear-progress-bar__paw ${
                    isCompleted ? 'bear-progress-bar__paw--completed' : ''
                  } ${
                    isCurrent ? 'bear-progress-bar__paw--current' : ''
                  } ${
                    isPending ? 'bear-progress-bar__paw--pending' : ''
                  }`}
                  onClick={() => isClickable && onStepClick?.(step.key)}
                  disabled={!isClickable}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Paso ${index + 1}: ${step.title}`}
                  type="button"
                >
                  <BearPawIcon className="bear-progress-bar__paw-icon" />
                </button>
              </Tooltip>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BearProgressBar;
