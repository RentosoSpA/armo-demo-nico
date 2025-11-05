import React, { useState, useEffect } from 'react';
import type { MetaMensual } from '../../types/finanzas';
import OsoPaw from './OsoPaw';

interface TermometroProgresoProps {
  meta: MetaMensual;
}

const TermometroProgreso: React.FC<TermometroProgresoProps> = ({ meta }) => {
  console.log('🐻 TermometroProgreso: Props recibidas:', meta);
  const { progreso, objetivoMensual, porcentaje, diasRestantes } = meta;
  const [showCelebration, setShowCelebration] = useState(false);

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  const getBarColor = () => {
    if (porcentaje >= 100) return 'termometro-barra--completo';
    if (porcentaje >= 70) return 'termometro-barra--alto';
    if (porcentaje >= 30) return 'termometro-barra--medio';
    return 'termometro-barra--bajo';
  };

  const faltante = objetivoMensual - progreso;

  useEffect(() => {
    if (porcentaje >= 100) {
      // Activar celebración cuando llega al 100%
      const timer = setTimeout(() => {
        setShowCelebration(true);
      }, 1200); // Espera a que la garrita llegue al final

      return () => clearTimeout(timer);
    } else {
      setShowCelebration(false);
    }
  }, [porcentaje]);

  return (
    <div className="termometro-progreso">
      <div className="termometro-header">
        <div className="termometro-label">
          Tu meta del mes
        </div>
        <div className="termometro-valores">
          <span className="actual">{formatCurrency(progreso)}</span>
          {' / '}
          <span>{formatCurrency(objetivoMensual)}</span>
        </div>
      </div>

      <div className="termometro-barra-wrapper">
        <div
          className={`termometro-barra ${getBarColor()}`}
          style={{ width: `${Math.min(porcentaje, 100)}%` }}
        >
          <div className="termometro-porcentaje">{porcentaje}%</div>

          {/* Garrita del Oso Cuidadoso - se mueve con la barra */}
          <div
            className={`oso-paw-indicator ${showCelebration ? 'celebrating' : ''}`}
          >
            <OsoPaw className="oso-paw-svg" />
            {showCelebration && (
              <div className="confetti-celebration">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      '--angle': `${(i * 30)}deg`,
                      '--delay': `${i * 0.05}s`
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="termometro-footer">
        <span className="termometro-footer-text">
          {porcentaje >= 100 
            ? '🎉 ¡Meta cumplida!' 
            : `Solo te faltan ${formatCurrency(faltante)} 🎯`
          }
        </span>
        <span className="termometro-footer-text">
          {diasRestantes} días restantes
        </span>
      </div>
    </div>
  );
};

export default TermometroProgreso;
