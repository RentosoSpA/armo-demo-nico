import React, { useEffect, useState, useRef } from 'react';
import { Badge } from 'antd';
import { useDecisions } from '../../hooks/useDecisions';
import '../../styles/components/_decisions-fab.scss';

const DecisionsFab: React.FC = () => {
  const { decisionsCount, hasDecisions, showFab, setModalVisible, modalVisible } = useDecisions();
  const [isPulsing, setIsPulsing] = useState(false);
  const prevModalVisibleRef = useRef<boolean>(modalVisible);

  console.log('[DecisionsFab] Render - hasDecisions:', hasDecisions, 'showFab:', showFab, 'decisionsCount:', decisionsCount);

  // Detectar cuando el modal se cierra para activar el pulso
  useEffect(() => {
    const wasVisible = prevModalVisibleRef.current;
    const isNowHidden = !modalVisible;

    // Solo activar pulso cuando el modal pasa de visible a oculto
    if (wasVisible && isNowHidden && showFab) {
      console.log('[DecisionsFab] Modal closed - triggering pulse');
      setIsPulsing(true);
      const timeout = setTimeout(() => {
        setIsPulsing(false);
      }, 100);

      prevModalVisibleRef.current = modalVisible;
      return () => clearTimeout(timeout);
    }

    prevModalVisibleRef.current = modalVisible;
  }, [modalVisible, showFab]);

  // Mostrar solo si hay decisiones Y el flag showFab está activo
  if (!hasDecisions || !showFab) {
    console.log('[DecisionsFab] Not showing - no decisions or showFab is false');
    return null;
  }

  console.log('[DecisionsFab] Rendering FAB!');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[DecisionsFab] FAB clicked - opening modal');
    // Abrir el modal de nuevo
    setModalVisible(true);
  };

  return (
    <div
      className={`decisions-fab-container ${isPulsing ? 'modal-closing' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <Badge count={decisionsCount} offset={[-8, 8]} className="decisions-fab-badge">
        <button
          className="decisions-fab"
          onClick={handleClick}
          aria-label="Ver decisiones pendientes"
          type="button"
        >
          <span className="fab-icon">🐻</span>
          <div className="fab-glow"></div>
        </button>
      </Badge>
    </div>
  );
};

export default DecisionsFab;
