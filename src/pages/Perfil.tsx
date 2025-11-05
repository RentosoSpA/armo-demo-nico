import React from 'react';
import { Space, Typography } from 'antd';
import ProfileComp from '../components/ajustes/Profile';

const { Title, Text } = Typography;

const Perfil: React.FC = () => {
  return (
    <Space
      direction="vertical"
      size="small"
      align="start"
      className="w-full"
      styles={{
        item: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' },
      }}
    >
      <div className="mb-24">
        <Title level={2} className="title-text text-left mb-0">
          Perfil
        </Title>
        <Text className="paragraph-text paragraph-secondary text-left mb-0">
          Administra la información de tu cueva
        </Text>
      </div>
      <ProfileComp />
    </Space>
  );
};

export default Perfil;