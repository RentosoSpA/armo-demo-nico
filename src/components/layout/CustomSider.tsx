import React from 'react';
import { Layout, Typography } from 'antd';
import {
  LayoutDashboard,
  Home,
  File,
  Calendar,
  ClipboardCheck,
  UserCheck,
  CreditCard,
  Wallet,
} from 'lucide-react';
import '../../styles/components/menu.scss';

const { Sider } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: 'Tablero', label: 'Tablero', icon: <LayoutDashboard size={18} /> },
  { key: 'Oportunidades', label: 'Oportunidades', icon: <ClipboardCheck size={18} /> },
  { key: 'Propiedades', label: 'Propiedades', icon: <Home size={18} /> },
  { key: 'Finanzas', label: 'Finanzas', icon: <Wallet size={18} /> },
  // { key: 'Brigada', label: 'Brigada', icon: <Settings size={18} /> }, // Oculto temporalmente
  { key: 'Cobros', label: 'Cobros', icon: <CreditCard size={18} /> },
  { key: 'Visitas', label: 'Visitas', icon: <Calendar size={18} /> },
  { key: 'Contratos', label: 'Contratos', icon: <File size={18} /> },
  { key: 'Propietarios', label: 'Propietarios', icon: <UserCheck size={18} /> },
];

interface CustomSiderProps {
  selectedKey: string;
  handleMenuClick: (key: string) => void;
  className?: string;
}

const CustomSider: React.FC<CustomSiderProps> = ({ handleMenuClick, selectedKey, className }) => {
  return (
    <Sider
      className={`custom-sider ${className}`}
      width="100%"
      theme="light"
      trigger={null}
      collapsible={false}
    >
      <div className="sider-content">
        <div className="sider-menu">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`menu-item ${selectedKey === item.key ? 'menu-item-selected' : ''}`}
            >
              <div
                className="menu-item-content"
                onClick={() => handleMenuClick(item.key)}
              >
                <div className="menu-item-icon">{item.icon}</div>
                <Text className="menu-item-label">{item.label}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sider>
  );
};

export default CustomSider; 