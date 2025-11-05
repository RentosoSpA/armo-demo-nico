import React, { useState, useEffect } from 'react';
import { Button, Input, message } from 'antd';
import { Pencil } from 'lucide-react';
import type { MetaMensual, KPI, FinanzasData } from '../../types/finanzas';
import KPICard from './KPICard';
import OsoGoalGauge from './OsoGoalGauge';

interface ResumenGeneralProps {
  userName: string;
  meta: MetaMensual;
  kpis: KPI[];
  datosGrafico: FinanzasData['porMes'];
  onExportarPDF: () => void;
  onVerFlujo: () => void;
  onUpdateMeta?: (nuevaMeta: number) => void;
}

const ResumenGeneral: React.FC<ResumenGeneralProps> = ({
  userName,
  meta,
  kpis,
  datosGrafico,
  onUpdateMeta,
}) => {
  console.log('🐻 ResumenGeneral: Componente montado con props:', { userName, meta, kpis, datosGrafico });
  console.log('🐻 ResumenGeneral: Validando props - meta:', meta, 'kpis:', kpis, 'userName:', userName);

  const [showConfetti, setShowConfetti] = useState(false);
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [editedMeta, setEditedMeta] = useState(meta.objetivoMensual);

  useEffect(() => {
    if (meta.porcentaje >= 100 && !showConfetti) {
      console.log('🐻 ResumenGeneral: ¡Meta cumplida! Mostrando confetti');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [meta.porcentaje, showConfetti]);

  const handleEditMeta = () => {
    setIsEditingMeta(true);
    setEditedMeta(meta.objetivoMensual);
  };

  const handleSaveMeta = () => {
    if (editedMeta <= 0) {
      message.error('La meta debe ser mayor a 0');
      return;
    }
    if (onUpdateMeta) {
      onUpdateMeta(editedMeta);
      message.success('Meta actualizada correctamente');
    }
    setIsEditingMeta(false);
  };

  const handleCancelEdit = () => {
    setIsEditingMeta(false);
    setEditedMeta(meta.objetivoMensual);
  };

  const formatMetaValue = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className="resumen-general-compact">
      <div className="resumen-compact-layout">
        {/* Columna Izquierda: Barra de progreso */}
        <div className="resumen-progress-column">
          <div className="resumen-header-compact">
            <h4 className="resumen-title-compact">
              {meta.porcentaje}% de tu meta{' '}
              {isEditingMeta ? (
                <span className="meta-edit-container">
                  <Input
                    type="number"
                    value={editedMeta}
                    onChange={(e) => setEditedMeta(Number(e.target.value))}
                    onPressEnter={handleSaveMeta}
                    onBlur={handleSaveMeta}
                    className="meta-input"
                    prefix="$"
                    autoFocus
                    style={{ width: '100px' }}
                  />
                  <Button
                    type="text"
                    size="small"
                    onClick={handleCancelEdit}
                    className="meta-cancel-btn"
                  >
                    ✕
                  </Button>
                </span>
              ) : (
                <span
                  className="meta-editable"
                  onClick={handleEditMeta}
                  title="Click para editar meta"
                >
                  {formatMetaValue(meta.objetivoMensual)}
                  <Pencil size={14} className="meta-edit-icon" />
                </span>
              )}
            </h4>
            {showConfetti && (
              <div className="meta-cumplida-badge-compact">
                🎉 ¡Meta cumplida!
              </div>
            )}
          </div>

          <div className="gauge-container-compact">
            <OsoGoalGauge meta={meta} />
          </div>
        </div>

        {/* Columna Derecha: Mini KPIs */}
        <div className="resumen-kpis-column">
          {kpis.map((kpi, index) => (
            <KPICard key={index} kpi={kpi} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumenGeneral;
