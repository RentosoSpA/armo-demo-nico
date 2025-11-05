import { Tag, Button, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import type { Propiedad, PropiedadArriendo, PropiedadVenta } from '../../types/propiedad';

const ColumnasTable = (
  onPropiedadClick?: (propiedadId: string) => void,
  onEditClick?: (propiedad: Propiedad) => void
) => {
  return [
    {
      title: 'Título',
      dataIndex: 'titulo',
      width: 180,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="font-medium">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      width: 100,
      render: (tipo: string) => (
        <Tag
          className="font-medium"
        >
          {tipo}
        </Tag>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: 100,
      render: (estado: string) => {
        const getEstadoColor = (estado: string) => {
          switch (estado) {
            case 'Disponible':
              return 'green';
            case 'Reservada':
              return 'orange';
            case 'Arrendada':
              return 'blue';
            case 'Vendida':
              return 'red';
            default:
              return 'default';
          }
        };
        return <Tag color={getEstadoColor(estado)}>{estado}</Tag>;
      },
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      width: 150,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Propietario',
      dataIndex: 'propietario',
      width: 120,
      ellipsis: true,
      render: (propietario: { nombre: string }) => (
        <Tooltip title={propietario?.nombre || 'N/A'}>
          <span>{propietario?.nombre || 'N/A'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Empresa',
      dataIndex: 'empresa',
      width: 120,
      ellipsis: true,
      render: (empresa: { nombre: string }) => (
        <Tooltip title={empresa?.nombre || 'N/A'}>
          <span>{empresa?.nombre || 'N/A'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Agente',
      dataIndex: 'agente',
      width: 120,
      ellipsis: true,
      render: (agente: { nombre: string }) => (
        <Tooltip title={agente?.nombre || 'No asignado'}>
          <span>{agente?.nombre || 'No asignado'}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Valor Venta',
      dataIndex: 'propiedadVenta',
      width: 120,
      render: (_: PropiedadVenta | undefined, record: Propiedad) => {
        if (record.venta && record.propiedadVenta) {
          return (
            <strong style={{ fontSize: '12px', color: '#ffffff' }}>
              {record.propiedadVenta.precioPrincipal.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}{' '}
              {record.propiedadVenta.divisa}
            </strong>
          );
        }
        return <span style={{ color: '#9CA3AF' }}>0</span>;
      },
    },
    {
      title: 'Valor Arriendo',
      dataIndex: 'arriendo',
      width: 120,
      render: (_: PropiedadArriendo | undefined, record: Propiedad) => {
        if (record.arriendo && record.propiedadArriendo) {
          return (
            <strong style={{ fontSize: '12px', color: '#ffffff' }}>
              {record.propiedadArriendo.precioPrincipal.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}{' '}
              {record.propiedadArriendo.divisa}
            </strong>
          );
        }
        return <span style={{ color: '#9CA3AF' }}>0</span>;
      },
    },
    {
      title: 'Acciones',
      width: 120,
      render: (record: Propiedad) => (
        <div style={{ background: 'transparent', display: 'flex', gap: '8px' }}>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              onPropiedadClick?.(record.id);
            }}
            style={{ background: 'transparent', borderColor: '#33F491', color: '#33F491' }}
          >
            Ver
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            type="default"
            onClick={() => {
              onEditClick?.(record);
            }}
            style={{ background: 'transparent', borderColor: 'rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Editar
          </Button>
        </div>
      ),
    },
  ];
};

export default ColumnasTable;
