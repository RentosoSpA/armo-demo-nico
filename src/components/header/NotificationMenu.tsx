import React from 'react';
import { Card, Button, Divider, Typography } from 'antd';
import './NotificationMenu.scss';

const { Text } = Typography;

// Mock notification data
const notifications = [
  {
    id: 1,
    title: 'Nueva propiedad agregada',
    moduleId: 'Propiedades',
    description: 'Se ha agregado una nueva propiedad a tu portafolio.',
    time: 'hace 2 min',
  },
  {
    id: 2,
    title: 'Pago recibido',
    moduleId: 'Finanzas',
    description: 'Has recibido un pago de arriendo.',
    time: 'hace 1 hora',
  },
  {
    id: 3,
    title: 'Contrato por vencer',
    moduleId: 'Contratos',
    description: 'Un contrato está próximo a vencer.',
    time: 'hace 3 horas',
  },
];

interface NotificationMenuProps {
  onNotificationClick: (moduleId: string) => void;
  setDropdownOpen: (open: boolean) => void;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({
  onNotificationClick,
  setDropdownOpen,
}) => {
  return (
    <Card
      className="notification-menu-card"
      bodyStyle={{ padding: 0 }}
    >
      {/* Header */}
      <div className="notification-header">
        <Text strong className="notification-title">
          Notificaciones
        </Text>
        <Button
          type="link"
          size="small"
          className="mark-read-button"
        >
          Marcar como leídas
        </Button>
      </div>
      <Divider className="notification-divider" />

      {/* Body */}
      <div className="notification-body">
        {notifications.slice(0, 3).map(notif => (
          <Card
            key={notif.id}
            className="notification-item-card"
            styles={{
              body: {
                padding: '12px 8px',
                transition: 'background 0.2s',
              },
            }}
            onClick={() => {
              setDropdownOpen(false);
              onNotificationClick(notif.moduleId);
            }}
          >
            <Text strong className="notification-title-text">
              {notif.title}
            </Text>
            <div className="notification-description">
              {notif.description}
            </div>
            <Text type="secondary" className="notification-time">
              {notif.time}
            </Text>
          </Card>
        ))}
        {notifications.length === 0 && (
          <Text type="secondary" className="notification-empty">
            No hay notificaciones nuevas.
          </Text>
        )}
      </div>
      <Divider className="notification-divider footer-divider" />
      {/* Footer */}
      <div className="notification-footer">
        <Button
          type="link"
          size="small"
          className="view-all-button"
        >
          Ver todas las notificaciones
        </Button>
      </div>
    </Card>
  );
};

export default NotificationMenu;
