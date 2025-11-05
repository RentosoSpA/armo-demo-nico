import React from 'react';
import { Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { Visita } from '../../types/visita';

interface IntelligentCalendarDayProps {
  date: Dayjs;
  visitas: Visita[];
  isSelected: boolean;
  isCurrentMonth: boolean;
  hasRecentActivity?: boolean;
  onSelect: (date: Dayjs) => void;
}

const IntelligentCalendarDay: React.FC<IntelligentCalendarDayProps> = ({
  date,
  visitas,
  isSelected,
  isCurrentMonth,
  hasRecentActivity = false,
  onSelect,
}) => {
  const dateStr = date.format('YYYY-MM-DD');
  const dayVisitas = visitas.filter(v => 
    dayjs(v.fecha_inicio).format('YYYY-MM-DD') === dateStr
  );

  const hasVisits = dayVisitas.length > 0;
  const isToday = date.isSame(dayjs(), 'day');

  // Count visit types
  const confirmedCount = dayVisitas.filter(v => v.estado === 'Aprobada' || v.estado === 'Completada').length;
  const pendingCount = dayVisitas.filter(v => v.estado === 'Agendada').length;
  const curiosoCount = dayVisitas.filter(v => (v as any).agendadaPorCurioso).length;

  const getTooltipContent = () => {
    if (dayVisitas.length === 0) return null;

    return (
      <div className="intelligent-calendar-day__tooltip">
        <div className="intelligent-calendar-day__tooltip-header">
          {date.format('DD MMMM YYYY')}
        </div>
        <div className="intelligent-calendar-day__tooltip-stats">
          {confirmedCount > 0 && (
            <div className="intelligent-calendar-day__tooltip-stat">
              <span className="dot dot--confirmed"></span>
              {confirmedCount} Confirmada{confirmedCount > 1 ? 's' : ''}
            </div>
          )}
          {pendingCount > 0 && (
            <div className="intelligent-calendar-day__tooltip-stat">
              <span className="dot dot--pending"></span>
              {pendingCount} Pendiente{pendingCount > 1 ? 's' : ''}
            </div>
          )}
          {curiosoCount > 0 && (
            <div className="intelligent-calendar-day__tooltip-stat">
              <span className="dot dot--curioso"></span>
              {curiosoCount} por CuriOso 🐻‍❄️
            </div>
          )}
        </div>
      </div>
    );
  };

  const dayContent = (
    <div
      className={`intelligent-calendar-day ${isSelected ? 'intelligent-calendar-day--selected' : ''} 
                 ${!isCurrentMonth ? 'intelligent-calendar-day--other-month' : ''} 
                 ${hasVisits ? 'intelligent-calendar-day--has-visits' : ''}
                 ${hasRecentActivity ? 'intelligent-calendar-day--recent-activity' : ''}
                 ${isToday ? 'intelligent-calendar-day--today' : ''}`}
      onClick={() => isCurrentMonth && onSelect(date)}
    >
      <div className="intelligent-calendar-day__number">
        {date.date()}
      </div>
      
      {hasVisits && (
        <div className="intelligent-calendar-day__indicators">
          {confirmedCount > 0 && (
            <span className="intelligent-calendar-day__dot intelligent-calendar-day__dot--confirmed"></span>
          )}
          {pendingCount > 0 && (
            <span className="intelligent-calendar-day__dot intelligent-calendar-day__dot--pending"></span>
          )}
          {curiosoCount > 0 && (
            <span className="intelligent-calendar-day__dot intelligent-calendar-day__dot--curioso"></span>
          )}
        </div>
      )}

      {dayVisitas.length > 1 && (
        <div className="intelligent-calendar-day__count">
          {dayVisitas.length}
        </div>
      )}
    </div>
  );

  if (!hasVisits) {
    return dayContent;
  }

  return (
    <Tooltip 
      title={getTooltipContent()} 
      placement="top"
      mouseEnterDelay={0.3}
    >
      {dayContent}
    </Tooltip>
  );
};

export default IntelligentCalendarDay;
