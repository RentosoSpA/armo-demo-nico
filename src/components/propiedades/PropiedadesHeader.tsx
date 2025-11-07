import { Row, Typography, Button, Select } from 'antd';
import { PlusOutlined, VerticalAlignTopOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ViewToggle, { cardsTableOptions } from '../common/ViewToggle';
import { usePresetLabels } from '../../hooks/usePresetLabels';
import '../../styles/components/_propiedades.scss';

const { Title } = Typography;

export type ViewMode = 'cards' | 'table';

interface Props {
  onPropietariosClick?: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  estadoFilter: string | null;
  onEstadoFilterChange: (estado: string | null) => void;
}

const PropiedadesHeader = ({ viewMode, onViewModeChange, estadoFilter, onEstadoFilterChange }: Props) => {
  const navigate = useNavigate();
  const { getLabel } = usePresetLabels();
  
  return (
  <Row justify="space-between" align="middle" id="propiedades-header">
    <div>
      <Title level={2} className="title-text mb-0">
        {getLabel('Propiedades', 'Espacios')}
      </Title>
      <div className="paragraph-text paragraph-secondary propiedades-subtitle">
        {getLabel('Administra todas tus propiedades en un solo lugar.', 'Administra todos tus espacios de coworking en un solo lugar.')}
      </div>
    </div>
    <div className="propiedades-header-actions">
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
          placeholder="Filtrar por estado"
          allowClear
          value={estadoFilter}
          onChange={onEstadoFilterChange}
          className="filter-select-gray"
          bordered={false}
          suffixIcon={null}
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
            { label: 'Disponible', value: 'Disponible' },
            { label: 'Reservada', value: 'Reservada' },
            { label: 'Arrendada', value: 'Arrendada' },
            { label: 'Vendida', value: 'Vendida' }
          ]}
        />
        <DownOutlined style={{ fontSize: '12px', color: '#9CA3AF' }} />
      </div>

      <ViewToggle
        value={viewMode}
        onChange={(value) => onViewModeChange(value as ViewMode)}
        options={cardsTableOptions}
      />

      <Button  icon={<VerticalAlignTopOutlined />} onClick={() => {
        console.log('Traer datos');
      }}>
        Importar datos
      </Button>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => navigate('/propiedades/crear')}
        className="agregar-propiedad-btn"
      >
        {getLabel('Agregar propiedad', 'Agregar espacio')}
      </Button>
    </div>
  </Row>
  );
};

export default PropiedadesHeader;
