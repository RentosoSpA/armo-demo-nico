import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, TimePicker, App, Row, Col, Space, Typography } from 'antd';
import { UserCog, Save } from 'lucide-react';
import type { AgenteWithRole, AgenteUpdate, AppRole } from '../../types/agente';
import dayjs from 'dayjs';

const { Title } = Typography;

interface EditAgentModalProps {
  visible: boolean;
  agente: AgenteWithRole | null;
  onClose: () => void;
  onSave: (agenteId: string, updates: AgenteUpdate, newRole?: AppRole) => Promise<void>;
}

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'agent', label: 'Agente' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'assistant', label: 'Asistente' },
];

const EditAgentModal: React.FC<EditAgentModalProps> = ({ visible, agente, onClose, onSave }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (agente && visible) {
      const hoursToTime = (hour: number | null | undefined) => {
        if (!hour && hour !== 0) return null;
        const hours = Math.floor(hour);
        const minutes = Math.round((hour - hours) * 60);
        return dayjs().hour(hours).minute(minutes);
      };

      form.setFieldsValue({
        nombre: agente.nombre,
        email: agente.email,
        telefono: agente.telefono,
        codigo_telefonico: agente.codigoTelefonico || 56,
        role: agente.role,
        activo: agente.activo,
        lunes_inicio: hoursToTime(agente.lunes_inicio),
        lunes_fin: hoursToTime(agente.lunes_fin),
        martes_inicio: hoursToTime(agente.martes_inicio),
        martes_fin: hoursToTime(agente.martes_fin),
        miercoles_inicio: hoursToTime(agente.miercoles_inicio),
        miercoles_fin: hoursToTime(agente.miercoles_fin),
        jueves_inicio: hoursToTime(agente.jueves_inicio),
        jueves_fin: hoursToTime(agente.jueves_fin),
        viernes_inicio: hoursToTime(agente.viernes_inicio),
        viernes_fin: hoursToTime(agente.viernes_fin),
        sabado_inicio: hoursToTime(agente.sabado_inicio),
        sabado_fin: hoursToTime(agente.sabado_fin),
        domingo_inicio: hoursToTime(agente.domingo_inicio),
        domingo_fin: hoursToTime(agente.domingo_fin),
      });
    }
  }, [agente, visible, form]);

  const handleSubmit = async () => {
    if (!agente) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      const timeToHours = (time: any) => {
        if (!time) return null;
        const hours = time.hour();
        const minutes = time.minute();
        return hours + minutes / 60;
      };

      const updates: AgenteUpdate = {
        nombre: values.nombre,
        email: values.email,
        telefono: parseInt(values.telefono),
        codigo_telefonico: parseInt(values.codigo_telefonico),
        activo: values.activo,
        lunes_inicio: timeToHours(values.lunes_inicio),
        lunes_fin: timeToHours(values.lunes_fin),
        martes_inicio: timeToHours(values.martes_inicio),
        martes_fin: timeToHours(values.martes_fin),
        miercoles_inicio: timeToHours(values.miercoles_inicio),
        miercoles_fin: timeToHours(values.miercoles_fin),
        jueves_inicio: timeToHours(values.jueves_inicio),
        jueves_fin: timeToHours(values.jueves_fin),
        viernes_inicio: timeToHours(values.viernes_inicio),
        viernes_fin: timeToHours(values.viernes_fin),
        sabado_inicio: timeToHours(values.sabado_inicio),
        sabado_fin: timeToHours(values.sabado_fin),
        domingo_inicio: timeToHours(values.domingo_inicio),
        domingo_fin: timeToHours(values.domingo_fin),
      };

      const newRole = values.role !== agente.role ? values.role : undefined;

      await onSave(agente.id, updates, newRole);
      message.success('Agente actualizado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al actualizar agente:', error);
      message.error('Error al actualizar agente');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const dias = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  return (
    <Modal
      title={
        <Space>
          <UserCog size={20} />
          <span>Editar Agente</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={
        <Space>
          <Save size={16} />
          <span>Guardar</span>
        </Space>
      }
      cancelText="Cancelar"
      confirmLoading={loading}
      width={800}
    >
      <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
        {/* Información Personal */}
        <Title level={5}>Información Personal</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[{ required: true, message: 'Ingrese el nombre' }]}
            >
              <Input placeholder="Nombre completo" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Ingrese el email' },
                { type: 'email', message: 'Email inválido' },
              ]}
            >
              <Input placeholder="correo@ejemplo.com" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="codigo_telefonico" label="Código">
              <Input type="number" placeholder="56" />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="telefono"
              label="Teléfono"
              rules={[{ required: true, message: 'Ingrese el teléfono' }]}
            >
              <Input type="number" placeholder="912345678" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
              <Select options={roles} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="activo" label="Estado" valuePropName="checked">
              <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
            </Form.Item>
          </Col>
        </Row>

        {/* Horarios */}
        <Title level={5} style={{ marginTop: '24px' }}>
          Horarios de Trabajo
        </Title>
        {dias.map((dia) => (
          <Row gutter={16} key={dia.key}>
            <Col span={8}>
              <div style={{ paddingTop: '30px', fontWeight: 500 }}>{dia.label}</div>
            </Col>
            <Col span={8}>
              <Form.Item name={`${dia.key}_inicio`} label="Inicio">
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={`${dia.key}_fin`} label="Fin">
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        ))}
      </Form>
    </Modal>
  );
};

export default EditAgentModal;
