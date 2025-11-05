import { Typography, Button, Row, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Plus, Bell } from 'lucide-react';
import SearchInput from '../common/SearchInput';
import CommonButton from '../common/CommonButton';
import type { Propiedad } from '../../types/propiedad';
import '../../styles/components/_oportunidades.scss';

const { Title } = Typography;

interface Props {
  onSearch: (value: string) => void;
  onAgregarClick: () => void;
  showNotifications?: boolean;
  onNotificationsClick?: () => void;
  propiedades: Propiedad[];
  selectedPropiedadId: string | null | 'all';
  onSelectPropiedad: (id: string | null) => void;
  stats: {
    encontrados: number;
    evaluados: number;
    enviados: number;
  };
}

const OportunidadesHeader = ({ 
  onSearch, 
  onAgregarClick, 
  showNotifications, 
  onNotificationsClick,
  propiedades,
  selectedPropiedadId,
  onSelectPropiedad,
  stats
}: Props) => {
  return (
    <Row justify="space-between" align="middle" className="oportunidades-header">
      <div>
        <Title level={2} className="title-text mb-0">
          Oportunidades
        </Title>
        <div className="paragraph-text paragraph-secondary">
          Gestiona el pipeline de ventas y califica prospectos.
        </div>
      </div>
      <div className="oportunidades-header-actions">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 11px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '6px',
          color: '#9CA3AF',
          cursor: 'pointer',
          minWidth: '200px'
        }}>
          <Select
            placeholder="Filtrar por propiedad"
            allowClear
            value={selectedPropiedadId}
            onChange={onSelectPropiedad}
            className="filter-select-gray"
            bordered={false}
            suffixIcon={null}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            style={{
              flex: 1,
              color: '#9CA3AF'
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
                root: 'filter-select-dropdown'
              }
            }}
            options={[
              { label: 'Todas las propiedades', value: 'all' },
              ...propiedades.map(p => ({
                value: p.id,
                label: p.titulo
              }))
            ]}
          />
          <DownOutlined style={{ fontSize: '12px', color: '#9CA3AF' }} />
        </div>

        <SearchInput
          placeholder="Buscar oportunidades..."
          onSearch={onSearch}
          className="oportunidades-search"
        />

        <Button
          icon={<Bell size={20} />}
          onClick={onNotificationsClick}
          className={`oportunidades-notifications-btn ${showNotifications ? 'active' : ''}`}
        >
          Notificaciones
        </Button>

        <CommonButton
          variant="primary"
          icon={Plus}
          onClick={onAgregarClick}
          className="agregar-oportunidad-btn"
        >
          Agregar Oportunidad
        </CommonButton>
      </div>
    </Row>
  );
};

export default OportunidadesHeader;
