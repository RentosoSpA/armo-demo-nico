import { Card, Button, Tag } from 'antd';
import { Eye, FileText } from 'lucide-react';
import type { Plantilla } from '../../lib/contratos-mock';

interface TemplatesGridProps {
  plantillas: Plantilla[];
  onUseTemplate: (plantilla: Plantilla) => void;
  onPreview: (plantilla: Plantilla) => void;
}

const TemplatesGrid: React.FC<TemplatesGridProps> = ({
  plantillas,
  onUseTemplate,
  onPreview
}) => {
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Arriendo': return 'blue';
      case 'Compra': return 'green';
      case 'Encargo': return 'purple';
      default: return 'default';
    }
  };

  return (
    <div className="templates-grid">
      {plantillas.map(plantilla => (
        <Card key={plantilla.id} className="template-card">
          <div className="template-card-header">
            <FileText size={24} className="template-icon" />
            <Tag color={getTipoColor(plantilla.tipo)}>{plantilla.tipo}</Tag>
          </div>
          
          <h3 className="template-title">{plantilla.titulo}</h3>
          
          <div className="template-meta">
            <span className="template-date">
              Actualizado: {new Date(plantilla.updatedAt).toLocaleDateString('es-ES')}
            </span>
            {plantilla.source === 'upload' && (
              <Tag color="orange">Importado</Tag>
            )}
          </div>

          <div className="template-actions">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => onPreview(plantilla)}
            >
              Vista previa
            </Button>
            <Button
              type="primary"
              onClick={() => onUseTemplate(plantilla)}
            >
              Usar plantilla
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TemplatesGrid;
