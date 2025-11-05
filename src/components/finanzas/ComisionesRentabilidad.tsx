import React, { useState } from 'react';
import { message, Input, Button } from 'antd';
import { Pencil } from 'lucide-react';
import type { Comision, ComisionesStats } from '../../types/finanzas';
import { useNavigate } from 'react-router-dom';

interface ComisionesRentabilidadProps {
  comisiones: Comision[];
  stats: ComisionesStats;
  porcentajeComision?: number;
  onUpdatePorcentaje?: (nuevoPorcentaje: number) => void;
}

const ComisionesRentabilidad: React.FC<ComisionesRentabilidadProps> = ({
  comisiones,
  stats,
  porcentajeComision = 50,
  onUpdatePorcentaje
}) => {
  console.log('🐻🔥 ComisionesRentabilidad: NUEVO BUILD - porcentajeComision =', porcentajeComision);
  console.log('🐻 ComisionesRentabilidad: Componente montado con:', { comisiones, stats, porcentajeComision });

  const navigate = useNavigate();
  const [isEditingPorcentaje, setIsEditingPorcentaje] = useState(false);
  const [editedPorcentaje, setEditedPorcentaje] = useState(porcentajeComision);

  const top3 = [...comisiones]
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 3);

  console.log('🐻 ComisionesRentabilidad: Top 3 =', top3);

  const getMedalla = (index: number) => {
    const medallas = ['🥇', '🥈', '🥉'];
    return medallas[index] || '';
  };

  const handleClickPropiedad = (propiedadId: string) => {
    navigate(`/propiedades/${propiedadId}`);
  };

  const handleEditPorcentaje = () => {
    setIsEditingPorcentaje(true);
    setEditedPorcentaje(porcentajeComision);
  };

  const handleSavePorcentaje = () => {
    if (editedPorcentaje < 0 || editedPorcentaje > 100) {
      message.error('El porcentaje debe estar entre 0 y 100');
      return;
    }
    if (onUpdatePorcentaje) {
      onUpdatePorcentaje(editedPorcentaje);
      message.success('Porcentaje de comisión actualizado');
    }
    setIsEditingPorcentaje(false);
  };

  const handleCancelEdit = () => {
    setIsEditingPorcentaje(false);
    setEditedPorcentaje(porcentajeComision);
  };

  return (
    <div className="comisiones-compact">
      <div className="comisiones-summary">
        <div className="comisiones-total-card">
          <span className="comisiones-total-label">Total del mes</span>
          <span className="comisiones-total-value">${stats.totalMes.toLocaleString('es-CL')}</span>
        </div>
        <div className="comisiones-stats-mini">
          <div className="stat-mini">
            <span className="stat-mini-label">Promedio</span>
            <span className="stat-mini-value">${stats.promedioComision.toLocaleString('es-CL')}</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini-label">Porcentaje de Comisión</span>
            {isEditingPorcentaje ? (
              <span className="stat-mini-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Input
                  type="number"
                  value={editedPorcentaje}
                  onChange={(e) => setEditedPorcentaje(Number(e.target.value))}
                  onPressEnter={handleSavePorcentaje}
                  onBlur={handleSavePorcentaje}
                  suffix="%"
                  autoFocus
                  style={{ width: '70px' }}
                  size="small"
                  min={0}
                  max={100}
                />
                <Button
                  type="text"
                  size="small"
                  onClick={handleCancelEdit}
                  style={{ padding: '0 4px', minWidth: 'auto', height: 'auto' }}
                >
                  ✕
                </Button>
              </span>
            ) : (
              <span
                className="stat-mini-value"
                onClick={handleEditPorcentaje}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Click para editar"
              >
                {porcentajeComision}%
                <Pencil size={12} style={{ opacity: 0.6 }} />
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="comisiones-top3-compact">
        <h4 className="comisiones-top3-title">Top 3 Propiedades</h4>
        <div className="top3-list-compact">
          {top3.map((comision, index) => (
            <div
              key={comision.id}
              className="top3-item-compact"
              onClick={() => handleClickPropiedad(comision.propiedadId)}
            >
              <div className="top3-rank">{getMedalla(index)}</div>
              <div className="top3-info">
                <span className="top3-nombre">{comision.propiedadNombre}</span>
                <span className="top3-monto">${comision.monto.toLocaleString('es-CL')}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-ver-todas" onClick={() => message.info('Ver tabla completa próximamente')}>
          Ver todas las comisiones
        </button>
      </div>
    </div>
  );
};

export default ComisionesRentabilidad;
