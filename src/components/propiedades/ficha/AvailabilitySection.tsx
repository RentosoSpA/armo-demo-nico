import React from 'react';
import { Card, Typography, Space } from 'antd';
import type { Propiedad } from '../../../types/propiedad';
import { CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface AvailabilitySectionProps {
  propiedad: Propiedad;
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({ propiedad }) => {
  // Only show for rental properties with availability dates
  if (!propiedad.arriendo || !propiedad.propiedadArriendo) {
    return null;
  }

  const { disponibleDesde, disponibleHasta } = propiedad.propiedadArriendo;

  // Don't render if there are no availability dates
  if (!disponibleDesde && !disponibleHasta) {
    return null;
  }

  return (
    <Card className="modern-card mb-24">
      <Title level={4}>Disponibilidad</Title>
      <Space direction="vertical" size="middle" className="w-full">
        {disponibleDesde && (
          <div>
            <Text strong>
              <CalendarOutlined /> Disponible desde:
            </Text>{' '}
            <Text>{new Date(disponibleDesde).toLocaleDateString()}</Text>
          </div>
        )}
        {disponibleHasta && (
          <div>
            <Text strong>
              <CalendarOutlined /> Disponible hasta:
            </Text>{' '}
            <Text>{new Date(disponibleHasta).toLocaleDateString()}</Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default AvailabilitySection;
