import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import '../../../styles/components/_mini-chart-widget.scss';

interface MiniChartWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: any;
  config?: any;
}

const MiniChartPropertiesPieWidget: React.FC<MiniChartWidgetProps> = () => {
  const mockData = [
    { name: 'Casas', value: 58, color: '#34F5C5' },
    { name: 'Departamentos', value: 42, color: '#3B82F6' },
    { name: 'Terrenos', value: 32, color: '#FACC15' },
    { name: 'Oficinas', value: 24, color: '#FF4080' }
  ];

  return (
    <div className="mini-chart-widget">
      <div className="mini-chart-widget__header">
        <h3 className="mini-chart-widget__title">Distribución de Propiedades</h3>
      </div>
      <div className="mini-chart-widget__content">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={mockData}
              cx="50%"
              cy="45%"
              labelLine={false}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => 
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
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
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ 
                paddingTop: '10px',
                fontSize: '13px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MiniChartPropertiesPieWidget;
