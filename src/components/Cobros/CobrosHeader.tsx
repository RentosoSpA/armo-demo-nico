import React from 'react';
import { Button, Typography, Row } from 'antd';
import { Plus, Bell } from 'lucide-react';
import SearchInput from '../common/SearchInput';
import CommonButton from '../common/CommonButton';

const { Title } = Typography;

interface CobrosHeaderProps {
  setBusqueda: (value: string) => void;
  onNuevoCobro: () => void;
  showNotifications?: boolean;
  onNotificationsClick?: () => void;
}

const CobrosHeader: React.FC<CobrosHeaderProps> = ({
  setBusqueda,
  onNuevoCobro,
  showNotifications,
  onNotificationsClick,
}) => {
  return (
    <div className="d-flex align-center justify-between mb-24">
      <Row justify="space-between" align="middle" className="mb-24">
        <div>
          <Title level={2} className="title-text mb-0">
            Cobros
          </Title>
          <div className="paragraph-text paragraph-secondary mb-8">
            Gestiona los cobros y pagos de propiedades.
          </div>
        </div>
      </Row>
      <div className="d-flex align-center gap-16">
        <SearchInput
          placeholder="Buscar cobros..."
          onSearch={setBusqueda}
          style={{ width: 300 }}
        />
        <Button
          icon={<Bell size={20} />}
          onClick={onNotificationsClick}
          style={{
            background: showNotifications ? '#33F491' : 'transparent',
            color: showNotifications ? '#222222' : '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px'
          }}
        >
          Notificaciones
        </Button>
        <CommonButton
          variant="primary"
          icon={Plus}
          onClick={onNuevoCobro}
          style={{
            background: 'transparent',
            border: '2px solid #33F491',
            color: '#33F491'
          }}
          className="nuevo-cobro-btn"
        >
          Nuevo Cobro
        </CommonButton>
      </div>
    </div>
  );
};

export default CobrosHeader;