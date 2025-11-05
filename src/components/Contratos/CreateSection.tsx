import { Card } from 'antd';
import TemplatesGrid from './TemplatesGrid';
import UploadDropzone from './UploadDropzone';
import UploadCard from './UploadCard';
import type { Plantilla } from '../../lib/contratos-mock';

interface CreateSectionProps {
  plantillas: Plantilla[];
  uploadedFile: File | null;
  onUseTemplate: (plantilla: Plantilla) => void;
  onPreviewTemplate: (plantilla: Plantilla) => void;
  onFileSelect: (file: File) => void;
  onMakeEditable: () => void;
  makeEditableLoading?: boolean;
}

const CreateSection: React.FC<CreateSectionProps> = ({
  plantillas,
  uploadedFile,
  onUseTemplate,
  onPreviewTemplate,
  onFileSelect,
  onMakeEditable,
  makeEditableLoading = false
}) => {
  return (
    <div className="create-section">
      <h2 className="section-title">Crea tu propio contrato</h2>
      <div className="templates-grid-container">
        <TemplatesGrid
          plantillas={plantillas}
          onUseTemplate={onUseTemplate}
          onPreview={onPreviewTemplate}
        />

        <Card className="template-card upload-template-card">
          <div className="upload-card-content">
            <h3 className="upload-title">Importa tus propios documentos</h3>
            {!uploadedFile ? (
              <UploadDropzone onFileSelect={onFileSelect} />
            ) : (
              <UploadCard
                fileName={uploadedFile.name}
                onMakeEditable={onMakeEditable}
                loading={makeEditableLoading}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateSection;
