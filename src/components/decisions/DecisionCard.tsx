import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Decision } from '../../types/decision';
import { useDecisions } from '../../hooks/useDecisions';
import '../../styles/components/_decisions-cards.scss';

interface DecisionCardProps {
  decision: Decision;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ decision }) => {
  const navigate = useNavigate();
  const { markAsRead } = useDecisions();

  const handleClick = async () => {
    await markAsRead(decision.id);
    navigate(decision.href);
  };

  const getBearColor = () => {
    const colors = {
      curioso: '18, 204, 255', // #12CCFF en RGB
      cauteloso: '52, 245, 197', // #34F5C5 en RGB
      notarioso: '212, 175, 55', // #D4AF37 en RGB
      cuidadoso: '89, 52, 245', // #5934F5 en RGB
    };
    return colors[decision.bear];
  };

  const getAccentGradient = () => {
    if (decision.source === 'oportunidades') {
      return 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)';
    } else {
      return 'linear-gradient(180deg, #EAB308 0%, #34F5C5 100%)';
    }
  };

  const getSeverityIcon = () => {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      urgent: '🚨',
    };
    return icons[decision.severity];
  };

  return (
    <div
      className={`decision-card severity-${decision.severity}`}
      onClick={handleClick}
      style={{ '--bear-color': getBearColor() } as React.CSSProperties}
    >
      {/* Accent lateral */}
      <div className="card-accent" style={{ background: getAccentGradient() }} />

      {/* Content */}
      <div className="card-content">
        {/* Bear Icon */}
        <div className="card-bear">
          <span>🐻</span>
        </div>

        {/* Message */}
        <div className="card-body">
          <div className="card-header">
            <span className="severity-icon">{getSeverityIcon()}</span>
            <span className="card-title">{decision.title}</span>
          </div>
          <p className="card-message">{decision.message}</p>
        </div>

        {/* Action */}
        <button className="card-action">
          Ver
        </button>
      </div>
    </div>
  );
};

export default DecisionCard;
