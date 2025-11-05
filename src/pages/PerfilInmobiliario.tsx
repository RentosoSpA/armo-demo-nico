import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Spin, Space } from 'antd';
import { useUserStore } from '../store/userStore';
import { useEmpresaStore } from '../store/empresaStore';
import type { Empresa } from '../types/empresa';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PerfilInmobiliario: React.FC = () => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const { empresa: userEmpresa } = useUserStore();
  const { empresa, loading, error, fetchEmpresaById, updateEmpresaInfo } = useEmpresaStore();

  useEffect(() => {
    console.log('[PerfilInmobiliario] userEmpresa:', userEmpresa);
    if (userEmpresa?.id) {
      console.log('[PerfilInmobiliario] Fetching empresa with id:', userEmpresa.id);
      fetchEmpresaById(userEmpresa.id);
    } else {
      console.log('[PerfilInmobiliario] No userEmpresa.id available');
    }
  }, [userEmpresa?.id, fetchEmpresaById]);

  useEffect(() => {
    console.log('[PerfilInmobiliario] empresa data:', empresa);
    if (empresa) {
      console.log('[PerfilInmobiliario] Setting form values');
      form.setFieldsValue({
        nombre: empresa.nombre,
        sobreNosotros: empresa.sobre_nosotros, // Map snake_case to camelCase
        mision: empresa.mision,
        vision: empresa.vision,
        email: empresa.email,
        telefono: empresa.telefono,
        direccion: empresa.direccion,
      });
    }
  }, [empresa, form]);

  const onFinish = async (values: any) => {
    if (!empresa?.id) {
      message.error('No se pudo identificar la empresa');
      return;
    }

    setSaving(true);
    try {
      // Map camelCase to snake_case for Supabase
      const updatedData: Partial<Empresa> = {
        nombre: values.nombre,
        sobre_nosotros: values.sobreNosotros,
        mision: values.mision,
        vision: values.vision,
        email: values.email,
        telefono: values.telefono,
        direccion: values.direccion,
      };

      await updateEmpresaInfo(empresa.id, updatedData);
      message.success('Información del perfil inmobiliario actualizada correctamente');
    } catch (error) {
      console.error('Error updating empresa:', error);
      message.error('Error al actualizar la información del perfil inmobiliario');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Space
        direction="vertical"
        size="small"
        align="center"
        className="w-full"
        styles={{
          item: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
        }}
      >
        <Card className="w-full">
          <div className="text-center">
            <Typography.Text type="danger">{error}</Typography.Text>
          </div>
        </Card>
      </Space>
    );
  }

  return (
    <Space
      direction="vertical"
      size="small"
      align="start"
      className="w-full"
      styles={{
        item: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' },
      }}
    >
      <div className="mb-24">
        <Title level={2} className="title-text text-left mb-0">
          Perfil Inmobiliario
        </Title>
        <Text className="paragraph-text paragraph-secondary text-left mb-0">
          Actualiza la información pública de tu empresa que se mostrará en armonioso
        </Text>
      </div>
      <Card className="profile-card w-full">
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-0">
          <Form.Item
            label="Nombre de la Empresa"
            name="nombre"
            rules={[{ required: true, message: 'Por favor ingresa el nombre de la empresa' }]}
          >
            <Input placeholder="Nombre de la empresa" />
          </Form.Item>

          <Form.Item
            label="Sobre Nosotros"
            name="sobreNosotros"
            rules={[{ required: true, message: 'Por favor ingresa la descripción de la empresa' }]}
          >
            <TextArea rows={4} placeholder="Describe tu empresa, su historia y valores..." />
          </Form.Item>

          <Form.Item
            label="Misión"
            name="mision"
            rules={[{ required: true, message: 'Por favor ingresa la misión de la empresa' }]}
          >
            <TextArea rows={3} placeholder="¿Cuál es la misión de tu empresa?" />
          </Form.Item>

          <Form.Item
            label="Visión"
            name="vision"
            rules={[{ required: true, message: 'Por favor ingresa la visión de la empresa' }]}
          >
            <TextArea rows={3} placeholder="¿Cuál es la visión de tu empresa?" />
          </Form.Item>

          <Form.Item
            label="Email de Contacto"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa el email de contacto' },
              { type: 'email', message: 'Ingresa un email válido' },
            ]}
          >
            <Input placeholder="contacto@empresa.com" />
          </Form.Item>

          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[{ required: true, message: 'Por favor ingresa el teléfono' }]}
          >
            <Input placeholder="+56 9 1234 5678" />
          </Form.Item>

          <Form.Item
            label="Dirección"
            name="direccion"
            rules={[{ required: true, message: 'Por favor ingresa la dirección' }]}
          >
            <TextArea rows={2} placeholder="Dirección completa de la empresa" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              size="large"
              className="w-full"
            >
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

export default PerfilInmobiliario;