import React from 'react';
import { Calendar, Badge, Typography, Card } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { Cobro, EstadoCobro } from '../../types/cobro';

const { Text } = Typography;

interface CobrosCalendarProps {
  data: Cobro[];
  loading?: boolean;
}

const CobrosCalendar: React.FC<CobrosCalendarProps> = ({ data, loading }) => {
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
    return data.filter(cobro => 
      dayjs(cobro.fechaVencimiento).format('YYYY-MM-DD') === fecha.format('YYYY-MM-DD')
    );
  };

  const cellRender = (value: Dayjs, info: any) => {
    if (info.type === 'date') {
      const cobrosDelDia = getCobrosPorFecha(value);
      
      if (cobrosDelDia.length === 0) {
        return null;
      }

      return (
        <ul className="calendar-cobros-list m-0 p-0">
          {cobrosDelDia.slice(0, 3).map(cobro => (
            <li key={cobro.id} style={{ marginBottom: 2 }}>
              <Badge
                status={getStatusColor(cobro.estado)}
                text={
                  <Text 
                    className="text-11"
                    ellipsis={{ tooltip: `${cobro.cliente.nombre} - ${cobro.propiedad.titulo}` }}
                  >
                    {cobro.cliente.nombre}
                  </Text>
                }
              />
            </li>
          ))}
          {cobrosDelDia.length > 3 && (
            <li>
              <Text type="secondary" style={{ fontSize: '10px' }}>
                +{cobrosDelDia.length - 3} más
              </Text>
            </li>
          )}
        </ul>
      );
    }

    if (info.type === 'month') {
      const cobrosDelMes = data.filter(cobro => 
        dayjs(cobro.fechaVencimiento).format('YYYY-MM') === value.format('YYYY-MM')
      );
      
      if (cobrosDelMes.length === 0) {
        return null;
      }

      const pagados = cobrosDelMes.filter(c => c.estado === 'Pagado').length;
      const atrasados = cobrosDelMes.filter(c => c.estado === 'Atrasado').length;
      const pendientes = cobrosDelMes.filter(c => c.estado === 'Por cobrar').length;

      return (
        <div className="month-summary text-12">
          {pagados > 0 && <Badge status="success" text={`${pagados} pagados`} />}
          {pendientes > 0 && <Badge status="processing" text={`${pendientes} pendientes`} />}
          {atrasados > 0 && <Badge status="error" text={`${atrasados} atrasados`} />}
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <Card loading className="modern-card">
        <div style={{ height: 400 }} />
      </Card>
    );
  }

  return (
    <Card className="modern-card cobros-calendar mb-16">
      <div>
        <Text strong>Calendario de Cobros</Text>
        <br />
        <Text type="secondary" className="text-12">
          <Badge status="success" text="Pagado" /> |{' '}
          <Badge status="processing" text="Por cobrar" /> |{' '}
          <Badge status="warning" text="Parcialmente" /> |{' '}
          <Badge status="error" text="Atrasado" />
        </Text>
      </div>
      
      <Calendar
        cellRender={cellRender}
        onPanelChange={(value, mode) => {
          console.log('Calendar panel changed:', value.format('YYYY-MM-DD'), mode);
        }}
        onSelect={(value) => {
          const cobrosDelDia = getCobrosPorFecha(value);
          if (cobrosDelDia.length > 0) {
            console.log('Cobros del día:', cobrosDelDia);
          }
        }}
      />
    </Card>
  );
};

export default CobrosCalendar;