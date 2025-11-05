import React, { useState } from 'react';
import { Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { VisitasData } from '../../types/salud-data';
import '../../styles/components/_visit-characteristics.scss';

interface VisitCharacteristicsProps {
  data: VisitasData;
  loading?: boolean;
}

type ChartType = 'estado';

const VisitCharacteristics: React.FC<VisitCharacteristicsProps> = ({ data, loading = false }) => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('estado');

  const chartOptions = [
    { value: 'estado', label: 'Por Estado' }
  ];

  const getChartData = () => {
    switch (selectedChart) {
      case 'estado':
        return Object.entries(data.porEstado || {}).map(([key, value]) => ({
          name: key,
          value: value,
          color: getColorByEstado(key)
        }));
      default:
        return [];
    }
  };

  const getColorByEstado = (estado: string) => {
    const colors: Record<string, string> = {
      'Agendada': '#3b82f6',
      'Aprobada': '#6b7280',
      'Completada': '#f59e0b',
      'Cancelada': '#ef4444'
    };
    return colors[estado] || '#6b7280';
  };

  const chartData = getChartData();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const getProgressWidth = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="visit-characteristics">
      <div className="characteristics-header">
        <h3 className="characteristics-title">Características Visitas</h3>
        <Select
          value={selectedChart}
          onChange={setSelectedChart}
          options={chartOptions}
          className="chart-selector"
          suffixIcon={<DownOutlined />}
          variant="borderless"
          popupMatchSelectWidth={false}
        />
      </div>
      
      <div className="characteristics-content">
        {loading ? (
          <div className="loading-state">
            <span>Cargando...</span>
          </div>
        ) : (
          <div className="characteristics-list">
            {chartData.map((item, index) => (
              <div key={index} className="characteristic-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-value">{item.value}</span>
                </div>
                <div className="progress-container">
                  <div 
                    className="progress-bar"
                    style={{ 
                      width: `${getProgressWidth(item.value)}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitCharacteristics;