import React, { useState } from 'react';
import { message } from 'antd';
import type { Gasto } from '../../types/finanzas';

interface GastosFacturasProps {
  gastos: Gasto[];
  onRegistrarGasto: () => void;
  onAdjuntarFactura: (gastoId: string) => void;
}

const GastosFacturas: React.FC<GastosFacturasProps> = ({
  gastos,
  onRegistrarGasto,
  onAdjuntarFactura,
}) => {
  const [activeTab, setActiveTab] = useState<'Fijo' | 'Variable'>('Fijo');
  const [osoMessage, setOsoMessage] = useState<string | null>(null);

  console.log('🐻 GastosFacturas: Componente montado con gastos =', gastos);

  const gastosFijos = gastos.filter(g => g.categoria === 'Fijo');
  const gastosVariables = gastos.filter(g => g.categoria === 'Variable');
  const gastosActuales = activeTab === 'Fijo' ? gastosFijos : gastosVariables;

  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
  const gastosPendientes = gastos.filter(g => g.estado === 'Pendiente' || g.estado === 'Atrasado');

  const getEstadoClass = (estado: Gasto['estado']) => {
    const classes = {
      'Pagado': 'gasto-estado-pagado',
      'Pendiente': 'gasto-estado-pendiente',
      'Atrasado': 'gasto-estado-atrasado',
    };
    return classes[estado];
  };

  const getEstadoIcon = (estado: Gasto['estado']) => {
    const icons = {
      'Pagado': '🟢',
      'Pendiente': '🟡',
      'Atrasado': '🔴',
    };
    return icons[estado];
  };

  const handleMarcarPagado = (gasto: Gasto) => {
    setOsoMessage('El Oso Cuidadoso verificó el pago 🧾');
    message.success(`${gasto.nombre} marcado como pagado`);
    setTimeout(() => setOsoMessage(null), 3000);
  };

  const handleConectarBanco = () => {
    message.info('Conectando con Fintoc...');
  };

  React.useEffect(() => {
    if (gastosPendientes.length > 0 && !osoMessage) {
      const timer = setTimeout(() => {
        setOsoMessage('El Oso Cuidadoso te recuerda registrarlos pronto 🐾');
        setTimeout(() => setOsoMessage(null), 4000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gastosPendientes.length]);

  return (
    <div className="gastos-facturas-compact">
      <div className="gastos-total-mini">
        <span className="gastos-total-mini-label">Total del Mes</span>
        <span className="gastos-total-mini-value">${totalGastos.toLocaleString('es-CL')}</span>
      </div>

      <div className="gastos-tabs">
        <button
          className={`gastos-tab ${activeTab === 'Fijo' ? 'active' : ''}`}
          onClick={() => setActiveTab('Fijo')}
        >
          Fijos ({gastosFijos.length})
        </button>
        <button
          className={`gastos-tab ${activeTab === 'Variable' ? 'active' : ''}`}
          onClick={() => setActiveTab('Variable')}
        >
          Variables ({gastosVariables.length})
        </button>
      </div>

      {osoMessage && (
        <div className="oso-message-gastos">
          {osoMessage}
        </div>
      )}

      <div className="gastos-list-compact gastos-list-fade">
        {gastosActuales.map(gasto => (
          <div key={gasto.id} className={`gasto-card-mini ${getEstadoClass(gasto.estado)}`}>
            <div className="gasto-border-indicator"></div>

            <div className="gasto-mini-content">
              <div className="gasto-mini-header">
                <span className="gasto-mini-nombre">{gasto.nombre}</span>
                <span className="gasto-mini-monto">${gasto.monto.toLocaleString('es-CL')}</span>
              </div>
              <div className="gasto-mini-footer">
                <span className="gasto-mini-categoria">{gasto.categoria}</span>
                <div className="gasto-mini-footer-right">
                  <span className={`gasto-mini-estado ${getEstadoClass(gasto.estado)}`}>
                    {getEstadoIcon(gasto.estado)} {gasto.estado}
                  </span>
                  {gasto.estado !== 'Pagado' && (
                    <button
                      className="btn-marcar-pagado"
                      onClick={() => handleMarcarPagado(gasto)}
                      title="Marcar como pagado"
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="gastos-actions">
        <button className="btn-gasto-action btn-registrar" onClick={onRegistrarGasto}>
          ➕ Registrar nuevo gasto
        </button>
        <button className="btn-gasto-action btn-adjuntar" onClick={() => onAdjuntarFactura('')}>
          📎 Adjuntar factura
        </button>
      </div>

      <div className="gastos-fintoc-section">
        <button className="btn-fintoc" onClick={handleConectarBanco}>
          🔗 Conectar cuenta bancaria (Fintoc)
        </button>
      </div>
    </div>
  );
};

export default GastosFacturas;
