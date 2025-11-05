import CustomCalendar from './CustomCalendar';
import type { Visita } from '../../types/visita';

interface CalendarioGridProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  visitas: Visita[];
}

const CalendarioGrid = ({ selectedDate, onSelectDate, visitas }: CalendarioGridProps) => {
  return (
    <div className="calendarCard">
      <div className="calendarInner">
        <div className="cal-card__body">
          <CustomCalendar
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            visitas={visitas}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarioGrid;