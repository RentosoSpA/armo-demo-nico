import React, { useState, useEffect, useCallback } from 'react';
import { Alert } from 'antd';
import DashboardCustomizable from '../components/dashboard/DashboardCustomizable';
import LoadingSplash from '../components/common/LoadingSplash';
import { getDashboardData } from '../services/dashboard/dashboardServiceAdapter';
import type { NewDashboardData } from '../types/salud-data';
import { useUser } from '../store/userStore';

// Default empty dashboard data with all zeros
const createEmptyDashboardData = (): NewDashboardData => ({
  propiedades: {
    total: 0,
    porTipo: {
      Casa: 0,
      Departamento: 0,
      Parcela: 0,
      LocalComercial: 0,
      Oficina: 0,
      Bodega: 0,
      Terreno: 0,
    },
    porEstado: {
      Disponible: 0,
      Reservada: 0,
      Arrendada: 0,
      Vendida: 0,
    },
    porOperacion: {
      arriendo: 0,
      venta: 0,
      ambas: 0,
    },
  },
  visitas: {
    total: 0,
    porEstado: {
      Agendada: 0,
      Aprobada: 0,
      Completada: 0,
      Cancelada: 0,
    },
    porMes: [],
    proximasVisitas: 0,
  },
  oportunidades: {
    total: 0,
    porEtapa: {
      Exploracion: 0,
      Visita: 0,
      Negociacion: 0,
      Cierre: 0,
    },
    conversionRate: 0,
  },
  agentes: {
    total: 0,
    activos: 0,
  },
  empresas: {
    total: 0,
  },
  facturacionTotal: 0,
});

const Tablero: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<NewDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { displayName, empresa } = useUser();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDashboardData(empresa!.id);
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  }, [empresa?.id]);

  useEffect(() => {
    if (empresa?.id) {
      fetchDashboardData();
    } else {
      setDashboardData(createEmptyDashboardData());
      setLoading(false);
      setError(null);
    }
  }, [fetchDashboardData]);

  // Check if user has no empresa (skipped registration or incomplete)
  const isEmpresaIncomplete = !empresa || (
    !empresa.nombre ||
    !empresa.nit ||
    !empresa.direccion ||
    !empresa.sobre_nosotros
  );

  return (
    <div className="tablero-container">
      <div className="tablero-header">
        <h2 className="tablero-title">
          Bienvenido de nuevo, {displayName}.
          {/* <WalkthroughButton walkthrough={() => getTableroWalkthrough(setActiveComponent)} /> */}
        </h2>
      </div>

      {isEmpresaIncomplete && (
        <Alert
          message="Completa la información de tu empresa"
          description="Por favor ingresa los datos de tu empresa para acceder a todas las funcionalidades."
          type="warning"
          showIcon
          closable={false}
          style={{ marginBottom: '20px' }}
        />
      )}

      {error && (
        <div className="error-alert">
          <span className="error-message">{error}</span>
          <button
            className="error-close"
            onClick={() => setError(null)}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSplash variant="inline" message="Cargando datos del dashboard..." />
      ) : (
        <div className="tablero-content">
          {dashboardData && (
            <DashboardCustomizable data={dashboardData} loading={loading} />
          )}
        </div>
      )}
    </div>

  );
};

export default Tablero;
