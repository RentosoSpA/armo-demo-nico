import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Spin } from 'antd';
import { useUserStore } from '../../store/userStore';
import { useEmpresaStore } from '../../store/empresaStore';
import type { Empresa } from '../../types/empresa';
import './ajustes.scss';

const { Title, Text } = Typography;
const { TextArea } = Input;

const EmpresaInfo: React.FC = () => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const { empresa: userEmpresa } = useUserStore();
  const { empresa, loading, error, fetchEmpresaById, updateEmpresaInfo } = useEmpresaStore();

  useEffect(() => {
    if (userEmpresa?.id) {
      fetchEmpresaById(userEmpresa.id);
    }
  }, [userEmpresa?.id, fetchEmpresaById]);

  useEffect(() => {
    if (empresa) {
      form.setFieldsValue({
        nombre: empresa.nombre,
        sobreNosotros: empresa.sobreNosotros,
        mision: empresa.mision,
        vision: empresa.vision,
        email: empresa.email,
        telefono: empresa.telefono,
        direccion: empresa.direccion,
      });
    }
  }, [empresa, form]);

  const onFinish = async (values: Partial<Empresa>) => {
    if (!empresa?.id) {
      message.error('No se pudo identificar la empresa');
      return;
    }

    setSaving(true);
    try {
      await updateEmpresaInfo(empresa.id, values);
      message.success('Información de la empresa actualizada correctamente');
    } catch (error) {
      console.error('Error updating empresa:', error);
      message.error('Error al actualizar la información de la empresa');
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
      <Card className="w-full">
        <div className="text-center">
          <Typography.Text type="danger">{error}</Typography.Text>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <Title level={3}>Información de la Empresa</Title>
      <Text type="secondary" className="d-block mb-24">
        Actualiza la información pública de tu empresa que se mostrará en el portal
      </Text>

      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-24">
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
  );
};

export default EmpresaInfo;
