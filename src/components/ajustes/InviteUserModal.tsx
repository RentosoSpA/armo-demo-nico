import React, { useState } from 'react';
import { Modal, Form, Select, Button, App, Input } from 'antd';
import { UserPlus, Copy, CheckCircle } from 'lucide-react';
import { createInvitationLink } from '../../services/invitations/invitationLinksServiceSupabase';
import type { AppRole } from '../../types/agente';
import { useUser } from '../../store/userStore';

interface InviteUserModalProps {
  visible: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'agent', label: 'Agente' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'assistant', label: 'Asistente' },
];

const InviteUserModal: React.FC<InviteUserModalProps> = ({ visible, onClose, onRefresh }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { empresa } = useUser();

  const handleSubmit = async () => {
    if (!empresa?.id) {
      message.error('No se encontró información de la empresa');
      return;
    }

    try {
      const values = await form.validateFields();
      setLoading(true);

      // Crear link de invitación
      const result = await createInvitationLink(empresa.id, values.rol as AppRole, {
        maxUses: 1,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      if (result.success && result.link) {
        const inviteUrl = `${window.location.origin}/registro-agente?token=${result.link.token}`;
        setInvitationLink(inviteUrl);
        message.success('Link de invitación creado exitosamente');
        
        if (onRefresh) {
          onRefresh();
        }
      } else {
        throw new Error(result.error || 'Error al crear invitación');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        message.error(error.message || 'Error al crear la invitación');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!invitationLink) return;

    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      message.success('Link copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      message.error('Error al copiar el link');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setInvitationLink(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e6f1ff' }}>
          <UserPlus size={20} />
          <span>Invitar usuario</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
      styles={{
        content: {
          background: 'rgba(17, 25, 40, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '16px',
        },
        header: {
          background: 'transparent',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '16px',
        },
      }}
    >
      <div style={{ marginTop: '24px' }}>
        {!invitationLink ? (
          <>
            <p style={{ color: '#8892b0', marginBottom: '24px', fontSize: '14px' }}>
              Selecciona el rol para el nuevo usuario y genera un link de invitación
            </p>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                name="rol"
                label="Rol"
                rules={[{ required: true, message: 'Por favor seleccione un rol' }]}
              >
                <Select placeholder="Selecciona un rol" size="large" options={roles} />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, marginTop: '32px' }}>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <Button onClick={handleCancel} size="large">
                    Cancelar
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<UserPlus size={16} />}
                    size="large"
                  >
                    Generar link de invitación
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <p style={{ color: '#8892b0', marginBottom: '16px', fontSize: '14px' }}>
              ¡Link de invitación generado! Compártelo con el nuevo usuario:
            </p>

            <Input.TextArea
              value={invitationLink}
              readOnly
              rows={3}
              style={{ marginBottom: '16px', fontFamily: 'monospace', fontSize: '12px' }}
            />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel} size="large">
                Cerrar
              </Button>
              <Button
                type="primary"
                icon={copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                onClick={handleCopy}
                size="large"
              >
                {copied ? 'Copiado' : 'Copiar link'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default InviteUserModal;
