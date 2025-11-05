import React from 'react';
import { Card, Typography, Descriptions, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { Bed, Bath, Square, Building } from 'lucide-react';
import type { Propiedad } from '../../../types/propiedad';

const { Title } = Typography;

interface PropertyDetailsProps {
  propiedad: Propiedad;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ propiedad }) => {
  return (
    <Card className="modern-card mb-24">
      <Title level={4}>Detalles de la Propiedad</Title>
      <Descriptions column={2} bordered>
        <Descriptions.Item label="Tipo de Propiedad">
          <Space>{propiedad.tipo}</Space>
        </Descriptions.Item>
        <Descriptions.Item label="Área Total">
          <Space>
            <Square size={16} />
            {propiedad.areaTotal} m²
          </Space>
        </Descriptions.Item>
        {propiedad.areaUsable && (
          <Descriptions.Item label="Área Usable">
            <Space>
              <Square size={16} />
              {propiedad.areaUsable} m²
            </Space>
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Habitaciones">
          <Space>
            <Bed size={16} />
            {propiedad.habitaciones}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Baños">
          <Space>
            <Bath size={16} />
            {propiedad.banos}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Piso">
          <Space>
            <Building size={16} />
            {propiedad.piso}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de Construcción">
          <Space>
            <CalendarOutlined />
            {propiedad.fechaConstruccion ? 
              new Date(propiedad.fechaConstruccion).toLocaleDateString() : 
              'No especificada'}
          </Space>
        </Descriptions.Item>
        {propiedad.arriendo && propiedad.propiedadArriendo && (
          <Descriptions.Item label="Gastos Comunes Incluidos">
            {propiedad.propiedadArriendo.incluyeGastosComunes ? 'Sí' : 'No'}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
};

export default PropertyDetails;
