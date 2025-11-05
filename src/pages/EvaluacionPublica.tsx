import React, { useState } from 'react';
import { Row, Col, Typography, Space, Card, Steps, Result } from 'antd';
import { CircleCheck, FileText, Send } from 'lucide-react';
import { useParams } from 'react-router-dom';
import ProspectoUploadForm from '../components/Oportunidades/ProspectoUploadForm';

const { Title, Text } = Typography;

const EvaluacionPublica: React.FC = () => {
  const { prospectoId } = useParams<{ prospectoId: string }>();
  const [currentStep, setCurrentStep] = useState(0);

  const handleSuccess = () => {
    setCurrentStep(1);
  };

  const steps = [
    {
      title: 'Envío de Documentos',
      description: 'Completa el formulario y sube tus documentos',
      icon: <FileText size={20} />,
    },
    {
      title: 'Confirmación',
      description: 'Documentos recibidos exitosamente',
      icon: <CircleCheck size={20} />,
    },
  ];

  return (
    <div className="p-24">
      <Row justify="center">
        <Col xs={24} lg={20} xl={16}>
          <Space direction="vertical" size="large" className="w-full">
            {/* Header */}
            <div className="text-center mb-32">
              <Title level={1}>Evaluación de Prospectos</Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Envía tus documentos para ser evaluado como prospecto
              </Text>
            </div>

            {/* Steps */}
            <Card>
              <Steps current={currentStep} items={steps} className="mb-32" />
            </Card>

            {/* Content */}
            {currentStep === 0 ? (
              <ProspectoUploadForm prospectoId={prospectoId} onSuccess={handleSuccess} />
            ) : (
              <Card>
                <Result
                  icon={<CircleCheck style={{ color: '#52c41a' }} />}
                  title="Documentos Enviados Exitosamente"
                  subTitle="Hemos recibido tus documentos y los estamos procesando"
                  extra={[
                    <Text
                      key="info"
                      type="secondary"
                      className="d-block mb-16"
                    >
                      ID de seguimiento: <Text code>{prospectoId}</Text>
                    </Text>,
                    <Text key="message" type="secondary" className="d-block">
                      Te notificaremos por email cuando se complete la evaluación de tus documentos.
                      Este proceso puede tomar entre 1-3 días hábiles.
                    </Text>,
                  ]}
                />
              </Card>
            )}

            {/* Information Cards */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card size="small">
                  <Space direction="vertical" align="center" className="w-full">
                    <FileText size={32} color="#1890ff" />
                    <Title level={5} className="text-center m-0">
                      Documentos Requeridos
                    </Title>
                    <Text type="secondary" className="text-center">
                      Cédula de ciudadanía, certificados laborales, extractos bancarios, etc.
                    </Text>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card size="small">
                  <Space direction="vertical" align="center" className="w-full">
                    <Send size={32} color="#52c41a" />
                    <Title level={5} className="text-center m-0">
                      Proceso Simple
                    </Title>
                    <Text type="secondary" className="text-center">
                      Completa el formulario y sube tus documentos en formato digital
                    </Text>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card size="small">
                  <Space direction="vertical" align="center" className="w-full">
                    <CircleCheck size={32} color="#faad14" />
                    <Title level={5} className="text-center m-0">
                      Evaluación Rápida
                    </Title>
                    <Text type="secondary" className="text-center">
                      Recibe una respuesta en 1-3 días hábiles con el resultado de tu evaluación
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default EvaluacionPublica;
