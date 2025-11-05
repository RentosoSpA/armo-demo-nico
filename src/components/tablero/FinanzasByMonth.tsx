import React from 'react';
import { Card, Spin } from 'antd';
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
import type { FinanzasData } from '../../types/finanzas';

interface FinanzasByMonthProps {
  data: FinanzasData;
  loading?: boolean;
}

const FinanzasByMonth: React.FC<FinanzasByMonthProps> = ({ data, loading = false }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry: any, index: number) => {
            let labelText = 'Ingresos';
            if (entry.dataKey === 'comisiones') labelText = 'Comisiones';
            if (entry.dataKey === 'gastos') labelText = 'Gastos';
            
            return (
              <p key={index} style={{ color: entry.color }}>
                {`${labelText}: ${formatCurrency(entry.value)}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="modern-card finanzas-by-month">
        <div className="loading-container">
          <Spin size="large" />
          <p>Cargando datos financieros...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="modern-card finanzas-by-month">
      <div className="card-header">
        <h3 className="chart-title">Finanzas por Mes</h3>
      </div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data.porMes}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="mes" 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#22C55E"
              strokeWidth={3}
              dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#22C55E', strokeWidth: 2 }}
              name="Ingresos"
            />
            <Line
              type="monotone"
              dataKey="comisiones"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              name="Comisiones"
            />
            <Line
              type="monotone"
              dataKey="gastos"
              stroke="#EAB308"
              strokeWidth={3}
              dot={{ fill: '#EAB308', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#EAB308', strokeWidth: 2 }}
              name="Gastos"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default FinanzasByMonth;