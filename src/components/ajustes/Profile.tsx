import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Divider, Button, Typography, Spin, Card, Select, App } from 'antd';
import { useUserStore } from '../../store/userStore';
import { useAuth } from '../../context/useAuth';
import { updateUser, getUser } from '../../services/user/userService';
import { updateAgente } from '../../services/agentes/agenteService';
import { userToProfile } from '../../utils/typeAdapters';

const { Title, Text } = Typography;

const ProfileComp: React.FC = () => {
  const { message } = App.useApp();
  const { loading } = useAuth();
  const { userProfile: profile, setUserProfile, agent, setAgent } = useUserStore();

  const [form] = Form.useForm();
  const [countryCode, setCountryCode] = useState(56);
  const countryCodes = [
    { value: 56, label: '+56' },
    { value: 54, label: '+54' },
    { value: 57, label: '+57' },
    { value: 1, label: '+1' },
    { value: 52, label: '+52' },
  ];

  useEffect(() => {
    console.log('[Profile Component] Profile updated:', profile);
    if (profile) {
      console.log('[Profile Component] Setting form values:', profile);
      form.setFieldsValue(profile);
    }
  }, [profile, form]);

  const handleFinish = async (values: any) => {
    if (!profile) return;

    try {
      const updatedUser = {
        ...profile,
        nombre: values.primerNombre,
        telefono: `+${countryCode}${values.telefono}`,
      };

      const profileUpdates = userToProfile(updatedUser);
      await updateUser(profile.uid, profileUpdates);

      // Reload the profile from Supabase to get the updated data
      const updatedProfile = await getUser(profile.uid);

      // Update the store with the new profile data
      const refreshedUser = {
        uid: profile.uid,
        email: profile.email,
        nombre: updatedProfile.full_name?.split(' ')[0] || '',
        apellido: updatedProfile.full_name?.split(' ').slice(1).join(' ') || '',
        telefono: updatedProfile.phone || '',
      };

      console.log('[Profile] Updated user in store:', refreshedUser);
      setUserProfile(refreshedUser);

      // Also update agent name if user is an agent
      if (agent) {
        console.log('[Profile] Current agent:', agent);
        console.log('[Profile] Updating agent with new name:', values.primerNombre);
        const updatedAgent = {
          ...agent,
          nombre: values.primerNombre,
        };
        try {
          await updateAgente(agent.id, updatedAgent);
          setAgent(updatedAgent);
          console.log('[Profile] Successfully updated agent in store:', updatedAgent);
        } catch (agentError) {
          console.error('[Profile] Error updating agent:', agentError);
        }
      } else {
        console.log('[Profile] No agent to update');
      }

      message.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Error al actualizar el perfil');
    }
  };

  if (loading) {
    return (
      <Card className="profile-card w-full">
        <Title level={3} className="mb-0">
          Información del Perfil
        </Title>
        <Text
          className="d-block mt-4 mb-16"
        >
          Actualiza tu información personal y detalles de contacto.
        </Text>
        <Spin className="d-block" />
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="profile-card w-full">
        <Title level={3} className="mb-0">
          Información del Perfil
        </Title>
        <Text className="d-block mt-4 mb-16" type="danger">
          No se pudo cargar la información del perfil.
        </Text>
      </Card>
    );
  }

  return (
    <Card className="profile-card w-full">
      <Title level={2} className="profile-title">
        Información del Perfil
      </Title>
      <Text
        className="d-block mt-4 mb-16"
      >
        Actualiza tu información personal y detalles de contacto.
      </Text>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          primerNombre: profile!.nombre || '',
          telefono: typeof profile!.telefono === 'string' ? profile!.telefono.replace(/^\+\d+/, '') : profile!.telefono,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Nombre completo"
              name="primerNombre"
              rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
            >
              <Input placeholder="Ingresa tu nombre completo" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
            >
              <Input placeholder="correo@ejemplo.com" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Teléfono"
              name="telefono"
              rules={[{ required: true, message: 'Por favor ingresa tu teléfono' }]}
            >
              <Input
                addonBefore={
                  <Select value={countryCode} onChange={setCountryCode} options={countryCodes} />
                }
                placeholder="Número de teléfono"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tipo de usuario"
              name="tipoUsuario"
            >
              <Select 
                placeholder="Selecciona tipo de usuario"
                options={[
                  { value: 'administrador', label: 'Administrador' },
                  { value: 'agente', label: 'Agente' },
                  { value: 'cliente', label: 'Cliente' }
                ]}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row justify="end">
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default ProfileComp;
