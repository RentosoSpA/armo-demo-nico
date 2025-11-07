import { Table, Tag, Button, Empty } from 'antd';
import { Eye } from 'lucide-react';
import type { Contrato, Estado } from '../../lib/contratos-mock';
import { usePresetStore } from '../../store/presetStore';
import { usePresetLabels } from '../../hooks/usePresetLabels';

interface ContractsTableProps {
  contratos: Contrato[];
  loading?: boolean;
  onView: (contrato: Contrato) => void;
}

const ContractsTable: React.FC<ContractsTableProps> = ({
  contratos,
  loading = false,
  onView
}) => {
  const { activePreset } = usePresetStore();
  const { getLabel } = usePresetLabels();

  const getEstadoColor = (estado: string) => {
    if (activePreset === 'coworking') {
      switch (estado) {
        case 'activa': return 'green';
        case 'renovacion_pendiente': return 'orange';
        case 'suspendida': return 'red';
        case 'cancelada': return 'default';
        default: return 'default';
      }
    }
    
    // Estados inmobiliaria
    switch (estado) {
      case 'Firmado': 
      case 'firmado': return 'green';
      case 'Enviado':
      case 'enviado': return 'blue';
      case 'Pendiente':
      case 'pendiente': return 'orange';
      case 'anulado': return 'red';
      default: return 'default';
    }
  };

  const formatEstado = (estado: string) => {
    if (activePreset === 'coworking') {
      const estadosMap: Record<string, string> = {
        'activa': 'Activa',
        'renovacion_pendiente': 'Renovación Pendiente',
        'suspendida': 'Suspendida',
        'cancelada': 'Cancelada'
      };
      return estadosMap[estado] || estado;
    }
    return estado;
  };

  const columns = [
    {
      title: activePreset === 'coworking' ? 'Plan / Miembro' : 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
      ellipsis: true
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 180,
      render: (estado: string) => (
        <Tag color={getEstadoColor(estado)}>{formatEstado(estado)}</Tag>
      )
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 100,
      render: (_: any, record: Contrato) => (
        <Button
          type="text"
          size="small"
          icon={<Eye size={16} />}
          onClick={() => onView(record)}
        >
          Ver
        </Button>
      )
    }
  ];

  return (
    <div className="contracts-table-container">
      {contratos.length === 0 && !loading ? (
        <Empty
          description={getLabel(
            'No hay contratos para esta propiedad',
            'No hay membresías para este espacio'
          )}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="contracts-empty-state"
        />
      ) : (
        <Table
          columns={columns}
          dataSource={contratos}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="contracts-table"
        />
      )}
    </div>
  );
};

export default ContractsTable;
