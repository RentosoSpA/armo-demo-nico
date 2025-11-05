import React, {  useState } from 'react';
import { Layout, Typography, Avatar } from 'antd';
import {  UserOutlined, LogoutOutlined, DownOutlined, } from '@ant-design/icons';
import type { RapidAccessItemProps } from '../header/RapidAccessItem';
import type { Profile } from '../../types/profile';
import type { Agente } from '../../types/agente';
import { profileToUser } from '../../utils/typeAdapters';
import RentosoIcon from '../../assets/RentosoIcon';




const { Text } = Typography;
const { Header } = Layout;

interface CustomHeaderProps {
  height?: string;
  className?: string;
  rapidAccessItems?: RapidAccessItemProps[];
  userProfile?: Profile | null;
  agent?: Agente | null;
  onLogout?: () => void;
  onNavigate?: (key: string) => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  height,
  className,
  userProfile,
  agent,
  onLogout,
  onNavigate,
}) => {
  const [isUserMenuOpen, seIsUserMenuOpen] = useState(false);



  const getUserDisplayName = () => {
    console.log('[CustomHeader] agent:', agent);
    console.log('[CustomHeader] userProfile:', userProfile);
    if (agent && agent.nombre) {
      console.log('[CustomHeader] Using agent name:', agent.nombre);
      return agent.nombre;
    }
    if (userProfile) {
      const user = profileToUser(userProfile as any);
      console.log('[CustomHeader] Converted user:', user);
      const displayName = `${user.nombre || ''} ${user.apellido || ''}`.trim() || 'Usuario';
      console.log('[CustomHeader] Display name:', displayName);
      return displayName;
    }
    return 'Usuario';
  };

  return (
    <Header className={`custom-header ${className || ''}`} style={{ height }}>
      <div className='header-menu-container'>
        <div className='header-button'>
          <button 
            className="home-button"
            onClick={() => onNavigate?.('home')}
          >
            <div className="home-button-logo">
              <RentosoIcon size={16} color="#ffffff" />
            </div>
            <span className="home-button-text">Sitio Web</span>
          </button>
        </div>
        <div className="home-button">
          <div className="user-icon" onClick={() => {
                seIsUserMenuOpen(!isUserMenuOpen)

              }
          }>
            <Avatar icon={<UserOutlined />} size="small" />
            <Text>{getUserDisplayName()}</Text>
            <Avatar icon={<DownOutlined/>} size={16} />
          </div>
        </div>
      </div>

      {isUserMenuOpen && (
        <>
          <div
            className="user-menu-backdrop"
            onClick={() => seIsUserMenuOpen(false)}
          />
          <div className="user-menu" onClick={(e) => e.stopPropagation()}>
              <div className="user-menu-section">
                <div className="user-name">Hola {getUserDisplayName()}</div>
                <div
                  className="user-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Navegando a Perfil');
                    onNavigate?.('Perfil');
                    seIsUserMenuOpen(false);
                  }}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Mi perfil
                </div>
                <div
                  className="user-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Navegando a Perfil-Inmobiliario');
                    onNavigate?.('Perfil-Inmobiliario');
                    seIsUserMenuOpen(false);
                  }}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Perfil inmobiliario
                </div>
              </div>
              <div className="user-menu-section">


                <div
                  className="user-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Navegando a Gestion-Usuarios');
                    onNavigate?.('Gestion-Usuarios');
                    seIsUserMenuOpen(false);
                  }}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  Gestión de Usuarios
                </div>
              </div>
              
              
              <div className="user-menu-section">
              {onLogout && (
                <button
                  className={`logout-button user-menu-item`}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Cerrando sesión');
                    seIsUserMenuOpen(false);
                    onLogout();
                  }}
                  title="Cerrar sesión"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <LogoutOutlined />
                  Cerrar sesión
                </button>
              )}
              </div>
            </div>
        </>
      )}

    </Header>
  );
};

export default CustomHeader;
