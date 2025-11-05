import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    setError(null);
    setSubmitting(true);
    try {
      await resetPassword(values.email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err?.message || 'Error al enviar el correo de recuperación.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="signin-main-row">
        <div className="signin-container">
          <Card className="signin-card">
            <Title level={2} className="signin-title title-text">
              Correo enviado
            </Title>
            <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.70)', marginBottom: '24px' }}>
              Te hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña.
            </p>
            <Button
              type="primary"
              block
              size="large"
              className="signin-submit-button"
              onClick={() => navigate('/auth/signin')}
            >
              Volver a iniciar sesión
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
            ¿Olvidaste tu contraseña?
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
            <Form.Item className="signin-form-item--submit">
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={submitting}
                size="large"
                className="signin-submit-button"
              >
                Enviar correo de recuperación
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

export default ForgotPassword;
