import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import type { VisitasData } from '../../types/salud-data';

interface VisitStatsProps {
  data: VisitasData;
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const VisitStats: React.FC<VisitStatsProps> = ({ data, loading = false }) => {
  const visitasPorEstado = Object.entries(data.porEstado).map(([estado, cantidad]) => ({
    name: estado,
    value: cantidad,
  }));

  const visitasPorMes = data.porMes.map(item => ({
    name: new Date(item.mes + '-01').toLocaleDateString('es-ES', {
      month: 'short',
      year: 'numeric',
    }),
    visitas: item.cantidad,
  }));

  const totalVisitas = data.total;
  const proximasVisitas = data.proximasVisitas;

  return (
    <div className="p-16">
      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="mb-24">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Visitas" value={totalVisitas} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Próximas Visitas"
              value={proximasVisitas}
              loading={loading}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Agendadas"
              value={data.porEstado.Agendada}
              loading={loading}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completadas"
              value={data.porEstado.Completada}
              loading={loading}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} className="mb-24">
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
        <Col xs={24} lg={12}>
          <Card title="Visitas por Estado (Barras)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitasPorEstado}>
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

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Visitas por Mes">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visitas"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Detailed Breakdown */}
      <Row gutter={[16, 16]} className="mt-24">
        <Col xs={24} sm={12} md={8}>
          <Card title="Por Estado">
            {visitasPorEstado.map((estado, index) => (
              <div key={estado.name} className="mb-12">
                <div
                  className="d-flex justify-between mb-4"
                >
                  <span>{estado.name}</span>
                  <span>{estado.value}</span>
                </div>
                <Progress
                  percent={totalVisitas > 0 ? (estado.value / totalVisitas) * 100 : 0}
                  showInfo={false}
                  strokeColor={COLORS[index % COLORS.length]}
                  size="small"
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="Por Mes">
            {visitasPorMes.map(mes => (
              <div key={mes.name} className="mb-12">
                <div
                  className="d-flex justify-between mb-4"
                >
                  <span>{mes.name}</span>
                  <span>{mes.visitas}</span>
                </div>
                <Progress
                  percent={totalVisitas > 0 ? (mes.visitas / totalVisitas) * 100 : 0}
                  showInfo={false}
                  strokeColor="#1890ff"
                  size="small"
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="Resumen">
            <div className="mb-16">
              <Statistic
                title="Tasa de Completación"
                value={totalVisitas > 0 ? (data.porEstado.Completada / totalVisitas) * 100 : 0}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#52c41a' }}
              />
            </div>
            <div className="mb-16">
              <Statistic
                title="Tasa de Cancelación"
                value={totalVisitas > 0 ? (data.porEstado.Cancelada / totalVisitas) * 100 : 0}
                suffix="%"
                precision={1}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </div>
            <div>
              <Statistic
                title="Visitas Pendientes"
                value={data.porEstado.Agendada + data.porEstado.Aprobada}
                valueStyle={{ color: '#1890ff' }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VisitStats;
