import React from 'react';
import { Modal, Descriptions, Tag, Space, Typography } from 'antd';
import { User, Mail, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { AgenteWithRole } from '../../types/agente';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface ViewAgentModalProps {
  visible: boolean;
  agente: AgenteWithRole | null;
  onClose: () => void;
}

const ViewAgentModal: React.FC<ViewAgentModalProps> = ({ visible, agente, onClose }) => {
  if (!agente) return null;

  const roleColors: Record<string, string> = {
    admin: 'green',
    agent: 'blue',
    supervisor: 'orange',
    assistant: 'purple',
  };

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    agent: 'Agente',
    supervisor: 'Supervisor',
    assistant: 'Asistente',
  };

  const formatHour = (hour: number | null | undefined): string => {
    if (!hour && hour !== 0) return '-';
    const hours = Math.floor(hour);
    const minutes = Math.round((hour - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const dias = [
    { key: 'lunes', label: 'Lunes', inicio: agente.lunes_inicio, fin: agente.lunes_fin },
    { key: 'martes', label: 'Martes', inicio: agente.martes_inicio, fin: agente.martes_fin },
    { key: 'miercoles', label: 'Miércoles', inicio: agente.miercoles_inicio, fin: agente.miercoles_fin },
    { key: 'jueves', label: 'Jueves', inicio: agente.jueves_inicio, fin: agente.jueves_fin },
    { key: 'viernes', label: 'Viernes', inicio: agente.viernes_inicio, fin: agente.viernes_fin },
    { key: 'sabado', label: 'Sábado', inicio: agente.sabado_inicio, fin: agente.sabado_fin },
    { key: 'domingo', label: 'Domingo', inicio: agente.domingo_inicio, fin: agente.domingo_fin },
  ];

  return (
    <Modal
      title={
        <Space>
          <User size={20} />
          <span>Perfil del Agente</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div style={{ marginTop: '24px' }}>
        {/* Información Personal */}
        <Title level={5}>
          <Mail size={16} style={{ marginRight: '8px' }} />
          Información Personal
        </Title>
        <Descriptions bordered column={2} size="small" style={{ marginBottom: '24px' }}>
          <Descriptions.Item label="Nombre">{agente.nombre}</Descriptions.Item>
          <Descriptions.Item label="Email">{agente.email}</Descriptions.Item>
          <Descriptions.Item label="Teléfono">
            +{agente.codigoTelefonico || 56} {agente.telefono}
          </Descriptions.Item>
          <Descriptions.Item label="Rol">
            <Tag color={roleColors[agente.role]}>{roleLabels[agente.role]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            {agente.activo ? (
              <Tag icon={<CheckCircle size={14} />} color="success">
                Activo
              </Tag>
            ) : (
              <Tag icon={<XCircle size={14} />} color="error">
                Inactivo
              </Tag>
            )}
          </Descriptions.Item>
        </Descriptions>

        {/* Horarios de Trabajo */}
        <Title level={5}>
          <Clock size={16} style={{ marginRight: '8px' }} />
          Horarios de Trabajo
        </Title>
        <div style={{ marginBottom: '24px' }}>
          {dias.map((dia) => (
            <div
              key={dia.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <Text strong>{dia.label}</Text>
              <Text>
                {dia.inicio !== null && dia.inicio !== undefined && dia.fin !== null && dia.fin !== undefined
                  ? `${formatHour(dia.inicio)} - ${formatHour(dia.fin)}`
                  : 'No disponible'}
              </Text>
            </div>
          ))}
        </div>

        {/* Metadata */}
        <Title level={5}>
          <Calendar size={16} style={{ marginRight: '8px' }} />
          Información del Sistema
        </Title>
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Fecha de creación">
            {dayjs(agente.createdAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Última actualización">
            {dayjs(agente.updatedAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default ViewAgentModal;
