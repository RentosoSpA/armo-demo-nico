import { Table, Tag, Button, Tooltip, Select, Card, Row, Col, Typography } from 'antd';
import { EyeOutlined, HomeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import type { Oportunidad } from '../../types/oportunidad';
import { getImage } from '../../services/multimedia/imagenesService';
import '../../styles/responsive-tables.scss';

const { Text } = Typography;

interface Props {
  data: Oportunidad[];
  loading: boolean;
  onOportunidadClick?: (oportunidad: Oportunidad) => void;
  onEstadoChange?: (oportunidadId: string, newEstado: string) => void;
}

const OportunidadesTable = ({ data, loading, onOportunidadClick, onEstadoChange }: Props) => {
  const [propertyImages, setPropertyImages] = useState<Record<string, string>>({});
  const [editingEstado, setEditingEstado] = useState<string | null>(null);

  // Load property images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = data.map(async (oportunidad) => {
        if (!oportunidad.propiedad) return { id: '', url: null };
        try {
          const imageData = await getImage(oportunidad.propiedad.id);
          return { id: oportunidad.propiedad.id, url: imageData.signedUrl };
        } catch (error) {
          return { id: oportunidad.propiedad.id, url: null };
        }
      });
      
      const images = await Promise.all(imagePromises);
      const imageMap = images.reduce((acc, { id, url }) => {
        if (url && id) acc[id] = url;
        return acc;
      }, {} as Record<string, string>);
      
      setPropertyImages(imageMap);
    };

    if (data.length > 0) {
      loadImages();
    }
  }, [data]);

  const getEtapaColor = (etapa: string) => {
    switch (etapa) {
      case 'Exploracion':
        return 'blue';
      case 'Evaluacion':
        return 'orange';
      case 'Visita':
        return 'purple';
      case 'Negociacion':
        return 'yellow';
      case 'Cierre':
        return 'green';
      default:
        return 'default';
    }
  };

  const estadoOptions = [
    { label: 'Exploracion', value: 'Exploracion' },
    { label: 'Evaluacion', value: 'Evaluacion' },
    { label: 'Visita', value: 'Visita' },
    { label: 'Negociacion', value: 'Negociacion' },
    { label: 'Cierre', value: 'Cierre' }
  ];

  const handleEstadoChange = (oportunidadId: string, newEstado: string) => {
    onEstadoChange?.(oportunidadId, newEstado);
    setEditingEstado(null);
  };

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'propiedad',
      render: (propiedad: any) => (
        <div className="d-flex align-center justify-center overflow-hidden">
          {propertyImages[propiedad.id] ? (
            <img 
              src={propertyImages[propiedad.id]} 
              alt={propiedad.titulo}
              className="w-full h-full"
            />
          ) : (
            <HomeOutlined style={{ fontSize: 24, color: '#d9d9d9' }} />
          )}
        </div>
      ),
      width: 100,
    },
    {
      title: 'Propiedad',
      dataIndex: 'propiedad',
      render: (propiedad: any) => (
        <div>
          <div className="font-semibold mb-4" style={{ color: '#ffffff' }}>
            {propiedad.titulo}
          </div>
          <div className="mb-4" style={{ color: '#ffffff' }}>
            📍 {propiedad.direccion}
          </div>
          <div className="text-12">
            <Tag color="blue" className="m-0">
              {propiedad.operacion}
            </Tag>
          </div>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Prospecto',
      dataIndex: 'prospecto',
      render: (prospecto: any) => {
        const nombre = prospecto ? `${prospecto.primer_nombre || ''} ${prospecto.primer_apellido || ''}`.trim() : 'Sin datos';
        return (
          <div>
            <div className="font-semibold mb-4" style={{ color: '#ffffff' }}>
              {nombre || prospecto?.display_name || 'Sin nombre'}
            </div>
            <div style={{ fontSize: '12px', color: '#ffffff', marginBottom: 2 }}>
              📞 {prospecto?.phone_e164 || 'Sin teléfono'}
            </div>
            <div style={{ fontSize: '12px', color: '#ffffff' }}>
              ✉️ {prospecto?.email || 'Sin email'}
            </div>
          </div>
        );
      },
      width: 250,
    },
    {
      title: 'Estado',
      dataIndex: 'etapa',
      render: (etapa: string, record: Oportunidad) => (
        editingEstado === record.id ? (
          <Select
            value={etapa}
            onChange={(value) => handleEstadoChange(record.id, value)}
            onBlur={() => setEditingEstado(null)}
            style={{ 
              width: 120,
              background: '#1b2a3a',
              color: '#9ca3af'
            }}
            styles={{
              popup: {
                root: {
                  background: '#1b2a3a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 1050
                }
              }
            }}
            classNames={{
              popup: {
                root: 'custom-select-dropdown'
              }
            }}
            options={estadoOptions}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <Tag 
            color={getEtapaColor(etapa)}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setEditingEstado(record.id);
            }}
          >
            {etapa}
          </Tag>
        )
      ),
      width: 120,
    },
    {
      title: 'Acciones',
      render: (_: unknown, record: Oportunidad) => (
        <Tooltip title="Ver prospecto">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onOportunidadClick?.(record);
            }}
          >
            Ver
          </Button>
        </Tooltip>
      ),
      width: 100,
    },
  ];

  const renderMobileCard = (oportunidad: Oportunidad) => {
    return (
      <Card
        key={oportunidad.id}
        className="mobile-oportunidad-card"
        onClick={() => onOportunidadClick?.(oportunidad)}
        style={{
          marginBottom: '16px',
          background: 'rgba(31, 41, 55, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(55, 65, 81, 0.5)',
          borderRadius: '12px',
          cursor: 'pointer'
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                background: 'rgba(55, 65, 81, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {propertyImages[oportunidad.propiedad?.id || ''] ? (
                  <img
                    src={propertyImages[oportunidad.propiedad?.id || '']}
                    alt={oportunidad.propiedad?.titulo || 'Propiedad'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <HomeOutlined style={{ fontSize: 32, color: '#d9d9d9' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <Text strong style={{ color: '#ffffff', fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                  {oportunidad.propiedad?.titulo || 'Sin propiedad'}
                </Text>
                <Text style={{ color: '#9ca3af', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                  📍 {oportunidad.propiedad?.direccion || 'Sin dirección'}
                </Text>
                <Tag color="blue" style={{ margin: 0 }}>
                  {oportunidad.propiedad?.operacion || 'N/A'}
                </Tag>
              </div>
            </div>
          </Col>

          <Col span={24}>
            <div style={{ padding: '12px', background: 'rgba(55, 65, 81, 0.3)', borderRadius: '8px' }}>
              <Text strong style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                {oportunidad.prospecto ? `${oportunidad.prospecto.primer_nombre || ''} ${oportunidad.prospecto.primer_apellido || ''}`.trim() || 'Sin nombre' : 'Sin datos'}
              </Text>
              <Text style={{ color: '#9ca3af', fontSize: '12px', display: 'block' }}>
                📞 {oportunidad.prospecto?.phone_e164 || 'Sin teléfono'}
              </Text>
              <Text style={{ color: '#9ca3af', fontSize: '12px', display: 'block' }}>
                ✉️ {oportunidad.prospecto?.email || 'Sin email'}
              </Text>
            </div>
          </Col>

          <Col span={12}>
            <Text type="secondary" style={{ color: '#9ca3af', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
              Estado
            </Text>
            {editingEstado === oportunidad.id ? (
              <Select
                value={oportunidad.etapa}
                onChange={(value) => handleEstadoChange(oportunidad.id, value)}
                onBlur={() => setEditingEstado(null)}
                style={{
                  width: '100%',
                  background: '#1b2a3a',
                  color: '#9ca3af'
                }}
                options={estadoOptions}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <Tag
                color={getEtapaColor(oportunidad.etapa)}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingEstado(oportunidad.id);
                }}
              >
                {oportunidad.etapa}
              </Tag>
            )}
          </Col>

          <Col span={12}>
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onOportunidadClick?.(oportunidad);
              }}
              block
              style={{
                background: 'rgba(55, 65, 81, 0.8)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                color: 'white'
              }}
            >
              Ver Prospecto
            </Button>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <>
      <style>
        {`
          .custom-select-dropdown .ant-select-item-option {
            color: #9ca3af !important;
            background-color: #1b2a3a !important;
          }
          .custom-select-dropdown .ant-select-item-option:hover {
            background-color: #2a3f4f !important;
          }
          .custom-select-dropdown .ant-select-item-option-selected {
            background-color: #33F491 !important;
            color: #222222 !important;
          }
          .ant-select-selector {
            color: #9ca3af !important;
          }
          .ant-select-selection-item {
            color: #9ca3af !important;
          }
        `}
      </style>

      {/* Desktop Table View */}
      <div className="liquid-glass overflow-hidden desktop-table-view" style={{ padding: '24px' }}>
        <Table
          id="oportunidades-table"
          dataSource={data}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} oportunidades`,
            position: ['bottomCenter'],
          }}
          loading={loading}
          rowKey="id"
          style={{
            background: 'transparent'
          }}
        />
      </div>

      {/* Mobile Card View */}
      <div className="mobile-cards-view">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            Cargando...
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            No hay oportunidades para mostrar
          </div>
        ) : (
          data.map(renderMobileCard)
        )}
      </div>
    </>
  );
};

export default OportunidadesTable;