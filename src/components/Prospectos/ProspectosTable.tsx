import { Table, Button, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { Prospecto } from '../../types/profile';
import ProspectoOpportunityModal from './ProspectoOpportunityModal';
import InfoModal from '../common/InfoModal';

interface Props {
  data: Prospecto[];
  loading: boolean;
}

const ProspectosTable = ({ data, loading }: Props) => {
  const [selectedProspecto, setSelectedProspecto] = useState<Prospecto | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewProfile = (prospecto: Prospecto) => {
    setSelectedProspecto(prospecto);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProspecto(null);
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'primer_nombre',
      render: (_: any, record: Prospecto) => (
        <div>{`${record.primer_nombre || ''} ${record.segundo_nombre || ''}`.trim()}</div>
      ),
    },
    {
      title: 'Apellido',
      dataIndex: 'primer_apellido',
      render: (_: any, record: Prospecto) => (
        <div>{`${record.primer_apellido || ''} ${record.segundo_apellido || ''}`.trim()}</div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (email: string) => <div>{email}</div>,
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone_e164',
      render: (phone: string) => <div>{phone || '-'}</div>,
    },
    {
      title: 'Acciones',
      render: (_: unknown, record: Prospecto) => {
        return (
          <Tooltip title="Ver perfil">
            <Button 
              type="default" 
              icon={<EyeOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                handleViewProfile(record);
              }}
            >
              Ver perfil
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div className="d-flex flex-column">
      <Table
        id="prospectos-table"
        dataSource={data}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} prospectos`,
          position: ['bottomCenter'],
        }}
        loading={loading}
        rowKey={(record) => record.id || record.email || 'unknown'}
        components={{
          body: {
            row: (props: any) => (
              <InfoModal message="Cambiar estado" position="top">
                <tr {...props} />
              </InfoModal>
            ),
          },
        }}
        onRow={(record) => ({
          onClick: () => handleViewProfile(record),
          style: { cursor: 'pointer' },
        })}
      />

      {selectedProspecto && (
        <ProspectoOpportunityModal
          visible={modalVisible}
          prospecto={selectedProspecto}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProspectosTable;
