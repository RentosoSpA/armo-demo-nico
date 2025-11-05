import React, { useState } from 'react';
import { Layout } from 'antd';
import CustomHeader from './CustomHeader';
import Portal from '../../pages/Portal';
import SobreNosotros from '../../pages/SobreNosotros';
import Contactanos from '../../pages/Contactanos';
import Ayuda from '../../pages/Ayuda';
import { usePortalStore } from '../../store/portalStore';

const { Content } = Layout;

const CustomAdminLayout: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('Portal');
  const { empresa } = usePortalStore();

  const renderContent = () => {
    switch (selectedKey) {
      case 'Portal':
        return <Portal />;
      case 'SobreNosotros':
        return <SobreNosotros empresa={empresa} />;
      case 'Contactanos':
        return <Contactanos empresa={empresa} />;
      case 'Ayuda':
        return <Ayuda />;
      default:
        return <Portal />;
    }
  };

  return (
    <Layout
      className="w-full"
    >
      <CustomHeader height="10vh" setSelectedKey={setSelectedKey} empresa={empresa} />
      <Layout style={{ height: '90vh' }}>
        <Content style={{ overflow: 'auto', scrollbarWidth: 'thin', padding: '10px 16px' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomAdminLayout;
