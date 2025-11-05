import React from 'react';
import { Card, Typography } from 'antd';
import type { Propiedad } from '../../../types/propiedad';

const { Title } = Typography;

interface DescriptionSectionProps {
  propiedad: Propiedad;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ propiedad }) => {
  if (!propiedad.descripcion) {
    return null;
  }

  return (
    <Card className="modern-card mb-24">
      <Title level={4}>Descripción</Title>
      <div className="paragraph-text">{propiedad.descripcion}</div>
    </Card>
  );
};

export default DescriptionSection;
