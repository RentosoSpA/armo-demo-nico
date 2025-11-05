import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Spin, App } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Building2, Shield } from 'lucide-react';
import {
  verifyInvitationLinkToken,
  incrementLinkUsage,
  type InvitationLinkWithCompany,
} from '../services/invitations/invitationLinksServiceSupabase';
import { supabase } from '../integrations/supabase/client';

const { Title, Text } = Typography;

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  agent: 'Agente',
  supervisor: 'Supervisor',
  assistant: 'Asistente',
};

const RegistroAgente: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationLinkWithCompany | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    if (!token) {
      setError('Token de invitación no proporcionado');
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await verifyInvitationLinkToken(token);

    if (result.success && result.data) {
      setInvitationData(result.data);
      setError(null);
    } else {
      setError(result.error || 'Token de invitación inválido');
    }
    setLoading(false);
  };

  const handleSubmit = async (values: any) => {
    if (!invitationData || !token) return;

    setSubmitting(true);

    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            empresa_id: invitationData.empresa_id,
            role: invitationData.role,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (signUpError) {
        message.error(signUpError.message);
        setSubmitting(false);
        return;
      }

      if (!authData.user) {
        message.error('Error al crear el usuario');
        setSubmitting(false);
        return;
      }

      // 2. Crear rol de usuario
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: authData.user.id,
        empresa_id: invitationData.empresa_id,
        role: invitationData.role,
      });

      if (roleError) {
        console.error('Error creating user role:', roleError);
      }

      // 3. Crear agente
      const { error: agenteError } = await supabase.from('agente').insert({
        user_uid: authData.user.id,
        empresa_id: invitationData.empresa_id,
        nombre: values.full_name,
        email: values.email,
        telefono: 0,
        codigo_telefonico: 56,
        time_zone: 'America/Santiago',
      });

      if (agenteError) {
        console.error('Error creating agente:', agenteError);
      }

      // 4. Incrementar contador de usos del link
      await incrementLinkUsage(invitationData.id);

      message.success('¡Registro exitoso! Por favor inicia sesión con tus credenciales.');
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/auth/signin');
      }, 2000);
    } catch (error: any) {
      console.error('Error during registration:', error);
      message.error('Error al completar el registro');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !invitationData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)',
        padding: '24px'
      }}>
        <Card style={{ maxWidth: 500, width: '100%' }}>
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Title level={3} type="danger">Error</Title>
            <Text>{error}</Text>
            <div style={{ marginTop: 24 }}>
              <Button type="primary" onClick={() => navigate('/auth/signin')}>
                Ir al Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)',
      padding: '24px'
    }}>
      <Card style={{ maxWidth: 500, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2}>Registro de Agente</Title>
          <Text type="secondary" style={{ color: '#8c8c8c' }}>
            Te estás registrando en {invitationData.empresa.nombre}
          </Text>
        </div>

        {/* Información de la invitación */}
        <div style={{ 
          marginBottom: 24, 
          padding: 16, 
          background: 'rgba(51, 244, 145, 0.1)', 
          borderRadius: 8,
          border: '1px solid rgba(51, 244, 145, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Building2 size={18} color="#33F491" />
            <Text strong>Empresa: </Text>
            <Text>{invitationData.empresa.nombre}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} color="#33F491" />
            <Text strong>Rol asignado: </Text>
            <Text>{roleLabels[invitationData.role] || invitationData.role}</Text>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="full_name"
            label="Nombre Completo"
            rules={[
              { required: true, message: 'Por favor ingresa tu nombre completo' },
              { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
              { max: 100, message: 'El nombre no puede exceder 100 caracteres' },
            ]}
          >
            <Input 
              prefix={<User size={18} />} 
              placeholder="Juan Pérez" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
              { required: true, message: 'Por favor ingresa tu correo' },
              { type: 'email', message: 'Por favor ingresa un correo válido' },
              { max: 255, message: 'El correo no puede exceder 255 caracteres' },
            ]}
          >
            <Input 
              prefix={<Mail size={18} />} 
              placeholder="tu@email.com" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: 'Por favor ingresa tu contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
            ]}
          >
            <Input.Password 
              prefix={<Lock size={18} />} 
              placeholder="Contraseña" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password_confirm"
            label="Confirmar Contraseña"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Por favor confirma tu contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<Lock size={18} />} 
              placeholder="Confirmar contraseña" 
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitting}
              block
              style={{ height: 48 }}
            >
              Completar Registro
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Text type="secondary">
            ¿Ya tienes una cuenta?{' '}
            <a onClick={() => navigate('/auth/signin')}>Inicia sesión aquí</a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default RegistroAgente;
