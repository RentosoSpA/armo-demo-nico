import { Upload, App } from 'antd';
import { Upload as UploadIcon } from 'lucide-react';
import type { UploadFile } from 'antd';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFileSelect }) => {
  const { message } = App.useApp();

  const handleBeforeUpload = (file: UploadFile) => {
    const isValidType = file.type === 'application/pdf' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword';

    if (!isValidType) {
      message.error('Solo se permiten archivos PDF o DOCX');
      return false;
    }

    const isLt10M = (file.size || 0) / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('El archivo debe ser menor a 10MB');
      return false;
    }

    onFileSelect(file as unknown as File);
    return false;
  };

  return (
    <div className="upload-dropzone-container">
      <Upload.Dragger
        name="file"
        multiple={false}
        beforeUpload={handleBeforeUpload}
        showUploadList={false}
        className="contract-upload-dragger"
      >
        <div className="upload-dropzone-content">
          <UploadIcon size={48} className="upload-icon" />
          <h3>Importa tu contrato</h3>
          <p>Arrastra un archivo .docx o .pdf aquí</p>
          <p className="upload-hint">o haz clic para seleccionar</p>
        </div>
      </Upload.Dragger>
    </div>
  );
};

export default UploadDropzone;
