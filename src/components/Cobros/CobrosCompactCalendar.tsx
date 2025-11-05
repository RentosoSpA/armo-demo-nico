import React from 'react';
import { Calendar, Badge, Typography, Card } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { Cobro, EstadoCobro } from '../../types/cobro';

const { Text } = Typography;

interface CobrosCompactCalendarProps {
  data: Cobro[];
  loading?: boolean;
}

const CobrosCompactCalendar: React.FC<CobrosCompactCalendarProps> = ({ data, loading }) => {
  const getStatusColor = (estado: EstadoCobro) => {
    switch (estado) {
      case 'Pagado':
        return 'success';
      case 'Por cobrar':
        return 'processing';
      case 'Atrasado':
        return 'error';
      case 'Cobrado parcialmente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getCobrosPorFecha = (fecha: Dayjs) => {
    return data.filter(cobro => {
      const fechaVencimiento = dayjs(cobro.fechaVencimiento).format('YYYY-MM-DD');
      const fechaPago = cobro.fechaPago ? dayjs(cobro.fechaPago).format('YYYY-MM-DD') : null;
      const fechaActual = fecha.format('YYYY-MM-DD');
      
      return fechaVencimiento === fechaActual || fechaPago === fechaActual;
    });
  };

  const cellRender = (value: Dayjs, info: any) => {
    if (info.type === 'date') {
      const cobrosDelDia = getCobrosPorFecha(value);
      
      if (cobrosDelDia.length === 0) {
        return null;
      }

      return (
        <ul className="calendar-cobros-list m-0 p-0">
          {cobrosDelDia.slice(0, 2).map(cobro => (
            <li key={cobro.id} style={{ marginBottom: 2 }}>
              <Badge
                status={getStatusColor(cobro.estado)}
                text={
                  <Text 
                    style={{ fontSize: '10px', lineHeight: '12px' }}
                    ellipsis={{ tooltip: `${cobro.cliente.nombre} - ${cobro.propiedad.titulo}` }}
                  >
                    {cobro.cliente.nombre.split(' ')[0]}
                  </Text>
                }
              />
            </li>
          ))}
          {cobrosDelDia.length > 2 && (
            <li>
              <Text type="secondary" style={{ fontSize: '9px' }}>
                +{cobrosDelDia.length - 2}
              </Text>
            </li>
          )}
        </ul>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <Card loading className="modern-card">
        <div style={{ height: 350 }} />
      </Card>
    );
  }

  return (
    <div className="calendar-panel">
      <Card className="modern-card" style={{ height: 'fit-content' }}>
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-dot success"></div>
            <span>Pagado</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot processing"></div>
            <span>Por cobrar</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot warning"></div>
            <span>Parcial</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot error"></div>
            <span>Atrasado</span>
          </div>
        </div>
        
        <Calendar
          cellRender={cellRender}
          fullscreen={false}
          style={{
            background: 'transparent'
          }}
          onSelect={(value) => {
            const cobrosDelDia = getCobrosPorFecha(value);
            if (cobrosDelDia.length > 0) {
              console.log('Cobros del día:', cobrosDelDia);
            }
          }}
        />
      </Card>
    </div>
  );
};

export default CobrosCompactCalendar;