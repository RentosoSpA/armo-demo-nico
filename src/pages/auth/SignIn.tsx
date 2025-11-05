import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import LoadingSplash from '../../components/common/LoadingSplash';

const { Title } = Typography;

const SignIn: React.FC = () => {
  const [form] = Form.useForm();
  const { signIn, sessionValid, dataLoaded, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingSession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isLogout = urlParams.get('logout') === 'true';

      if (isLogout) {
        // ✅ Limpiar flag de signout explícito
        sessionStorage.removeItem('explicit_signout');
        setSessionChecked(true);
        window.history.replaceState({}, '', '/auth/signin');
        return;
      }
      
      // ✅ También limpiar si estamos en signin normal (no es logout)
      sessionStorage.removeItem('explicit_signout');

      if (loading) {
        return;
      }
      
      try {
        // ✅ NUEVA LÓGICA: Verificar sessionValid Y dataLoaded, no solo localStorage
        if (sessionValid && dataLoaded) {
          console.log('[SignIn] Valid session detected, redirecting to tablero');
          navigate('/tablero', { replace: true });
          return;
        }
        
        // ✅ Si hay backup pero no sessionValid, esperar un momento a que AuthContext cargue
        const hasBackup = localStorage.getItem('mock_session_backup');
        if (hasBackup && !sessionValid && !dataLoaded) {
          console.log('[SignIn] Session backup found, waiting for context to load...');
          // No marcar como checked aún, esperar a que loading termine
          return;
        }
      } catch (error) {
        console.error('[SignIn] Error checking existing session:', error);
      } finally {
        // Solo marcar como checked si no hay sesión O si ya redirigimos
        if (!loading) {
          setSessionChecked(true);
        }
      }
    };
    
    checkExistingSession();
  }, [loading, navigate, sessionValid, dataLoaded]);

  const onFinish = async (values: { email: string; password: string }) => {
    setError(null);
    setSubmitting(true);
    try {
      console.log('[SignIn] Starting login process...');
      await signIn(values.email, values.password);
      
      // ✅ Verificar que sessionValid sea true antes de navegar
      const maxRetries = 10;
      let retries = 0;
      
      while (retries < maxRetries) {
        // Esperar un poco para que los estados se actualicen
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (sessionValid && dataLoaded) {
          console.log('[SignIn] Session validated successfully ✅');
          navigate('/tablero');
          return;
        }
        
        retries++;
      }
      
      // Si después de 1 segundo no hay sesión válida, mostrar error
      throw new Error('Login succeeded but session validation failed');
    } catch (err: any) {
      console.error('[SignIn] Login error:', err);
      setError(err?.message || 'Credenciales inválidas. Verifica tu email y contraseña. En modo demo, puedes usar las credenciales prellenadas.');
      setSubmitting(false);
    }
  };


  // Show loading while checking session
  if (!sessionChecked || loading) {
    return <LoadingSplash variant="full" message="Verificando sesión..." />;
  }

  return (
    <div className="signin-main-row">
      <div className="signin-container">
        <Card className="signin-card">
          <Title level={2} className="signin-title title-text">
            Inicia sesión en Rentoso
          </Title>
          {error && (
            <div className="signin-error">
              {error}
            </div>
          )}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            disabled={submitting || loading}
          >
            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                { required: true, message: 'Por favor ingresa tu correo electrónico' },
                { type: 'email', message: 'El correo no es válido' },
              ]}
              className="signin-form-item--email"
            >
              <Input placeholder="" autoFocus size="large" />
            </Form.Item>
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
              className="signin-form-item--password"
            >
              <Input.Password
                placeholder=""
                size="large"
              />
            </Form.Item>
            <div className="signin-forgot-password">
              <Button
                type="link"
                className="signin-link"
                onClick={() => navigate('/auth/forgot-password')}
                aria-label="Recuperar contraseña"
              >
                ¿Olvidaste la contraseña?
              </Button>
            </div>
            <Form.Item className="signin-form-item--submit">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={submitting || loading}
                size="large"
                className="signin-submit-button"
              >
                Inicia sesión
              </Button>
            </Form.Item>
          </Form>
          <div className="signin-footer-container">
            <span className="signin-footer-text">
              ¿No tienes cuenta?
            </span>
            <Button
              type="link"
              className="signin-link"
              onClick={() => navigate('/auth/signup')}
            >
              Crea una cuenta empresarial
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
