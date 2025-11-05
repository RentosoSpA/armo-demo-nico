import { Table, Tag, Button, Empty } from 'antd';
import { Eye } from 'lucide-react';
import type { Contrato, Estado } from '../../lib/contratos-mock';

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

  const getEstadoColor = (estado: Estado) => {
    switch (estado) {
      case 'Firmado': return 'green';
      case 'Enviado': return 'blue';
      case 'Pendiente': return 'orange';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
      ellipsis: true
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 120,
      render: (estado: Estado) => (
        <Tag color={getEstadoColor(estado)}>{estado}</Tag>
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
          description="No hay contratos para esta propiedad"
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
