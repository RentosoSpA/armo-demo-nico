import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { FileSpreadsheet, BarChart, PieChart } from 'lucide-react';
import ReportCard from './ReportCard';
import ReportToggler from './ReportToggler';

const ReportGrid: React.FC = () => {
  const iconColor = '#6290F1';
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const reportes = [
    {
      title: 'Pipeline de Ventas',
      description: 'Análisis detallado del embudo de ventas por etapas',
      date: '2024-01-01',
      type: 'ventas',
      icon: <FileSpreadsheet size={24} color={iconColor} />,
      onClick: () => {},
    },
    {
      title: 'Rentabilidad por Propiedad',
      description: 'Comparación de márgenes y retornos por inmueble',
      date: '2024-01-01',
      type: 'financieros',
      icon: <BarChart size={24} color={iconColor} />,
      onClick: () => {},
    },
    {
      title: 'Tendencia Mensual',
      description: 'Evolución histórica de ventas de los últimos 12 meses',
      date: '2024-01-01',
      type: 'ventas',
      icon: <PieChart size={24} color={iconColor} />,
      onClick: () => {},
    },
    {
      title: 'Ventas por Agente',
      description: 'Rendimiento comparativo del equipo comercial',
      date: '2024-01-01',
      type: 'ventas',
      icon: <FileSpreadsheet size={24} color={iconColor} />,
      onClick: () => {},
    },
    {
      title: 'Análisis de Mercado',
      description: 'Tendencias del mercado inmobiliario local',
      date: '2024-01-01',
      type: 'propiedades',
      icon: <BarChart size={24} color={iconColor} />,
      onClick: () => {},
    },
    {
      title: 'Tiempo de Conversión',
      description: 'Duración promedio del ciclo de venta por segmento',
      date: '2024-01-01',
      type: 'ventas',
      icon: <PieChart size={24} color={iconColor} />,
      onClick: () => {},
    },
  ];

  return (
    <div
      className="d-flex align-center flex-column w-full gap-16"
    >
      <ReportToggler
        id="reportes-toggler"
        activeFilter={activeFilter}
        filters={['todos', 'ventas', 'arriendos', 'clientes', 'financieros', 'propiedades']}
        onFilterChange={setActiveFilter}
      />
      <Row gutter={[16, 16]} className="w-full">
        {reportes
          .filter(reporte => activeFilter === 'todos' || reporte.type === activeFilter)
          .map((reporte, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              {index === 0 ? (
                <ReportCard id={'reportes-card'} {...reporte} />
              ) : (
                <ReportCard {...reporte} />
              )}
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default ReportGrid;
