import { Card, Button } from 'antd';
import { FileText, Sparkles } from 'lucide-react';

interface UploadCardProps {
  fileName: string;
  onMakeEditable: () => void;
  loading?: boolean;
}

const UploadCard: React.FC<UploadCardProps> = ({
  fileName,
  onMakeEditable,
  loading = false
}) => {
  return (
    <Card className="upload-card">
      <div className="upload-card-content">
        <FileText size={48} className="upload-card-icon" />
        <div className="upload-card-info">
          <h3>{fileName}</h3>
          <p>Archivo cargado correctamente</p>
        </div>
      </div>
      <Button
        type="primary"
        icon={<Sparkles size={16} />}
        onClick={onMakeEditable}
        loading={loading}
        size="large"
      >
        Volver modificable
      </Button>
    </Card>
  );
};

export default UploadCard;
