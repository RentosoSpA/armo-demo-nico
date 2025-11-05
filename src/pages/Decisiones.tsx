import React from 'react';
import { Typography, Empty, Spin } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DecisionCard from '../components/decisions/DecisionCard';
import { useDecisions } from '../hooks/useDecisions';

const { Title, Text } = Typography;

const Decisiones: React.FC = () => {
  const navigate = useNavigate();
  const { decisions, loading, decisionsCount } = useDecisions();

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => navigate('/tablero')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#34F5C5',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            marginBottom: '16px',
            padding: '8px 0',
          }}
        >
          <ArrowLeft size={16} />
          Volver al tablero
        </button>

        <Title level={2} style={{ margin: 0, color: '#ffffff' }}>
          Centro de Decisiones
        </Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
          Tienes {decisionsCount} {decisionsCount === 1 ? 'decisión pendiente' : 'decisiones pendientes'}
        </Text>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" />
        </div>
      ) : decisions.length === 0 ? (
        <Empty
          description="No tienes decisiones pendientes"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: '80px 0' }}
        />
      ) : (
        <div>
          {decisions.map(decision => (
            <DecisionCard key={decision.id} decision={decision} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Decisiones;
