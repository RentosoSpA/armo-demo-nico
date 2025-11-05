import { Card, Calendar, Button, Row, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { Visita } from '../../types/visita';
import { useState } from 'react';
import '../../styles/components/_common-cards.scss';
import '../../styles/components/_calendario.scss';

const { Title } = Typography;

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  visitas: Visita[];
}

const CalendarioHeader = ({ selectedDate, onSelectDate, visitas }: Props) => {
  const parsedDate = dayjs(selectedDate);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(parsedDate);

  const handleSelect = (value: Dayjs) => {
    onSelectDate(value.format('YYYY-MM-DD'));
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth =
      direction === 'prev' ? currentMonth.subtract(1, 'month') : currentMonth.add(1, 'month');
    setCurrentMonth(newMonth);
  };

  const cellRender = (date: Dayjs, info: { type: string }) => {
    if (info.type !== 'date') return null;

    const fechaActual = date.format('YYYY-MM-DD');
    const tieneVisita = visitas?.some(v => {
      const visitaDate = dayjs(v.fecha);
      return visitaDate.format('YYYY-MM-DD') === fechaActual;
    }) || false;
    const esSeleccionado = fechaActual === selectedDate;

    return (
      <div
        className={`custom-day ${tieneVisita ? 'visita' : ''} ${esSeleccionado ? 'selected' : ''}`}
      >
        {date.date()}
      </div>
    );
  };

  const calendarValue = dayjs(selectedDate).isSame(currentMonth, 'month')
    ? dayjs(selectedDate)
    : currentMonth;

  return (
    <Card
      id="calendario-card"
      className="modern-card calendario-card-container"
      styles={{ body: { paddingTop: 0 } }}
    >
      <div className="modern-card-content calendario-card-content-wrapper">
        <div className="card-header">
          <Row justify="center" align="middle">
            <Title level={3} className="card-title text-center mb-0">
              Calendario de visitas
            </Title>
          </Row>
        </div>
        <div className="modern-card-content calendario-card-inner">
          <Calendar
            fullscreen={false}
            value={calendarValue}
            onSelect={handleSelect}
            onPanelChange={setCurrentMonth}
            cellRender={cellRender}
            className="liquid-glass"
            headerRender={() => (
              <Row justify="center" align="middle" className="calendario-header-wrapper">
                <Button
                  icon={<LeftOutlined />}
                  shape="circle"
                  size="small"
                  onClick={() => handleMonthChange('prev')}
                />
                <span className="calendario-month-text">{currentMonth.format('MMMM YYYY')}</span>
                <Button
                  icon={<RightOutlined />}
                  shape="circle"
                  size="small"
                  onClick={() => handleMonthChange('next')}
                />
              </Row>
            )}
          />
        </div>
      </div>
    </Card>
  );
};

export default CalendarioHeader;
