import React from 'react';
import { Form, Input, Button, Row, Col, Card, Typography, message, Skeleton } from 'antd';
import type { Empresa } from '../types/empresa';

const { Title } = Typography;

interface ContactanosProps {
  empresa: Empresa | null;
}

const Contactanos: React.FC<ContactanosProps> = ({ empresa }) => {
  const [form] = Form.useForm();

  const onFinish = () => {
    
    message.success('¡Mensaje enviado correctamente!');
    form.resetFields();
  };

  if (!empresa) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: '80vh', background: '#0f133d' }}>
        <Col xs={22} sm={16} md={12} lg={8}>
          <Card>
            <Skeleton active />
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '80vh', background: '#0f133d' }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card>
          <Title level={2} className="title-text">Contáctanos</Title>
          <div className="paragraph-text">
            ¿Tienes alguna pregunta o necesitas ayuda? Completa el siguiente formulario y nos
            pondremos en contacto contigo lo antes posible.
          </div>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Nombre"
              name="nombre"
              rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
            >
              <Input placeholder="Tu nombre" />
            </Form.Item>
            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                { required: true, message: 'Por favor ingresa tu correo electrónico' },
                { type: 'email', message: 'Ingresa un correo electrónico válido' },
              ]}
            >
              <Input placeholder="tu@email.com" />
            </Form.Item>
            <Form.Item
              label="Mensaje"
              name="mensaje"
              rules={[{ required: true, message: 'Por favor ingresa tu mensaje' }]}
            >
              <Input.TextArea rows={4} placeholder="¿En qué podemos ayudarte?" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Enviar
              </Button>
            </Form.Item>
          </Form>
          <div className="paragraph-text mt-24">
            También puedes escribirnos a <a href={`mailto:${empresa.email}`}>{empresa.email}</a>
          </div>
          <div className="paragraph-text">
            <strong>Dirección:</strong> {empresa.direccion}
          </div>
          <div className="paragraph-text">
            <strong>Teléfono:</strong> +{empresa.codigoTelefonico} {empresa.telefono}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Contactanos;
