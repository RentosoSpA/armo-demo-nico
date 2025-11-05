import React, { useState, useEffect } from 'react';
import { Table, Button, Switch, Tag, Space, Popconfirm, App, Tooltip } from 'antd';
import { Plus, Copy, Edit, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import {
  getInvitationLinks,
  toggleInvitationLinkStatus,
  deleteInvitationLink,
  type InvitationLink,
} from '../../services/invitations/invitationLinksServiceSupabase';
import { useUserStore } from '../../store/userStore';
import CreateInvitationLinkModal from './CreateInvitationLinkModal';
import EditInvitationLinkRoleModal from './EditInvitationLinkRoleModal';

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  agent: 'Agente',
  supervisor: 'Supervisor',
  assistant: 'Asistente',
};

const InvitationLinksManager: React.FC = () => {
  const [links, setLinks] = useState<InvitationLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedLink, setSelectedLink] = useState<InvitationLink | null>(null);
  const [deleteCountdown, setDeleteCountdown] = useState<Record<string, number>>({});
  const [popconfirmVisible, setPopconfirmVisible] = useState<Record<string, boolean>>({});
  const { message } = App.useApp();
  const { empresa } = useUserStore();

  useEffect(() => {
    if (empresa) {
      loadLinks();
    }
  }, [empresa]);

  // Countdown effect for delete confirmations
  useEffect(() => {
    const intervals: Record<string, NodeJS.Timeout> = {};

    Object.keys(popconfirmVisible).forEach((linkId) => {
      if (popconfirmVisible[linkId] && deleteCountdown[linkId] > 0) {
        intervals[linkId] = setInterval(() => {
          setDeleteCountdown((prev) => {
            const newCount = (prev[linkId] || 7) - 1;
            if (newCount <= 0) {
              if (intervals[linkId]) clearInterval(intervals[linkId]);
              return { ...prev, [linkId]: 0 };
            }
            return { ...prev, [linkId]: newCount };
          });
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, [popconfirmVisible, deleteCountdown]);

  const loadLinks = async () => {
    if (!empresa) return;

    setLoading(true);
    try {
      const data = await getInvitationLinks(empresa.id);
      setLinks(data);
    } catch (error) {
      console.error('Error loading invitation links:', error);
      message.error('Error al cargar los links de invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/registro-agente?token=${token}`;
    navigator.clipboard.writeText(link);
    message.success('Link copiado al portapapeles');
  };

  const handleToggleStatus = async (linkId: string, currentStatus: boolean) => {
    const result = await toggleInvitationLinkStatus(linkId, !currentStatus);
    if (result.success) {
      message.success(`Link ${!currentStatus ? 'activado' : 'desactivado'} correctamente`);
      loadLinks();
    } else {
      message.error(result.error || 'Error al cambiar el estado del link');
    }
  };

  const handleEditRole = (link: InvitationLink) => {
    setSelectedLink(link);
    setEditModalVisible(true);
  };

  const handleDeleteClick = (linkId: string) => {
    setPopconfirmVisible({ ...popconfirmVisible, [linkId]: true });
    setDeleteCountdown({ ...deleteCountdown, [linkId]: 7 });
  };

  const handleDeleteCancel = (linkId: string) => {
    setPopconfirmVisible({ ...popconfirmVisible, [linkId]: false });
    setDeleteCountdown({ ...deleteCountdown, [linkId]: 7 });
  };

  const handleDelete = async (linkId: string) => {
    setPopconfirmVisible({ ...popconfirmVisible, [linkId]: false });
    const result = await deleteInvitationLink(linkId);
    if (result.success) {
      message.success('Link eliminado correctamente');
      loadLinks();
    } else {
      message.error(result.error || 'Error al eliminar el link');
    }
    setDeleteCountdown({ ...deleteCountdown, [linkId]: 7 });
  };

  const columns = [
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      width: 200,
      render: (token: string) => (
        <code style={{ fontSize: '12px', color: '#33F491' }}>{token.substring(0, 20)}...</code>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (role: string) => (
        <Tag color="blue">{roleLabels[role] || role}</Tag>
      ),
    },
    {
      title: 'Creado',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Usos',
      key: 'uses',
      width: 150,
      render: (_: any, record: InvitationLink) => {
        const isUnlimited = record.max_uses === null;
        const currentUses = record.current_uses || 0;
        const usagePercent = isUnlimited ? 0 : (currentUses / (record.max_uses || 1)) * 100;
        const isNearLimit = !isUnlimited && usagePercent >= 80;
        const isMaxed = !isUnlimited && currentUses >= (record.max_uses || 0);

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: isMaxed ? '#ff4d4f' : isNearLimit ? '#faad14' : 'inherit' }}>
              {currentUses} / {record.max_uses || '∞'}
            </span>
            {isMaxed && <Tag color="error">Máximo alcanzado</Tag>}
            {isNearLimit && !isMaxed && <Tag color="warning">Cerca del límite</Tag>}
          </div>
        );
      },
    },
    {
      title: 'Expira',
      dataIndex: 'expires_at',
      key: 'expires_at',
      width: 150,
      render: (date: string | null) => {
        if (!date) return <Tag color="green">Nunca</Tag>;
        
        const expiryDate = dayjs(date);
        const isExpired = expiryDate.isBefore(dayjs());
        const daysUntilExpiry = expiryDate.diff(dayjs(), 'day');
        const isExpiringSoon = daysUntilExpiry >= 0 && daysUntilExpiry <= 7;

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{expiryDate.format('DD/MM/YYYY')}</span>
            {isExpired && <Tag color="error">Expirado</Tag>}
            {isExpiringSoon && !isExpired && <Tag color="warning">Expira pronto</Tag>}
          </div>
        );
      },
    },
    {
      title: 'Estado',
      key: 'status',
      width: 150,
      render: (_: any, record: InvitationLink) => {
        const isExpired = record.expires_at && dayjs(record.expires_at).isBefore(dayjs());
        const currentUses = record.current_uses || 0;
        const isMaxed = record.max_uses !== null && currentUses >= record.max_uses;
        
        if (!record.is_active) {
          return <Tag color="default">Inactivo</Tag>;
        }
        if (isExpired) {
          return <Tag color="error">Expirado</Tag>;
        }
        if (isMaxed) {
          return <Tag color="error">Agotado</Tag>;
        }
        return (
          <Switch
            checked={record.is_active || false}
            onChange={() => handleToggleStatus(record.id, record.is_active || false)}
            checkedChildren="Activo"
            unCheckedChildren="Inactivo"
          />
        );
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: InvitationLink) => {
        const isExpired = record.expires_at && dayjs(record.expires_at).isBefore(dayjs());
        const currentUses = record.current_uses || 0;
        const isMaxed = record.max_uses !== null && currentUses >= record.max_uses;
        const isUsable = record.is_active && !isExpired && !isMaxed;

        return (
          <Space>
            <Tooltip title={isUsable ? "Copiar link" : "Link no disponible"}>
              <Button
                type="text"
                size="small"
                icon={<Copy size={16} />}
                onClick={() => handleCopyLink(record.token)}
                disabled={!isUsable}
              />
            </Tooltip>
            <Tooltip title="Editar rol">
              <Button
                type="text"
                size="small"
                icon={<Edit size={16} />}
                onClick={() => handleEditRole(record)}
              />
            </Tooltip>
            <Popconfirm
              open={popconfirmVisible[record.id]}
              onOpenChange={(visible) => {
                if (visible) {
                  handleDeleteClick(record.id);
                } else {
                  handleDeleteCancel(record.id);
                }
              }}
              title="¿Eliminar link de invitación?"
              description="Esta acción no se puede deshacer. Los links ya compartidos dejarán de funcionar."
              onConfirm={() => handleDelete(record.id)}
              okText={deleteCountdown[record.id] > 0 ? `Espera ${deleteCountdown[record.id]}s...` : 'Sí, eliminar'}
              cancelText="Cancelar"
              okButtonProps={{
                danger: true,
                disabled: deleteCountdown[record.id] > 0,
              }}
            >
              <Tooltip title="Eliminar">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<Trash2 size={16} />}
                  onClick={() => handleDeleteClick(record.id)}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setCreateModalVisible(true)}
        >
          Generar Nuevo Link
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={links}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} links`,
        }}
        scroll={{ x: 1000 }}
      />

      <CreateInvitationLinkModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={() => {
          loadLinks();
          setCreateModalVisible(false);
        }}
      />

      <EditInvitationLinkRoleModal
        visible={editModalVisible}
        link={selectedLink}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedLink(null);
        }}
        onSuccess={() => {
          loadLinks();
          setEditModalVisible(false);
          setSelectedLink(null);
        }}
      />
    </div>
  );
};

export default InvitationLinksManager;
