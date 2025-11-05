import React, { useState } from 'react';
import { Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { PropiedadesData } from '../../types/salud-data';
import '../../styles/components/_property-characteristics.scss';

interface PropertyCharacteristicsProps {
  data: PropiedadesData;
  loading?: boolean;
}

type ChartType = 'tipo' | 'estado' | 'operacion';

const PropertyCharacteristics: React.FC<PropertyCharacteristicsProps> = ({ data, loading = false }) => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('tipo');

  const chartOptions = [
    { value: 'tipo', label: 'Por Tipo' },
    { value: 'estado', label: 'Por Estado' },
    { value: 'operacion', label: 'Por Operación' }
  ];

  const getChartData = () => {
    switch (selectedChart) {
      case 'tipo':
        return Object.entries(data.porTipo || {}).map(([key, value]) => ({
          name: key,
          value: value,
          color: getColorByType(key)
        }));
      case 'estado':
        return Object.entries(data.porEstado || {}).map(([key, value]) => ({
          name: key,
          value: value,
          color: getColorByEstado(key)
        }));
      case 'operacion':
        return Object.entries(data.porOperacion || {}).map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: value,
          color: getColorByOperacion(key)
        }));
      default:
        return [];
    }
  };

  const getColorByType = (type: string) => {
    const colors: Record<string, string> = {
      'Casa': '#3b82f6',
      'Departamento': '#10b981',
      'Parcela': '#f59e0b',
      'LocalComercial': '#ef4444',
      'Oficina': '#8b5cf6',
      'Bodega': '#f97316',
      'Terreno': '#84cc16'
    };
    return colors[type] || '#6b7280';
  };

  const getColorByEstado = (estado: string) => {
    const colors: Record<string, string> = {
      'Disponible': '#3b82f6',
      'Reservada': '#f59e0b',
      'Arrendada': '#10b981',
      'Vendida': '#ef4444'
    };
    return colors[estado] || '#6b7280';
  };

  const getColorByOperacion = (operacion: string) => {
    const colors: Record<string, string> = {
      'arriendo': '#3b82f6',
      'venta': '#10b981',
      'ambas': '#f59e0b'
    };
    return colors[operacion] || '#6b7280';
  };

  const chartData = getChartData();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const getProgressWidth = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="property-characteristics">
      <div className="characteristics-header">
        <h3 className="characteristics-title">Características Propiedades</h3>
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

export default PropertyCharacteristics;