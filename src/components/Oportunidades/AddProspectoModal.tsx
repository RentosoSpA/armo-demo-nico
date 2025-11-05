import { Modal, Form, Input, Select, Button, App } from 'antd';
import { useState } from 'react';
import type { ProspectoCreate } from '../../types/profile';

const { Option } = Select;

interface AddProspectoModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (prospecto: ProspectoCreate & { id: string }) => void;
  onCreateProspecto: (payload: ProspectoCreate) => Promise<{ id: string; [key: string]: any }>;
}

const AddProspectoModal = ({ open, onClose, onCreated, onCreateProspecto }: AddProspectoModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const handleFinish = async (values: any) => {
    try {
      setLoading(true);
      
      // Validate phone number format
      const telefono = values.telefono?.toString().trim();
      if (!telefono || telefono.length < 7 || telefono.length > 15) {
        message.error('El número de teléfono debe tener entre 7 y 15 dígitos');
        setLoading(false);
        return;
      }

      const prospectoData: ProspectoCreate = {
        source: 'manual',
        phone_e164: `+${values.codigo_telefonico}${telefono}`,
        email: values.email?.trim() || undefined,
        primer_nombre: values.primer_nombre?.trim(),
        segundo_nombre: values.segundo_nombre?.trim() || undefined,
        primer_apellido: values.primer_apellido?.trim(),
        segundo_apellido: values.segundo_apellido?.trim() || undefined,
        codigo_telefonico: values.codigo_telefonico,
        fecha_nacimiento: undefined,
        genero: undefined,
        documento: undefined,
        tipo_documento: undefined,
        ingresos_mensuales: undefined,
        egresos_mensuales: undefined,
        situacion_laboral: undefined,
        evaluado: false,
        aprobado: false,
        estado: 'activo'
      };

      const nuevoProspecto = await onCreateProspecto(prospectoData);
      message.success('Prospecto creado correctamente');
      
      onCreated({ ...prospectoData, id: nuevoProspecto.id });
      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error('Error al crear prospecto:', error);
      
      // Enhanced error messages based on Supabase error codes
      let errorMessage = 'Error al crear el prospecto';
      
      if (error?.code === '23505') {
        errorMessage = 'Este teléfono o email ya está registrado';
      } else if (error?.code === '22007') {
        errorMessage = 'Formato de fecha inválido';
      } else if (error?.code === '23502') {
        errorMessage = 'Faltan campos obligatorios';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title="Crear Nuevo Prospecto"
      width={480}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          codigo_telefonico: 56
        }}
      >
        <Form.Item
          name="primer_nombre"
          label="Primer Nombre"
          rules={[{ required: true, message: 'Por favor ingresa el primer nombre' }]}
        >
          <Input placeholder="Primer nombre" />
        </Form.Item>

        <Form.Item
          name="segundo_nombre"
          label="Segundo Nombre"
        >
          <Input placeholder="Segundo nombre (opcional)" />
        </Form.Item>

        <Form.Item
          name="primer_apellido"
          label="Primer Apellido"
          rules={[{ required: true, message: 'Por favor ingresa el primer apellido' }]}
        >
          <Input placeholder="Primer apellido" />
        </Form.Item>

        <Form.Item
          name="segundo_apellido"
          label="Segundo Apellido"
        >
          <Input placeholder="Segundo apellido (opcional)" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Por favor ingresa el email' },
            { type: 'email', message: 'Ingresa un email válido' }
          ]}
        >
          <Input placeholder="email@ejemplo.com" />
        </Form.Item>

        <div className="d-flex gap-8">
          <Form.Item
            name="codigo_telefonico"
            label="Código"
            style={{ width: '120px' }}
            rules={[{ required: true, message: 'Requerido' }]}
          >
            <Select placeholder="Código">
              <Option value={56}>+56 (Chile)</Option>
              <Option value={57}>+57 (Colombia)</Option>
              <Option value={58}>+58 (Venezuela)</Option>
              <Option value={51}>+51 (Perú)</Option>
              <Option value={593}>+593 (Ecuador)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="telefono"
            label="Teléfono"
            className="flex-1"
            rules={[{ required: true, message: 'Por favor ingresa el teléfono' }]}
          >
            <Input placeholder="Número de teléfono" />
          </Form.Item>
        </div>

        <div className="d-flex justify-end gap-8 mt-24">
          <Button onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? 'Creando...' : 'Crear Prospecto'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddProspectoModal;