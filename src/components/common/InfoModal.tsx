import { useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './InfoModal.scss';

interface InfoModalProps {
  children: ReactNode;
  message: string;
  disabled?: boolean;
  position?: 'center' | 'top';
}

const InfoModal = ({ children, message, disabled = false, position = 'center' }: InfoModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const wrapperRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (wrapperRef.current && position === 'top') {
      const rect = wrapperRef.current.getBoundingClientRect();
      const style = {
        position: 'fixed' as const,
        top: `${rect.top}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translate(-50%, calc(-100% - 8px))',
        zIndex: 99999,
      };
      setTooltipStyle(style);
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      // Update position on scroll or resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible, position]);

  if (disabled) {
    return <>{children}</>;
  }

  const tooltipContent = position === 'top' ? (
    <div
      className={`info-modal-tooltip position-top`}
      style={tooltipStyle}
    >
      {message}
    </div>
  ) : (
    <div
      className={`info-modal-tooltip position-center`}
    >
      {message}
      <div className="info-modal-arrow" />
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className="info-modal-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && position === 'top' && createPortal(tooltipContent, document.body)}
      {isVisible && position === 'center' && tooltipContent}
    </div>
  );
};

export default InfoModal;