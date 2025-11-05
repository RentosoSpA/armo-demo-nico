import { Typography, Button, Row } from 'antd';
import { Plus, Bell } from 'lucide-react';
import SearchInput from '../common/SearchInput';
import CommonButton from '../common/CommonButton';
import '../../styles/components/_oportunidades.scss';

const { Title } = Typography;

interface Props {
  onSearch: (value: string) => void;
  onAgregarClick: () => void;
  showNotifications?: boolean;
  onNotificationsClick?: () => void;
}

const OportunidadesHeader = ({ onSearch, onAgregarClick, showNotifications, onNotificationsClick }: Props) => {
  return (
    <Row justify="space-between" align="middle" className="oportunidades-header">
      <div>
        <Title level={2} className="title-text mb-0">
          Oportunidades
        </Title>
        <div className="paragraph-text paragraph-secondary mb-8">
          Gestiona el pipeline de ventas y califica prospectos.
        </div>
      </div>
      <div className="oportunidades-header-actions">
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
          style={{
            background: 'transparent',
            border: '2px solid #33F491',
            color: '#33F491'
          }}
          className="agregar-oportunidad-btn"
        >
          Agregar Oportunidad
        </CommonButton>
      </div>
    </Row>
  );
};

export default OportunidadesHeader;