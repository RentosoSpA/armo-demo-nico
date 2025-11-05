import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Button, App } from 'antd';
import { updateInvitationLinkRole, type InvitationLink } from '../../services/invitations/invitationLinksServiceSupabase';

interface EditInvitationLinkRoleModalProps {
  visible: boolean;
  link: InvitationLink | null;
  onClose: () => void;
  onSuccess: () => void;
}

const roleOptions = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Agente', value: 'agent' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Asistente', value: 'assistant' },
];

const EditInvitationLinkRoleModal: React.FC<EditInvitationLinkRoleModalProps> = ({
  visible,
  link,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  useEffect(() => {
    if (link && visible) {
      form.setFieldsValue({ role: link.role });
    }
  }, [link, visible, form]);

  const handleSubmit = async () => {
    if (!link) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      const result = await updateInvitationLinkRole(link.id, values.role);

      if (result.success) {
        message.success('Rol actualizado correctamente');
        onSuccess();
      } else {
        message.error(result.error || 'Error al actualizar el rol');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      message.error('Error al actualizar el rol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Editar Rol del Link de Invitación"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Guardar Cambios
        </Button>,
      ]}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="role"
          label="Nuevo Rol"
          rules={[{ required: true, message: 'Por favor selecciona un rol' }]}
        >
          <Select options={roleOptions} placeholder="Seleccionar rol" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditInvitationLinkRoleModal;
