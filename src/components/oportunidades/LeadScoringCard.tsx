import React, { useState } from 'react';
import { Card, Progress } from 'antd';
import { TrophyOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import type { LeadProfile } from '../../types/whatsapp-chat';

interface LeadScoringCardProps {
  lead: LeadProfile;
}

export const LeadScoringCard: React.FC<LeadScoringCardProps> = ({ lead }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!lead.matchPercentage || !lead.scoring) {
    return null;
  }
  
  return (
    <Card 
      className="lead-scoring-card"
      size="small"
    >
      <div 
        className="scoring-header"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <div className="scoring-title">
          <TrophyOutlined className="scoring-icon" />
          <span>Match Score: {lead.matchPercentage}%</span>
        </div>
        {isExpanded ? <UpOutlined /> : <DownOutlined />}
      </div>
      
      {isExpanded && (
        <div className="scoring-details">
          <div className="scoring-item">
            <div className="scoring-label">Ingresos</div>
            <Progress 
              percent={lead.scoring.ingresos} 
              size="small" 
              strokeColor="#52c41a"
            />
          </div>
          
          <div className="scoring-item">
            <div className="scoring-label">Documentos</div>
            <Progress 
              percent={lead.scoring.documentos} 
              size="small" 
              strokeColor="#1890ff"
            />
          </div>
          
          <div className="scoring-item">
            <div className="scoring-label">Total</div>
            <Progress 
              percent={lead.scoring.total} 
              size="small" 
              strokeColor="#722ed1"
            />
          </div>
          
          <div className="lead-info">
            <div><strong>Nombre:</strong> {lead.nombre}</div>
            <div><strong>Teléfono:</strong> {lead.telefono}</div>
            {lead.email && <div><strong>Email:</strong> {lead.email}</div>}
          </div>
        </div>
      )}
    </Card>
  );
};
