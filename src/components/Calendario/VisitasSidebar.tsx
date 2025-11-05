import { Typography, Button, Space, Checkbox, Tabs } from 'antd';
import { Plus, Clock, MapPin, User } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import type { Visita } from '../../types/visita';

dayjs.locale('es');

const { Title, Text } = Typography;

interface VisitasSidebarProps {
  selectedDate: string;
  visitas: Visita[];
  onAddVisita: () => void;
}

const VisitasSidebar = ({ selectedDate, visitas, onAddVisita }: VisitasSidebarProps) => {
  const selectedDay = dayjs(selectedDate);
  const visitasHoy = visitas.filter(v => 
    dayjs(v.fecha_inicio).format('YYYY-MM-DD') === selectedDate
  );

  const mockNotifications = [
    {
      id: '1',
      user: 'Patty Portner',
      action: 'opened',
      time: '3:00 AM - 3:00 AM | Next',
      status: 'pending'
    }
  ];

  const notificationTabs = [
    {
      label: 'Pendiente',
      key: 'pending',
      children: (
        <Space direction="vertical" className="w-full" size="small">
          {mockNotifications.map(notification => (
            <div
              key={notification.id}
              className="d-flex align-center p-12 gap-12"
            >
              <div
                className="d-flex align-center justify-center"
              >
                <User size={16} color="#9ca3af" />
              </div>
              <div className="flex-1">
                <Text className="font-medium">
                  {notification.user} {notification.action}
                </Text>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#9ca3af',
                  marginTop: '2px'
                }}>
                  {notification.time}
                </div>
              </div>
            </div>
          ))}
        </Space>
      )
    },
    {
      label: 'Resuelto',
      key: 'resolved',
      children: (
        <div className="text-center p-24">
          No hay notificaciones resueltas
        </div>
      )
    }
  ];

  return (
    <div className="cal-card d-flex flex-column overflow-hidden">
      {/* Date Header */}
      <div
        className="p-24"
      >
        <Text style={{ 
          fontSize: '14px', 
          color: '#9ca3af',
          textTransform: 'capitalize' 
        }}>
          {selectedDay.format('dddd')}
        </Text>
        <Title level={4} className="m-0">
          {selectedDay.format('DD [de] MMMM')}
        </Title>
      </div>

      {/* Visits Section */}
      <div className="d-flex flex-column">
        <div
          className="d-flex align-center justify-between"
        >
          <Text className="font-semibold">
            Visitas programadas
          </Text>
          <Button
            type="text"
            icon={<Plus size={16} />}
            onClick={onAddVisita}
            style={{
              padding: '4px 8px',
              height: 'auto',
              color: '#33F491'
            }}
          />
        </div>

        <div className="overflow-y-auto">
          {visitasHoy.length === 0 ? (
            <div className="text-center p-24">
              No hay visitas programadas para este día
            </div>
          ) : (
            <Space direction="vertical" className="w-full" size="middle">
              {visitasHoy.map(visita => (
                <div
                  key={visita.id}
                  className="d-flex align-start gap-12 p-16"
                >
                  <Checkbox className="mt-2" />
                  <div className="flex-1">
                    <Text className="font-semibold">
                      {visita.propiedad}
                    </Text>
                    <div className="d-flex align-center mt-4 gap-4">
                      <Clock size={12} />
                      {dayjs(visita.fecha_inicio).format('HH:mm')} - {dayjs(visita.fecha_inicio).add(1, 'hour').format('HH:mm')}
                    </div>
                    <div className="d-flex align-center gap-4">
                      <MapPin size={12} />
                      {visita.plataforma}
                    </div>
                  </div>
                </div>
              ))}
            </Space>
          )}
        </div>
      </div>

      {/* Notifications Section */}
      <div
        style={{
          borderTop: '1px solid #374151',
          backgroundColor: '#1b2a3a',
          minHeight: '200px'
        }}
      >
        <div style={{ padding: '16px 24px 0' }}>
          <Text className="font-semibold">
            Notificaciones
          </Text>
        </div>
        
        <Tabs
          size="small"
          items={notificationTabs}
          style={{ padding: '0 24px' }}
          tabBarStyle={{
            marginBottom: '8px'
          }}
        />
      </div>
    </div>
  );
};

export default VisitasSidebar;