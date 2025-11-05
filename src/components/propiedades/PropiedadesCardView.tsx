import React, { useState, memo, useMemo, useCallback } from 'react';
import { Card, Row, Col, Typography, Tooltip, Select } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InfoModal from '../common/InfoModal';
import type { Propiedad } from '../../types/propiedad';
import { EstadoPropiedad } from '../../types/propiedad';
import '../../styles/components/_propiedades.scss';

const { Text, Title } = Typography;

interface Props {
  data: Propiedad[];
  loading: boolean;
  onPropiedadClick?: (propiedadId: string) => void;
  onEditClick?: (propiedad: Propiedad) => void;
  onEstadoChange?: (propiedadId: string, newEstado: string) => void;
}

const PropertyCardItem: React.FC<{
  property: Propiedad;
  imageUrl: string | null;
  onPropiedadClick?: (propiedadId: string) => void;
  onEditClick?: (propiedad: Propiedad) => void;
  onEstadoChange?: (propiedadId: string, newEstado: string) => void;
}> = ({ property, imageUrl, onPropiedadClick, onEditClick, onEstadoChange }) => {
  const navigate = useNavigate();
  
  const [selectOpen, setSelectOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getEstadoColor = useCallback((estado: string) => {
    switch (estado) {
      case 'Disponible':
        return '#10b981'; // green-500
      case 'Reservada':
        return '#f59e0b'; // amber-500
      case 'Arrendada':
        return '#3b82f6'; // blue-500
      case 'Vendida':
        return '#ef4444'; // red-500
      default:
        return '#6b7280'; // gray-500
    }
  }, []);

  const getEstadoBgColor = useCallback((estado: string) => {
    switch (estado) {
      case 'Disponible':
        return 'rgba(16, 185, 129, 0.1)'; // green with transparency
      case 'Reservada':
        return 'rgba(245, 158, 11, 0.1)'; // amber with transparency
      case 'Arrendada':
        return 'rgba(59, 130, 246, 0.1)'; // blue with transparency
      case 'Vendida':
        return 'rgba(239, 68, 68, 0.1)'; // red with transparency
      default:
        return 'rgba(107, 114, 128, 0.1)'; // gray with transparency
    }
  }, []);

  const formatPrice = useCallback((value: number, currency: string) => {
    return `${value.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ${currency}`;
  }, []);

  const primaryPrice = useMemo(() => {
    // Get price from the main precio field or from specific venta/arriendo
    const precio = property.precio || property.precioVenta || property.propiedadVenta?.precioPrincipal || property.propiedadArriendo?.precioPrincipal;
    const divisa = property.divisa || property.propiedadVenta?.divisa || property.propiedadArriendo?.divisa || 'CLP';

    if (precio) {
      return formatPrice(precio, divisa);
    }
    return 'Precio no disponible';
  }, [property, formatPrice]);

  const secondaryPrice = useMemo(() => {
    // Show arriendo price if property has both venta and arriendo
    if (property.venta && property.arriendo && property.propiedadArriendo) {
      return `Arriendo: ${formatPrice(property.propiedadArriendo.precioPrincipal, property.propiedadArriendo.divisa)}`;
    }
    return null;
  }, [property, formatPrice]);


  const handleNavigateToOportunidades = useCallback(() => {
    navigate(`/oportunidades?propiedadId=${property.id}&view=kanban`);
  }, [navigate, property.id]);

  const handleNavigateToContratos = useCallback(() => {
    navigate(`/contratos?propiedadId=${property.id}`);
  }, [navigate, property.id]);

  return (
    <div>
      <div
        className="property-card-glass"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }}
      >
        {/* Image Section */}
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          {imageUrl && !imageError ? (
            <>
              {/* Shimmer Loading Animation */}
              {!imageLoaded && (
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.03) 80%, rgba(255,255,255,0.03) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2.5s ease-in-out infinite'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse">
                      <HomeOutlined style={{ fontSize: '56px', color: 'rgba(255,255,255,0.25)' }} />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Real Image */}
              <img
                src={imageUrl}
                alt={property.titulo}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: imageLoaded ? 1 : 0,
                  transform: imageLoaded ? 'scale(1)' : 'scale(1.05)',
                  transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
                }}
              />
            </>
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HomeOutlined style={{ fontSize: '48px', color: 'rgba(255,255,255,0.3)' }} />
            </div>
          )}

          {/* Status Badge - Top Left */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
            <InfoModal message="Cambiar el estado de la propiedad" position="top" disabled={selectOpen}>
              <Select
                value={property.estado}
                onChange={(value) => onEstadoChange?.(property.id, value)}
                onClick={(e) => e.stopPropagation()}
                onDropdownVisibleChange={(open) => setSelectOpen(open)}
                dropdownStyle={{ minWidth: 120, zIndex: 100000 }}
                bordered={false}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  border: `2px solid ${getEstadoColor(property.estado)}`,
                  padding: '4px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: getEstadoColor(property.estado)
                }}
              >
                {Object.values(EstadoPropiedad).map((estado) => (
                  <Select.Option key={estado} value={estado}>
                    <span style={{ color: getEstadoColor(estado), fontWeight: 600 }}>
                      {estado}
                    </span>
                  </Select.Option>
                ))}
              </Select>
            </InfoModal>
          </div>

          {/* Quick Action Icons - Top Right */}
          <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px', zIndex: 10 }}>
            <Tooltip title="Ver prospectos de la propiedad">
              <div
                onClick={handleNavigateToOportunidades}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Users size={16} color="#6b7280" />
              </div>
            </Tooltip>
            <Tooltip title="Ver contratos de la propiedad">
              <div
                onClick={handleNavigateToContratos}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FileText size={16} color="#6b7280" />
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: '20px' }}>
          {/* Title */}
          <Tooltip title={property.titulo}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '16px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.95)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: '1.4'
            }}>
              {property.titulo}
            </h3>
          </Tooltip>

          {/* Property Type */}
          <div style={{
            display: 'inline-block',
            background: getEstadoBgColor(property.estado),
            border: `1px solid ${getEstadoColor(property.estado)}40`,
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 600,
            color: getEstadoColor(property.estado),
            marginBottom: '16px'
          }}>
            {property.tipo}
          </div>

          {/* Price - Main Focus */}
          <div style={{
            textAlign: 'center',
            margin: '16px 0',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.95)',
              lineHeight: '1.4'
            }}>
              {primaryPrice}
            </div>
            {secondaryPrice && (
              <div style={{
                fontSize: '13px',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '4px'
              }}>
                {secondaryPrice}
              </div>
            )}
          </div>

          {/* Location */}
          <Tooltip title={property.direccion}>
            <div style={{
              fontSize: '13px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.6)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: '16px'
            }}>
              {property.direccion}
            </div>
          </Tooltip>

          {/* Features Icons - Aligned Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '12px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '16px'
          }}>
            {(property.habitaciones || 0) > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                <HomeOutlined style={{ fontSize: '18px' }} />
                <span style={{ fontWeight: 500 }}>{property.habitaciones}</span>
              </div>
            )}
            {(property.banos || 0) > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                <UserOutlined style={{ fontSize: '18px' }} />
                <span style={{ fontWeight: 500 }}>{property.banos}</span>
              </div>
            )}
            {(property.areaTotal || 0) > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
              }}>
                <span style={{ fontWeight: 500 }}>{property.areaTotal}m²</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onPropiedadClick?.(property.id)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.25)';
              }}
            >
              Ver
            </button>
            <button
              onClick={() => onEditClick?.(property)}
              style={{
                padding: '12px 20px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize the card component to prevent re-renders when props don't change
const MemoizedPropertyCardItem = memo(PropertyCardItem, (prevProps, nextProps) => {
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.property.estado === nextProps.property.estado &&
    prevProps.property.titulo === nextProps.property.titulo &&
    prevProps.property.precio === nextProps.property.precio &&
    prevProps.imageUrl === nextProps.imageUrl
  );
});

const PropiedadesCardView: React.FC<Props> = ({ data, loading, onPropiedadClick, onEditClick, onEstadoChange }) => {
  // Debug: Log images to verify they're loaded
  if (data && data.length > 0) {
    console.log('📸 PropiedadesCardView - Images check:', data.map(p => ({
      id: p.id,
      titulo: p.titulo,
      imagenPrincipal: p.imagenPrincipal
    })));
  }

  if (loading) {
    return (
      <Row gutter={[16, 16]}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Col key={index} xs={24} sm={12} lg={8} xl={6}>
            <Card loading={true} />
          </Col>
        ))}
      </Row>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="empty-state">
        <div className="property-empty-state">
          <HomeOutlined className="property-empty-icon" />
          <Title level={3} type="secondary">
            No hay propiedades disponibles
          </Title>
          <Text type="secondary">
            Agrega tu primera propiedad para comenzar
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <Row gutter={[16, 16]} className="properties-card-grid">
      {data.map(property => (
        <Col key={property.id} xs={24} sm={12} lg={8} xl={6}>
          <MemoizedPropertyCardItem
            property={property}
            imageUrl={property.imagenPrincipal || null}
            onPropiedadClick={onPropiedadClick}
            onEditClick={onEditClick}
            onEstadoChange={onEstadoChange}
          />
        </Col>
      ))}
    </Row>
  );
};

export default memo(PropiedadesCardView);
