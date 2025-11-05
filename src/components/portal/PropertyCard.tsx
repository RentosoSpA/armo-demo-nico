import React, { useEffect } from 'react';
import { Card, Typography, Tag, Space, Skeleton, Image } from 'antd';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import type { Propiedad } from '../../types/propiedad';
import { usePortalStore } from '../../store/portalStore';

const { Title, Text } = Typography;

interface PropertyCardProps {
  propiedad: Propiedad;
  onClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ propiedad, onClick }) => {
  const { fetchPropertyImage, imageCache, imageLoadingCache } = usePortalStore();

  const thumbnailUrl = imageCache[propiedad.id];
  const imageLoading = imageLoadingCache[propiedad.id] || false;

  useEffect(() => {
    // Only fetch if not already cached and not currently loading
    if (thumbnailUrl === undefined && !imageLoading) {
      fetchPropertyImage(propiedad.id);
    }
  }, [propiedad.id, thumbnailUrl, imageLoading, fetchPropertyImage]);

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      Disponible: 'green',
      Reservada: 'orange',
      Vendida: 'blue',
      Arrendada: 'purple',
    };
    return colors[estado] || 'default';
  };

  const formatPrice = (price: number, divisa: string) => {
    if (divisa === 'CLP') {
      return `$${price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `${price.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${divisa}`;
  };

  const renderPrice = () => {
    if (propiedad.arriendo && propiedad.propiedadArriendo) {
      return (
        <div>
          <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
            {formatPrice(
              propiedad.propiedadArriendo.precioPrincipal,
              propiedad.propiedadArriendo.divisa
            )}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            /mes
          </Text>
        </div>
      );
    }

    if (propiedad.venta && propiedad.propiedadVenta) {
      return (
        <div>
          <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
            {formatPrice(propiedad.propiedadVenta.precioPrincipal, propiedad.propiedadVenta.divisa)}
          </Text>
        </div>
      );
    }

    return <Text type="secondary">Precio no disponible</Text>;
  };

  return (
    <Card
      hoverable
      className="d-flex flex-column h-full cursor-pointer overflow-hidden"
      bodyStyle={{
        padding: 0,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
      cover={
        <div className="overflow-hidden position-relative">
          {imageLoading ? (
            <div style={{ 
              height: '200px', 
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.05)'
            }}>
              <Skeleton.Image
                active
                style={{
                  width: '100%',
                  height: '200px'
                }}
              />
            </div>
          ) : thumbnailUrl ? (
            <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
              <Image
                src={thumbnailUrl}
                alt={propiedad.titulo}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
                preview={false}
              />
            </div>
          ) : (
            <div
              style={{
                height: '200px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.05)'
              }}
            >
              <Text type="secondary">Sin imagen</Text>
            </div>
          )}
          <div
            className="position-absolute"
            style={{
              top: '12px',
              left: '12px',
              zIndex: 10
            }}
          >
            <Tag color={getEstadoColor(propiedad.estado)} className="m-0">
              {propiedad.estado}
            </Tag>
          </div>
        </div>
      }
    >
      <div className="d-flex flex-column p-16">
        {/* Title */}
        <Title level={5} className="m-0 mb-8">
          {propiedad.titulo}
        </Title>

        {/* Location */}
        <Space className="mb-12">
          <MapPin size={14} style={{ color: '#666' }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {propiedad.comuna}, {propiedad.region}
          </Text>
        </Space>

        {/* Property Details */}
        <Space size="small" className="mb-12">
          <Space size={4}>
            <Bed size={14} style={{ color: '#666' }} />
            <Text style={{ fontSize: 12 }}>{propiedad.habitaciones}</Text>
          </Space>
          <Space size={4}>
            <Bath size={14} style={{ color: '#666' }} />
            <Text style={{ fontSize: 12 }}>{propiedad.banos}</Text>
          </Space>
          <Space size={4}>
            <Square size={14} style={{ color: '#666' }} />
            <Text style={{ fontSize: 12 }}>{propiedad.areaTotal}m²</Text>
          </Space>
        </Space>

        {/* Price */}
        <div className="mb-12">{renderPrice()}</div>

        {/* Tags */}
        <Space size={8} style={{ marginTop: 'auto' }}>
          <Tag
            color="blue"
            className="m-0"
          >
            {propiedad.tipo}
          </Tag>
          {propiedad.arriendo && (
            <Tag
              color="orange"
              className="m-0"
            >
              Arriendo
            </Tag>
          )}
          {propiedad.venta && (
            <Tag
              color="green"
              className="m-0"
            >
              Venta
            </Tag>
          )}
        </Space>
      </div>
    </Card>
  );
};

export default PropertyCard;
