import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomAdminLayout from './components/layout/CustomAdminLayout';
import { ConfigProvider, App as AntdApp, Spin } from 'antd';
import { customTheme } from './theme/themeConfig';
import { AuthProvider } from './context/auth';
import { ErrorBoundary } from './components/common';
import './styles/main.scss';

// Keep critical route components as direct imports
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import NotFound from './pages/NotFound';
import Tablero from './pages/Tablero';

// Critical pages - direct imports (Fase 1.2: No lazy loading)
import Oportunidades from './pages/Oportunidades';
import Propiedades from './pages/Propiedades';
import Propietarios from './pages/Propietarios';

// Lazy load large feature components
const Registro = React.lazy(() => import('./pages/Registro'));
const RegistroAgente = React.lazy(() => import('./pages/RegistroAgente'));
const EvaluacionPublica = React.lazy(() => import('./pages/EvaluacionPublica'));
const AceptarInvitacion = React.lazy(() => import('./pages/AceptarInvitacion'));
const PropiedadFicha = React.lazy(() => import('./pages/PropiedadFicha'));
const PublicPropertyFicha = React.lazy(() => import('./components/propiedades/ficha/public').then(module => ({ default: module.PublicPropertyFicha })));
const Portal = React.lazy(() => import('./components/portal/CustomPortalLayout'));
const PublicPortal = React.lazy(() => import('./pages/PublicPortal'));

// Admin page lazy imports (less frequent pages)
const Prospectos = React.lazy(() => import('./pages/Prospectos'));
const Contratos = React.lazy(() => import('./pages/Contratos'));
const Cobros = React.lazy(() => import('./pages/Cobros'));
// const Brigada = React.lazy(() => import('./pages/Brigada')); // Oculto temporalmente
const Reportes = React.lazy(() => import('./pages/Reportes'));
const Calendario = React.lazy(() => import('./pages/Calendario'));
const CalificarOportunidad = React.lazy(() => import('./pages/CalificarOportunidad'));
const CrearPropiedad = React.lazy(() => import('./pages/CrearPropiedad'));
const EditarPropiedad = React.lazy(() => import('./pages/EditarPropiedad'));
const CrearContrato = React.lazy(() => import('./pages/CrearContrato'));
const Perfil = React.lazy(() => import('./pages/Perfil'));
const PerfilInmobiliario = React.lazy(() => import('./pages/PerfilInmobiliario'));
const RolesyAccesos = React.lazy(() => import('./pages/RolesyAccesos'));
const Decisiones = React.lazy(() => import('./pages/Decisiones'));
const Finanzas = React.lazy(() => import('./pages/Finanzas'));

function App() {
  const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex-center full-height"><Spin size="large" /></div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );

  return (
    <ConfigProvider theme={customTheme}>
      <AntdApp>
        <AuthProvider>
          <div className="app">
            <Routes>
              {/* Root route - Redirect to SignIn */}
              <Route path="/" element={<SignIn />} />

              {/* Auth Routes */}
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/registro" element={<SuspenseWrapper><Registro /></SuspenseWrapper>} />
              <Route path="/registro-agente" element={<SuspenseWrapper><RegistroAgente /></SuspenseWrapper>} />

              {/* Public Routes */}
              <Route path="/evaluacion/:prospectoId" element={<SuspenseWrapper><EvaluacionPublica /></SuspenseWrapper>} />
              <Route path="/portal" element={<SuspenseWrapper><PublicPortal /></SuspenseWrapper>} />
              <Route path="/portal/:empresaNombre" element={<SuspenseWrapper><Portal /></SuspenseWrapper>} />
              <Route path="/portal/:empresaNombre/propiedad/:id" element={<SuspenseWrapper><PublicPropertyFicha /></SuspenseWrapper>} />
              <Route path="/aceptar-invitacion" element={<SuspenseWrapper><AceptarInvitacion /></SuspenseWrapper>} />

              {/* Main app routes with CustomAdminLayout wrapper */}
              <Route element={<CustomAdminLayout />}>
                <Route path="/tablero" element={<Tablero />} />
                {/* Critical pages - no Suspense wrapper (Fase 1.2) */}
                <Route path="/oportunidades" element={<Oportunidades />} />
                <Route path="/propiedades" element={<Propiedades />} />
                <Route path="/propietarios" element={<Propietarios />} />
                {/* Less frequent pages - keep Suspense */}
                <Route path="/oportunidades/calificar/:id" element={<SuspenseWrapper><CalificarOportunidad /></SuspenseWrapper>} />
                <Route path="/propiedades/crear" element={<SuspenseWrapper><CrearPropiedad /></SuspenseWrapper>} />
                <Route path="/propiedades/editar/:id" element={<SuspenseWrapper><EditarPropiedad /></SuspenseWrapper>} />
                <Route path="/propiedades/:id" element={<SuspenseWrapper><PropiedadFicha /></SuspenseWrapper>} />
                <Route path="/prospectos" element={<SuspenseWrapper><Prospectos /></SuspenseWrapper>} />
                <Route path="/finanzas" element={<SuspenseWrapper><Finanzas /></SuspenseWrapper>} />
                <Route path="/clientes" element={<Navigate to="/propietarios" replace />} />
                <Route path="/contratos" element={<SuspenseWrapper><Contratos /></SuspenseWrapper>} />
                <Route path="/contratos/crear" element={<SuspenseWrapper><CrearContrato /></SuspenseWrapper>} />
                {/* <Route path="/brigada" element={<SuspenseWrapper><Brigada /></SuspenseWrapper>} /> */}
                <Route path="/cobros" element={<SuspenseWrapper><Cobros /></SuspenseWrapper>} />
                <Route path="/reportes" element={<SuspenseWrapper><Reportes /></SuspenseWrapper>} />
                <Route path="/calendario" element={<SuspenseWrapper><Calendario /></SuspenseWrapper>} />
                <Route path="/decisiones" element={<SuspenseWrapper><Decisiones /></SuspenseWrapper>} />
                <Route path="/perfil" element={<SuspenseWrapper><Perfil /></SuspenseWrapper>} />
                <Route path="/perfil-inmobiliario" element={<SuspenseWrapper><PerfilInmobiliario /></SuspenseWrapper>} />
                <Route path="/roles" element={<SuspenseWrapper><RolesyAccesos /></SuspenseWrapper>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
