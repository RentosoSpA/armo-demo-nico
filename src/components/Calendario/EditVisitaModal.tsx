import { Modal, Form, Select, DatePicker, Button, message, Popconfirm, Input } from 'antd';
import { useState, useEffect } from 'react';
import type { Visita, VisitaUpdate } from '../../types/visita';
import { EstadoVisita } from '../../types/visita';
import { updateVisita, deleteVisita } from '../../services/visitas/visitasService';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

interface EditVisitaModalProps {
  visible: boolean;
  visita: Visita | null;
  onCancel: () => void;
  onReload: () => void;
}

const EditVisitaModal = ({ visible, visita, onCancel, onReload }: EditVisitaModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const visitaData: VisitaUpdate = {
        id: visita!.id,
        estado: values.estado,
        fecha: new Date(values.fecha.format('YYYY-MM-DD')),
        horaInicio: parseFloat(values.horaInicio),
        horaFin: parseFloat(values.horaFin),
      };
      await updateVisita(visitaData);
      form.resetFields();
      onCancel();
      onReload();
    } catch (error) {
      console.error('Error al reagendar visita:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!visita) return;

    try {
      setDeleting(true);
      await deleteVisita(visita.id);
      message.success('Visita eliminada exitosamente');
      onCancel();
      onReload();
    } catch (error) {
      console.error('Error al eliminar visita:', error);
      message.error('Error al eliminar la visita');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Initialize form when modal opens
  useEffect(() => {
    if (visible && visita) {
      form.setFieldsValue({
        estado: visita.estado,
        fecha: dayjs(visita.fecha),
        horaInicio: visita.horaInicio,
        horaFin: visita.horaFin,
      });
    }
  }, [visible, visita, form]);

  return (
    <Modal title="Editar Visita" open={visible} onCancel={handleCancel} footer={null} width={500}>
      <Form form={form} layout="vertical" className="mt-16">
        <Form.Item
          name="estado"
          label="Estado"
          rules={[{ required: true, message: 'Por favor selecciona un estado' }]}
        >
          <Select placeholder="Selecciona el estado">
            <Select.Option value={EstadoVisita.Agendada}>Agendada</Select.Option>
            <Select.Option value={EstadoVisita.Aprobada}>Aprobada</Select.Option>
            <Select.Option value={EstadoVisita.Completada}>Completada</Select.Option>
            <Select.Option value={EstadoVisita.Cancelada}>Cancelada</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="fecha"
          label="Fecha"
          rules={[{ required: true, message: 'Por favor selecciona una fecha' }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            placeholder="Selecciona fecha"
            className="w-full"
          />
        </Form.Item>

        <Form.Item
          name="horaInicio"
          label="Hora Inicio (formato 24h decimal: 9.5 = 9:30)"
          rules={[{ required: true, message: 'Por favor ingresa la hora de inicio' }]}
        >
          <Input type="number" step="0.5" min="0" max="24" placeholder="9.0" />
        </Form.Item>

        <Form.Item
          name="horaFin"
          label="Hora Fin (formato 24h decimal: 10.5 = 10:30)"
          rules={[{ required: true, message: 'Por favor ingresa la hora de fin' }]}
        >
          <Input type="number" step="0.5" min="0" max="24" placeholder="10.0" />
        </Form.Item>

        <Form.Item className="text-right mb-0">
          <Button
            type="primary"
            onClick={handleUpdate}
            loading={loading}
            className="mr-8"
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de que quieres eliminar esta visita?"
            description="Esta acción no se puede deshacer."
            onConfirm={handleDelete}
            okText="Sí, eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button danger loading={deleting} className="mr-8">
              Eliminar
            </Button>
          </Popconfirm>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditVisitaModal;
