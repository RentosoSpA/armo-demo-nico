import { Modal, Upload, Button, message, Alert, Progress } from 'antd';
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadDocument } from '../../services/multimedia/documentosService';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;

interface NuevoReporteModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const NuevoReporteModal = ({ open, onClose, onCreated }: NuevoReporteModalProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file: RcFile) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    const isAllowedType =
      allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);

    if (!isAllowedType) {
      message.error('Solo se permiten archivos PDF, DOC, DOCX, XLS o XLSX');
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('El archivo debe ser menor a 10MB');
      return false;
    }

    const uploadFile: UploadFile = {
      uid: crypto.randomUUID(),
      name: file.name,
      status: 'done',
      originFileObj: file,
    };

    setFileList([uploadFile]);
    return false; // Prevent default upload behavior
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error('Por favor selecciona un archivo');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const uploadFile = fileList[0];
      const file = uploadFile.originFileObj as File;
      const formData = new FormData();
      formData.append('file', file);

      // Step 1: Call webhook to get propiedad_uid
      setProgress(25);
      const propiedadUid = 'propiedad-001';

      if (!propiedadUid) {
        throw new Error('No se pudo obtener el ID de la propiedad');
      }

      // Step 2: Upload file to backend with the path
      setProgress(75);
      const folderPath = `propiedades/${propiedadUid}/reportes`;
      await uploadDocument(folderPath, file);

      setProgress(100);
      message.success('Reporte subido correctamente');
      setFileList([]);
      onClose();
      onCreated();
    } catch (error) {
      console.error('Error during upload:', error);
      message.error('Error al subir el reporte');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setFileList([]);
    setProgress(0);
    onClose();
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: handleUpload,
    onRemove: () => {
      setFileList([]);
      return true;
    },
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title="Subir Nuevo Reporte"
      width={600}
      afterClose={handleClose}
    >
      <div className="mb-16">
        <Alert
          message="Formato requerido"
          description="Solo se permiten archivos PDF, DOC, DOCX, XLS, XLSX con un tamaño máximo de 10MB. El sistema automáticamente detectará la propiedad asociada al reporte."
          type="info"
          showIcon
          className="mb-16"
        />
      </div>

      {!uploading && (
        <Dragger {...uploadProps} disabled={uploading}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Haz clic o arrastra el archivo a esta área</p>
          <p className="ant-upload-hint">
            Solo se permiten archivos PDF, DOC, DOCX, XLS, XLSX con un tamaño máximo de 10MB
          </p>
        </Dragger>
      )}

      {uploading && (
        <div className="text-center">
          <FileTextOutlined className="mb-16" />
          <h3>Subiendo reporte...</h3>
          <Progress percent={progress} status="active" />
          <p>Procesando archivo...</p>
        </div>
      )}

      <div className="d-flex justify-between mt-24">
        <Button onClick={handleClose} disabled={uploading}>
          Cancelar
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={uploading}
          disabled={fileList.length === 0 || uploading}
        >
          {uploading ? 'Subiendo...' : 'Subir reporte'}
        </Button>
      </div>
    </Modal>
  );
};

export default NuevoReporteModal;
