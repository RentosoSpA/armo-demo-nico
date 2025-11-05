import React, { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import '../../styles/components/_flip-card.scss';

const TRANSITION_MS = 500; // debe coincidir con el width .5s del SCSS

interface FlipCardProps {
  titleFront: string;
  valueFront: string | number;
  iconFront: ReactNode;
  gradientFrontClass: string;
  titleBack: string;
  valueBack: string | number;
  iconBack: ReactNode;
  gradientBackClass: string;
  frontEdgeColor?: string;
  backEdgeColor?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  titleFront,
  valueFront,
  iconFront,
  gradientFrontClass,
  titleBack,
  valueBack,
  iconBack,
  gradientBackClass,
  frontEdgeColor,
  backEdgeColor
}) => {
  const [revealed, setRevealed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const triggerEdge = (dir: "right" | "left") => {
    const node = rootRef.current;
    if (!node) return;
    node.classList.remove("edge-anim-right", "edge-anim-left");
    // reflow para reiniciar animación
    node.offsetWidth;
    node.classList.add(dir === "right" ? "edge-anim-right" : "edge-anim-left");
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      node.classList.remove("edge-anim-right", "edge-anim-left");
    }, TRANSITION_MS);
  };

  const onPointerEnter = () => {
    // si estamos en front (revealed=false) → vamos a back → borde derecha
    const edgeDirection = revealed ? "left" : "right";
    triggerEdge(edgeDirection);
    setRevealed(v => !v);
  };

  const onPointerLeave = () => {}; // persistente, no revertir ni animar
  const onClick = (e: React.MouseEvent) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    /* sin acción */ 
  };

  return (
    <div 
      ref={rootRef}
      className={`flip-card ${revealed ? 'revealed' : ''}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      style={{
        ['--frontEdgeColor' as string]: frontEdgeColor || 'rgba(255,255,255,.18)',
        ['--backEdgeColor' as string]: backEdgeColor || 'rgba(255,255,255,.35)'
      }}
    >
      <div className="flip-card__inner">
        {/* Front */}
        <div className={`flip-card__front ${gradientFrontClass}`}>
          <div className="flip-card__content">
            <div className="flip-card__icon">
              {iconFront}
            </div>
            <div className="stat-content">
              <div className="stat-value kpi">
                {valueFront}
              </div>
              <div className="stat-title subtitle">
                {titleFront}
              </div>
            </div>
          </div>
        </div>
        
        {/* Back */}
        <div className={`flip-card__back ${gradientBackClass}`}>
          <div className="flip-card__content">
            <div className="flip-card__icon">
              {iconBack}
            </div>
            <div className="stat-content">
              <div className="stat-value kpi">
                {valueBack}
              </div>
              <div className="stat-title subtitle">
                {titleBack}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;