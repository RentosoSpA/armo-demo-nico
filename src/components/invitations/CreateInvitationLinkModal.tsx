import React, { useState } from 'react';
import { Modal, Form, Select, InputNumber, DatePicker, Button, App, Input } from 'antd';
import { Copy } from 'lucide-react';
import dayjs from 'dayjs';
import { createInvitationLink } from '../../services/invitations/invitationLinksServiceSupabase';
import { useUserStore } from '../../store/userStore';

interface CreateInvitationLinkModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const roleOptions = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Agente', value: 'agent' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Asistente', value: 'assistant' },
];

const CreateInvitationLinkModal: React.FC<CreateInvitationLinkModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const { message } = App.useApp();
  const { empresa } = useUserStore();

  const handleSubmit = async () => {
    if (!empresa) {
      message.error('No se encontró información de la empresa');
      return;
    }

    try {
      const values = await form.validateFields();
      setLoading(true);

      const result = await createInvitationLink(empresa.id, values.role, {
        maxUses: values.max_uses || undefined,
        expiresAt: values.expires_at ? dayjs(values.expires_at).toISOString() : undefined,
      });

      if (result.success && result.link) {
        const fullLink = `${window.location.origin}/registro-agente?token=${result.link.token}`;
        setGeneratedLink(fullLink);
        message.success('Link de invitación creado exitosamente');
      } else {
        message.error(result.error || 'Error al crear el link de invitación');
      }
    } catch (error) {
      console.error('Error creating invitation link:', error);
      message.error('Error al crear el link de invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      message.success('Link copiado al portapapeles');
    }
  };

  const handleClose = () => {
    form.resetFields();
    setGeneratedLink(null);
    onClose();
  };

  const handleFinish = () => {
    onSuccess();
    handleClose();
  };

  return (
    <Modal
      title="Generar Link de Invitación"
      open={visible}
      onCancel={handleClose}
      footer={
        generatedLink ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <Button onClick={handleFinish}>Cerrar</Button>
            <Button type="primary" icon={<Copy size={16} />} onClick={handleCopyLink}>
              Copiar Link
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="primary" loading={loading} onClick={handleSubmit}>
              Generar Link
            </Button>
          </div>
        )
      }
      width={600}
    >
      {!generatedLink ? (
        <Form form={form} layout="vertical" initialValues={{ role: 'agent' }}>
          <Form.Item
            name="role"
            label="Rol del Agente"
            rules={[{ required: true, message: 'Por favor selecciona un rol' }]}
          >
            <Select options={roleOptions} placeholder="Seleccionar rol" />
          </Form.Item>

          <Form.Item
            name="max_uses"
            label="Máximo de Usos (opcional)"
            tooltip="Deja en blanco para usos ilimitados"
          >
            <InputNumber
              min={1}
              placeholder="Usos ilimitados"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="expires_at"
            label="Fecha de Expiración (opcional)"
            tooltip="Deja en blanco para que nunca expire"
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Nunca expira"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p style={{ marginBottom: 16 }}>
            ¡Link de invitación generado exitosamente! Copia y comparte este link con el nuevo agente:
          </p>
          <Input.TextArea
            value={generatedLink}
            readOnly
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </div>
      )}
    </Modal>
  );
};

export default CreateInvitationLinkModal;
