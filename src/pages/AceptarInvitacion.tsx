import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, App, Spin } from 'antd';
import { Mail, Building2, UserCircle, Lock, CheckCircle } from 'lucide-react';
import { verifyInvitationToken, acceptInvitation, type InvitationWithCompany } from '../services/users/inviteUserServiceSupabase';
import { supabase } from '../integrations/supabase/client';

const { Title, Text, Paragraph } = Typography;

const roleTranslations: Record<string, string> = {
  admin: 'Administrador',
  agent: 'Agente',
  supervisor: 'Supervisor',
  assistant: 'Asistente',
};

export const AceptarInvitacion: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitation, setInvitation] = useState<InvitationWithCompany | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Token de invitación no encontrado');
      setLoading(false);
      return;
    }

    verifyToken(token);
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    try {
      const invitationData = await verifyInvitationToken(token);
      if (!invitationData) {
        setError('Invitación inválida o expirada');
      } else {
        setInvitation(invitationData);
        form.setFieldsValue({ email: invitationData.email });
      }
    } catch (err) {
      console.error('Error verifying token:', err);
      setError('Error al verificar la invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: { nombre: string; password: string; confirmPassword: string }) => {
    if (!invitation) return;

    setSubmitting(true);
    try {
      // Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: invitation.email,
        password: values.password,
        options: {
          data: {
            full_name: values.nombre,
            company_name: invitation.empresa.nombre,
            email: invitation.email,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        message.error(signUpError.message || 'Error al crear la cuenta');
        return;
      }

      if (!authData.user) {
        message.error('Error al crear el usuario');
        return;
      }

      // Create user role entry
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: invitation.role,
          empresa_id: invitation.empresa_id,
        });

      if (roleError) {
        console.error('Role assignment error:', roleError);
        message.error('Error al asignar rol');
        return;
      }

      // Mark invitation as accepted
      await acceptInvitation(invitation.token);

      message.success('¡Cuenta creada exitosamente! Redirigiendo...');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      message.error(err.message || 'Error al procesar la invitación');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ width: 400, textAlign: 'center' }}>
          <Spin size="large" />
          <Paragraph style={{ marginTop: 20 }}>Verificando invitación...</Paragraph>
        </Card>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ width: 500, textAlign: 'center' }}>
          <Title level={3} style={{ color: '#ff4d4f' }}>Invitación Inválida</Title>
          <Paragraph>{error || 'La invitación no pudo ser verificada'}</Paragraph>
          <Button type="primary" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ 
            width: 60, 
            height: 60, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <CheckCircle size={32} color="white" />
          </div>
          <Title level={2} style={{ marginBottom: 10 }}>¡Bienvenido a RentOso!</Title>
          <Text type="secondary">Has sido invitado a unirte a una empresa</Text>
        </div>

        <Card 
          style={{ 
            marginBottom: 30, 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            border: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <Building2 size={20} style={{ marginRight: 8, color: '#667eea' }} />
            <Text strong>Empresa: </Text>
            <Text style={{ marginLeft: 8 }}>{invitation.empresa.nombre}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <Mail size={20} style={{ marginRight: 8, color: '#667eea' }} />
            <Text strong>Email: </Text>
            <Text style={{ marginLeft: 8 }}>{invitation.email}</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserCircle size={20} style={{ marginRight: 8, color: '#667eea' }} />
            <Text strong>Rol: </Text>
            <Text style={{ marginLeft: 8 }}>{roleTranslations[invitation.role]}</Text>
          </div>
        </Card>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            label="Email"
          >
            <Input 
              prefix={<Mail size={18} />}
              disabled
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="nombre"
            label="Nombre completo"
            rules={[
              { required: true, message: 'Por favor ingresa tu nombre' },
              { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
            ]}
          >
            <Input 
              prefix={<UserCircle size={18} />}
              placeholder="Tu nombre completo"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: 'Por favor ingresa una contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password
              prefix={<Lock size={18} />}
              placeholder="Mínimo 6 caracteres"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar contraseña"
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
              placeholder="Confirma tu contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              size="large"
              block
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                height: 48
              }}
            >
              Crear Cuenta y Aceptar Invitación
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Al crear tu cuenta, aceptas los términos y condiciones de RentOso
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AceptarInvitacion;
