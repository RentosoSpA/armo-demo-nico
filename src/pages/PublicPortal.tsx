import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Input, Select, Button, ConfigProvider } from 'antd';
import { 
  SearchOutlined, 
  HomeOutlined, 
  BuildOutlined, 
  DollarOutlined, 
  EnvironmentOutlined, 
  FilterOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useFavoritesStore } from '../stores/favoritesStore';
import { FavoriteButton } from '../components/portal/FavoriteButton';
import { MOCK_DATA } from '../services/mock/mockData';
import { getPropertyImage } from '../services/mock/propertyImages';
import type { Propiedad } from '../types/propiedad';

const PublicPortal: React.FC = () => {
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [filteredPropiedades, setFilteredPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedOperation, setSelectedOperation] = useState<string | undefined>();
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites, getFavoritesCount } = useFavoritesStore();

  useEffect(() => {
    setTimeout(() => {
      setPropiedades(MOCK_DATA.propiedades);
      setFilteredPropiedades(MOCK_DATA.propiedades);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let filtered = [...propiedades];
    
    // Filtro de favoritos
    if (showFavorites) {
      filtered = filtered.filter(p => favorites.includes(p.id));
    }
    
    // Resto de filtros
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.comuna?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedType) filtered = filtered.filter(p => p.tipo === selectedType);
    if (selectedOperation) {
      if (selectedOperation === 'venta') filtered = filtered.filter(p => p.venta);
      else if (selectedOperation === 'arriendo') filtered = filtered.filter(p => p.arriendo);
    }
    setFilteredPropiedades(filtered);
  }, [searchTerm, selectedType, selectedOperation, propiedades, showFavorites, favorites]);

  const getPropertyTypes = () => {
    const types = [...new Set(propiedades.map(p => p.tipo))];
    return types.map(t => ({ label: t, value: t }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType(undefined);
    setSelectedOperation(undefined);
    setShowFavorites(false);
  };

  const getPropertyPrice = (p: Propiedad) => {
    // Para propiedades en venta
    if (p.venta && p.propiedadVenta) {
      if (p.propiedadVenta.divisa === 'UF') {
        return `${p.propiedadVenta.precioUF.toLocaleString('es-CL')} UF`;
      }
      return `$${p.propiedadVenta.precioPrincipal.toLocaleString('es-CL')}`;
    }
    
    // Para propiedades en arriendo
    if (p.arriendo && p.propiedadArriendo) {
      if (p.propiedadArriendo.divisa === 'UF') {
        return `${p.propiedadArriendo.precioUF.toLocaleString('es-CL')} UF/mes`;
      }
      return `$${p.propiedadArriendo.precioPrincipal.toLocaleString('es-CL')}/mes`;
    }
    
    // Fallback al precio genérico si existe
    if (p.precio) {
      if (p.divisa === 'UF') {
        return `${p.precio.toLocaleString('es-CL')} UF`;
      }
      return `$${p.precio.toLocaleString('es-CL')}`;
    }
    
    return 'Consultar';
  };

  return (
    <div className="public-portal-wrapper">
      {/* Aurora Background */}
      <div className="aurora-layer">
        <div className="aurora aurora--top-right"></div>
        <div className="aurora aurora--bottom-left"></div>
      </div>

      {/* Main Container con márgenes laterales */}
      <div className="portal-main-container">
        {/* Hero Section */}
        <div className="portal-hero">
          <div className="portal-section-content text-center">
          <div className="badge-premium">
            <HomeOutlined className="icon-glow" />
            <span>Portal Inmobiliario</span>
            <div className="badge-shine"></div>
          </div>
          
          <h1 className="hero-title">
            Encuentra tu{' '}
            <span className="gradient-text">próximo hogar</span>
          </h1>
          
          <p className="hero-subtitle">
            Explora nuestra selección de propiedades exclusivas
          </p>

          {/* Search Container Premium */}
          <ConfigProvider
            theme={{
              token: {
                colorText: 'rgba(255, 255, 255, 0.95)',
                colorTextSecondary: 'rgba(255, 255, 255, 0.85)',
                colorTextPlaceholder: 'rgba(255, 255, 255, 0.92)',
                colorIcon: 'rgb(52, 245, 197)',
                colorBorder: 'rgba(52, 245, 197, 0.35)',
                colorBgContainer: 'rgba(14, 16, 38, 0.65)',
                controlOutline: 'rgba(52, 245, 197, 0.28)',
              },
              components: {
                Input: {
                  activeBorderColor: 'rgb(52, 245, 197)',
                  hoverBorderColor: 'rgba(52, 245, 197, 0.5)',
                },
                Select: {
                  activeBorderColor: 'rgb(52, 245, 197)',
                  hoverBorderColor: 'rgba(52, 245, 197, 0.5)',
                  optionSelectedBg: 'rgba(52, 245, 197, 0.20)',
                  optionActiveBg: 'rgba(52, 245, 197, 0.15)',
                  colorBgContainer: 'rgba(14, 16, 38, 0.65)',
                  colorText: 'rgba(255, 255, 255, 0.95)',
                  colorTextPlaceholder: 'rgba(255, 255, 255, 0.92)',
                },
              },
            }}
          >
            <div className="search-container-premium max-w-4xl mx-auto">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={24} lg={10}>
                  <div className="input-premium">
                    <SearchOutlined className="input-icon" />
                    <Input 
                      size="large" 
                      placeholder="Buscar por ubicación o título..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: '48px' }}
                    />
                  </div>
                </Col>
                <Col xs={12} md={12} lg={5}>
                  <div className="input-premium">
                    <BuildOutlined className="input-icon" />
                    <Select 
                      size="large" 
                      placeholder="Tipo de propiedad" 
                      options={getPropertyTypes()} 
                      value={selectedType} 
                      onChange={setSelectedType} 
                      allowClear 
                      className="w-full"
                    />
                  </div>
                </Col>
                <Col xs={12} md={12} lg={5}>
                  <div className="input-premium">
                    <DollarOutlined className="input-icon" />
                    <Select 
                      size="large" 
                      placeholder="Operación" 
                      options={[
                        { label: 'Venta', value: 'venta' }, 
                        { label: 'Arriendo', value: 'arriendo' }
                      ]} 
                      value={selectedOperation} 
                      onChange={setSelectedOperation} 
                      allowClear 
                      className="w-full"
                    />
                  </div>
                </Col>
                <Col xs={24} md={24} lg={4}>
                  <Button 
                    size="large"
                    icon={<HeartFilled />}
                    onClick={() => setShowFavorites(!showFavorites)}
                    className={`btn-favorites-filter ${showFavorites ? 'active' : ''}`}
                    style={{ width: '100%', height: '48px' }}
                  >
                    Favoritos {getFavoritesCount() > 0 && `(${getFavoritesCount()})`}
                  </Button>
                </Col>
              </Row>
            </div>
          </ConfigProvider>
        </div>
      </div>

      {/* Properties Section */}
      <div className="portal-properties-section">
        <div className="portal-section-content">
          {/* Section Header */}
          <div className="section-header-premium">
            <div className="header-content">
              <div className="header-badge">
                <span className="badge-dot"></span>
                <span className="badge-text">Explora</span>
              </div>
              <h2 className="section-title-premium">
                Propiedades <span className="title-highlight">disponibles</span>
              </h2>
              <p className="section-subtitle">
                {loading ? 'Cargando...' : showFavorites 
                  ? `${filteredPropiedades.length} ${filteredPropiedades.length === 1 ? 'favorito' : 'favoritos'}` 
                  : `${filteredPropiedades.length} propiedades encontradas`
                }
              </p>
            </div>
            
            {(searchTerm || selectedType || selectedOperation || showFavorites) && (
              <Button 
                icon={<FilterOutlined />} 
                onClick={clearFilters}
                className="btn-clear-filters"
              >
                Limpiar Filtros
              </Button>
            )}
          </div>

          {/* Empty state para favoritos */}
          {showFavorites && filteredPropiedades.length === 0 && !loading && (
            <div className="empty-favorites-state">
              <div className="empty-icon">
                <HeartOutlined />
              </div>
              <h3>No tienes favoritos aún</h3>
              <p>Explora nuestras propiedades y marca tus favoritas haciendo clic en el corazón</p>
              <Button 
                type="primary" 
                size="large"
                onClick={() => setShowFavorites(false)}
                className="btn-explore"
              >
                Explorar Propiedades
              </Button>
            </div>
          )}

          {/* Properties Grid */}
          <Row gutter={[32, 32]}>
            {loading ? (
              // Loading Skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <Col key={i} xs={24} sm={12} lg={8}>
                  <div className="skeleton-card-premium">
                    <div className="skeleton-image shimmer"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-line short shimmer"></div>
                      <div className="skeleton-line long shimmer"></div>
                      <div className="skeleton-features">
                        <div className="skeleton-feature shimmer"></div>
                        <div className="skeleton-feature shimmer"></div>
                        <div className="skeleton-feature shimmer"></div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              // Property Cards
              filteredPropiedades.map((p, i) => (
                <Col 
                  key={p.id} 
                  xs={24} 
                  sm={12} 
                  lg={8}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${i * 0.1}s backwards`
                  }}
                >
                  <div 
                    className="property-card-premium"
                    onClick={() => navigate(`/propiedades/${p.id}`)}
                  >
                    {/* Image Wrapper */}
                    <div className="property-image-wrapper">
                      <img 
                        src={getPropertyImage(p.imagenPrincipal) || p.imagenPrincipal || 'https://via.placeholder.com/400x300'} 
                        alt={p.titulo}
                        className="property-image"
                      />
                      <div className="image-overlay"></div>
                      
                      {/* Tags */}
                      <div className="property-tags">
                        {p.venta && (
                          <div className="tag-premium tag-venta">
                            <span>Venta</span>
                            <div className="tag-shine"></div>
                          </div>
                        )}
                        {p.arriendo && (
                          <div className="tag-premium tag-arriendo">
                            <span>Arriendo</span>
                            <div className="tag-shine"></div>
                          </div>
                        )}
                      </div>
                      
                      {/* Favorite Button */}
                      <FavoriteButton propertyId={p.id} />
                    </div>
                    
                    {/* Content */}
                    <div className="property-content">
                      {/* Type Badge */}
                      <div className="property-type">
                        <BuildOutlined className="type-icon" />
                        <span>{p.tipo}</span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="property-title">{p.titulo}</h3>
                      
                      {/* Location */}
                      <div className="property-location">
                        <EnvironmentOutlined className="location-icon pulse" />
                        <span>{p.direccion}, {p.comuna}</span>
                      </div>
                      
                      {/* Features */}
                      <div className="property-features">
                        {p.habitaciones && (
                          <div className="feature-item">
                            <div className="feature-icon">🛏️</div>
                            <span>{p.habitaciones}</span>
                          </div>
                        )}
                        {p.banos && (
                          <div className="feature-item">
                            <div className="feature-icon">🚿</div>
                            <span>{p.banos}</span>
                          </div>
                        )}
                        {(p.areaUsable || p.areaTotal) && (
                          <div className="feature-item">
                            <div className="feature-icon">📐</div>
                            <span>{p.areaUsable || p.areaTotal}m²</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Price */}
                      <div className="property-price-container">
                        <div className="price-label">Precio</div>
                        <div className="property-price">
                          <DollarOutlined className="price-icon" />
                          <span className="price-amount">
                            {getPropertyPrice(p)}
                          </span>
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <button className="btn-view-property">
                        Ver Detalles
                        <ArrowRightOutlined className="btn-arrow" />
                      </button>
                    </div>
                  </div>
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>

      {/* Footer Premium */}
      <footer className="footer-premium">
        <div className="portal-section-content">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="brand-logo">
                <HomeOutlined className="logo-icon" />
                <span className="brand-name">RentOso</span>
              </div>
              <p className="brand-tagline">
                Tu próximo hogar te está esperando
              </p>
            </div>
            
            <div className="footer-links">
              <div className="link-column">
                <h4>Propiedades</h4>
                <a href="#venta">En Venta</a>
                <a href="#arriendo">En Arriendo</a>
                <a href="#destacadas">Destacadas</a>
              </div>
              <div className="link-column">
                <h4>Sobre Nosotros</h4>
                <a href="#nosotros">Quiénes Somos</a>
                <a href="#contacto">Contacto</a>
                <a href="#ayuda">Ayuda</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <span className="copyright">© 2025 RentOso. Todos los derechos reservados.</span>
            <div className="social-links">
              {/* Add social icons here if needed */}
            </div>
          </div>
        </div>
        
        <div className="footer-aurora"></div>
      </footer>
      </div>
    </div>
  );
};

export default PublicPortal;
