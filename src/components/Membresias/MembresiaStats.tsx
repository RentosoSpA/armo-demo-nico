import React from 'react';
import { Card, Row, Col } from 'antd';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';
import type { Membresia } from '../../presets/coworking/types/membresia';
import './MembresiaStats.scss';

interface MembresiaStatsProps {
  membresias: Membresia[];
}

const MembresiaStats: React.FC<MembresiaStatsProps> = ({ membresias }) => {
  const activas = membresias.filter(m => m.estado === 'activa');
  const totalMRR = activas.reduce((sum, m) => sum + m.precio_mensual, 0);
  const promedioMensual = activas.length > 0 ? totalMRR / activas.length : 0;

  const stats = [
    {
      icon: <Users size={24} />,
      label: 'Miembros Activos',
      value: activas.length,
      color: '#10b981',
    },
    {
      icon: <DollarSign size={24} />,
      label: 'MRR Total',
      value: `$${(totalMRR / 1000).toFixed(0)}K`,
      color: '#3b82f6',
    },
    {
      icon: <TrendingUp size={24} />,
      label: 'Retención',
      value: '95%',
      color: '#8b5cf6',
    },
    {
      icon: <Award size={24} />,
      label: 'Miembro Promedio',
      value: `$${(promedioMensual / 1000).toFixed(0)}K`,
      color: '#f59e0b',
    },
  ];

  return (
    <div className="membresia-stats-page">
      <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Card className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MembresiaStats;
