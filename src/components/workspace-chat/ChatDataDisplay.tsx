import React from 'react';
import { Table, Card, Button, Tag, Space, Statistic, Row, Col } from 'antd';
import { Eye, Download, Trash2 } from 'lucide-react';

interface ChatDataDisplayProps {
  dataType: 'propiedades' | 'oportunidades' | 'prospectos' | 'visitas' | 'cobros' | 'dashboard';
  data: any;
  actions: string[];
  onAction: (action: string, item: any) => void;
}

export const ChatDataDisplay: React.FC<ChatDataDisplayProps> = ({
  dataType,
  data,
  actions,
  onAction
}) => {
  if (!data) return null;

  if (dataType === 'dashboard') {
    return (
      <Card size="small" style={{ marginTop: 12 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="Propiedades Disponibles" 
              value={data.propiedades?.disponibles || 0}
              suffix={`/ ${data.propiedades?.total || 0}`}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="Oportunidades Abiertas" 
              value={data.oportunidades?.total || 0}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="Visitas Próximas" 
              value={data.visitas?.total || 0}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic 
              title="Cobros Pendientes" 
              value={data.cobros?.pendientes || 0}
              suffix={`(${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(data.cobros?.monto_total || 0)})`}
            />
          </Col>
        </Row>
      </Card>
    );
  }

  if (!Array.isArray(data) || data.length === 0) return null;

  const renderTable = () => {
    switch (dataType) {
      case 'propiedades':
        return (
          <Table
            dataSource={data}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 5, simple: true }}
            scroll={{ x: 800 }}
            columns={[
              {
                title: 'Título',
                dataIndex: 'titulo',
                key: 'titulo',
                fixed: 'left',
                width: 200,
                ellipsis: true
              },
              {
                title: 'Tipo',
                dataIndex: 'tipo',
                key: 'tipo',
                width: 120
              },
              {
                title: 'Comuna',
                dataIndex: 'comuna',
                key: 'comuna',
                width: 150
              },
              {
                title: 'Precio',
                key: 'precio',
                width: 150,
                render: (_, record) => {
                  const precio = record.precio_venta || record.precio_arriendo;
                  return precio ? `${record.divisa} ${precio.toLocaleString('es-CL')}` : '-';
                }
              },
              {
                title: 'Estado',
                dataIndex: 'estado',
                key: 'estado',
                width: 120,
                render: (estado: string) => (
                  <Tag color={estado === 'Disponible' ? 'green' : 'orange'}>
                    {estado}
                  </Tag>
                )
              },
              {
                title: 'Acciones',
                key: 'actions',
                fixed: 'right',
                width: 100,
                render: (_, record) => (
                  <Space size="small">
                    <Button
                      type="link"
                      size="small"
                      icon={<Eye size={14} />}
                      onClick={() => onAction('ver_detalles', record)}
                    />
                    {actions.includes('exportar_excel') && (
                      <Button
                        type="link"
                        size="small"
                        icon={<Download size={14} />}
                        onClick={() => onAction('exportar_excel', record)}
                      />
                    )}
                  </Space>
                )
              }
            ]}
          />
        );

      case 'oportunidades':
        return (
          <Table
            dataSource={data}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 5, simple: true }}
            scroll={{ x: 600 }}
            columns={[
              {
                title: 'Tipo',
                dataIndex: 'tipo_oportunidad',
                key: 'tipo',
                width: 120
              },
              {
                title: 'Etapa',
                dataIndex: 'etapa_oportunidad',
                key: 'etapa',
                width: 150,
                render: (etapa: string) => <Tag color="blue">{etapa}</Tag>
              },
              {
                title: 'Monto Estimado',
                key: 'monto',
                width: 150,
                render: (_, record) =>
                  record.monto_estimado
                    ? `${record.divisa} ${record.monto_estimado.toLocaleString('es-CL')}`
                    : '-'
              },
              {
                title: 'Actualizado',
                dataIndex: 'fecha_ultima_actualizacion',
                key: 'actualizado',
                width: 120,
                render: (fecha: string) => new Date(fecha).toLocaleDateString('es-CL')
              },
              {
                title: 'Acciones',
                key: 'actions',
                width: 80,
                render: (_, record) => (
                  <Button
                    type="link"
                    size="small"
                    icon={<Eye size={14} />}
                    onClick={() => onAction('ver_detalles', record)}
                  />
                )
              }
            ]}
          />
        );

      case 'visitas':
        return (
          <Table
            dataSource={data}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 5, simple: true }}
            scroll={{ x: 600 }}
            columns={[
              {
                title: 'Fecha y Hora',
                key: 'fecha',
                width: 180,
                render: (_, record) =>
                  new Date(record.fecha_inicio).toLocaleString('es-CL', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })
              },
              {
                title: 'Tipo',
                dataIndex: 'tipo_visita',
                key: 'tipo',
                width: 120
              },
              {
                title: 'Estado',
                dataIndex: 'estado',
                key: 'estado',
                width: 120,
                render: (estado: string) => (
                  <Tag color={estado === 'Confirmada' ? 'green' : 'orange'}>
                    {estado}
                  </Tag>
                )
              },
              {
                title: 'Acciones',
                key: 'actions',
                width: 100,
                render: (_, record) => (
                  <Space size="small">
                    <Button
                      type="link"
                      size="small"
                      icon={<Eye size={14} />}
                      onClick={() => onAction('ver_detalles', record)}
                    />
                    {actions.includes('cancelar') && (
                      <Button
                        type="link"
                        size="small"
                        danger
                        icon={<Trash2 size={14} />}
                        onClick={() => onAction('cancelar', record)}
                      />
                    )}
                  </Space>
                )
              }
            ]}
          />
        );

      case 'cobros':
        return (
          <Table
            dataSource={data}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 5, simple: true }}
            scroll={{ x: 600 }}
            columns={[
              {
                title: 'Concepto',
                dataIndex: 'concepto',
                key: 'concepto',
                width: 200,
                ellipsis: true
              },
              {
                title: 'Monto',
                key: 'monto',
                width: 150,
                render: (_, record) =>
                  `${record.divisa} ${record.monto.toLocaleString('es-CL')}`
              },
              {
                title: 'Vencimiento',
                dataIndex: 'fecha_vencimiento',
                key: 'vencimiento',
                width: 120,
                render: (fecha: string) =>
                  new Date(fecha).toLocaleDateString('es-CL')
              },
              {
                title: 'Estado',
                dataIndex: 'estado',
                key: 'estado',
                width: 140,
                render: (estado: string) => {
                  const color =
                    estado === 'Pagado'
                      ? 'green'
                      : estado === 'Por cobrar'
                      ? 'orange'
                      : 'red';
                  return <Tag color={color}>{estado}</Tag>;
                }
              },
              {
                title: 'Acciones',
                key: 'actions',
                width: 80,
                render: (_, record) => (
                  <Button
                    type="link"
                    size="small"
                    icon={<Eye size={14} />}
                    onClick={() => onAction('ver_detalles', record)}
                  />
                )
              }
            ]}
          />
        );

      default:
        return <Card size="small">Tipo de dato no soportado</Card>;
    }
  };

  return (
    <div className="chat-data-display" style={{ marginTop: 12 }}>
      {renderTable()}
    </div>
  );
};
