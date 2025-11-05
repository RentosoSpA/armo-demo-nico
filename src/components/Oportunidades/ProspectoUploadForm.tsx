import React, { useState } from 'react';
import { Button, Upload, message, Card, Typography, Space, Progress } from 'antd';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { uploadDocument } from '../../services/multimedia/documentosService';
import { sendProspectoUploadNotification } from '../../services/notifications/notificationService';

const { Title, Text } = Typography;

interface ProspectoUploadFormProps {
  prospectoId?: string;
  onSuccess?: () => void;
}

const ProspectoUploadForm: React.FC<ProspectoUploadFormProps> = ({ prospectoId, onSuccess }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload: UploadProps['beforeUpload'] = file => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('El archivo debe ser menor a 10MB!');
      return false;
    }
    return false; // Prevent default upload
  };

  const handleSubmit = async () => {
    try {
      if (!prospectoId) {
        message.error('ID de oportunidad no válido');
        return;
      }

      if (fileList.length === 0) {
        message.error('Por favor selecciona al menos un documento');
        return;
      }

      setUploading(true);
      setProgress(10);

      // Upload documents
      const uploadPromises = fileList.map(async (file, index) => {
        if (file.originFileObj) {
          const folderPath = `Oportunidades/${prospectoId}`;
          await uploadDocument(folderPath, file.originFileObj);
          setProgress(10 + ((index + 1) / fileList.length) * 80);
        }
      });

      await Promise.all(uploadPromises);
      setProgress(100);

      // Send notification to workspace users
      await sendProspectoUploadNotification(prospectoId, 'Oportunidad');

      message.success(
        'Documentos enviados exitosamente. Te notificaremos cuando se complete la evaluación.'
      );

      // Reset file list
      setFileList([]);
      setProgress(0);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error during submission:', error);
      message.error('Error al enviar los documentos. Por favor intenta nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    beforeUpload: handleUpload,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Space direction="vertical" size="large" className="w-full">
        <div className="text-center">
          <Title level={2}>Envío de Documentos</Title>
          <Text type="secondary">Sube los documentos requeridos para tu evaluación de oportunidad</Text>
        </div>

        <div>
          <div className="mb-16">
            <Text strong>Documentos Requeridos</Text>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} disabled={uploading}>
                Seleccionar Archivos
              </Button>
            </Upload>
            <Text type="secondary" className="d-block mt-8">
              Sube los documentos necesarios (máximo 10MB por archivo)
            </Text>
          </div>

          {uploading && (
            <div className="mb-16">
              <Progress percent={progress} status="active" />
              <Text type="secondary" className="d-block text-center">
                Procesando documentos...
              </Text>
            </div>
          )}

          <div className="text-center mt-24">
            <Button
              type="primary"
              icon={<SendOutlined />}
              size="large"
              loading={uploading}
              disabled={fileList.length === 0}
              onClick={handleSubmit}
            >
              Enviar Documentos
            </Button>
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default ProspectoUploadForm;