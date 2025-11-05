import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic } from 'antd';
import { TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import type { Visita } from '../../types/visita';
import { getCuriosoStats } from '../../services/mock/curiosoActivityService';
import type { CuriosoStats } from '../../services/mock/curiosoActivityService';

const { Text } = Typography;

interface CalendarioStatsEnhancedProps {
  visitas: Visita[];
}

const CalendarioStatsEnhanced: React.FC<CalendarioStatsEnhancedProps> = ({ visitas }) => {
  const [stats, setStats] = useState<CuriosoStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await getCuriosoStats(visitas);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [visitas]);

  if (!stats) return null;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '16px', marginTop: '-8px' }}>
      <Col xs={12} sm={8} md={8}>
        <Card
          className="glass"
          bordered={false}
          size="small"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Statistic
            title={<Text style={{ color: '#9ca3af', fontSize: '12px' }}>Visitas Hoy</Text>}
            value={stats.visitasAgendadasHoy}
            prefix={<Calendar size={16} style={{ color: '#33F491' }} />}
            valueStyle={{ color: '#ffffff', fontSize: '20px', fontWeight: 600 }}
            loading={loading}
          />
        </Card>
      </Col>
      
      <Col xs={12} sm={8} md={8}>
        <Card
          className="glass"
          bordered={false}
          size="small"
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <Statistic
            title={<Text style={{ color: '#93c5fd', fontSize: '12px' }}>🐻‍❄️ Por CuriOso</Text>}
            value={stats.porcentajeAgendadasPorCurioso}
            suffix="%"
            valueStyle={{ color: '#ffffff', fontSize: '20px', fontWeight: 600 }}
            loading={loading}
          />
        </Card>
      </Col>

      <Col xs={12} sm={8} md={8}>
        <Card
          className="glass"
          bordered={false}
          size="small"
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <Statistic
            title={<Text style={{ color: '#6ee7b7', fontSize: '12px' }}>Tasa Confirmación</Text>}
            value={stats.tasaConfirmacion}
            suffix="%"
            prefix={<CheckCircle size={16} style={{ color: '#10B981' }} />}
            valueStyle={{ color: '#ffffff', fontSize: '20px', fontWeight: 600 }}
            loading={loading}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default CalendarioStatsEnhanced;
