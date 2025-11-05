import React from 'react';
import { Button, Typography, Space, Card } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/tablero');
  };

  return (
    <div
      className="d-flex align-center justify-center p-20"
    >
      <Card
        className="w-full text-center"
        bodyStyle={{ padding: '48px 32px' }}
      >
        <div className="mb-32">
          <div
            className="font-bold mb-16"
          >
            404
          </div>
          <Title level={2} className="title-text m-0">
            Página no encontrada
          </Title>
          <Text
            className="d-block mt-16"
          >
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </Text>
        </div>

        <Space direction="vertical" size="middle" className="w-full">
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            className="w-full"
          >
            Ir al Inicio
          </Button>
        </Space>

        <div className="mt-32">
          <Text type="secondary" style={{ fontSize: 14 }}>
            Si crees que esto es un error, contacta al soporte técnico.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
