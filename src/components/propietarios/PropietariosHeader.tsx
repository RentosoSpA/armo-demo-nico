import { Row, Typography, Button } from 'antd';
import { Plus } from 'lucide-react';

const { Title } = Typography;

interface Props {
  title?: string;
  subtitle?: string;
  onAddClick?: () => void;
  onAgregarClick?: () => void;
  onNavigate?: (key: string) => void;
}

const PropietariosHeader = ({ title, subtitle, onAddClick, onAgregarClick }: Props) => (
  <Row justify="space-between" align="middle" className="mb-24" id="propietarios-header">
    <div>
      <Title level={2} className="title-text mb-0">
        {title || 'Propietarios'}
      </Title>
      <div className="paragraph-text paragraph-secondary mb-0">
        {subtitle || 'Administra todos los propietarios de tu empresa.'}
      </div>
    </div>
    <div className="d-flex align-center gap-12">



      <Button
        type="primary"
        icon={<Plus size={16} />}
        onClick={onAddClick || onAgregarClick}
        className="anadir-propietario-btn"
      >
        Añadir Propietario
      </Button>
    </div>
  </Row>
);

export default PropietariosHeader;