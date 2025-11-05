import React from 'react';
import { Typography } from 'antd';
import {
  LayoutDashboard,
  Home,
  ClipboardCheck,
  Users,
  UserCheck,
} from 'lucide-react';

const { Text } = Typography;

const menuItems = [
  { key: 'Tablero', label: 'Tablero', icon: <LayoutDashboard size={20} /> },
  { key: 'Propiedades', label: 'Propiedades', icon: <Home size={20} /> },
  { key: 'Prospectos', label: 'Prospectos', icon: <Users size={20} /> },
  { key: 'Propietarios', label: 'Propietarios', icon: <UserCheck size={20} /> },
  { key: 'Oportunidades', label: 'Más', icon: <ClipboardCheck size={20} /> },
];

interface MobileBottomNavProps {
  selectedKey: string;
  handleMenuClick: (key: string) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  selectedKey,
  handleMenuClick
}) => {
  return (
    <div className="mobile-bottom-nav">
      <div className="bottom-nav-container">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`bottom-nav-item ${
              selectedKey === item.key ? 'bottom-nav-item-active' : ''
            }`}
            onClick={() => handleMenuClick(item.key)}
          >
            <div className="bottom-nav-icon">
              {item.icon}
            </div>
            <Text className="bottom-nav-label">
              {item.label}
            </Text>
            {selectedKey === item.key && (
              <div className="bottom-nav-indicator" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;