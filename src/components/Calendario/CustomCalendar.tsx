import React, { useState } from 'react';
import { Button } from 'antd';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import type { Visita } from '../../types/visita';
import IntelligentCalendarDay from './IntelligentCalendarDay';

dayjs.locale('es');

interface CustomCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  visitas: Visita[];
}

const CustomCalendar = ({ selectedDate, onSelectDate, visitas }: CustomCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs(selectedDate));

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const handleDateClick = (date: Dayjs) => {
    onSelectDate(date.format('YYYY-MM-DD'));
  };

  const renderCalendarDays = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');

    const days = [];
    let current = startDate;

    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Header row with weekdays
    weekdays.forEach((day, index) => {
      days.push(
        <div key={`weekday-${index}`} className="text-center font-semibold" style={{
          gridRow: 1,
          gridColumn: index + 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
        
          color: '#ffffff',
          
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          {day}
        </div>
      );
    });

    // Calendar days
    let dayCount = 0;
    while (current.isBefore(endDate) || current.isSame(endDate)) {
      const day = current;
      const isCurrentMonth = day.isSame(currentMonth, 'month');
      const isSelected = day.format('YYYY-MM-DD') === selectedDate;
      
      // Check if day has recent activity (last 2 hours)
      const hasRecentActivity = visitas.some(v => {
        const visitDate = dayjs(v.fecha_inicio).format('YYYY-MM-DD');
        const lastActivity = v.ultimaActividad ? dayjs(v.ultimaActividad) : null;
        return visitDate === day.format('YYYY-MM-DD') && 
               lastActivity && 
               lastActivity.isAfter(dayjs().subtract(2, 'hour'));
      });

      days.push(
        <div key={day.format('YYYY-MM-DD')} className="day" style={{ gridRow: Math.floor(dayCount / 7) + 2, gridColumn: (dayCount % 7) + 1 }}>
          <IntelligentCalendarDay
            date={day}
            visitas={visitas}
            isSelected={isSelected}
            isCurrentMonth={isCurrentMonth}
            hasRecentActivity={hasRecentActivity}
            onSelect={handleDateClick}
          />
        </div>
      );
      
      current = current.add(1, 'day');
      dayCount++;
    }

    return days;
  };

  return (
    <div className="calendar-wrapper w-full p-16">
      {/* Calendar Header */}
      <div className="calendar-header">
        <Button
          type="text"
          icon={<ChevronLeft size={16} />}
          onClick={handlePrevMonth}
          style={{ 
            color: '#ffffff',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px'
          }}
        />
        
        <div className="d-flex align-center font-semibold gap-8">
          <Calendar size={20} />
          {currentMonth.format('MMMM YYYY')}
        </div>

        <Button
          type="text"
          icon={<ChevronRight size={16} />}
          onClick={handleNextMonth}
          style={{ 
            color: '#ffffff',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '8px'
          }}
        />
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default CustomCalendar;