import React, { useState } from 'react';
import { Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { VisitasData } from '../../types/salud-data';
import '../../styles/components/_property-characteristics.scss';

interface MetricsByMonthProps {
  visitasData: VisitasData;
  loading?: boolean;
}

type MetricType = 'visitas' | 'finanzas';

const MetricsByMonth: React.FC<MetricsByMonthProps> = ({ visitasData, loading = false }) => {
  console.log('🔍 [MetricsByMonth] v2.0.0 - Component loaded with dropdown (NO TABS)');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('visitas');

  const metricOptions = [
    { value: 'visitas', label: 'Visitas' },
    { value: 'finanzas', label: 'Finanzas' }
  ];

  // Mock finance data with three series as specified
  const months = ["feb 2001","mar 2001","abr 2001","may 2001","jun 2001","jul 2001","ago 2001","sep 2001","oct 2001","nov 2001","dic 2001","ene 2001"];
  const financeMock = months.map((m, i) => {
    // curva suave ascendente
    const ingresos = 42000 + i * 2800 + (i % 3 === 0 ? 2500 : 0);
    const comisiones = Math.round(ingresos * 0.08);     // 8%
    const gastos = Math.round(ingresos * (0.55 + (i%4)*0.02)); // 55–61%
    return { month: m, ingresos, comisiones, gastos };
  });
  const fmtCOP = (n:number)=> n.toLocaleString("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0});

  // Use mock finance data instead of service data for chart
  const finanzasChartData = financeMock.map(item => ({
    name: item.month,
    ingresos: item.ingresos,
    comisiones: item.comisiones,
    gastos: item.gastos,
  }));

  // Transform visitas data for the chart
  const visitasChartData = (visitasData.porMes || []).map(item => {
    const date = new Date(item.mes + '-01');
    const monthName = date.toLocaleDateString('es-ES', {
      month: 'short',
      year: 'numeric',
    });

    return {
      name: monthName,
      agendadas: item.agendadas || Math.floor((item.cantidad || 0) * 0.4),
      aprobadas: item.aprobadas || Math.floor((item.cantidad || 0) * 0.25),
      completadas: item.completadas || Math.floor((item.cantidad || 0) * 0.25),
      canceladas: item.canceladas || Math.floor((item.cantidad || 0) * 0.1),
      total: item.total || item.cantidad || 0,
    };
  });

  // Custom tooltip for visitas
  const VisitasTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry: { color: string; name: string; value: number }, index: number) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for finanzas
  const FinanzasTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry: { color: string; name: string; value: number }, index: number) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {`${entry.name}: ${fmtCOP(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderVisitasChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={visitasChartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#ffffff', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#ffffff', fontSize: 12 }}
        />
        <Tooltip content={<VisitasTooltip />} />
        <Legend 
          wrapperStyle={{ color: '#ffffff' }}
          iconType="line"
        />
        
        {/* Total line - main line with thicker stroke */}
        <Line
          type="monotone"
          dataKey="total"
          stroke="#33F491"
          strokeWidth={3}
          dot={{ fill: '#33F491', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          name="Total"
        />
        
        {/* Individual status lines */}
        <Line
          type="monotone"
          dataKey="agendadas"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 3 }}
          name="Agendadas"
        />
        
        <Line
          type="monotone"
          dataKey="aprobadas"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ fill: '#f59e0b', r: 3 }}
          name="Aprobadas"
        />
        
        <Line
          type="monotone"
          dataKey="completadas"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 3 }}
          name="Completadas"
        />
        
        <Line
          type="monotone"
          dataKey="canceladas"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: '#ef4444', r: 3 }}
          name="Canceladas"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderFinanzasChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={finanzasChartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#ffffff', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#ffffff', fontSize: 12 }}
          tickFormatter={(value) => fmtCOP(value)}
        />
        <Tooltip content={<FinanzasTooltip />} />
        <Legend 
          wrapperStyle={{ color: '#ffffff' }}
          iconType="line"
        />
        
        {/* Ingresos line - RentOso green */}
        <Line
          type="monotone"
          dataKey="ingresos"
          stroke="#34F5C5"
          strokeWidth={3}
          dot={{ fill: '#34F5C5', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          name="Ingresos"
        />

        {/* Comisiones line - yellow */}
        <Line
          type="monotone"
          dataKey="comisiones"
          stroke="#FACC15"
          strokeWidth={3}
          dot={{ fill: '#FACC15', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          name="Comisiones"
        />

        {/* Gastos line - pink */}
        <Line
          type="monotone"
          dataKey="gastos"
          stroke="#FF4080"
          strokeWidth={3}
          dot={{ fill: '#FF4080', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          name="Gastos"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderCurrentChart = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <span>Cargando datos...</span>
        </div>
      );
    }

    return selectedMetric === 'visitas' ? renderVisitasChart() : renderFinanzasChart();
  };

  return (
    <div className="property-characteristics metrics-chart">
      <div className="characteristics-header">
        <h3 className="characteristics-title">
          {selectedMetric === 'visitas' ? '📊 Evolución Mensual' : '📈 Flujo de Ingresos y Gastos'}
        </h3>
        <Select
          value={selectedMetric}
          onChange={setSelectedMetric}
          options={metricOptions}
          className="chart-selector"
          suffixIcon={<DownOutlined style={{ color: '#ffffff' }} />}
          variant="borderless"
          popupMatchSelectWidth={false}
        />
      </div>

      <div className="characteristics-content">
        {renderCurrentChart()}
      </div>
    </div>
  );
};

// Force module refresh for cache busting - version 2.0.0
export const METRICS_BY_MONTH_VERSION = '2.0.0';
export default MetricsByMonth;