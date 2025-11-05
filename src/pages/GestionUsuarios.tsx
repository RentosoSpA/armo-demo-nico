import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, Tag, Table, Spin, Tooltip, App, Popconfirm } from 'antd';
import { Users, UserCheck, UserPlus, Eye, Edit, Trash2, Shield } from 'lucide-react';
import type { AgenteWithRole, AgenteUpdate, AgentesStats, AppRole } from '../types/agente';
import {
  getAgentesByEmpresa,
  getAgentesStats,
  updateAgente,
  updateAgenteRole,
  toggleAgenteStatus,
} from '../services/agentes/agentesServiceSupabase';
import InviteUserModal from '../components/ajustes/InviteUserModal';
import ViewAgentModal from '../components/agentes/ViewAgentModal';
import EditAgentModal from '../components/agentes/EditAgentModal';
import { useUser } from '../store/userStore';
import '../styles/components/_dashboard-stats.scss';
import '../styles/components/_common-cards.scss';
import '../styles/pages/_Oportunidades.scss';

const { Title, Text } = Typography;
const { useApp } = App;

interface GestionUsuariosProps {
  onNavigate?: (key: string) => void;
}

const GestionUsuarios: React.FC<GestionUsuariosProps> = () => {
  const { message } = useApp();
  const [agentes, setAgentes] = useState<AgenteWithRole[]>([]);
  const [stats, setStats] = useState<AgentesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAgente, setSelectedAgente] = useState<AgenteWithRole | null>(null);
  const { empresa } = useUser();

  useEffect(() => {
    fetchAgentes();
  }, [empresa]);

  const fetchAgentes = async () => {
    if (!empresa?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [agentesData, statsData] = await Promise.all([
        getAgentesByEmpresa(empresa.id),
        getAgentesStats(empresa.id),
      ]);
      setAgentes(agentesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar agentes:', error);
      message.error('Error al cargar los agentes');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = () => {
    setInviteModalVisible(true);
  };

  const handleViewUser = (agente: AgenteWithRole) => {
    setSelectedAgente(agente);
    setViewModalVisible(true);
  };

  const handleEditUser = (agente: AgenteWithRole) => {
    setSelectedAgente(agente);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (agenteId: string, updates: AgenteUpdate, newRole?: AppRole) => {
    if (!empresa?.id) return;

    try {
      // Actualizar datos del agente
      await updateAgente(agenteId, updates);

      // Si cambió el rol, actualizarlo también
      if (newRole && selectedAgente) {
        await updateAgenteRole(selectedAgente.userUID, empresa.id, newRole);
      }

      message.success('Agente actualizado exitosamente');
      fetchAgentes();
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error al actualizar agente:', error);
      message.error('Error al actualizar agente');
    }
  };

  const handleToggleStatus = async (agente: AgenteWithRole) => {
    try {
      await toggleAgenteStatus(agente.id, !agente.activo);
      message.success(`Agente ${agente.activo ? 'desactivado' : 'activado'} exitosamente`);
      fetchAgentes();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      message.error('Error al cambiar estado del agente');
    }
  };

  const roleColors: Record<AppRole, string> = {
    admin: 'green',
    agent: 'blue',
    supervisor: 'orange',
    assistant: 'purple',
  };

  const roleLabels: Record<AppRole, string> = {
    admin: 'Administrador',
    agent: 'Agente',
    supervisor: 'Supervisor',
    assistant: 'Asistente',
  };

  const columns = [
    {
      title: 'USUARIO',
      key: 'usuario',
      render: (agente: AgenteWithRole) => (
        <div>
          <Text strong className="d-block">
            {agente.nombre}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', color: '#8892b0' }}>
            {agente.email}
          </Text>
        </div>
      ),
    },
    {
      title: 'ROL',
      key: 'rol',
      render: (agente: AgenteWithRole) => (
        <Tag color={roleColors[agente.role]} style={{ borderRadius: '12px', padding: '4px 12px' }}>
          {roleLabels[agente.role]}
        </Tag>
      ),
    },
    {
      title: 'ESTADO',
      key: 'estado',
      render: (agente: AgenteWithRole) => (
        <Tag color={agente.activo ? 'success' : 'error'}>
          {agente.activo ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'ACCIONES',
      key: 'acciones',
      render: (agente: AgenteWithRole) => (
        <div className="d-flex gap-8">
          <Tooltip title="Ver perfil">
            <Button
              type="text"
              icon={<Eye size={16} />}
              size="small"
              style={{ color: '#8892b0', border: 'none', background: 'transparent' }}
              onClick={() => handleViewUser(agente)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<Edit size={16} />}
              size="small"
              style={{ color: '#8892b0', border: 'none', background: 'transparent' }}
              onClick={() => handleEditUser(agente)}
            />
          </Tooltip>
          <Popconfirm
            title={`¿${agente.activo ? 'Desactivar' : 'Activar'} agente?`}
            description={`¿Estás seguro de ${agente.activo ? 'desactivar' : 'activar'} a ${agente.nombre}?`}
            onConfirm={() => handleToggleStatus(agente)}
            okText="Sí"
            cancelText="No"
          >
            <Tooltip title={agente.activo ? 'Desactivar' : 'Activar'}>
              <Button
                type="text"
                icon={<Trash2 size={16} />}
                size="small"
                style={{ color: '#8892b0', border: 'none', background: 'transparent' }}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="d-flex align-center justify-center" style={{ minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="Oportunidades-page">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div className="d-flex align-center justify-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 auto', minWidth: '250px' }}>
              <Title level={2} className="title-text m-0">
                Gestión de usuarios
              </Title>
              <Text style={{ color: '#8892b0', fontSize: '14px' }}>
                Gestiona fácilmente a tu equipo: agrega nuevos agentes, define sus roles y mantén todo bajo control.
              </Text>
            </div>
            <Button
              type="primary"
              icon={<UserPlus size={16} />}
              onClick={handleInviteUser}
              className="font-medium"
              style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              Invitar a un usuario
            </Button>
          </div>
        </Col>

        <Col span={24}>
          <div className="modern-card" style={{ padding: '16px 24px', background: 'rgba(136, 146, 176, 0.05)' }}>
            <Text style={{ color: '#8892b0', fontSize: '14px' }}>
              Envía una invitación para que otro usuario tenga acceso a tu cuenta con nosotros
            </Text>
          </div>
        </Col>

        {/* Stats Cards */}
        <Col span={8}>
          <div className="dashboard-stat-card prospecto">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats?.total || 0}</div>
              <div className="stat-title">Total Usuarios</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div className="dashboard-stat-card pendientes">
            <div className="stat-icon">
              <UserCheck size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats?.activos || 0}</div>
              <div className="stat-title">Usuarios Activos</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div className="dashboard-stat-card evaluados">
            <div className="stat-icon">
              <Shield size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats?.porRol.admin || 0}</div>
              <div className="stat-title">Administradores</div>
            </div>
          </div>
        </Col>

        {/* Users Table */}
        <Col span={24}>
          <div className="modern-card">
            <div className="modern-card-content">
              <Table
                dataSource={agentes}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10, showSizeChanger: false, style: { marginTop: '24px' } }}
                size="large"
                style={{ background: 'transparent' }}
                showHeader={true}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Modals */}
      <InviteUserModal
        visible={inviteModalVisible}
        onClose={() => setInviteModalVisible(false)}
        onRefresh={fetchAgentes}
      />

      <ViewAgentModal
        visible={viewModalVisible}
        agente={selectedAgente}
        onClose={() => {
          setViewModalVisible(false);
          setSelectedAgente(null);
        }}
      />

      <EditAgentModal
        visible={editModalVisible}
        agente={selectedAgente}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedAgente(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default GestionUsuarios;
