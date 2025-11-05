import React, { useState } from 'react';
import { Card, Typography, Form, Switch, Row, Col, Divider, Button } from 'antd';

const { Title, Text } = Typography;

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  maintenanceNotifications: boolean;
  newTenantsNotifications: boolean;
}

const Notifications: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    maintenanceNotifications: true,
    newTenantsNotifications: false,
  });

  const handleFinish = (values: NotificationSettings) => {
    setLoading(true);
    setTimeout(() => {
      setSettings(values);
      setLoading(false);
    }, 800);
  };

  return (
    <Card className="profile-card w-full">
      <Title level={2} className="profile-title">
        Preferencias de notificación
      </Title>
      <Text
        className="d-block mt-4 mb-16"
      >
        Configura cómo y cuándo quieres recibir notificaciones.
      </Text>
      <Form form={form} layout="vertical" initialValues={settings} onFinish={handleFinish}>
        <div className="w-full">
          <Form.Item name="emailNotifications" valuePropName="checked" className="mb-20">
            <Row align="middle" className="w-full" justify="space-between">
              <Col flex="auto">
                <div className="font-bold">Notificaciones por correo electrónico</div>
                <div className="text-gray-500 text-13">
                  Recibe actualizaciones en tu bandeja de entrada.
                </div>
              </Col>
              <Col>
                <Switch />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item name="pushNotifications" valuePropName="checked" className="mb-20">
            <Row align="middle" className="w-full" justify="space-between">
              <Col flex="auto">
                <div className="font-bold">Notificaciones Push</div>
                <div className="text-gray-500 text-13">Recibe alertas en tu dispositivo.</div>
              </Col>
              <Col>
                <Switch />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            name="newTenantsNotifications"
            valuePropName="checked"
            className="mb-20"
          >
            <Row align="middle" className="w-full" justify="space-between">
              <Col flex="auto">
                <div className="font-bold">Notificaciones de nuevos prospectos</div>
                <div className="text-gray-500 text-13">
                  Sé notificado cuando hay nuevos prospectos.
                </div>
              </Col>
              <Col>
                <Switch />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            name="maintenanceNotifications"
            valuePropName="checked"
            className="mb-20"
          >
            <Row align="middle" className="w-full" justify="space-between">
              <Col flex="auto">
                <div className="font-bold">Alertas de mantenimiento</div>
                <div className="text-gray-500 text-13">
                  Recibe notificaciones sobre mantenimiento programado.
                </div>
              </Col>
              <Col>
                <Switch />
              </Col>
            </Row>
          </Form.Item>
        </div>
        <Divider />
        <Row justify="end">
          <Button type="primary" htmlType="submit" loading={loading}>
            Guardar
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default Notifications;
