import { Modal, Upload, Button, Form, Select, Progress, App } from 'antd';
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { uploadDocument } from '../../services/mock/multimediaServiceMock';
import { getPropiedades } from '../../services/mock/propiedadesServiceMock';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import type { Propiedad } from '../../types/propiedad';

const { Dragger } = Upload;
const { Option } = Select;

interface NuevoContratoModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface FormData {
  propiedadId: string;
}

const NuevoContratoModal = ({ open, onClose, onCreated }: NuevoContratoModalProps) => {
  const { message: messageApi } = App.useApp();
  const [form] = Form.useForm<FormData>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loadingPropiedades, setLoadingPropiedades] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPropiedades();
    }
  }, [open]);

  const fetchPropiedades = async () => {
    try {
      setLoadingPropiedades(true);
      const propiedadesData = await getPropiedades();
      setPropiedades(propiedadesData);
    } catch (error) {
      console.error('Error loading propiedades:', error);
      messageApi.error('Error al cargar las propiedades');
    } finally {
      setLoadingPropiedades(false);
    }
  };

  const handleUpload = async (file: RcFile) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
    ];

    const allowedExtensions = [
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.txt',
    ];
    const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

    const isAllowedType =
      allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);

    if (!isAllowedType) {
      messageApi.error(
        'Tipo de archivo no permitido. Se permiten: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, TXT'
      );
      return false;
    }

    const isLt50M = file.size / 1024 / 1024 < 50;
    if (!isLt50M) {
      messageApi.error('El archivo debe ser menor a 50MB');
      return false;
    }

    const uploadFile: UploadFile = {
      uid: file.name,
      name: file.name,
      status: 'done',
      originFileObj: file,
    };

    setFileList([uploadFile]);
    return false; // Prevent default upload behavior
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      const values = await form.validateFields();

      if (fileList.length === 0) {
        messageApi.error('Por favor selecciona un archivo');
        return;
      }

      setUploading(true);
      setProgress(20);

      const uploadFile = fileList[0];
      const file = uploadFile.originFileObj as File;

      // Construct the folder path: propiedades/{propiedadId}/boveda
      const folderPath = `propiedades/${values.propiedadId}/boveda`;

      setProgress(50);

      // Upload file to GCP using the uploadDocument service
      await uploadDocument(folderPath, file);

      setProgress(100);
      messageApi.success('Documento subido correctamente');

      // Reset form and close modal
      form.resetFields();
      setFileList([]);
      onClose();
      onCreated();
    } catch (error) {
      console.error('Error during upload:', error);
      if (error instanceof Error) {
        messageApi.error(`Error al subir el documento: ${error.message}`);
      } else {
        messageApi.error('Error al subir el documento');
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    form.resetFields();
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
    showUploadList: true,
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title="Subir Nuevo Documento"
      width={600}
      afterClose={handleClose}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="propiedadId"
          label="Seleccionar Propiedad"
          rules={[{ required: true, message: 'Por favor selecciona una propiedad' }]}
        >
          <Select
            placeholder="Buscar y seleccionar propiedad..."
            loading={loadingPropiedades}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              String(option?.children || '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {propiedades.map(propiedad => (
              <Option key={propiedad.id} value={propiedad.id}>
                {propiedad.titulo} - {propiedad.direccion}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Archivo" required>
          {!uploading && (
            <Dragger {...uploadProps} disabled={uploading}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Haz clic o arrastra el archivo a esta área</p>
              <p className="ant-upload-hint">
                Se permiten documentos PDF, Word, Excel, imágenes y archivos de texto (máximo 50MB)
              </p>
            </Dragger>
          )}

          {uploading && (
            <div className="text-center">
              <FileTextOutlined className="mb-16" />
              <h3>Subiendo documento...</h3>
              <Progress percent={progress} status="active" />
              <p>Procesando y guardando archivo...</p>
            </div>
          )}
        </Form.Item>
      </Form>

      <div className="d-flex justify-between mt-24">
        <Button onClick={handleClose} disabled={uploading}>
          Cancelar
        </Button>
        <Button type="primary" onClick={handleSubmit} loading={uploading} disabled={uploading}>
          {uploading ? 'Subiendo...' : 'Subir documento'}
        </Button>
      </div>
    </Modal>
  );
};

export default NuevoContratoModal;
