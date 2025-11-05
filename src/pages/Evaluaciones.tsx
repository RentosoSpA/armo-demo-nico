import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Space, Button, Tag, Table, Spin, Select, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Eye, Filter, ShieldCheck} from 'lucide-react';
import type { Prospecto } from '../types/profile';
import { useProspectoStore } from '../store/prospectoStore';
import EvaluacionModal from '../components/Oportunidades/EvaluacionModal';
import { EstadoProspecto, getEstadoProspectoTitle, getEstadoProspectoColor } from '../types/estadoProspecto';
import '../styles/components/_dashboard-stats.scss';
import '../styles/components/_common-cards.scss';
import '../styles/pages/_Oportunidades.scss';

const { Title, Text } = Typography;
const { useApp } = App;

const Oportunidades: React.FC = () => {
  const { message } = useApp();
  const navigate = useNavigate();
  const [selectedProspecto, setSelectedProspecto] = useState<Prospecto | null>(null);
  const [evaluacionModalVisible, setEvaluacionModalVisible] = useState(false);
  const [filterEstado, setFilterEstado] = useState<EstadoProspecto | 'all'>('all');
  const { prospectos, loading, error, fetchProspectos } = useProspectoStore();

  useEffect(() => {
    fetchProspectos().catch(() => {
      // Error is already handled in the store
    });
  }, [fetchProspectos]);

  const handleEvaluar = (prospecto: Prospecto) => {
    setSelectedProspecto(prospecto);
    setEvaluacionModalVisible(true);
  };

  const handleEvaluacionComplete = () => {
    setEvaluacionModalVisible(false);
    setSelectedProspecto(null);
    fetchProspectos(); // Refresh the list
    message.success('Evaluación completada exitosamente');
  };


  const getStatusColor = (estado?: EstadoProspecto) => {
    return estado ? getEstadoProspectoColor(estado) : getEstadoProspectoColor(EstadoProspecto.VERIFICACION);
  };

  const getStatusText = (estado?: EstadoProspecto) => {
    return estado ? getEstadoProspectoTitle(estado) : getEstadoProspectoTitle(EstadoProspecto.VERIFICACION);
  };

  const columns = [
    {
      title: 'Nombre',
      key: 'nombre',
      render: (prospecto: Prospecto) => (
        <Text strong>
          {prospecto.primer_nombre} {prospecto.segundo_nombre} {prospecto.primer_apellido}{' '}
          {prospecto.segundo_apellido}
        </Text>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Documento',
      dataIndex: 'documento',
      key: 'documento',
    },
    {
      title: 'Estado',
      key: 'estado',
      render: (prospecto: Prospecto) => (
        <Tag color={getStatusColor(prospecto.estado as EstadoProspecto)}>
          {getStatusText(prospecto.estado as EstadoProspecto)}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (prospecto: Prospecto) => (
        <Space> 
          {(prospecto.estado === EstadoProspecto.REVISIONMANUAL || prospecto.estado === EstadoProspecto.VERIFICACION) && (
            <Button
              type="primary"
              icon={<Eye />}
              size="small"
              onClick={() => {
                console.log('prospecto', prospecto);
                handleEvaluar(prospecto);
              }}
            >
              Evaluar
            </Button>
          )}
          {(prospecto.estado === EstadoProspecto.INACTIVO || prospecto.estado === EstadoProspecto.ACTIVO) && (
            <Button
              type="primary"
              icon={<ShieldCheck />}
              size="small"
              onClick={() => {
                console.log('prospecto', prospecto);
                handleEvaluar(prospecto);
              }}
            >
              Revisar
            </Button>
          )}
          {/* <Button
            icon={<User />}
            size="small"
            onClick={() => handleViewProfile(prospecto)}
          >
            Ver perfil
          </Button> */}
        </Space>

      ),
    },
  ];

  // Filter prospects based on selected estado
  const filteredProspectos = filterEstado === 'all' 
    ? prospectos 
    : prospectos.filter(p => p.estado === filterEstado || (!p.estado && filterEstado === EstadoProspecto.VERIFICACION));

  const pendingEvaluations = prospectos.filter(p => 
    p.estado === EstadoProspecto.VERIFICACION || 
    p.estado === EstadoProspecto.DOCUMENTOS || 
    p.estado === EstadoProspecto.REVISIONMANUAL ||
    !p.estado
  );
  const completedEvaluations = prospectos.filter(p => 
    p.estado === EstadoProspecto.ACTIVO || 
    p.estado === EstadoProspecto.INACTIVO
  );

  // Filter options for the dropdown
  const filterOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: EstadoProspecto.VERIFICACION, label: getEstadoProspectoTitle(EstadoProspecto.VERIFICACION) },
    { value: EstadoProspecto.DOCUMENTOS, label: getEstadoProspectoTitle(EstadoProspecto.DOCUMENTOS) },
    { value: EstadoProspecto.REVISIONMANUAL, label: getEstadoProspectoTitle(EstadoProspecto.REVISIONMANUAL) },
    { value: EstadoProspecto.ACTIVO, label: getEstadoProspectoTitle(EstadoProspecto.ACTIVO) },
    { value: EstadoProspecto.INACTIVO, label: getEstadoProspectoTitle(EstadoProspecto.INACTIVO) },
  ];

  if (loading) {
    return (
      <div
        className="d-flex align-center justify-center"
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-24">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card className="text-center p-40">
              <Title level={2} className="title-text">
                <Text type="danger" style={{ fontSize: '16px' }}>
                  Error: {error}
                </Text>
              </Title>
              <br />
              <Button
                type="primary"
                onClick={() => fetchProspectos()}
                className="mt-16"
              >
                Reintentar
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="Oportunidades-page" >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div className="d-flex align-center justify-between">
            <Title level={2} className="title-text m-0">Oportunidades de Prospectos</Title>
            <Button
              type="primary"
              onClick={() => navigate('/prospectos')}
            >
              Lista de Prospectos
            </Button>
          </div>
        </Col>

        {/* Stats Cards */}
        <Col span={8}>
          <div className="dashboard-stat-card prospecto">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {prospectos.length}
              </div>
              <div className="stat-title">Total Prospectos</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div className="dashboard-stat-card pendientes">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {pendingEvaluations.length}
              </div>
              <div className="stat-title">Pendientes</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div className="dashboard-stat-card evaluados">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {completedEvaluations.length}
              </div>
              <div className="stat-title">Evaluados</div>
            </div>
          </div>
        </Col>

        {/* All Evaluations */}
        <Col span={24}>
          <div className="modern-card">
            <div className="card-header">
              <h3 className="card-title">Oportunidades</h3>
              <Select
                value={filterEstado}
                onChange={setFilterEstado}
                options={filterOptions}
                style={{ minWidth: '200px' }}
                placeholder="Filtrar por estado"
                suffixIcon={<Filter size={16} />}
                variant="borderless"
                className="filter-select"
              />
            </div>
            <div className="modern-card-content">
              <Table
                dataSource={filteredProspectos}
                columns={columns}
                rowKey="uid"
                pagination={{ pageSize: 10 }}
                size="small"
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Evaluation Modal */}
      {selectedProspecto && (
        <EvaluacionModal
          prospecto={selectedProspecto}
          visible={evaluacionModalVisible}
          onClose={() => setEvaluacionModalVisible(false)}
          onComplete={handleEvaluacionComplete}
        />
      )}
    </div>
  );
};

export default Oportunidades;
