import React, { useEffect, useRef } from 'react';
import { Tag, Empty } from 'antd';
import { useWhatsAppChatStore } from '../../store/whatsappChatStore';
import type { BrigadaActivity } from '../../types/whatsapp-chat';

export const BrigadaActivityFeed: React.FC = () => {
  const { brigadaActivities } = useWhatsAppChatStore();
  const feedRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [brigadaActivities]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'pending': return 'processing';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };
  
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  };
  
  const getAgentColor = (agentName: string) => {
    switch (agentName) {
      case 'CuriOso': return '#1890ff';
      case 'Oso Cauteloso': return '#722ed1';
      case 'Oso Notarioso': return '#fa8c16';
      case 'Oso Cuidadoso': return '#52c41a';
      case 'OptimizOso': return '#eb2f96';
      default: return '#8c8c8c';
    }
  };
  
  return (
    <div className="brigada-column">
      <div className="brigada-header">
        <h3 className="brigada-title">
          <span className="title-emoji">🐻</span>
          Actividad de la Brigada
        </h3>
      </div>
      
      <div className="brigada-feed" ref={feedRef}>
        {brigadaActivities.length === 0 ? (
          <Empty description="Sin actividad reciente" />
        ) : (
          brigadaActivities.map((activity: BrigadaActivity) => (
            <div 
              key={activity.id} 
              className={`activity-item status-${activity.status}`}
            >
              <div className="activity-icon" style={{ color: getAgentColor(activity.agentName) }}>
                {activity.icon}
              </div>
              <div className="activity-details">
                <div className="activity-agent" style={{ color: getAgentColor(activity.agentName) }}>
                  {activity.agentName}
                </div>
                <div className="activity-action">{activity.action}</div>
                <div className="activity-property">{activity.propiedadTitulo}</div>
                <div className="activity-timestamp">{getRelativeTime(activity.timestamp)}</div>
              </div>
              <div className="activity-status">
                <Tag color={getStatusColor(activity.status)}>
                  {activity.status === 'success' ? 'Completado' : 
                   activity.status === 'pending' ? 'En proceso' : 'Atención'}
                </Tag>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
