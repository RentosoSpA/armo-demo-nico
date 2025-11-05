import { Table } from 'antd';
import ColumnasTable from './ColumnasTable';
import type { Propiedad } from '../../types/propiedad';

interface Props {
  data: Propiedad[];
  loading: boolean;
  onPropiedadClick?: (propiedadId: string) => void;
  onEditClick?: (propiedad: Propiedad) => void;
}

const PropiedadesTable = ({ data, loading, onPropiedadClick, onEditClick }: Props) => (
  <Table
    id="propiedades-table"
    dataSource={data}
    columns={ColumnasTable(onPropiedadClick, onEditClick)}
    pagination={{
      pageSize: 6,
      showSizeChanger: false,
      position: ['bottomCenter'],
    }}
    loading={loading}
    rowKey="id"
    scroll={{ x: 1800 }}
  />
);

export default PropiedadesTable;
