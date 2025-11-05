import React from 'react';
import type { JourneyStage } from '../../types/whatsapp-chat';
import '../../styles/components/_lead-journey-timeline.scss';

interface JourneyStep {
  key: JourneyStage;
  oso: string;
  emoji: string;
  label: string;
}

interface LeadJourneyTimelineProps {
  currentStage: JourneyStage;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    key: 'inicial',
    oso: 'CuriOso',
    emoji: '🐻‍❄️',
    label: 'Contacto Inicial'
  },
  {
    key: 'docs_solicitados',
    oso: 'Cauteloso',
    emoji: '🧸',
    label: 'Docs Solicitados'
  },
  {
    key: 'docs_enviados',
    oso: 'Notarioso',
    emoji: '🐻',
    label: 'Docs Recibidos'
  },
  {
    key: 'evaluado',
    oso: 'Cuidadoso',
    emoji: '🐨',
    label: 'Evaluado'
  }
];

export const LeadJourneyTimeline: React.FC<LeadJourneyTimelineProps> = ({ currentStage }) => {
  const currentIndex = JOURNEY_STEPS.findIndex(step => step.key === currentStage);

  const getStepStatus = (index: number): 'completed' | 'current' | 'pending' => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="lead-journey-timeline">
      <div className="timeline-container">
        {JOURNEY_STEPS.map((step, index) => {
          const status = getStepStatus(index);
          const isLastStep = index === JOURNEY_STEPS.length - 1;

          return (
            <React.Fragment key={step.key}>
              {/* Step Circle */}
              <div className="timeline-step-wrapper">
                <div className={`timeline-step timeline-step--${status}`}>
                  <div className="timeline-step-circle">
                    <span className="timeline-step-emoji">{step.emoji}</span>
                  </div>
                </div>
                <div className="timeline-step-labels">
                  <div className="timeline-step-oso">{step.oso}</div>
                  <div className="timeline-step-label">{step.label}</div>
                </div>
              </div>

              {/* Connecting Line (except after last step) */}
              {!isLastStep && (
                <div className={`timeline-line timeline-line--${status === 'completed' || (status === 'current' && index < currentIndex) ? 'active' : 'inactive'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
