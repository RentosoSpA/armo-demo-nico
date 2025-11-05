import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import LoadingSplash from '../../components/common/LoadingSplash';

const { Title } = Typography;

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const { updatePassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a valid session from the password reset link
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          setError('El enlace de recuperación es inválido o ha expirado. Por favor solicita uno nuevo.');
          setHasValidSession(false);
          setIsReady(true);
          return;
        }

        if (!session) {
          setError('No se encontró una sesión válida. Por favor solicita un nuevo enlace de recuperación.');
          setHasValidSession(false);
          setIsReady(true);
          return;
        }

        // Session is valid, allow password reset
        setHasValidSession(true);
        setIsReady(true);
      } catch (err) {
        console.error('Error checking session:', err);
        setError('Error al verificar la sesión. Por favor intenta nuevamente.');
        setHasValidSession(false);
        setIsReady(true);
      }
    };

    checkSession();
  }, []);

  const validatePasswords = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const password = form.getFieldValue('password');
    const confirmPassword = form.getFieldValue('confirmPassword');

    if (!passwordRegex.test(password)) {
      return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial (@$!%*?&)';
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  };

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    const errorMessage = validatePasswords();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await updatePassword(values.password);
      navigate('/auth/signin');
    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err?.message || 'Error al actualizar la contraseña.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while checking session
  if (!isReady) {
    return <LoadingSplash variant="full" message="Verificando enlace de recuperación..." />;
  }

  // Show error if session is invalid
  if (!hasValidSession) {
    return (
      <div className="signin-main-row">
        <div className="signin-container">
          <Card className="signin-card">
            <Title level={2} className="signin-title title-text">
              Enlace inválido
            </Title>
            <div className="signin-error" role="alert" aria-live="polite">
              {error || 'El enlace de recuperación es inválido o ha expirado.'}
            </div>
            <Button
              type="primary"
              block
              size="large"
              className="signin-submit-button"
              onClick={() => navigate('/auth/forgot-password')}
            >
              Solicitar nuevo enlace
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="signin-main-row">
      <div className="signin-container">
        <Card className="signin-card">
          <Title level={2} className="signin-title title-text">
            Escribe tu nueva contraseña
          </Title>
          {error && (
            <div
              className="signin-error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            disabled={submitting}
          >
            <Form.Item
              label="Nueva contraseña"
              name="password"
              rules={[{ required: true, message: 'Por favor ingresa tu nueva contraseña' }]}
              className="signin-form-item--password"
            >
              <Input.Password
                placeholder=""
                autoFocus
                size="large"
              />
            </Form.Item>
            <Form.Item
              label="Repite tu contraseña"
              name="confirmPassword"
              rules={[{ required: true, message: 'Por favor confirma tu contraseña' }]}
              className="signin-form-item--password"
            >
              <Input.Password
                placeholder=""
                size="large"
              />
            </Form.Item>
            <Form.Item className="signin-form-item--submit">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={submitting}
                size="large"
                className="signin-submit-button"
              >
                Restablecer contraseña
              </Button>
            </Form.Item>
          </Form>
          <div className="signin-footer-container">
            <span className="signin-footer-text">
              ¿Recordaste tu contraseña?
            </span>
            <Button
              type="link"
              className="signin-link"
              onClick={() => navigate('/auth/signin')}
              aria-label="Volver a iniciar sesión"
            >
              Inicia sesión
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
