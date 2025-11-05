import React from 'react';
import { Badge } from 'antd';
import { ArrowLeft } from 'lucide-react';
import type { Decision } from '../../types/decision';
import '../../styles/components/_decisions-list.scss';

interface DecisionsListProps {
  decisions: Decision[];
  onDecisionClick: (decisionId: string, href: string) => void;
  onBack: () => void;
}

const getBearEmoji = (bearType: string): string => {
  const bearEmojis: Record<string, string> = {
    curioso: '🐻',
    cauteloso: '🐻‍❄️',
    notarioso: '🧸',
    cuidadoso: '🐻',
  };
  return bearEmojis[bearType] || '🐻';
};

const getBadgeColor = (severity: string): string => {
  const colors: Record<string, string> = {
    info: '#34F5C5',
    warning: '#FFA940',
    urgent: '#FF4080',
  };
  return colors[severity] || '#34F5C5';
};

const getBadgeLeftColor = (source: string): string => {
  const colors: Record<string, string> = {
    oportunidades: '#2EE9A0',
    cobros: '#FFA940',
  };
  return colors[source] || '#2EE9A0';
};

const DecisionsList: React.FC<DecisionsListProps> = ({ decisions, onDecisionClick, onBack }) => {
  return (
    <div className="decisions-list-container">
      {/* Header con botón de volver */}
      <div className="decisions-list-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>Decisiones pendientes</h2>
        <div className="decisions-count-badge">
          <Badge count={decisions.length} />
        </div>
      </div>

      {/* Lista de decisiones */}
      <div className="decisions-list-content">
        {decisions.map((decision) => (
          <div
            key={decision.id}
            className="decision-card"
            onClick={() => onDecisionClick(decision.id, decision.href)}
            style={{
              borderLeftColor: getBadgeLeftColor(decision.source),
            }}
          >
            {/* Emoji del oso */}
            <div className="decision-bear">
              <span>{getBearEmoji(decision.bear)}</span>
            </div>

            {/* Contenido */}
            <div className="decision-content">
              <h3>{decision.title}</h3>
              <p>{decision.message}</p>

              {/* Footer con badge de severidad */}
              <div className="decision-footer">
                <span className="decision-source">
                  {decision.source === 'oportunidades' ? 'Oportunidades' : 'Cobros'}
                </span>
                {decision.count && (
                  <Badge
                    count={decision.count}
                    style={{
                      backgroundColor: getBadgeColor(decision.severity),
                      color: '#fff',
                      fontWeight: 600,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Indicador de acción requerida */}
            {decision.requiresAction && (
              <div className="action-indicator">
                <span className="action-dot"></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecisionsList;
