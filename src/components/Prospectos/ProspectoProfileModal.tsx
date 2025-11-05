import { Modal, Descriptions, Tag, Card, Row, Col, Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { Prospecto } from '../../types/profile';

interface ProspectoProfileModalProps {
  visible: boolean;
  prospecto: Prospecto;
  onClose: () => void;
}

const ProspectoProfileModal: React.FC<ProspectoProfileModalProps> = ({
  visible,
  prospecto,
  onClose,
}) => {
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'No especificado';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  if (!prospecto) {
    return (
      <Modal
        title="Perfil del Prospecto"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <div className="text-center p-40">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <div className="d-flex align-center gap-8">
          <Avatar icon={<UserOutlined />} />
          <span>
            Perfil de {prospecto.primer_nombre} {prospecto.primer_apellido}
          </span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
    >
      <div>
        {/* Información Personal */}
        <Card title="Información Personal" className="mb-16">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Nombre completo">
                  {prospecto.primer_nombre} {prospecto.segundo_nombre} {prospecto.primer_apellido}{' '}
                  {prospecto.segundo_apellido}
                </Descriptions.Item>
                <Descriptions.Item label="Email">{prospecto.email}</Descriptions.Item>
                <Descriptions.Item label="Teléfono">
                  {prospecto.phone_e164}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Fecha de Nacimiento">
                  {prospecto.fecha_nacimiento
                    ? new Date(prospecto.fecha_nacimiento).toLocaleDateString('es-ES')
                    : 'No especificado'}
                </Descriptions.Item>
                <Descriptions.Item label="Género">
                  <Tag color="purple">{prospecto.genero}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Tipo de Documento">
                  {prospecto.tipo_documento}
                </Descriptions.Item>
                <Descriptions.Item label="Número de Documento">
                  {prospecto.documento}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>

        {/* Información Laboral */}
        <Card title="Información Laboral y Financiera" className="mb-16">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Situación Laboral">
                  {prospecto.situacion_laboral ? (
                    <Tag color="cyan">{prospecto.situacion_laboral}</Tag>
                  ) : (
                    'No especificado'
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ingresos Mensuales">
                  {prospecto.ingresos_mensuales !== null && prospecto.ingresos_mensuales !== undefined 
                    ? formatCurrency(prospecto.ingresos_mensuales) 
                    : 'No especificado'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Egresos Mensuales">
                  {prospecto.egresos_mensuales !== null && prospecto.egresos_mensuales !== undefined
                    ? formatCurrency(prospecto.egresos_mensuales)
                    : 'No especificado'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>

        {/* Estado de Evaluación */}
        <Card title="Estado de Evaluación">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Estado de Evaluación">
                  {prospecto.evaluado ? (
                    <Tag color="green">Evaluado</Tag>
                  ) : (
                    <Tag color="orange">Pendiente de Evaluación</Tag>
                  )}
                </Descriptions.Item>
                {prospecto.evaluado && (
                  <Descriptions.Item label="Resultado">
                    {prospecto.aprobado ? (
                      <span className="font-bold">
                        ✓ Prospecto aprobado para continuar con el proceso
                      </span>
                    ) : (
                      <span className="font-bold">
                        ✗ Prospecto rechazado
                      </span>
                    )}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Col>
          </Row>
        </Card>
      </div>
    </Modal>
  );
};

export default ProspectoProfileModal;
