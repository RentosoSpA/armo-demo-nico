import React, { useState, useEffect } from 'react';
import {
  Modal,
  Typography,
  Space,
  Button,
  Descriptions,
  List,
  message,
  Spin,
  Divider,
  Row,
  Col,
  Card,
} from 'antd';
import { FileUp, CheckCircle, XCircle } from 'lucide-react';
import type { Prospecto } from '../../types/profile';
import type { GCP_FILES } from '../../types/document';
import { getDocuments } from '../../services/multimedia/documentosService';
import { updateProspecto } from '../../services/prospectos/prospectoService';
import { sendEvaluationCompleteNotification } from '../../services/notifications/notificationService';

const { Title, Text } = Typography;

interface EvaluacionModalProps {
  prospecto: Prospecto;
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const EvaluacionModal: React.FC<EvaluacionModalProps> = ({
  prospecto,
  visible,
  onClose,
  onComplete,
}) => {
  const [documents, setDocuments] = useState<GCP_FILES | null>(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    if (visible && prospecto) {
      fetchDocuments();
    }
  }, [visible, prospecto]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const folderPath = `Oportunidades/${prospecto.id}`;
      const docs = await getDocuments(folderPath);
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      message.warning('No se encontraron documentos para este prospecto');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluar = async (aprobado: boolean) => {
    try {
      setEvaluating(true);
      await updateProspecto(prospecto.id, {
        evaluado: true,
        aprobado: aprobado,
      });

      // Send notification to prospecto
      const prospectoName = `${prospecto.primer_nombre || ''} ${prospecto.primer_apellido || ''}`.trim() || prospecto.display_name || 'Prospecto';
      await sendEvaluationCompleteNotification(prospecto.id, prospectoName, aprobado);

      onComplete();
    } catch (error) {
      console.error('Error updating prospecto:', error);
      message.error('Error al actualizar la evaluación');
    } finally {
      setEvaluating(false);
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Modal
      title={
        <Space>
          <Title level={4} className="m-0">
            Evaluar Prospecto
          </Title>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Space direction="vertical" size="large" className="w-full" style={{ marginTop: '16px' }}>
        {/* Prospecto Information */}
        <Card
          size="small"
          title={
            <Text strong style={{ fontSize: '16px', whiteSpace: 'normal', overflow: 'visible', marginTop: '24px' }}>
              Información del Prospecto
            </Text>
          }
        >
          <Descriptions column={2}>
            <Descriptions.Item label="Nombre">
              {prospecto.primer_nombre} {prospecto.segundo_nombre} {prospecto.primer_apellido}{' '}
              {prospecto.segundo_apellido}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{prospecto.email}</Descriptions.Item>
            <Descriptions.Item label="Documento">{prospecto.documento}</Descriptions.Item>
            <Descriptions.Item label="Teléfono">
              {prospecto.phone_e164 || `+${prospecto.codigo_telefonico || ''}`}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Documents Section */}
        <Card size="small" title="Documentos Subidos">
          {loading ? (
            <div className="text-center p-20">
              <Spin />
              <Text type="secondary" className="d-block mt-8">
                Cargando documentos...
              </Text>
            </div>
          ) : documents && documents.files && documents.files.length > 0 ? (
            <List
              dataSource={documents.files}
              renderItem={file => (
                <List.Item
                  actions={[
                    <Button
                      key="download"
                      type="link"
                      onClick={() => handleDownload(documents.signedUrls[file.name])}
                    >
                      Ver Documento
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={file.name}
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">
                          Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Text>
                        <Text type="secondary">
                          Subido: {new Date(file.timeCreated).toLocaleDateString()}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center p-20">
              <FileUp style={{ fontSize: 48, color: '#d9d9d9' }} />
              <Text type="secondary" className="d-block mt-8">
                No se encontraron documentos
              </Text>
            </div>
          )}
        </Card>

        {/* Evaluation Actions */}
        <Divider />
        <Row gutter={16} justify="center">
          <Col>
            <Button
              type="primary"
              icon={<CheckCircle />}
              size="large"
              onClick={() => handleEvaluar(true)}
              loading={evaluating}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Aprobar Prospecto
            </Button>
          </Col>
          <Col>
            <Button
              danger
              icon={<XCircle />}
              size="large"
              onClick={() => handleEvaluar(false)}
              loading={evaluating}
            >
              Rechazar Prospecto
            </Button>
          </Col>
        </Row>
      </Space>
    </Modal>
  );
};

export default EvaluacionModal;
