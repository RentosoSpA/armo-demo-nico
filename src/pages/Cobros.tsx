import { useEffect, useState, useCallback } from 'react';
import { Button, Space, Typography, App } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';

import CobrosHeader from '../components/Cobros/CobrosHeader';
import CobrosStats from '../components/Cobros/CobrosStats';
import CobrosTable from '../components/Cobros/CobrosTable';
import CobrosNotifications from '../components/Cobros/CobrosNotifications';
import CobrosCompactCalendar from '../components/Cobros/CobrosCompactCalendar';

import type { Cobro, CobroStats, EstadoCobro } from '../types/cobro';
import { getCobrosByEmpresa, getCobrosStats, updateCobro } from '../services/mock/cobrosServiceMock';
import { useUserStore } from '../store/userStore';
import './Cobros.scss';

const { Title } = Typography;



type ViewMode = 'list' | 'calendar';

const Cobros = () => {
  const [data, setData] = useState<Cobro[]>([]);
  const [stats, setStats] = useState<CobroStats>({
    pendientesCobrar: 0,
    atrasados: 0,
    cobradosExito: 0,
    totalMonto: 0,
  });
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showNotifications, setShowNotifications] = useState(false);

  const { empresa } = useUserStore();
  const { message } = App.useApp();

  const fetchCobros = useCallback(async () => {
    try {
      setLoading(true);
      const cobros = await getCobrosByEmpresa(empresa?.id || '');
      setData(cobros);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [empresa?.id]);

  const fetchStats = useCallback(async () => {
    try {
      const cobrosStats = await getCobrosStats(empresa?.id || '');
      setStats(cobrosStats);
    } catch (error) {
      console.error(error);
    }
  }, [empresa?.id]);

  useEffect(() => {
    fetchCobros();
    fetchStats();
  }, [fetchCobros, fetchStats]);

  const dataFiltrada = data.filter(cobro =>
    cobro.propiedad.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    cobro.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cobro.cliente.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleCobroClick = (cobro: Cobro) => {
    console.log('Cobro clicked:', cobro);
  };

  const handleNuevoCobro = () => {
    console.log('Nuevo cobro clicked');
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleEstadoChange = async (cobroId: string, newEstado: EstadoCobro) => {
    try {
      await updateCobro(cobroId, { estado: newEstado });
      message.success('Estado del cobro actualizado');
      await fetchCobros();
      await fetchStats();
    } catch (error) {
      console.error('Error updating cobro estado:', error);
      message.error('Error al actualizar el estado del cobro');
    }
  };

  const notifications = [
    {
      id: 1,
      type: 'warning',
      message: '🐻 Oso Cuidadoso ha encontrado 3 clientes con riesgo de atraso. Click para verlos.',
      action: () => console.log('Ver clientes en riesgo'),
    },
    
  ];

  return (
    <div style={{ padding: '0 16px 24px 16px' }}>
      <CobrosHeader
        setBusqueda={setBusqueda}
        onNuevoCobro={handleNuevoCobro}
        showNotifications={showNotifications}
        onNotificationsClick={handleNotificationsClick}
      />

      <CobrosStats stats={stats} loading={loading} />

      {/* Notificaciones de Oso Cuidadoso */}
      {showNotifications && notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            background: notification.type === 'warning' 
              ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
              : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            marginTop: '16px',
            marginBottom: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
          onClick={notification.action}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }}
        >
          {notification.message}
        </div>
      ))}

      <div className="modern-card mt-24" style={{ padding: '24px' }}>
        <div className="d-flex align-center justify-between">
          <Title level={3} className="m-0">
            Cobros
          </Title>
          <Space.Compact>
            <Button
              icon={<UnorderedListOutlined />}
              type={viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? '#33F491' : 'transparent',
                color: viewMode === 'list' ? '#222222' : '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px 0 0 8px'
              }}
            >
              Lista
            </Button>
            <Button
              icon={<AppstoreOutlined />}
              type={viewMode === 'calendar' ? 'primary' : 'default'}
              onClick={() => setViewMode('calendar')}
              style={{
                background: viewMode === 'calendar' ? '#33F491' : 'transparent',
                color: viewMode === 'calendar' ? '#222222' : '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0 8px 8px 0'
              }}
            >
              Calendario
            </Button>
          </Space.Compact>
        </div>

        <div style={{ marginTop: '24px' }}>
          {viewMode === 'list' ? (
            <CobrosTable
              data={dataFiltrada}
              loading={loading}
              onCobroClick={handleCobroClick}
              onEstadoChange={handleEstadoChange}
            />
          ) : (
            <div className="cobros-calendario">
              <CobrosNotifications data={dataFiltrada} />
              <CobrosCompactCalendar data={dataFiltrada} loading={loading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cobros;