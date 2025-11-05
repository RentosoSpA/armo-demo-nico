import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, message, Button, Tag, Row, Col } from 'antd';
import { 
  ArrowLeft, 
  Share2, 
  Bed, 
  Bath, 
  Ruler, 
  MapPin, 
  Calendar,
  Home,
  Mail,
  Phone,
  User,
  CheckCircle2
} from 'lucide-react';
import type { Propiedad } from '../types/propiedad';
import type { Amenidades } from '../types/amenidades';
import { usePropiedadStore } from '../store/propiedadStore';
import type { PropertyImagesResponse } from '../types/document';
import { getImages } from '../services/mock/imagenesServiceMock';
import '../styles/pages/_propiedad-ficha-portal.scss';

const PropiedadFicha: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchPropiedadById, loading } = usePropiedadStore();
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [files, setFiles] = useState<PropertyImagesResponse | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleShare = async () => {
    if (navigator.share && propiedad) {
      try {
        await navigator.share({
          title: propiedad.titulo,
          text: `Mira esta propiedad: ${propiedad.titulo}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success('✓ Enlace copiado al portapapeles');
    }
  };

  const getEstadoConfig = (estado: string) => {
    const configs: Record<string, { color: string; bg: string }> = {
      Disponible: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      Reservada: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      Vendida: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      Arrendada: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    };
    return configs[estado] || { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' };
  };

  const formatPrice = (precio: number, divisa: string = 'CLP') => {
    return `${precio.toLocaleString('es-CL')} ${divisa}`;
  };

  const allImages = files?.files?.map(f => f.url) || [];
  const currentImage = allImages[selectedImageIndex] || propiedad?.imagenPrincipal;

  const getAmenidadesArray = (amenidades?: Amenidades): string[] => {
    if (!amenidades) return [];
    const amenidadesMap: Record<string, string> = {
      amoblado: 'Amoblado',
      cocina: 'Cocina equipada',
      mascota: 'Acepta mascotas',
      estacionamiento: 'Estacionamiento',
      balcon: 'Balcón',
      jardin: 'Jardín',
      wifi: 'WiFi',
      garage: 'Garaje',
      zonaFumador: 'Zona fumador',
      lavaplatos: 'Lavaplatos',
      lavadora: 'Lavadora',
      tvCable: 'TV Cable',
      enCondominio: 'En condominio',
      permiteMascotas: 'Permite mascotas',
      piscina: 'Piscina',
      gimnasio: 'Gimnasio',
      sauna: 'Sauna',
      jacuzzi: 'Jacuzzi',
      bodega: 'Bodega',
      piezaServicio: 'Pieza de servicio',
      agua: 'Agua',
      caldera: 'Caldera',
      gasNatural: 'Gas natural',
      luz: 'Luz',
      alcantarillado: 'Alcantarillado',
    };
    
    return Object.entries(amenidades)
      .filter(([key, value]) => value === true && key !== 'id' && key !== 'propiedadId')
      .map(([key]) => amenidadesMap[key] || key);
  };

  const fetchPropiedad = useCallback(async () => {
    if (!id) return;
    
    try {
      const propiedadData = await fetchPropiedadById(id);
      setPropiedad(propiedadData);
      
      // Try to load images, but don't fail if they're not available
      try {
        const propertyFiles = await getImages(id);
        setFiles(propertyFiles);
      } catch (imgError) {
        console.warn('No se pudieron cargar imágenes adicionales:', imgError);
        // Continue without additional images, don't redirect to 404
        setFiles({ files: [] });
      }
    } catch (error) {
      console.error('Error fetching propiedad:', error);
      message.error('Propiedad no encontrada');
      navigate('/404');
    }
  }, [id, navigate, fetchPropiedadById]);

  useEffect(() => {
    if (id) {
      fetchPropiedad();
    }
  }, [id, fetchPropiedad]);

  if (loading) {
    return (
      <div
        className="d-flex align-center justify-center"
        style={{ minHeight: '400px' }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!propiedad) {
    return null;
  }

  return (
    <div className="propiedad-ficha-portal">
      {/* Back Button */}
      <div className="portal-back-nav">
        <Button
          type="text"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/propiedades')}
          className="portal-back-btn"
        >
          Volver a propiedades
        </Button>
      </div>

      {/* Hero Section - Images Gallery */}
      <div className="portal-hero-section">
        <div className="portal-hero-main-image">
          {currentImage ? (
            <img src={currentImage} alt={propiedad.titulo} />
          ) : (
            <div className="portal-hero-placeholder">
              <Home size={64} />
            </div>
          )}
          
          {/* Estado Badge */}
          <div 
            className="portal-estado-badge"
            style={{
              background: getEstadoConfig(propiedad.estado).bg,
              borderColor: getEstadoConfig(propiedad.estado).color,
              color: getEstadoConfig(propiedad.estado).color
            }}
          >
            {propiedad.estado}
          </div>
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="portal-thumbnails">
            {allImages.slice(0, 5).map((img: string, idx: number) => (
              <div
                key={idx}
                className={`portal-thumbnail ${idx === selectedImageIndex ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(idx)}
              >
                <img src={img} alt={`Vista ${idx + 1}`} />
                {idx === 4 && allImages.length > 5 && (
                  <div className="portal-thumbnail-overlay">
                    +{allImages.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="portal-content-wrapper">
        {/* Left Column - Main Info */}
        <div className="portal-left-column">
          {/* Title & Price Section */}
          <div className="portal-title-section">
            <div className="portal-title-row">
              <h1 className="portal-title">{propiedad.titulo}</h1>
              <Button
                type="text"
                icon={<Share2 size={20} />}
                onClick={handleShare}
                className="portal-share-btn"
              />
            </div>
            
            <div className="portal-location">
              <MapPin size={16} />
              <span>{propiedad.direccion}</span>
            </div>

            <div className="portal-price-section">
              <div className="portal-price-main">
                {formatPrice(
                  propiedad.precio || propiedad.precioVenta || propiedad.propiedadVenta?.precioPrincipal || 0,
                  propiedad.divisa || 'CLP'
                )}
              </div>
              <div className="portal-operation-badge">{propiedad.operacion}</div>
            </div>
          </div>

          {/* Key Features */}
          <div className="portal-features-grid">
            {propiedad.habitaciones && (
              <div className="portal-feature-card">
                <Bed size={24} />
                <div>
                  <div className="portal-feature-value">{propiedad.habitaciones}</div>
                  <div className="portal-feature-label">Dormitorios</div>
                </div>
              </div>
            )}
            {propiedad.banos && (
              <div className="portal-feature-card">
                <Bath size={24} />
                <div>
                  <div className="portal-feature-value">{propiedad.banos}</div>
                  <div className="portal-feature-label">Baños</div>
                </div>
              </div>
            )}
            {(propiedad.superficie_total || propiedad.areaTotal) && (
              <div className="portal-feature-card">
                <Ruler size={24} />
                <div>
                  <div className="portal-feature-value">
                    {propiedad.superficie_total || propiedad.areaTotal}m²
                  </div>
                  <div className="portal-feature-label">Superficie Total</div>
                </div>
              </div>
            )}
            {propiedad.superficie_util && (
              <div className="portal-feature-card">
                <Ruler size={24} />
                <div>
                  <div className="portal-feature-value">{propiedad.superficie_util}m²</div>
                  <div className="portal-feature-label">Superficie Útil</div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="portal-section-card">
            <h2 className="portal-section-title">Descripción</h2>
            <p className="portal-description">
              {propiedad.descripcion || 'Hermosa propiedad disponible. Contáctanos para más información.'}
            </p>
          </div>

          {/* Características */}
          <div className="portal-section-card">
            <h2 className="portal-section-title">Características</h2>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="portal-detail-item">
                  <span className="portal-detail-label">Tipo:</span>
                  <span className="portal-detail-value">{propiedad.tipo}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="portal-detail-item">
                  <span className="portal-detail-label">Operación:</span>
                  <span className="portal-detail-value">{propiedad.operacion}</span>
                </div>
              </Col>
              {propiedad.habitaciones && (
                <Col span={12}>
                  <div className="portal-detail-item">
                    <span className="portal-detail-label">Dormitorios:</span>
                    <span className="portal-detail-value">{propiedad.habitaciones}</span>
                  </div>
                </Col>
              )}
              {propiedad.banos && (
                <Col span={12}>
                  <div className="portal-detail-item">
                    <span className="portal-detail-label">Baños:</span>
                    <span className="portal-detail-value">{propiedad.banos}</span>
                  </div>
                </Col>
              )}
              {propiedad.estacionamientos && (
                <Col span={12}>
                  <div className="portal-detail-item">
                    <span className="portal-detail-label">Estacionamientos:</span>
                    <span className="portal-detail-value">{propiedad.estacionamientos}</span>
                  </div>
                </Col>
              )}
              {propiedad.bodegas && (
                <Col span={12}>
                  <div className="portal-detail-item">
                    <span className="portal-detail-label">Bodegas:</span>
                    <span className="portal-detail-value">{propiedad.bodegas}</span>
                  </div>
                </Col>
              )}
            </Row>
          </div>

          {/* Amenidades */}
          {propiedad.amenidades && getAmenidadesArray(propiedad.amenidades).length > 0 && (
            <div className="portal-section-card">
              <h2 className="portal-section-title">Amenidades</h2>
              <div className="portal-amenities-grid">
                {getAmenidadesArray(propiedad.amenidades).map((amenidad: string, idx: number) => (
                  <div key={idx} className="portal-amenity-item">
                    <CheckCircle2 size={18} />
                    <span>{amenidad}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ubicación */}
          <div className="portal-section-card">
            <h2 className="portal-section-title">Ubicación</h2>
            <div className="portal-location-details">
              <div className="portal-location-icon">
                <MapPin size={24} />
              </div>
              <div>
                <div className="portal-location-address">{propiedad.direccion}</div>
                {propiedad.comuna && (
                  <div className="portal-location-meta">
                    Comuna: {propiedad.comuna}
                  </div>
                )}
                {propiedad.region && (
                  <div className="portal-location-meta">
                    Región: {propiedad.region}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Card (Sticky) */}
        <div className="portal-right-column">
          <div className="portal-contact-card">
            <h3 className="portal-contact-title">¿Interesado en esta propiedad?</h3>
            <p className="portal-contact-subtitle">Contáctanos para más información</p>

            {propiedad.propietario && (
              <div className="portal-agent-info">
                <div className="portal-agent-icon">
                  <User size={24} />
                </div>
                <div>
                  <div className="portal-agent-label">Propietario</div>
                  <div className="portal-agent-name">{propiedad.propietario.nombre}</div>
                </div>
              </div>
            )}

            <div className="portal-contact-buttons">
              <Button
                type="primary"
                size="large"
                icon={<Phone size={18} />}
                block
                className="portal-contact-btn-primary"
              >
                Llamar ahora
              </Button>
              <Button
                size="large"
                icon={<Mail size={18} />}
                block
                className="portal-contact-btn-secondary"
              >
                Enviar mensaje
              </Button>
            </div>

            <div className="portal-property-meta">
              <div className="portal-meta-item">
                <Calendar size={16} />
                <span>Publicado hace 2 días</span>
              </div>
              <div className="portal-meta-item">
                <Home size={16} />
                <span>ID: {propiedad.id.slice(0, 8)}</span>
              </div>
            </div>

            <Button
              type="default"
              block
              onClick={() => navigate(`/propiedades/editar/${propiedad.id}`)}
              className="portal-edit-btn"
            >
              Editar Propiedad
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropiedadFicha;
