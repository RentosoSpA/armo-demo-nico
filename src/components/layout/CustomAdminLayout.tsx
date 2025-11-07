import React, { useState, useEffect } from 'react';
import { Alert } from 'antd';
import { User, Building, DollarSign, Calendar, AlertTriangle, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import CustomSider from './CustomSider';
import CustomHeader from './CustomHeader';
import MobileBottomNav from './MobileBottomNav';
import LoadingSplash from '../common/LoadingSplash';
import { useAuth } from '../../context/useAuth';
import { useUserStore } from '../../store/userStore';
import { useEmpresaStore } from '../../store/empresaStore';
import RentosoLogo from '../../assets/Rentoso_negativo.svg';
import { userToProfile } from '../../utils/typeAdapters';
import RentosoChat from '../chat/RentosoChat';
import BearDecisionModal from '../decisions/BearDecisionModal';
import DecisionsFab from '../decisions/DecisionsFab';


const CustomAdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [missingEmpresa, setMissingEmpresa] = useState(false);
  const [hasHydratedOnce, setHasHydratedOnce] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { sessionValid, loading: authLoading, dataLoaded, signOut } = useAuth();
  const { userProfile, agent, empresa: storeEmpresa } = useUserStore();
  const { fetchEmpresaById } = useEmpresaStore();

  // Get current selected key from URL
  const getCurrentKey = () => {
    const path = location.pathname.split('/').filter(Boolean).pop();
    if (!path) return 'Tablero';

    // Convert URL path to menu key
    const pathToKey: { [key: string]: string } = {
      'tablero': 'Tablero',
      'oportunidades': 'Oportunidades',
      'propiedades': 'Propiedades',
      'prospectos': 'Prospectos',
      'propietarios': 'Propietarios',
      'finanzas': 'Finanzas',
      'contratos': 'Contratos',
      'cobros': 'Cobros',
      'reportes': 'Reportes',
      'calendario': 'Visitas'
    };

    return pathToKey[path] || 'Tablero';
  };

  const selectedKey = getCurrentKey();

  // Session validation - Solo redirigir en logout explícito
  useEffect(() => {
    if (authLoading) {
      return;
    }

    // ✅ NUEVA LÓGICA: Solo redirigir si ES logout explícito O si ya se hidrato una vez
    if (!sessionValid && !authLoading) {
      const wasExplicitSignOut = sessionStorage.getItem('explicit_signout') === 'true';
      
      if (wasExplicitSignOut) {
        console.log('[CustomAdminLayout] Redirecting due to explicit signout');
        navigate('/auth/signin?logout=true', { replace: true });
        return;
      }
      
      // ✅ Solo redirigir si ya se hidrato una vez (no en primera carga)
      if (hasHydratedOnce && dataLoaded) {
        console.warn('[CustomAdminLayout] Session lost after successful hydration - redirecting');
        navigate('/auth/signin', { replace: true });
        return;
      }
      
      // ✅ En primera carga, NO redirigir - dar tiempo a que signIn() actualice estados
      console.log('[CustomAdminLayout] Waiting for session to be established...');
      return;
    }

    if (!dataLoaded) {
      return;
    }

    if (!hasHydratedOnce && sessionValid && dataLoaded) {
      console.log('[CustomAdminLayout] First successful hydration ✅');
      setHasHydratedOnce(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionValid, authLoading, dataLoaded, hasHydratedOnce, navigate]);

  // Separate effect for empresa validation
  useEffect(() => {
    if (!hasHydratedOnce || !dataLoaded) return;

    if (agent?.empresaId || storeEmpresa?.id) {
      setMissingEmpresa(false);
      const empresaId = agent?.empresaId || storeEmpresa?.id;
      if (empresaId) {
        fetchEmpresaById(empresaId);
      }
    } else {
      setMissingEmpresa(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydratedOnce]);

  const handleMenuClick = (key: string) => {
    // Handle special case for public portal
    if (key === 'home') {
      navigate('/portal');
      return;
    }

    // Convert menu key to URL path
    const keyToPath: { [key: string]: string } = {
      'Tablero': '/tablero',
      'Oportunidades': '/oportunidades',
      'Propiedades': '/propiedades',
      'Prospectos': '/prospectos',
      'Propietarios': '/propietarios',
      'Finanzas': '/finanzas',
      'Membresias': '/membresias',
      'Contratos': '/contratos',
      'Brigada': '/brigada',
      'Perfil': '/perfil',
      'Perfil-Inmobiliario': '/perfil-inmobiliario',
      'Gestion-Usuarios': '/roles',
      'Cobros': '/cobros',
      'Reportes': '/reportes',
      'Visitas': '/calendario'
    };

    const path = keyToPath[key] || '/tablero';
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      // Silent error handling
    }

    await new Promise(resolve => setTimeout(resolve, 100));
    window.location.href = '/auth/signin';
  };

  // ✅ FIX: Mostrar loader en primera carga hasta que TODOS los estados estén listos
  if (!hasHydratedOnce && (!dataLoaded || authLoading || !sessionValid)) {
    return <LoadingSplash variant="full" message="Restaurando sesión..." />;
  }

  // Si no hay sesión válida después de hidratación, no renderizar nada
  if (!sessionValid) {
    return null;
  }


  const rapidAccess = [
    {
      title: 'Propiedades',
      description: 'Gestiona tus propiedades',
      icon: <Building color="#22f477" />,
      onClick: () => handleMenuClick('Propiedades'),
    },
    {
      title: 'Prospectos',
      description: 'Gestiona tus prospectos',
      icon: <User color="#22f477" />,
      onClick: () => handleMenuClick('Prospectos'),
    },
    {
      title: 'Oportunidades',
      description: 'Revisa las Oportunidades de tus prospectos',
      icon: <DollarSign color="#22f477" />,
      onClick: () => handleMenuClick('Oportunidades'),
    },
    {
      title: 'Calendario',
      description: 'Gestiona tus visitas',
      icon: <Calendar color="#22f477" />,
      onClick: () => handleMenuClick('Visitas'),
    },
  ];

  return (
    <>
      <div className="admin-layout layout-fade-in">
        {/* Aurora Background Layer */}
        <div className="aurora-layer">
          <div className="aurora aurora--top-right"></div>
          <div className="aurora aurora--bottom-left"></div>
        </div>

        {/* Advertencia de empresa faltante */}
        {missingEmpresa && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            width: '90%',
            maxWidth: '600px',
            background: 'rgba(11, 15, 31, 0.85)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            border: '1px solid rgba(34, 244, 119, 0.2)',
            padding: '4px'
          }}>
            <Alert
              message="Configuración Incompleta"
              description={
                <div>
                  <p>¡Ooops!, esto no debería haber ocurrido, sin embargo, nuestros osos al armar tu cuenta no te registraron en una empresa. Esto puede romper completamente tu experiencia en RentOso :(</p>
                  <p style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
                    Contacta al administrador o vuelve a registrarte para resolver este problema.
                  </p>
                </div>
              }
              type="warning"
              showIcon
              icon={<AlertTriangle size={20} />}
              closable
              onClose={() => setMissingEmpresa(false)}
            />
          </div>
        )}

        {/* Logo Area */}
        <div className="grid-main-menu-logo">
        <div className="menu-logo-container">
          <img
            src={RentosoLogo}
            alt="RentOso"
          />
        </div>

      </div>
      
      {/* Header Area */}
      <div className="grid-header">
        <CustomHeader
          rapidAccessItems={rapidAccess}
          userProfile={userProfile ? userToProfile(userProfile) as any : null}
          agent={agent}
          onLogout={handleLogout}
          onNavigate={handleMenuClick}
        />
      </div>
      
      {/* Main Menu Area */}
      <div className="grid-main-menu">
        <CustomSider 
          selectedKey={selectedKey} 
          handleMenuClick={handleMenuClick} 
        />
      </div>
      
      {/* Main Content Area */}
      <div className="grid-main-content">
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        selectedKey={selectedKey}
        handleMenuClick={handleMenuClick}
      />

      {/* Info Area */}
      <div className="grid-info">
        <div className="info-banner">
          <div className="banner-content">
            <p>Agenda, clientes y contratos en segundos 🐻 </p>
            <button 
              className="discover-button"
              onClick={() => setChatOpen(true)}
            >
              <MessageCircle size={16} style={{ marginRight: 6 }} />
              Habla con Rentoso →
            </button>
          </div>
        </div>
      </div>

      {/* Floating Chat Button (Mobile) */}
      <button 
        className="floating-chat-button"
        onClick={() => setChatOpen(true)}
        aria-label="Abrir chat con Rentoso"
      >
        <MessageCircle size={24} color="#0a0c27" />
      </button>

      {/* Rentoso AI Chat */}
      <RentosoChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      {/* Decision Center Components */}
      <BearDecisionModal />
      <DecisionsFab />
      </div>
    </>
  );
};

export default CustomAdminLayout;
