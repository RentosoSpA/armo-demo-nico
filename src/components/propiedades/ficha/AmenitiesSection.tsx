import React from 'react';
import { Card, Typography, Row, Col, Space, Divider } from 'antd';
import {
  Wifi,
  TreePine,
  Car,
  Tv,
  Utensils,
  Dog,
  Sun,
  Waves,
  DoorOpen,
  Sparkles,
  Shirt,
  Home,
  Building2,
  CheckCircle,
  FileText,
  Key,
  Flag,
  Dumbbell,
  Droplet,
  Flame,
  Zap,
  Package,
  User,
  ShieldCheck,
  Wind,
} from 'lucide-react';
import type { Amenidades } from '../../../types/amenidades';

const { Title, Text } = Typography;

interface AmenitiesSectionProps {
  amenidades: Amenidades;
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ amenidades }) => {
  // Amenidades básicas
  const basicAmenities = [
    { key: 'amoblado', label: 'Amoblado', icon: <Sparkles size={20} /> },
    { key: 'cocina', label: 'Cocina', icon: <Utensils size={20} /> },
    { key: 'mascota', label: 'Mascotas', icon: <Dog size={20} /> },
    { key: 'estacionamiento', label: 'Estacionamiento', icon: <Car size={20} /> },
    { key: 'balcon', label: 'Balcón', icon: <Sun size={20} /> },
    { key: 'jardin', label: 'Jardín', icon: <TreePine size={20} /> },
    { key: 'wifi', label: 'WiFi', icon: <Wifi size={20} /> },
    { key: 'garage', label: 'Garage', icon: <DoorOpen size={20} /> },
    { key: 'zonaFumador', label: 'Zona de Fumador', icon: <Waves size={20} /> },
    { key: 'lavaplatos', label: 'Lavaplatos', icon: <Sparkles size={20} /> },
    { key: 'lavadora', label: 'Lavadora', icon: <Shirt size={20} /> },
    { key: 'tvCable', label: 'TV Cable', icon: <Tv size={20} /> },
  ];

  // Amenidades del condominio/edificio
  const buildingAmenities = [
    { key: 'enCondominio', label: 'En Condominio', icon: <Building2 size={20} /> },
    { key: 'permiteMascotas', label: 'Permite Mascotas', icon: <Dog size={20} /> },
    { key: 'piscina', label: 'Piscina', icon: <Waves size={20} /> },
    { key: 'gimnasio', label: 'Gimnasio', icon: <Dumbbell size={20} /> },
    { key: 'sauna', label: 'Sauna', icon: <Wind size={20} /> },
    { key: 'jacuzzi', label: 'Jacuzzi', icon: <Droplet size={20} /> },
    { key: 'canchaTenis', label: 'Cancha de Tenis', icon: <Flag size={20} /> },
  ];

  // Amenidades adicionales
  const additionalAmenities = [
    { key: 'recibos', label: 'Recibos', icon: <FileText size={20} /> },
    { key: 'llavesOficina', label: 'Llaves en Oficina', icon: <Key size={20} /> },
    { key: 'tieneLetrero', label: 'Tiene Letrero', icon: <Flag size={20} /> },
    { key: 'bodega', label: 'Bodega', icon: <Package size={20} /> },
    { key: 'piezaServicio', label: 'Pieza de Servicio', icon: <User size={20} /> },
    { key: 'regularizada', label: 'Regularizada', icon: <ShieldCheck size={20} /> },
  ];

  // Servicios
  const services = [
    { key: 'agua', label: 'Agua', icon: <Droplet size={20} /> },
    { key: 'caldera', label: 'Caldera', icon: <Flame size={20} /> },
    { key: 'gasNatural', label: 'Gas Natural', icon: <Flame size={20} /> },
    { key: 'luz', label: 'Luz', icon: <Zap size={20} /> },
    { key: 'alcantarillado', label: 'Alcantarillado', icon: <Waves size={20} /> },
  ];

  // Filter available amenities by category
  const availableBasicAmenities = basicAmenities.filter(
    amenity => amenidades[amenity.key as keyof Amenidades] === true
  );

  const availableBuildingAmenities = buildingAmenities.filter(
    amenity => amenidades[amenity.key as keyof Amenidades] === true
  );

  const availableAdditionalAmenities = additionalAmenities.filter(
    amenity => amenidades[amenity.key as keyof Amenidades] === true
  );

  const availableServices = services.filter(
    amenity => amenidades[amenity.key as keyof Amenidades] === true
  );

  const totalAmenities =
    availableBasicAmenities.length +
    availableBuildingAmenities.length +
    availableAdditionalAmenities.length +
    availableServices.length;

  if (!amenidades || totalAmenities === 0) {
    return (
      <Card className="modern-card mb-24">
        <Title level={4}>Amenidades</Title>
        <Text type="secondary">No hay amenidades registradas para esta propiedad.</Text>
      </Card>
    );
  }

  const renderAmenityGrid = (amenitiesList: typeof basicAmenities) => (
    <Row gutter={[16, 16]}>
      {amenitiesList.map((amenity, index) => (
        <Col xs={12} sm={8} md={6} lg={4} key={index}>
          <Card
            size="small"
            className="text-center"
            bodyStyle={{ padding: '12px 8px' }}
          >
            <Space direction="vertical" size={4} className="w-full">
              <div style={{ color: '#34F5C5' }}>{amenity.icon}</div>
              <Text className="font-medium">{amenity.label}</Text>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <Card className="modern-card mb-24">
      <Title level={4}>Amenidades y Servicios</Title>

      {/* Amenidades Básicas */}
      {availableBasicAmenities.length > 0 && (
        <>
          <Title level={5} style={{ marginTop: '16px', marginBottom: '16px' }}>
            Amenidades Básicas
          </Title>
          {renderAmenityGrid(availableBasicAmenities)}
        </>
      )}

      {/* Amenidades del Edificio/Condominio */}
      {availableBuildingAmenities.length > 0 && (
        <>
          <Divider style={{ margin: '24px 0' }} />
          <Title level={5} style={{ marginBottom: '16px' }}>
            Amenidades del Edificio/Condominio
          </Title>
          {renderAmenityGrid(availableBuildingAmenities)}
        </>
      )}

      {/* Amenidades Adicionales */}
      {availableAdditionalAmenities.length > 0 && (
        <>
          <Divider style={{ margin: '24px 0' }} />
          <Title level={5} style={{ marginBottom: '16px' }}>
            Información Adicional
          </Title>
          {renderAmenityGrid(availableAdditionalAmenities)}
        </>
      )}

      {/* Servicios */}
      {availableServices.length > 0 && (
        <>
          <Divider style={{ margin: '24px 0' }} />
          <Title level={5} style={{ marginBottom: '16px' }}>
            Servicios
          </Title>
          {renderAmenityGrid(availableServices)}
        </>
      )}
    </Card>
  );
};

export default AmenitiesSection;
