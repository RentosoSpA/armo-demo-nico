import React from 'react';
import { Card, Typography, Row, Col, Space, Descriptions, Divider } from 'antd';
import { MapPin, Home } from 'lucide-react';
import type { Propiedad } from '../../../types/propiedad';
import GoogleMap from '../../common/GoogleMap';

const { Title, Text } = Typography;

interface LocationSectionProps {
  propiedad: Propiedad;
}

const LocationSection: React.FC<LocationSectionProps> = ({ propiedad }) => {
  return (
    <>
      {/* Dirección Detallada */}
      <Card className="modern-card mb-24">
        <Title level={4}>Dirección</Title>
        <Descriptions column={2} bordered>
          {propiedad.direccion && (
            <Descriptions.Item label="Dirección Completa" span={2}>
              <Space>
                <Home size={16} />
                {propiedad.direccion}
              </Space>
            </Descriptions.Item>
          )}
          {propiedad.nombreCalle && (
            <Descriptions.Item label="Calle">
              {propiedad.nombreCalle}
            </Descriptions.Item>
          )}
          {propiedad.numeroCalle && (
            <Descriptions.Item label="Número">
              {propiedad.numeroCalle}
            </Descriptions.Item>
          )}
          {propiedad.unidad && (
            <Descriptions.Item label="Unidad/Depto">
              {propiedad.unidad}
            </Descriptions.Item>
          )}
          {propiedad.letra && (
            <Descriptions.Item label="Letra">
              {propiedad.letra}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Comuna">
            <Space>
              <MapPin size={16} />
              {propiedad.comuna}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Región">
            <Space>
              <MapPin size={16} />
              {propiedad.region}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Mapa */}
      <Card className="modern-card mb-24">
        <Title level={4}>Ubicación en Mapa</Title>
        <GoogleMap
          address={`${propiedad.direccion}, ${propiedad.comuna}, ${propiedad.region}`}
          height={400}
          zoom={15}
        />
        {propiedad.lat && propiedad.lng && (
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              Coordenadas: {propiedad.lat.toFixed(6)}, {propiedad.lng.toFixed(6)}
            </Text>
          </div>
        )}
      </Card>
    </>
  );
};

export default LocationSection;
