import React from 'react';
import { Card, Typography, Space, Avatar, Button } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { Propiedad } from '../../../../types/propiedad';

const { Title, Text } = Typography;

interface ContactSectionProps {
  propiedad: Propiedad;
}

const ContactSection: React.FC<ContactSectionProps> = ({ propiedad }) => {
  const handleLocation = () => {
    const address = encodeURIComponent(propiedad.direccion || 'Sin dirección');
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  return (
    <Card className="mb-24">
      <Title level={4}>Información de Contacto</Title>
      <Space direction="vertical" size="middle" className="w-full">
        {/* Agente Responsable */}
        {propiedad.agente && (
          <div>
            <Text strong>Agente Responsable</Text>
            <br />
            <Space className="mt-8">
              <Avatar icon={<UserOutlined />} />
              <div>
                <Text>{propiedad.agente.nombre}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {propiedad.agente.email}
                </Text>
              </div>
            </Space>
          </div>
        )}

        {/* Contact Buttons */}
        <Space direction="vertical" className="w-full mt-16">
          <Button type="primary" icon={<PhoneOutlined />} block style={{ height: 40 }}>
            Llamar
          </Button>
          <Button icon={<MailOutlined />} block style={{ height: 40 }}>
            Enviar Mensaje
          </Button>
          <Button
            icon={<EnvironmentOutlined />}
            block
            style={{ height: 40 }}
            onClick={handleLocation}
          >
            Ver Ubicación
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

export default ContactSection;
