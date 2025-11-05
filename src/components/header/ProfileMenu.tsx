import {
  SettingOutlined,
  PlayCircleOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { Card, Col, Divider, Row, Typography } from 'antd';
// Import the walkthrough
/* import { getHeaderWalkthrough } from '../../services/walkthroughs/headerWt'; */
import type { Profile } from '../../types/profile';
import './ProfileMenu.scss';
import { profileToUser } from '../../utils/typeAdapters';

const { Text } = Typography;

interface ProfileMenuProps {
  profile: Profile;
  onMenuAccess: (moduleId: string) => void;
  logout: () => void;
  setDropdownOpen: (open: boolean) => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  profile,
  onMenuAccess,
  logout,
  setDropdownOpen,
}) => {
  // Handler for walkthrough
  const handleWalkthrough = () => {
    setDropdownOpen(false);
    localStorage.setItem('headerWalkthroughDone', 'true');
  };

  return (
    <Card
      className="profile-menu-card"
      styles={{ body: { padding: '8px 10px' } }}
    >
      <Row align="middle" gutter={12} className="profile-info-row">
        <Col>
          <div>
            <Text strong className="profile-name">
              {`${profileToUser(profile as any).nombre || ''} ${profileToUser(profile as any).apellido || ''}`.trim() || 'Usuario'}
            </Text>
            <br />
            <Text type="secondary" className="profile-email">
              {profileToUser(profile as any).telefono || ''}
            </Text>
          </div>
        </Col>
      </Row>
      <Divider className="profile-divider" />
      <Button
        type="text"
        block
        className="profile-menu-button"
        onClick={() => {
          setDropdownOpen(false);
          onMenuAccess('Ajustes');
        }}
      >
        <SettingOutlined /> Ajustes
      </Button>
      <Button
        type="text"
        block
        className="profile-menu-button"
        onClick={() => {
          setDropdownOpen(false);
          onMenuAccess('Ajustes');
        }}
      >
        <UserOutlined /> Cambiar corredor
      </Button>
      <Button
        type="text"
        block
        className="profile-menu-button"
        onClick={handleWalkthrough}
      >
        <PlayCircleOutlined /> Iniciar recorrido
      </Button>
      <Button
        type="text"
        danger
        block
        className="profile-menu-button"
        onClick={() => {
          setDropdownOpen(false);
          logout();
        }}
      >
        <LogoutOutlined /> Cerrar sesión
      </Button>
    </Card>
  );
};

export default ProfileMenu;
