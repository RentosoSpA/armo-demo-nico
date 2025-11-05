import { Typography, Button } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ViewToggle, { kanbanListOptions } from '../common/ViewToggle';

const { Title } = Typography;

export type ViewMode = 'kanban' | 'list';

interface Props {
  onNuevoProspecto: () => void;
  onNavigate?: (key: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ProspectosHeader = ({ onNuevoProspecto, onNavigate, viewMode, onViewModeChange }: Props) => (
  <div className="d-flex align-center justify-between mb-24">
    <div>
      <Title level={2} className="title-text mb-0">
        Prospectos
      </Title>
      <div className="paragraph-text paragraph-secondary mb-0">
        Gestiona los prospectos interesados en tus propiedades
      </div>
    </div>

    <div className="d-flex align-center gap-12">
      <ViewToggle
        value={viewMode}
        onChange={(value) => onViewModeChange(value as ViewMode)}
        options={kanbanListOptions}
      />

      {onNavigate && (
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => onNavigate('Oportunidades')}
        >
          Volver a Oportunidades
        </Button>
      )}
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={onNuevoProspecto}
      >
        Nuevo Prospecto
      </Button>
    </div>
  </div>
);

export default ProspectosHeader;
