import { Button, Tooltip } from 'antd';
import { Phone, Mail, Edit } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { Propietario } from '../../types/propietario';

const ColumnasTable = (
  onEditClick?: (propietario: Propietario) => void
): ColumnsType<Propietario> => {
  console.log('ColumnasTable - onEditClick:', !!onEditClick);
  
  return [
  {
    title: '#',
    key: 'index',
    width: '5%',
    render: (_, __, index) => (
      <span className="text-muted-foreground">#{index + 1}</span>
    ),
  },
  {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
    width: '45%',
    render: (nombre: string, record: Propietario) => (
      <div>
        <div className="font-medium text-foreground">{nombre}</div>
        {record.documento && (
          <div className="text-sm text-muted-foreground">{record.tipo_documento}: {record.documento}</div>
        )}
      </div>
    ),
  },
  {
    title: 'Contacto',
    key: 'contacto',
    width: '35%',
    render: (_, record: Propietario) => (
      <div className="space-y-1">
        {record.telefono && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>+{record.codigo_telefonico} {record.telefono}</span>
          </div>
        )}
        {record.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{record.email}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    title: 'Acciones',
    key: 'acciones',
    width: '15%',
    render: (_, record: Propietario) => (
      <div className="flex justify-end">
        {onEditClick && (
          <Tooltip title="Editar propietario">
            <Button
              type="text"
              className="border border-border px-3 py-1 flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(record);
              }}
            >
              <Edit className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Editar</span>
            </Button>
          </Tooltip>
        )}
      </div>
    ),
  },
];
};

export default ColumnasTable;