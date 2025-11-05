import React, { useRef, useState, useEffect } from 'react';
import { Zap, CheckCircle, TrendingUp, Clock, X } from 'lucide-react';
import OsoActivityFeed from './OsoActivityFeed';
import '../../styles/components/_oso-flip-card.scss';

const TRANSITION_MS = 500;

interface OsoFlipCardProps {
  id: string;
  name: string;
  description: string;
  color: string;
  activeTasks: number;
  completedTasks: number;
  lastActivity: Date;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const OsoFlipCard: React.FC<OsoFlipCardProps> = ({
  id,
  name,
  description,
  color,
  activeTasks,
  completedTasks,
  lastActivity,
  isExpanded,
  onToggleExpand,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  // Auto-flip cuando se expande
  useEffect(() => {
    if (isExpanded && !isFlipped) {
      setIsFlipped(true);
    }
  }, [isExpanded, isFlipped]);

  const successRate = activeTasks + completedTasks > 0 
    ? Math.round((completedTasks / (activeTasks + completedTasks)) * 100) 
    : 0;

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return 'Hace más de 1 día';
  };

  const triggerEdge = (dir: "right" | "left") => {
    const node = rootRef.current;
    if (!node) return;
    node.classList.remove("edge-anim-right", "edge-anim-left");
    node.offsetWidth; // reflow
    node.classList.add(dir === "right" ? "edge-anim-right" : "edge-anim-left");
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      node.classList.remove("edge-anim-right", "edge-anim-left");
    }, TRANSITION_MS);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Si ya está expandida, no hacer nada (solo el botón X puede colapsar)
    if (isExpanded) return;
    
    // Si no está volteada, voltear y luego expandir automáticamente
    if (!isFlipped) {
      const edgeDirection = "right";
      triggerEdge(edgeDirection);
      setIsFlipped(true);
      
      // Expandir automáticamente después de la animación de volteo
      setTimeout(() => {
        onToggleExpand();
      }, 400);
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleExpand();
  };

  const handleCollapse = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Primero colapsar, luego voltear de regreso
    onToggleExpand();
    setTimeout(() => {
      setIsFlipped(false);
    }, 100);
  };

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Generar gradiente dinámico basado en el color del oso
  const lightenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  };

  const darkenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R > 0 ? R : 0) * 0x10000 +
      (G > 0 ? G : 0) * 0x100 +
      (B > 0 ? B : 0))
      .toString(16).slice(1);
  };

  const gradientFront = `linear-gradient(135deg, ${color} 0%, ${darkenColor(color, 15)} 100%)`;
  const gradientBack = `linear-gradient(135deg, ${darkenColor(color, 20)} 0%, ${darkenColor(color, 35)} 100%)`;

  return (
    <div 
      ref={rootRef}
      className={`oso-flip-card ${isFlipped ? 'revealed' : ''} ${isExpanded ? 'expanded' : ''}`}
      onClick={isExpanded ? undefined : handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${name} - ${description}. Click para ver estadísticas.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isExpanded) handleClick(e as any);
        }
      }}
      style={{
        ['--frontEdgeColor' as string]: `${color}88`,
        ['--backEdgeColor' as string]: `${lightenColor(color, 20)}88`
      }}
    >
      <div className="oso-flip-card__inner">
        {/* Front - Oso con nombre */}
        <div 
          className="oso-flip-card__front"
          style={{ background: gradientFront }}
        >
          <div className="oso-flip-card__content">
            <div className="oso-flip-card__bear-circle" style={{ borderColor: lightenColor(color, 30) }}>
              🐻
            </div>
            <div className="oso-flip-card__title">
              <div className="oso-flip-card__name">{name}</div>
              <div className="oso-flip-card__hint">Click para ver actividad en tiempo real</div>
            </div>
          </div>
        </div>
        
        {/* Back - Estadísticas en tiempo real + Feed opcional */}
        <div 
          className="oso-flip-card__back"
          style={{ background: gradientBack }}
        >
          {isExpanded && (
            <button 
              className="oso-flip-card__close-btn"
              onClick={handleCollapse}
              aria-label="Cerrar vista expandida"
            >
              <X size={20} />
            </button>
          )}

          <div className="oso-flip-card__back-content">
            <div className="oso-flip-card__stats-section">
              <div className="oso-flip-card__stats-grid">
                <div className="oso-flip-card__stat">
                  <Zap size={20} className="stat-icon" />
                  <div className="stat-value">{activeTasks}</div>
                  <div className="stat-label">Activas</div>
                </div>
                
                <div className="oso-flip-card__stat">
                  <CheckCircle size={20} className="stat-icon" />
                  <div className="stat-value">{completedTasks}</div>
                  <div className="stat-label">Completadas</div>
                </div>
                
                <div className="oso-flip-card__stat">
                  <TrendingUp size={20} className="stat-icon" />
                  <div className="stat-value">{successRate}%</div>
                  <div className="stat-label">Éxito</div>
                </div>
                
                <div className="oso-flip-card__stat">
                  <Clock size={20} className="stat-icon" />
                  <div className="stat-value stat-value--small">{getRelativeTime(lastActivity)}</div>
                  <div className="stat-label">Última actividad</div>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="oso-flip-card__feed-section">
                <OsoActivityFeed osoName={name} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OsoFlipCard;
