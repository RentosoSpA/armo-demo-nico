import React, { useEffect } from 'react';
import { Row, Col, Space, Skeleton, Typography } from 'antd';
import { useParams, Navigate } from 'react-router-dom';
import { PortalFilters, PropertyCard } from '../components/portal';
import { usePortalStore } from '../store/portalStore';

const Portal: React.FC = () => {
  const { empresaNombre } = useParams<{ empresaNombre: string }>();
  const {
    empresa,
    empresaError,
    propiedades,
    filteredPropiedades,
    loading,
    error,
    fetchEmpresa,
    fetchPropiedades,
    setFilteredPropiedades,
  } = usePortalStore();

  useEffect(() => {
    if (empresaNombre) {
      fetchEmpresa(decodeURIComponent(empresaNombre));
    }
  }, [empresaNombre, fetchEmpresa]);

  useEffect(() => {
    if (empresa?.id) {
      fetchPropiedades(empresa.id);
    }
  }, [empresa?.id, fetchPropiedades]);

  // Redirect if empresa not found
  if (empresaError) {
    return <Navigate to="/404" replace />;
  }
  return (
    <Space direction="vertical" size={16} className="w-full">
      <Row>
        <PortalFilters propiedades={propiedades} onFilterChange={setFilteredPropiedades} />
        <Col span={24} className="mt-24">
          {error && (
            <Typography.Text type="danger" className="d-block mb-16">
              {error}
            </Typography.Text>
          )}
          <Typography.Text type="secondary" className="d-block mb-16">
            {loading ? 'Cargando...' : `${filteredPropiedades.length} propiedades encontradas`}
          </Typography.Text>
          <Row gutter={[16, 16]}>
            {loading ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Skeleton.Image
                    active
                    className="w-full"
                  />
                </Col>
              ))
            ) : filteredPropiedades.length > 0 ? (
              filteredPropiedades.map(prop => (
                <Col key={prop.id} xs={24} sm={12} md={8} lg={6}>
                  <PropertyCard
                    propiedad={prop}
                    onClick={() => {
                      window.open(
                        `${window.location.origin}/portal/${encodeURIComponent(empresa?.nombre || '')}/propiedad/${prop.id}`,
                        '_self'
                      );
                    }}
                  />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <div
                  className="text-center"
                >
                  <Typography.Title level={4} type="secondary">
                    No se encontraron propiedades
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    Intenta ajustar los filtros de búsqueda
                  </Typography.Text>
                </div>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Space>
  );
};

export default Portal;
