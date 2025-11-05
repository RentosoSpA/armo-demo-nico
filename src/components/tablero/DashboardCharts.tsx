import React from 'react';
import { Row, Col } from 'antd';
import PropertyCharacteristics from './PropertyCharacteristics';
import MetricsByMonth from './MetricsByMonth';
import OpportunitiesByStage from './OpportunitiesByStage';
import VisitCharacteristics from './VisitCharacteristics';
import { FlipCard } from '../common';
import '../../styles/components/_dashboard-stats.scss';
import type { NewDashboardData } from '../../types/salud-data';

interface DashboardChartsProps {
  data: NewDashboardData;
  loading?: boolean;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ data, loading = false }) => {
  // Mock data and currency formatter
  const mock = {
    billing: { total: 325000000, commissionsTotal: 48750000 },
    visits: { upcoming: 1 },
    leads: { newThisMonth: 7 },
    properties: { count: 5, totalValue: 1980000000 },
    collections: { paidCount: 78, onTimeRate: 0.75 }
  };
  const currency = (n: number) => n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const pct = (n: number) => `${Math.round(n * 100)}%`;

  console.log('🔍 [DashboardCharts] Component rendered with FlipCard');
  console.log('🔍 [DashboardCharts] Received data:', data);
  console.log('🔍 [DashboardCharts] Loading state:', loading);

  return (
    <div>
      {/* Summary Statistics 
      <Row gutter={[16, 16]} className="mb-24">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Propiedades"
              value={data.propiedades?.total || 0}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Visitas" value={data.visitas?.total || 0} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Oportunidades"
              value={data.oportunidades?.total || 0}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Agentes Activos"
              value={data.agentes?.activos || 0}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
      */}
      {/* Charts Row 1 
      <Row gutter={[16, 16]} className="mb-24">
        <Col xs={24} lg={12}>
          <Card title="Propiedades por Tipo">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propiedadesPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propiedadesPorTipo.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Propiedades por Estado">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propiedadesPorEstado}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      */}

      {/* Charts Row 2 
      <Row gutter={[16, 16]} className="mb-24">
        <Col xs={24} lg={12}>
          <Card title="Propiedades por Operación">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propiedadesPorOperacion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Visitas por Estado">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={visitasPorEstado}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {visitasPorEstado.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      */}

      {/* Charts Row 3 
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Oportunidades por Etapa">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={oportunidadesPorEtapa}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Visitas por Mes">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visitas" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      */}
      {/* Flip Cards Row */}
      <Row gutter={[16, 16]} style={{ marginTop: '18px' }}>
        <Col xs={24} sm={12} md={6}>
          <FlipCard
            titleFront="Facturación Total"
            valueFront={currency(mock.billing.total)}
            iconFront={<span>💰</span>}
            gradientFrontClass="-grad-green"
            titleBack="Comisiones Totales"
            valueBack={currency(mock.billing.commissionsTotal)}
            iconBack={<span>💵</span>}
            gradientBackClass="-grad-green-dark"
            
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <FlipCard
            titleFront="Próximas Visitas"
            valueFront={mock.visits.upcoming}
            iconFront={<span>📅</span>}
            gradientFrontClass="-grad-purple"
            titleBack="Nuevos Prospectos"
            valueBack={mock.leads.newThisMonth}
            iconBack={<span>👥</span>}
            gradientBackClass="-grad-purple-dark"
            frontEdgeColor="#7A5CFF"
            backEdgeColor="#5A49D9"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <FlipCard
            titleFront="Total Propiedades"
            valueFront={mock.properties.count}
            iconFront={<span>🏠</span>}
            gradientFrontClass="-grad-pink"
            titleBack="Valor Total Propiedades"
            valueBack={currency(mock.properties.totalValue)}
            iconBack={<span>📊</span>}
            gradientBackClass="-grad-pink-dark"
            frontEdgeColor="#FF3D6E"
            backEdgeColor="#C02F59"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <FlipCard
            titleFront="Cobranzas Pagadas"
            valueFront={mock.collections.paidCount}
            iconFront={<span role="img" aria-label="cobranza pagada">💵</span>}
            gradientFrontClass="-grad-amber"
            titleBack="Cobranza a Tiempo"
            valueBack={pct(mock.collections.onTimeRate)}
            iconBack={<span role="img" aria-label="cobranza a tiempo">⏱️</span>}
            gradientBackClass="-grad-amber-dark"
            frontEdgeColor="#F59E0B"
            backEdgeColor="#B45309"
          />
        </Col>
      </Row>
      
      {/* Characteristics and Charts Layout */}
      <Row gutter={[16, 16]} className="mt-24">
        <Col xs={24} lg={8}>
          <div className="characteristics-column">
            <div className="chart-item">
              <PropertyCharacteristics data={data.propiedades} loading={loading} />
            </div>
            <div className="chart-item">
              <VisitCharacteristics data={data.visitas} loading={loading} />
            </div>
          </div>
        </Col>
        <Col xs={24} lg={16}>
          <div className="charts-column">
            <div className="chart-item">
              <MetricsByMonth visitasData={data.visitas} loading={loading} />
            </div>
            <div className="chart-item">
              <OpportunitiesByStage data={data.oportunidades} loading={loading} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardCharts;
