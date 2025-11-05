import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { AgentesData } from '../../types/salud-data';
import '../../styles/components/_agent-stats.scss';

interface AgentStatsProps {
  data: AgentesData;
  loading?: boolean;
}

const { Text } = Typography;

const AgentStats: React.FC<AgentStatsProps> = ({ data, loading = false }) => {
  const totalAgentes = data.total;
  const agentesActivos = data.activos;
  const agentesInactivos = totalAgentes - agentesActivos;
  const tasaActividad = totalAgentes > 0 ? (agentesActivos / totalAgentes) * 100 : 0;

  return (
    <div className="agent-stats">
      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="summary-row">
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Agentes"
              value={totalAgentes}
              loading={loading}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Agentes Activos"
              value={agentesActivos}
              loading={loading}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Agentes Inactivos"
              value={agentesInactivos}
              loading={loading}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      

      {/* Detailed Breakdown */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
        <Card title="Tasa de Actividad" className="progress-card">
            <div className="progress-container">
              <Progress
                type="circle"
                percent={tasaActividad}
                format={percent => `${percent?.toFixed(1)}%`}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size={120}
              />
              <div className="margin-top-16">
                <Text type="secondary">
                  {agentesActivos} de {totalAgentes} agentes están activos
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Métricas de Rendimiento" className="metrics-card">
            <div className="margin-bottom-16">
              <Statistic
                title="Eficiencia del Equipo"
                value={tasaActividad}
                suffix="%"
                precision={1}
                valueStyle={{
                  color:
                    tasaActividad >= 80 ? '#52c41a' : tasaActividad >= 60 ? '#fa8c16' : '#ff4d4f',
                }}
              />
            </div>
            <div className="margin-bottom-16">
              <Statistic
                title="Capacidad de Trabajo"
                value={agentesActivos}
                suffix={`/ ${totalAgentes}`}
                valueStyle={{ color: '#1890ff' }}
              />
            </div>
            <div>
              <Statistic
                title="Agentes por Actividad"
                value={agentesActivos > 0 ? (totalAgentes / agentesActivos).toFixed(1) : 0}
                suffix="ratio"
                valueStyle={{ color: '#8b7db8' }}
              />
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default AgentStats;
