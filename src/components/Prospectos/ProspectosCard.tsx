import { Card, Typography, Badge, Row, Col, Avatar } from 'antd';
import { UserOutlined, CalendarOutlined, HomeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import SearchInput from '../common/SearchInput';
import { useState } from 'react';
import type { Prospecto } from '../../types/profile';
import ProspectoOpportunityModal from './ProspectoOpportunityModal';

const { Text } = Typography;

interface Props {
  data: Prospecto[];
  loading: boolean;
}

interface KanbanColumn {
  key: string;
  title: string;
  color: string;
  icon: React.ReactNode;
}

const ProspectosCard = ({ data, loading }: Props) => {
  const [searchText, setSearchText] = useState('');
  const [selectedProspecto, setSelectedProspecto] = useState<Prospecto | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const columns: KanbanColumn[] = [
    {
      key: 'nuevo',
      title: 'Captación',
      color: '#1890ff',
      icon: <UserOutlined />,
    },
    {
      key: 'contactado',
      title: 'Evaluación',
      color: '#faad14',
      icon: <CalendarOutlined />,
    },
    {
      key: 'evaluado',
      title: 'Negociación',
      color: '#722ed1',
      icon: <HomeOutlined />,
    },
    {
      key: 'aprobado',
      title: 'Cierre',
      color: '#52c41a',
      icon: <CheckCircleOutlined />,
    },
  ];

  const filteredData = data?.filter(
    item =>
      item.primer_nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.primer_apellido?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

  const getProspectosByStatus = (status: string) => {
    return filteredData.filter(prospecto => {
      switch (status) {
        case 'nuevo':
          return !prospecto.evaluado && !prospecto.aprobado;
        case 'contactado':
          return prospecto.evaluado && !prospecto.aprobado;
        case 'evaluado':
          return prospecto.evaluado && prospecto.aprobado;
        case 'aprobado':
          return prospecto.aprobado && prospecto.estado === 'activo';
        default:
          return false;
      }
    });
  };

  const handleProspectoClick = (prospecto: Prospecto) => {
    setSelectedProspecto(prospecto);
    setModalVisible(true);
  };

  const renderProspectoCard = (prospecto: Prospecto) => {
    const initials = `${prospecto.primer_nombre?.charAt(0) || ''}${prospecto.primer_apellido?.charAt(0) || ''}`.toUpperCase();
    
    return (
      <Card
        key={prospecto.id}
        className="cursor-pointer mb-12 animate-fade-in hover-scale"
        styles={{ body: { padding: 12 } }}
        onClick={() => handleProspectoClick(prospecto)}
        hoverable
      >
        <div className="d-flex align-center justify-between mb-8">
          <Avatar size={32} style={{ backgroundColor: '#1890ff' }}>
            {initials || 'U'}
          </Avatar>
        </div>

        <div className="mb-8">
          <Text strong style={{ fontSize: 14 }}>
            {`${prospecto.primer_nombre || ''} ${prospecto.primer_apellido || ''}`.trim() || 'Sin nombre'}
          </Text>
        </div>

        <div className="mb-8">
          <Text type="secondary" style={{ fontSize: 12 }}>
            {prospecto.email}
          </Text>
        </div>

        {prospecto.phone_e164 && (
          <div className="mb-4">
            <Text type="secondary" style={{ fontSize: 12 }}>
              {prospecto.phone_e164}
            </Text>
          </div>
        )}
      </Card>
    );
  };

  return (
    <Card className="modern-card">
      <div className="modern-card-content">
        <div className="card-header">
          <h2 className="card-title">Prospectos - Vista Kanban</h2>
          <div className="card-filters">
            <SearchInput
              placeholder="Buscar prospectos..."
              onChange={setSearchText}
              style={{ width: 300 }}
            />
          </div>
        </div>
        
        <Row gutter={16} className="mt-24">
          {columns.map(column => {
            const columnProspectos = getProspectosByStatus(column.key);

            return (
              <Col key={column.key} xs={24} sm={12} md={6}>
                <Card
                  title={
                    <div className="d-flex align-center justify-between">
                      <div className="d-flex align-center gap-8">
                        <span style={{ color: column.color }}>{column.icon}</span>
                        <Text strong>{column.title}</Text>
                      </div>
                      <Badge
                        count={columnProspectos.length}
                        style={{ backgroundColor: column.color }}
                      />
                    </div>
                  }
                  className="stats-card"
                  style={{
                    borderRadius: 12,
                    height: 'fit-content',
                    minHeight: 400,
                  }}
                  styles={{
                    body: {
                      padding: 12,
                      minHeight: 300,
                      display: 'flex',
                      flexDirection: 'column',
                    }
                  }}
                >
                  {loading ? (
                    <div className="text-center p-20">
                      <Text type="secondary">Cargando...</Text>
                    </div>
                  ) : columnProspectos.length === 0 ? (
                    <div className="text-center p-20">
                      <Text type="secondary">Sin oportunidades</Text>
                    </div>
                  ) : (
                    <div className="flex-1">{columnProspectos.map(renderProspectoCard)}</div>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>

        {selectedProspecto && (
          <ProspectoOpportunityModal
            visible={modalVisible}
            prospecto={selectedProspecto}
            onClose={() => {
              setModalVisible(false);
              setSelectedProspecto(null);
            }}
          />
        )}
      </div>
    </Card>
  );
};

export default ProspectosCard;
