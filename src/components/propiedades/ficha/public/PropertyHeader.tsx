import React from 'react';
import { Card, Typography, Row, Col, Tag } from 'antd';
import type { Propiedad } from '../../../../types/propiedad';

const { Title, Text } = Typography;

interface PropertyHeaderProps {
  propiedad: Propiedad;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ propiedad }) => {
  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      Disponible: 'green',
      Reservada: 'orange',
      Vendida: 'blue',
      Arrendada: 'purple',
    };
    return colors[estado] || 'default';
  };

  return (
    <Card className="mb-24">
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2} className="m-0">
            {propiedad.titulo}
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            {propiedad.direccion}
          </Text>
        </Col>
        <Col>
          <Tag color={getEstadoColor(propiedad.estado)}>{propiedad.estado}</Tag>
        </Col>
      </Row>
    </Card>
  );
};

export default PropertyHeader;
