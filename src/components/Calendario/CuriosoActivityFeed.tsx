import React, { useState, useEffect } from 'react';
import { Typography, Select, Space } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

const { Text } = Typography;

export interface CuriosoActivity {
  id: string;
  type: 'scheduling' | 'confirmed' | 'rescheduled' | 'waiting_response' | 'cancelled';
  prospecto: string;
  propiedad: string;
  timestamp: string;
  status: 'in_progress' | 'completed' | 'pending';
  metadata?: {
    previousDate?: string;
    reason?: string;
  };
}

interface CuriosoActivityFeedProps {
  activities: CuriosoActivity[];
  isTyping?: boolean;
}

const getActivityIcon = (type: CuriosoActivity['type']) => {
  switch (type) {
    case 'scheduling':
      return '📅';
    case 'confirmed':
      return '✅';
    case 'rescheduled':
      return '🔄';
    case 'waiting_response':
      return '⏳';
    case 'cancelled':
      return '❌';
    default:
      return '📌';
  }
};

const getActivityText = (type: CuriosoActivity['type']) => {
  switch (type) {
    case 'scheduling':
      return 'Agendando visita';
    case 'confirmed':
      return 'Visita confirmada';
    case 'rescheduled':
      return 'Visita reagendada';
    case 'waiting_response':
      return 'Esperando respuesta';
    case 'cancelled':
      return 'Visita cancelada';
    default:
      return 'Actividad';
  }
};

const getActivityColor = (type: CuriosoActivity['type']) => {
  switch (type) {
    case 'scheduling':
      return '#3B82F6';
    case 'confirmed':
      return '#10B981';
    case 'rescheduled':
      return '#8B5CF6';
    case 'waiting_response':
      return '#F59E0B';
    case 'cancelled':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

const CuriosoActivityFeed: React.FC<CuriosoActivityFeedProps> = ({ 
  activities, 
  isTyping = false 
}) => {
  const [filter, setFilter] = useState<'today' | 'week' | 'all'>('today');
  const [filteredActivities, setFilteredActivities] = useState<CuriosoActivity[]>(activities);

  useEffect(() => {
    let filtered = activities;
    const now = dayjs();

    if (filter === 'today') {
      filtered = activities.filter(a => dayjs(a.timestamp).isSame(now, 'day'));
    } else if (filter === 'week') {
      filtered = activities.filter(a => dayjs(a.timestamp).isAfter(now.subtract(7, 'day')));
    }

    setFilteredActivities(filtered);
  }, [activities, filter]);

  return (
    <div className="curioso-activity-feed">
      {/* Header */}
      <div className="curioso-activity-feed__header">
        <div className="curioso-activity-feed__title">
          <span className="curioso-activity-feed__bear">🐻‍❄️</span>
          <Text className="curioso-activity-feed__title-text">
            CuriOso en Acción
          </Text>
        </div>
        <div className="curioso-activity-feed__status">
          <span className="curioso-activity-feed__status-dot"></span>
        </div>
      </div>

      {/* Filter */}
      <div className="curioso-activity-feed__filter">
        <Select
          value={filter}
          onChange={setFilter}
          size="small"
          style={{ width: '100%' }}
          options={[
            { value: 'today', label: 'Hoy' },
            { value: 'week', label: 'Esta semana' },
            { value: 'all', label: 'Todas' },
          ]}
        />
      </div>

      {/* Activities Timeline */}
      <div className="curioso-activity-feed__timeline">
        {isTyping && (
          <div className="curioso-activity-feed__typing">
            <div className="curioso-activity-feed__typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <Text className="curioso-activity-feed__typing-text">
              CuriOso está procesando...
            </Text>
          </div>
        )}

        {filteredActivities.length === 0 ? (
          <div className="curioso-activity-feed__empty">
            <Text className="curioso-activity-feed__empty-text">
              No hay actividad reciente
            </Text>
          </div>
        ) : (
          <Space direction="vertical" className="w-full" size={12}>
            {filteredActivities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="curioso-activity-feed__item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="curioso-activity-feed__item-indicator"
                  style={{ backgroundColor: getActivityColor(activity.type) }}
                >
                  <span className="curioso-activity-feed__item-icon">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                
                <div className="curioso-activity-feed__item-content">
                  <Text className="curioso-activity-feed__item-title">
                    {getActivityText(activity.type)}
                  </Text>
                  <Text className="curioso-activity-feed__item-details">
                    {activity.prospecto} → {activity.propiedad}
                  </Text>
                  <Text className="curioso-activity-feed__item-time">
                    {dayjs(activity.timestamp).fromNow()}
                  </Text>
                </div>

                {activity.status === 'in_progress' && (
                  <div className="curioso-activity-feed__item-badge">
                    <span className="curioso-activity-feed__item-badge-pulse"></span>
                  </div>
                )}
              </div>
            ))}
          </Space>
        )}
      </div>
    </div>
  );
};

export default CuriosoActivityFeed;
