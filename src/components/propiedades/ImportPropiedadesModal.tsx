import { Modal, Upload, Button, message, Alert, Progress } from 'antd';
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons';
import { useState } from 'react';
// import type { PropiedadCreate } from '../../types/propiedad';
// import { createPropiedad } from '../../services/propiedades/propiedadesService';
import type { UploadFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;

interface ImportPropiedadesModalProps {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

const ImportPropiedadesModal = ({
  open,
  onClose,
  // onImported
}: ImportPropiedadesModalProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleUpload = async (file: UploadFile) => {
    const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');
    if (!isCsv) {
      message.error('Solo se permiten archivos CSV');
      return false;
    }

    const isLt5M = (file.size || 0) / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('El archivo debe ser menor a 5MB');
      return false;
    }

    setFileList([file]);
    return false; // Prevent default upload behavior
  };

  const handleImport = async () => {
    if (fileList.length === 0) {
      message.error('Por favor selecciona un archivo CSV');
      return;
    }

    setImporting(true);
    setProgress(0);
    setImportResult(null);

    try {
      const uploadFile = fileList[0];
      const file = uploadFile.originFileObj as File;
      const formData = new FormData();
      formData.append('file', file);

      // Send file to webhook
      const webhookResponse = await fetch(
        import.meta.env.VITE_LOAD_PROPERTY_WEBHOOK,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!webhookResponse.ok) {
        throw new Error('Error al procesar el archivo CSV');
      }

      // const result = await webhookResponse.json();
      // const propiedades: PropiedadCreate[] = result.data || [];

      // if (propiedades.length === 0) {
      //   message.warning('No se encontraron propiedades válidas en el archivo');
      //   setImporting(false);
      //   return;
      // }

      // // Create propiedades one by one with progress tracking
      // const results: ImportResult = {
      //   success: 0,
      //   failed: 0,
      //   errors: [],
      // };

      // for (let i = 0; i < propiedades.length; i++) {
      //   try {
      //     await createPropiedad(propiedades[i]);
      //     results.success++;
      //   } catch (error) {
      //     results.failed++;
      //     results.errors.push(
      //       `Fila ${i + 1}: ${error instanceof Error ? error.message : 'Error desconocido'}`
      //     );
      //   }

      //   // Update progress
      //   const currentProgress = Math.round(((i + 1) / propiedades.length) * 100);
      //   setProgress(currentProgress);
      // }

      // setImportResult(results);

      // if (results.success > 0) {
      //   message.success(`${results.success} propiedades importadas exitosamente`);
      //   onImported();
      // }

      // if (results.failed > 0) {
      //   message.warning(`${results.failed} propiedades fallaron al importar`);
      // }
    } catch (error) {
      console.error('Error during import:', error);
      message.error('Error al importar las propiedades');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFileList([]);
    setProgress(0);
    setImportResult(null);
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
      title="Importar Propiedades desde CSV"
      width={600}
      afterClose={handleClose}
    >
      <div className="mb-16">
        <Alert
          message="Formato requerido"
          description="El archivo CSV debe contener las siguientes columnas: tipo, titulo, direccion, moneda, canonMensual, area, numeroHabitaciones, numeroBanos, barrio, ciudad, pais. Las demás columnas son opcionales."
          type="info"
          showIcon
          className="mb-16"
        />
      </div>

      {!importing && (
        <Dragger {...uploadProps} disabled={importing}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Haz clic o arrastra el archivo CSV a esta área</p>
          <p className="ant-upload-hint">
            Solo se permiten archivos CSV con un tamaño máximo de 5MB
          </p>
        </Dragger>
      )}

      {importing && (
        <div className="text-center">
          <FileTextOutlined className="mb-16" />
          <h3>Importando propiedades...</h3>
          <Progress percent={progress} status="active" />
          <p>Procesando archivo CSV...</p>
        </div>
      )}

      {importResult && (
        <div className="mt-16">
          <Alert
            message={`Importación completada: ${importResult.success} exitosos, ${importResult.failed} fallidos`}
            type={importResult.failed === 0 ? 'success' : 'warning'}
            showIcon
            className="mb-16"
          />

          {importResult.errors.length > 0 && (
            <div
              className="p-8"
            >
              <h4>Errores encontrados:</h4>
              <ul className="m-0 pl-20">
                {importResult.errors.map((error, index) => (
                  <li key={index} className="mb-4">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="d-flex justify-between mt-24">
        <Button onClick={handleClose} disabled={importing}>
          Cancelar
        </Button>
        <Button
          type="primary"
          onClick={handleImport}
          loading={importing}
          disabled={fileList.length === 0 || importing}
        >
          {importing ? 'Importando...' : 'Importar'}
        </Button>
      </div>
    </Modal>
  );
};

export default ImportPropiedadesModal;
