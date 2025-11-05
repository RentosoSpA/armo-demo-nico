import React, { useState } from 'react';
import { Table, Tag, Button, Typography, Tooltip, Select, Card, Row, Col } from 'antd';
import { Edit } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { Cobro, EstadoCobro } from '../../types/cobro';
import { currencyFormatter } from '../../utils/formatters';
import { getPropertyImage } from '../../services/mock/propertyImages';
import '../../styles/responsive-tables.scss';

const { Text } = Typography;

interface CobrosTableProps {
  data: Cobro[];
  loading?: boolean;
  onCobroClick: (cobro: Cobro) => void;
  onEstadoChange?: (cobroId: string, newEstado: EstadoCobro) => void;
}

const CobrosTable: React.FC<CobrosTableProps> = ({
  data,
  loading,
  onCobroClick,
  onEstadoChange,
}) => {
  const [editingEstado, setEditingEstado] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const getEstadoColor = (estado: EstadoCobro) => {
    switch (estado) {
      case 'Pagado':
        return 'success';
      case 'Por cobrar':
        return 'processing';
      case 'Atrasado':
        return 'error';
      case 'Cobrado parcialmente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const estadoOptions = [
    { label: 'Por cobrar', value: 'Por cobrar' },
    { label: 'Pagado', value: 'Pagado' },
    { label: 'Atrasado', value: 'Atrasado' },
    { label: 'Cobrado parcialmente', value: 'Cobrado parcialmente' }
  ];

  const handleEstadoChange = (cobroId: string, newEstado: EstadoCobro) => {
    onEstadoChange?.(cobroId, newEstado);
    setEditingEstado(null);
  };

  const columns: ColumnsType<Cobro> = [
    {
      title: 'Imagen',
      dataIndex: 'propiedad',
      render: (propiedad: any, record: Cobro) => {
        const imageUrl = getPropertyImage(propiedad.imagenUrl);
        return (
          <div className="cobro-image-container" style={{ width: 80, height: 80, minWidth: 80, minHeight: 80 }}>
            {!imageError[record.id] && imageUrl ? (
              <>
                {!imageLoaded[record.id] && (
                  <div className="cobro-image-shimmer" />
                )}
                <img 
                  src={imageUrl} 
                  alt={propiedad.titulo}
                  className={`cobro-image ${imageLoaded[record.id] ? 'loaded' : ''}`}
                  onLoad={() => setImageLoaded(prev => ({ ...prev, [record.id]: true }))}
                  onError={() => setImageError(prev => ({ ...prev, [record.id]: true }))}
                />
              </>
            ) : (
              <div className="cobro-image-fallback" />
            )}
          </div>
        );
      },
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
      title: 'Cliente',
      dataIndex: 'cliente',
      render: (cliente: any) => (
        <div>
          <div className="font-semibold mb-4" style={{ color: '#ffffff' }}>
            {cliente.nombre}
          </div>
          <div style={{ fontSize: '12px', color: '#ffffff', marginBottom: 2 }}>
            📞 {cliente.telefono}
          </div>
          <div style={{ fontSize: '12px', color: '#ffffff' }}>
            ✉️ {cliente.email}
          </div>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Estado de Pago',
      dataIndex: 'estado',
      render: (estado: EstadoCobro, record: Cobro) => (
        editingEstado === record.id ? (
          <Select
            value={estado}
            onChange={(value) => handleEstadoChange(record.id, value as EstadoCobro)}
            onBlur={() => setEditingEstado(null)}
            style={{
              width: 180,
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
            color={getEstadoColor(estado)}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setEditingEstado(record.id);
            }}
          >
            {estado}
          </Tag>
        )
      ),
      width: 180,
    },
    {
      title: 'Monto',
      key: 'monto',
      width: 120,
      render: (_, record) => {
        const montoTotal = record.monto;
        const montoAbonado = record.montoAbonado || 0;
        const montoPendiente = montoTotal - montoAbonado;

        return (
          <div>
            <Text strong style={{ color: '#ffffff' }}>{currencyFormatter(montoTotal)}</Text>
            {record.estado === 'Cobrado parcialmente' && (
              <>
                <br />
                <Text type="secondary" className="text-11" style={{ color: '#ffffff' }}>
                  Abonado: {currencyFormatter(montoAbonado)}
                </Text>
                <br />
                <Text type="warning" className="text-11" style={{ color: '#ffffff' }}>
                  Pendiente: {currencyFormatter(montoPendiente)}
                </Text>
              </>
            )}
          </div>
        );
      },
    },
    {
      title: 'Fecha Vencimiento',
      dataIndex: 'fechaVencimiento',
      key: 'fechaVencimiento',
      width: 120,
      render: (fecha: Date) => (
        <Text style={{ color: '#ffffff' }}>{new Date(fecha).toLocaleDateString('es-CO')}</Text>
      ),
    },
    {
      title: 'Acciones',
      render: (_, record) => (
        <Tooltip title="Editar estado del cobro">
          <Button
            type="default"
            shape="circle"
            icon={<Edit size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              setEditingEstado(record.id);
            }}
          />
        </Tooltip>
      ),
      width: 100,
    },
  ];

  const renderMobileCard = (cobro: Cobro) => {
    const montoTotal = cobro.monto;
    const montoAbonado = cobro.montoAbonado || 0;
    const montoPendiente = montoTotal - montoAbonado;

    return (
      <Card
        key={cobro.id}
        className="mobile-cobro-card"
        onClick={() => onCobroClick(cobro)}
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
              <div className="cobro-mobile-image-container" style={{ width: 80, height: 80, minWidth: 80, minHeight: 80 }}>
                {(() => {
                  const imageUrl = getPropertyImage(cobro.propiedad.imagenUrl);
                  return !imageError[cobro.id] && imageUrl ? (
                    <>
                      {!imageLoaded[cobro.id] && (
                        <div className="cobro-image-shimmer" />
                      )}
                      <img
                        src={imageUrl}
                        alt={cobro.propiedad.titulo}
                        className={`cobro-mobile-image ${imageLoaded[cobro.id] ? 'loaded' : ''}`}
                        onLoad={() => setImageLoaded(prev => ({ ...prev, [cobro.id]: true }))}
                        onError={() => setImageError(prev => ({ ...prev, [cobro.id]: true }))}
                      />
                    </>
                  ) : (
                    <div className="cobro-image-fallback" />
                  );
                })()}
              </div>
              <div style={{ flex: 1 }}>
                <Text strong style={{ color: '#ffffff', fontSize: '16px', display: 'block', marginBottom: '4px' }}>
                  {cobro.propiedad.titulo}
                </Text>
                <Text style={{ color: '#9ca3af', fontSize: '12px', display: 'block' }}>
                  📍 {cobro.propiedad.direccion}
                </Text>
              </div>
            </div>
          </Col>

          <Col span={24}>
            <div style={{ padding: '12px', background: 'rgba(55, 65, 81, 0.3)', borderRadius: '8px' }}>
              <Text strong style={{ color: '#ffffff', display: 'block', marginBottom: '8px' }}>
                {cobro.cliente.nombre}
              </Text>
              <Text style={{ color: '#9ca3af', fontSize: '12px', display: 'block' }}>
                📞 {cobro.cliente.telefono}
              </Text>
              <Text style={{ color: '#9ca3af', fontSize: '12px', display: 'block' }}>
                ✉️ {cobro.cliente.email}
              </Text>
            </div>
          </Col>

          <Col span={12}>
            <Text type="secondary" style={{ color: '#9ca3af', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
              Estado
            </Text>
            {editingEstado === cobro.id ? (
              <Select
                value={cobro.estado}
                onChange={(value) => handleEstadoChange(cobro.id, value as EstadoCobro)}
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
                color={getEstadoColor(cobro.estado)}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingEstado(cobro.id);
                }}
              >
                {cobro.estado}
              </Tag>
            )}
          </Col>

          <Col span={12}>
            <Text type="secondary" style={{ color: '#9ca3af', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
              Monto
            </Text>
            <Text strong style={{ color: '#ffffff', display: 'block' }}>
              {currencyFormatter(montoTotal)}
            </Text>
            {cobro.estado === 'Cobrado parcialmente' && (
              <>
                <Text style={{ color: '#9ca3af', fontSize: '11px', display: 'block' }}>
                  Abonado: {currencyFormatter(montoAbonado)}
                </Text>
                <Text style={{ color: '#fbbf24', fontSize: '11px', display: 'block' }}>
                  Pendiente: {currencyFormatter(montoPendiente)}
                </Text>
              </>
            )}
          </Col>

          <Col span={12}>
            <Text type="secondary" style={{ color: '#9ca3af', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
              Vencimiento
            </Text>
            <Text style={{ color: '#ffffff', display: 'block' }}>
              {new Date(cobro.fechaVencimiento).toLocaleDateString('es-CO')}
            </Text>
          </Col>

          <Col span={12}>
            <Button
              type="default"
              icon={<Edit size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                setEditingEstado(cobro.id);
              }}
              block
              style={{
                background: 'rgba(55, 65, 81, 0.8)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                color: 'white'
              }}
            >
              Editar Estado
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
      <div className="liquid-glass overflow-hidden desktop-table-view">
        <Table
          dataSource={data}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} cobros`,
            position: ['bottomCenter'],
          }}
          loading={loading}
          rowKey="id"
          style={{
            background: 'transparent'
          }}
          onRow={(record) => ({
            onClick: () => onCobroClick(record),
            style: { cursor: 'pointer' },
          })}
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
            No hay cobros para mostrar
          </div>
        ) : (
          data.map(renderMobileCard)
        )}
      </div>
    </>
  );
};

export default CobrosTable;