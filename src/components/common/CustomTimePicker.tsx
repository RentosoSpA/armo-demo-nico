import React, { useState, useRef, useEffect } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import '../../styles/components/_custom-time-picker.scss';

interface CustomTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  value,
  onChange,
  defaultValue = '08:00',
  placeholder = 'Select time'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(
    value ? parseInt(value.split(':')[0]) : parseInt(defaultValue.split(':')[0])
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    value ? parseInt(value.split(':')[1]) : parseInt(defaultValue.split(':')[1])
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const displayValue = value || formatTime(selectedHour, selectedMinute);

  const handleHourClick = (hour: number) => {
    setSelectedHour(hour);
    const newTime = formatTime(hour, selectedMinute);
    onChange?.(newTime);
  };

  const handleMinuteClick = (minute: number) => {
    setSelectedMinute(minute);
    const newTime = formatTime(selectedHour, minute);
    onChange?.(newTime);
    // Auto-close after selecting minute
    setTimeout(() => setIsOpen(false), 200);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll selected items into view
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const hourColumn = dropdownRef.current.querySelector('.custom-time-picker__column--hour');
      const minuteColumn = dropdownRef.current.querySelector('.custom-time-picker__column--minute');

      if (hourColumn) {
        const selectedHourElement = hourColumn.querySelector('.custom-time-picker__item--selected');
        selectedHourElement?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }

      if (minuteColumn) {
        const selectedMinuteElement = minuteColumn.querySelector('.custom-time-picker__item--selected');
        selectedMinuteElement?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [isOpen]);

  return (
    <div className="custom-time-picker" ref={containerRef}>
      <div
        className="custom-time-picker__input"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={displayValue ? '' : 'custom-time-picker__placeholder'}>
          {displayValue || placeholder}
        </span>
        <ClockCircleOutlined className="custom-time-picker__icon" />
      </div>

      {isOpen && (
        <div className="custom-time-picker__dropdown" ref={dropdownRef}>
          <div className="custom-time-picker__panel">
            <div className="custom-time-picker__columns">
              {/* Hours column */}
              <div className="custom-time-picker__column custom-time-picker__column--hour">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={`custom-time-picker__item ${
                      hour === selectedHour ? 'custom-time-picker__item--selected' : ''
                    }`}
                    onClick={() => handleHourClick(hour)}
                  >
                    {hour.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>

              {/* Minutes column */}
              <div className="custom-time-picker__column custom-time-picker__column--minute">
                {minutes.map((minute) => (
                  <div
                    key={minute}
                    className={`custom-time-picker__item ${
                      minute === selectedMinute ? 'custom-time-picker__item--selected' : ''
                    }`}
                    onClick={() => handleMinuteClick(minute)}
                  >
                    {minute.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
