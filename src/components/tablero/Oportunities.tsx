import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { OportunidadesData } from '../../types/salud-data';

interface OportunitiesProps {
  data: OportunidadesData;
  loading?: boolean;
}

const Oportunities: React.FC<OportunitiesProps> = ({ data, loading = false }) => {
  const oportunidadesPorEtapa = Object.entries(data.porEtapa).map(([etapa, cantidad]) => ({
    name: etapa,
    value: cantidad,
  }));

  const totalOportunidades = data.total;
  const conversionRate = data.conversionRate;

  return (
    <div className="p-16">
      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="mb-24">
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Oportunidades" value={totalOportunidades} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tasa de Conversión"
              value={conversionRate}
              suffix="%"
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div>
              <div className="mb-8">Progreso de Conversión</div>
              <Progress
                percent={conversionRate}
                status={
                  conversionRate >= 50 ? 'success' : conversionRate >= 25 ? 'normal' : 'exception'
                }
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Opportunities by Stage Chart */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Oportunidades por Etapa">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={oportunidadesPorEtapa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Stage Breakdown */}
      <Row gutter={[16, 16]} className="mt-24">
        {oportunidadesPorEtapa.map(etapa => (
          <Col xs={24} sm={12} md={6} key={etapa.name}>
            <Card>
              <Statistic
                title={etapa.name}
                value={etapa.value}
                loading={loading}
                valueStyle={{ color: '#1890ff' }}
              />
              <Progress
                percent={totalOportunidades > 0 ? (etapa.value / totalOportunidades) * 100 : 0}
                showInfo={false}
                strokeColor="#1890ff"
                size="small"
                className="mt-8"
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Oportunities;
