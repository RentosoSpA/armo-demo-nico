import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../../../styles/components/_mini-chart-widget.scss';

interface MiniChartWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: any;
  config?: any;
}

const MiniChartVisitsTrendWidget: React.FC<MiniChartWidgetProps> = () => {
  const mockData = [
    { mes: 'Ene', visitas: 65 },
    { mes: 'Feb', visitas: 72 },
    { mes: 'Mar', visitas: 68 },
    { mes: 'Abr', visitas: 78 },
    { mes: 'May', visitas: 85 },
    { mes: 'Jun', visitas: 89 }
  ];

  return (
    <div className="mini-chart-widget">
      <div className="mini-chart-widget__header">
        <h3 className="mini-chart-widget__title">Tendencia de Visitas</h3>
      </div>
      <div className="mini-chart-widget__content">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart 
            data={mockData}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34F5C5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#34F5C5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.02)" 
              vertical={false}
            />
            <XAxis 
              dataKey="mes" 
              stroke="rgba(255,255,255,0.4)"
              style={{ fontSize: '11px', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)"
              style={{ fontSize: '11px', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(26, 29, 41, 0.98)', 
                border: '1px solid rgba(52, 245, 197, 0.2)',
                borderRadius: '12px',
                color: 'white',
                padding: '10px 14px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="visitas" 
              stroke="#34F5C5" 
              strokeWidth={3}
              dot={{ 
                fill: '#34F5C5', 
                r: 5, 
                strokeWidth: 2, 
                stroke: '#1a1d29',
                filter: 'drop-shadow(0 0 6px rgba(52, 245, 197, 0.6))'
              }}
              activeDot={{ 
                r: 7, 
                strokeWidth: 2,
                stroke: '#1a1d29',
                fill: '#34F5C5',
                filter: 'drop-shadow(0 0 8px rgba(52, 245, 197, 0.8))'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MiniChartVisitsTrendWidget;
