import React, { useState, useEffect } from 'react';
import type { MetaMensual } from '../../types/finanzas';
import OsoPaw from './OsoPaw';

interface OsoGoalGaugeProps {
  meta: MetaMensual;
}

const OsoGoalGauge: React.FC<OsoGoalGaugeProps> = ({ meta }) => {
  console.log('🐻 OsoGoalGauge: Props recibidas:', meta);
  const { progreso, objetivoMensual, porcentaje, diasRestantes } = meta;
  const [showCelebration, setShowCelebration] = useState(false);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const formatCurrency = (value: number) => {
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  const getMotivationalMessage = () => {
    if (porcentaje >= 100) return '¡Meta cumplida! 🎉';
    if (porcentaje >= 90) return '¡Casi lo logras! 💪';
    if (porcentaje >= 75) return '¡Vas excelente! ⭐';
    if (porcentaje >= 50) return 'Mitad del camino 🚀';
    if (porcentaje >= 25) return '¡Sigue así! 🐾';
    return '¡Tú puedes! 💫';
  };

  const getGradientColor = () => {
    if (porcentaje >= 100) return '#10b981'; // verde
    if (porcentaje >= 70) return '#22c55e'; // verde-amarillo
    if (porcentaje >= 50) return '#eab308'; // amarillo
    if (porcentaje >= 30) return '#f59e0b'; // naranja
    return '#ef4444'; // rojo
  };

  const faltante = objetivoMensual - progreso;

  // Animación de progreso al montar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(Math.min(porcentaje, 100));
    }, 300);
    return () => clearTimeout(timer);
  }, [porcentaje]);

  // Detectar celebración al 100%
  useEffect(() => {
    if (porcentaje >= 100) {
      const timer = setTimeout(() => {
        setShowCelebration(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
    }
  }, [porcentaje]);

  // Calcular ángulo del arco (de -90deg a 90deg, total 180deg)
  const startAngle = -90;
  const endAngle = 90;
  const totalAngle = endAngle - startAngle; // 180 grados
  const currentAngle = startAngle + (animatedPercentage / 100) * totalAngle;

  // SVG parameters para el arco
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  const strokeWidth = 16;

  // Función para convertir ángulo a coordenadas del arco
  const polarToCartesian = (angle: number) => {
    const angleInRadians = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Crear el path del arco de fondo (gris)
  const createArcPath = (start: number, end: number) => {
    const startCoords = polarToCartesian(start);
    const endCoords = polarToCartesian(end);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return [
      'M',
      startCoords.x,
      startCoords.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      endCoords.x,
      endCoords.y,
    ].join(' ');
  };

  // Path del arco de fondo
  const backgroundArcPath = createArcPath(startAngle, endAngle);

  // Path del arco de progreso
  const progressArcPath = createArcPath(startAngle, currentAngle);

  // Posición de la garrita (al final del arco de progreso)
  const pawPosition = polarToCartesian(currentAngle);

  return (
    <div className="oso-goal-gauge">
      <div className="gauge-container">
        <svg
          width="300"
          height="180"
          viewBox="0 0 300 200"
          className="gauge-svg"
        >
          <defs>
            {/* Gradiente dinámico según progreso */}
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: getGradientColor(), stopOpacity: 1 }} />
            </linearGradient>

            {/* Filtro de glassmorphism para el arco */}
            <filter id="glassArc" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0"
                result="glass"
              />
            </filter>

            {/* Glow para celebración */}
            <filter id="celebrationGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Arco de fondo (gris translúcido) */}
          <path
            d={backgroundArcPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#glassArc)"
          />

          {/* Arco de progreso (con gradiente) */}
          <path
            d={progressArcPath}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#glassArc)"
            className="gauge-progress-arc"
            style={{
              transition: 'd 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />

          {/* Garrita del Oso Cuidadoso */}
          <g
            transform={`translate(${pawPosition.x - 20}, ${pawPosition.y - 20})`}
            className={`gauge-paw ${showCelebration ? 'celebrating' : ''}`}
            style={{
              transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <OsoPaw className="gauge-paw-svg" />
          </g>

          {/* Confetti de celebración */}
          {showCelebration && (
            <g className="gauge-confetti">
              {[...Array(16)].map((_, i) => {
                const angle = (i * 360) / 16;
                const distance = 30 + Math.random() * 20;
                const angleRad = (angle * Math.PI) / 180;
                const x = pawPosition.x + distance * Math.cos(angleRad);
                const y = pawPosition.y + distance * Math.sin(angleRad);
                const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899'];
                const color = colors[i % colors.length];

                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={color}
                    filter="url(#celebrationGlow)"
                    className="confetti-particle"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* Mensaje motivacional en el centro */}
        <div className="gauge-center-message">
          <div className="gauge-amount gauge-amount--current">
            <div className="gauge-amount-label">Actual</div>
            <div className="gauge-amount-value">{formatCurrency(progreso)}</div>
          </div>
          
        </div>
      </div>

      {/* Footer con información financiera */}
      <div className="gauge-footer">
        <div className="gauge-footer-amounts">
          <div className="gauge-motivational-text">
            {getMotivationalMessage()}
          </div>
          
        </div>
        <div className="gauge-footer-info">
          {porcentaje >= 100 ? (
            <span className="gauge-info-success">
              🎉 ¡Meta superada!
            </span>
          ) : (
            <>
              <span className="gauge-info-missing">
                Faltan {formatCurrency(faltante)}
              </span>
              <span className="gauge-info-separator">·</span>
              <span className="gauge-info-days">
                {diasRestantes} días restantes
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OsoGoalGauge;
