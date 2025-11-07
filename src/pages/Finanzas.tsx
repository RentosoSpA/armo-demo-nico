import React, { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { useUserStore } from '../store/userStore';
import { getFinanzasCompleteData } from '../services/finanzas/finanzasServiceAdapter';
import type { FinanzasCompleteData } from '../types/finanzas';
import ResumenGeneral from '../components/finanzas/ResumenGeneral';
import ComisionesRentabilidad from '../components/finanzas/ComisionesRentabilidad';
import GastosFacturas from '../components/finanzas/GastosFacturas';
import ConfiguracionPersonal from '../components/finanzas/ConfiguracionPersonal';
import '../styles/pages/_finanzas.scss';

const Finanzas: React.FC = () => {
  console.log('🐻 Finanzas: Componente montado');

  const { agent } = useUserStore();
  const [data, setData] = useState<FinanzasCompleteData | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('🐻 Finanzas: agent =', agent);

  useEffect(() => {
    console.log('🐻 Finanzas: useEffect ejecutado');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('🐻 Finanzas: Iniciando fetchData...');
      setLoading(true);
      const finanzasData = await getFinanzasCompleteData();
      console.log('🐻 Finanzas: Datos recibidos =', finanzasData);
      setData(finanzasData);
    } catch (error) {
      console.error('🐻 Finanzas: ERROR en fetchData =', error);
      message.error('Error al cargar datos financieros');
    } finally {
      setLoading(false);
      console.log('🐻 Finanzas: fetchData completado');
    }
  };

  const handleExportarPDF = () => {
    message.success('Exportando PDF con branding Rentoso...');
  };

  const handleUpdateMeta = (nuevaMeta: number) => {
    if (data) {
      const progreso = data.meta.progreso;
      const porcentaje = Math.round((progreso / nuevaMeta) * 100);
      const updatedMeta = {
        ...data.meta,
        objetivoMensual: nuevaMeta,
        porcentaje: porcentaje
      };
      setData({ ...data, meta: updatedMeta });
    }
  };

  const handleUpdatePorcentajeComision = (nuevoPorcentaje: number) => {
    if (data) {
      const updatedConfig = {
        ...data.configuracion,
        porcentajeComision: nuevoPorcentaje
      };
      setData({ ...data, configuracion: updatedConfig });
    }
  };

  if (loading) {
    console.log('🐻 Finanzas: Mostrando spinner de carga...');
    return (
      <div className="finanzas-loading">
        <Spin size="large" />
        <p>Cargando tu información financiera...</p>
      </div>
    );
  }

  if (!data) {
    console.log('🐻 Finanzas: No hay datos disponibles');
    return null;
  }

  console.log('🐻 Finanzas: Renderizando página completa');
  console.log('🐻 Finanzas: Configuración actual =', data.configuracion);
  console.log('🐻 Finanzas: porcentajeComision a pasar =', data.configuracion?.porcentajeComision ?? 50);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="finanzas-page">
      <div className="finanzas-header-compact">
        <div className="finanzas-header-top">
          <div>
            <h2 className="title-text mb-0">
              Finanzas
            </h2>
            <div className="paragraph-text paragraph-secondary">
              Tu centro de control financiero
            </div>
          </div>
        </div>
        <nav className="finanzas-quick-nav">
          <button onClick={() => scrollToSection('vista-general')} className="quick-nav-btn">
            <span>📊</span> Vista General
          </button>
          <button onClick={() => scrollToSection('comisiones')} className="quick-nav-btn">
            <span>💼</span> Comisiones
          </button>
          
        </nav>
      </div>

      <div className="finanzas-dashboard-layout">
        {/* Columna Izquierda: Vista General + Comisiones */}
        <div className="finanzas-main-column">
          <section id="vista-general" className="finanzas-section-compact finanzas-section--vista-general">
            <ResumenGeneral
              userName={agent?.nombre || 'Francisco'}
              meta={data.meta}
              kpis={data.kpis}
              datosGrafico={data.porMes}
              onExportarPDF={handleExportarPDF}
              onVerFlujo={() => message.info('Flujo detallado próximamente')}
              onUpdateMeta={handleUpdateMeta}
            />
          </section>

          <section id="comisiones" className="finanzas-section-compact finanzas-section--comisiones">
            <div className="section-title-mini">
              <span className="section-title-emoji">💼</span>
              <span className="section-title-text">Comisiones</span>
            </div>
            <ComisionesRentabilidad
              comisiones={data.comisiones}
              stats={data.comisionesStats}
              porcentajeComision={data.configuracion?.porcentajeComision ?? 50}
              onUpdatePorcentaje={handleUpdatePorcentajeComision}
            />
          </section>
        </div>

        {/* Columna Derecha: Gastos + Configuración */}
        <div className="finanzas-sidebar-column">
          <section id="gastos" className="finanzas-section-compact finanzas-section--gastos">
            <div className="section-title-mini">
              <span className="section-title-emoji">🧾</span>
              <span className="section-title-text">Gastos</span>
            </div>
            <GastosFacturas
              gastos={data.gastos}
              onRegistrarGasto={() => message.info('Modal de registro próximamente')}
              onAdjuntarFactura={(id) => message.info(`Adjuntar factura: ${id}`)}
            />
          </section>

          <section className="finanzas-section-compact finanzas-section--configuracion">
            <div className="section-title-mini">
              <span className="section-title-emoji">⚙️</span>
              <span className="section-title-text">Configuración</span>
            </div>
            <ConfiguracionPersonal
              configuracion={data.configuracion}
              onGuardarConfiguracion={(config) => {
                console.log('🐻 Finanzas: Nueva configuración guardada:', config);
                message.success('Configuración guardada ✓');
                setData({ ...data, configuracion: config });
              }}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Finanzas;
