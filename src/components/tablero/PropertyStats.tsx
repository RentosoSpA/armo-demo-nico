import React from 'react';
import { Card, Row, Col, Progress } from 'antd';
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
} from 'recharts';
import type { PropiedadesData } from '../../types/salud-data';

interface PropertyStatsProps {
  data: PropiedadesData;
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

//TODO: Agregar loading a las estadisticas
const PropertyStats: React.FC<PropertyStatsProps> = ({ data }) => {
  const propiedadesPorTipo = Object.entries(data.porTipo).map(([tipo, cantidad]) => ({
    name: tipo,
    value: cantidad,
  }));

  const propiedadesPorEstado = Object.entries(data.porEstado).map(([estado, cantidad]) => ({
    name: estado,
    value: cantidad,
  }));

  const propiedadesPorOperacion = Object.entries(data.porOperacion).map(
    ([operacion, cantidad]) => ({
      name: operacion.charAt(0).toUpperCase() + operacion.slice(1),
      value: cantidad,
    })
  );

  const totalPropiedades = data.total;

  return (
    <div className="p-16">
      {/* Summary Statistics */}
      {/*<Row gutter={[16, 16]} className="mb-24">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Propiedades" value={totalPropiedades} loading={loading} />
          </Card>
        </Col>
        {/*<Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Disponibles"
              value={data.porEstado.Disponible}
              loading={loading}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Arriendo"
              value={data.porOperacion.arriendo}
              loading={loading}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Venta"
              value={data.porOperacion.venta}
              loading={loading}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        
      </Row>
      */}
      {/* Charts Row 1 */}
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

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
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
      </Row>

      {/* Detailed Breakdown */}
      <Row gutter={[16, 16]} className="mt-24">
        <Col xs={24} sm={12} md={8}>
          <Card title="Por Tipo">
            {propiedadesPorTipo.map((tipo, index) => (
              <div key={tipo.name} className="mb-12">
                <div
                  className="d-flex justify-between mb-4"
                >
                  <span>{tipo.name}</span>
                  <span>{tipo.value}</span>
                </div>
                <Progress
                  percent={totalPropiedades > 0 ? (tipo.value / totalPropiedades) * 100 : 0}
                  showInfo={false}
                  strokeColor={COLORS[index % COLORS.length]}
                  size="small"
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="Por Estado">
            {propiedadesPorEstado.map((estado, index) => (
              <div key={estado.name} className="mb-12">
                <div
                  className="d-flex justify-between mb-4"
                >
                  <span>{estado.name}</span>
                  <span>{estado.value}</span>
                </div>
                <Progress
                  percent={totalPropiedades > 0 ? (estado.value / totalPropiedades) * 100 : 0}
                  showInfo={false}
                  strokeColor={COLORS[index % COLORS.length]}
                  size="small"
                />
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="Por Operación">
            {propiedadesPorOperacion.map((operacion, index) => (
              <div key={operacion.name} className="mb-12">
                <div
                  className="d-flex justify-between mb-4"
                >
                  <span>{operacion.name}</span>
                  <span>{operacion.value}</span>
                </div>
                <Progress
                  percent={totalPropiedades > 0 ? (operacion.value / totalPropiedades) * 100 : 0}
                  showInfo={false}
                  strokeColor={COLORS[index % COLORS.length]}
                  size="small"
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PropertyStats;
