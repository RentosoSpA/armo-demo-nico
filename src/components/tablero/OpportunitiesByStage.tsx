import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { OportunidadesData } from '../../types/salud-data';
import '../../styles/components/_opportunities-by-stage.scss';

interface OpportunitiesByStageProps {
  data: OportunidadesData;
  loading?: boolean;
}

const OpportunitiesByStage: React.FC<OpportunitiesByStageProps> = ({ data, loading = false }) => {
  // Transform data for the chart with color coding
  const chartData = Object.entries(data.porEtapa || {}).map(([stage, count]) => {
    const stageColors: Record<string, string> = {
      'Exploracion': '#3b82f6',
      'Visita': '#10b981', 
      'Negociacion': '#f59e0b',
      'Cierre': '#ef4444'
    };

    return {
      name: stage,
      value: count,
      fill: stageColors[stage] || '#6b7280'
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom bar shape to add rounded corners
  const CustomBar = (props: unknown) => {
    const { fill, x, y, width, height } = props as { fill: string; x: number; y: number; width: number; height: number };
    const radius = 4;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          rx={radius}
          ry={radius}
        />
      </g>
    );
  };

  return (
    <div className="opportunities-by-stage">
      <div className="chart-header">
        <h3 className="chart-title">Oportunidades por Etapa</h3>
      </div>
      
      <div className="chart-content">
        {loading ? (
          <div className="loading-state">
            <span>Cargando datos...</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barCategoryGap="20%"
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
              <Tooltip content={<CustomTooltip />} />
              
              <Bar
                dataKey="value"
                shape={CustomBar}
                radius={[4, 4, 0, 0]}
              >
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesByStage;