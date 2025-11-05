import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../store/userStore';
import { useDecisions } from '../../hooks/useDecisions';
import DecisionsList from './DecisionsList';
import '../../styles/components/_decisions-modal.scss';

const BearDecisionModal: React.FC = () => {
  const navigate = useNavigate();
  const { displayName } = useUser();
  const { modalVisible, decisionsCount, decisions, dismissModal, dismissModalToFab, markAsRead } = useDecisions();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDecisionsList, setShowDecisionsList] = useState(false);

  const handleGoToDashboard = () => {
    console.log('[BearDecisionModal] Go to Dashboard clicked');
    console.log('[BearDecisionModal] Current path:', window.location.pathname);
    setIsAnimating(true);

    // Animación de salida 100ms
    setTimeout(() => {
      // Después de la animación, cerrar el modal y mostrar el FAB
      dismissModalToFab();
      setIsAnimating(false);

      // Solo navegar si NO estamos en /tablero
      if (window.location.pathname !== '/tablero') {
        console.log('[BearDecisionModal] Navigating to /tablero');
        navigate('/tablero');
      } else {
        console.log('[BearDecisionModal] Already on /tablero, just closing modal');
      }
    }, 150);
  };

  const handleViewDecisions = () => {
    console.log('[BearDecisionModal] View Decisions clicked - showing decisions list');
    setShowDecisionsList(true);
  };

  const handleBackToWelcome = () => {
    console.log('[BearDecisionModal] Back to welcome screen');
    setShowDecisionsList(false);
  };

  const handleDecisionClick = async (decisionId: string, href: string) => {
    console.log('[BearDecisionModal] Decision clicked:', decisionId, href);

    // Marcar como leída
    await markAsRead(decisionId);

    // Cerrar modal
    dismissModal();

    // Navegar a la ruta
    setTimeout(() => {
      navigate(href);
    }, 100);
  };

  // Reset showDecisionsList when modal closes
  useEffect(() => {
    if (!modalVisible && !isAnimating) {
      setShowDecisionsList(false);
    }
  }, [modalVisible, isAnimating]);

  console.log('[BearDecisionModal] Render - modalVisible:', modalVisible, 'decisionsCount:', decisionsCount, 'isAnimating:', isAnimating, 'showDecisionsList:', showDecisionsList);

  // Mantener el modal montado durante la animación, luego desmontarlo
  if (!modalVisible && !isAnimating) {
    console.log('[BearDecisionModal] Not rendering - modal closed and not animating');
    return null;
  }

  return (
    <Modal
      open={modalVisible || isAnimating}
      footer={null}
      closable={false}
      centered
      width={560}
      className={`bear-decision-modal ${isAnimating ? 'morphing' : ''}`}
      transitionName=""
      maskTransitionName=""
      afterClose={() => {
        console.log('[BearDecisionModal] Modal afterClose callback');
      }}
      styles={{
        mask: {
          backgroundColor: 'rgba(8, 11, 22, 0.85)',
          backdropFilter: 'blur(12px)',
        },
      }}
    >
      <div className="modal-content">
        {!showDecisionsList ? (
          <>
            {/* Animated Bear Icon */}
            <div className="bear-icon-container">
              <div className="bear-icon">
                <span className="bear-emoji">🐻</span>
                <div className="bear-glow"></div>
              </div>
            </div>

            {/* Message */}
            <div className="modal-message">
              <h2>Hola {displayName || 'amigo'},</h2>
              <p>
                tienes <span className="count-highlight">{decisionsCount}</span> {decisionsCount === 1 ? 'decisión importante' : 'decisiones importantes'} que {decisionsCount === 1 ? 'espera' : 'esperan'} tu aprobación.
              </p>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleViewDecisions}>
                Ver decisiones
              </button>
              <button className="btn-secondary" onClick={handleGoToDashboard}>
                Ir al tablero
              </button>
            </div>
          </>
        ) : (
          <DecisionsList
            decisions={decisions}
            onDecisionClick={handleDecisionClick}
            onBack={handleBackToWelcome}
          />
        )}
      </div>
    </Modal>
  );
};

export default BearDecisionModal;
