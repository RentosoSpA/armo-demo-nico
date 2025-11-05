import { Card, Typography, Button, Tag, Row, Col, Space } from 'antd';
import { HomeOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Visita } from '../../types/visita';
import { EstadoVisita } from '../../types/visita';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useState } from 'react';
import EditVisitaModal from './EditVisitaModal';

const { Title, Text } = Typography;

interface VisitaCardProps {
  visita: Visita;
  onReload: () => void;
}

const VisitaCard = ({ visita, onReload }: VisitaCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const getEstadoColor = (estado: string | EstadoVisita) => {
    switch (estado) {
      case EstadoVisita.Agendada:
      case 'Agendada':
        return { color: '#faad14', bg: '#fff7e6' }; // Orange
      case EstadoVisita.Aprobada:
      case 'Aprobada':
        return { color: '#1890ff', bg: '#e6f7ff' }; // Blue
      case EstadoVisita.Completada:
      case 'Completada':
        return { color: '#52c41a', bg: '#f6ffed' }; // Green
      case EstadoVisita.Cancelada:
      case 'Cancelada':
        return { color: '#ff4d4f', bg: '#fff2f0' }; // Red
      default:
        return { color: '#8c8c8c', bg: '#f5f5f5' }; // Gray
    }
  };

  const getEstadoText = (estado: string | EstadoVisita) => {
    switch (estado) {
      case EstadoVisita.Aprobada:
      case 'Aprobada':
        return 'Aprobada';
      case EstadoVisita.Agendada:
      case 'Agendada':
        return 'Agendada';
      case EstadoVisita.Completada:
      case 'Completada':
        return 'Completada';
      case EstadoVisita.Cancelada:
      case 'Cancelada':
        return 'Cancelada';
      default:
        return estado?.toString() || 'Desconocido';
    }
  };

  const estadoStyle = getEstadoColor(visita.estado);
  const visitaDate = dayjs(visita.fecha_inicio);

  // Remove prospecto fetching since visita only contains property name now

  return (
    <Card
      type="inner"
      style={{
        borderRadius: '8px',
        border: `1px solid ${estadoStyle.color}20`,
        backgroundColor: estadoStyle.bg,
      }}
      bodyStyle={{ padding: '16px' }}
    >
      <Row gutter={[16, 12]} align="middle">
        <Col span={24}>
          <div
            className="d-flex align-start justify-between mb-12"
          >
            <div>
              <Title level={5} className="m-0 mb-4">
                <HomeOutlined className="mr-8" />
                Propiedad
              </Title>
              <div
                className="d-flex align-start flex-column gap-0"
              >
                <Text type="secondary" className="ml-24">
                  {visita.propiedad}
                </Text>
                <Text type="secondary" className="ml-24">
                  Plataforma: {visita.plataforma}
                </Text>
              </div>
            </div>
            <Tag
              color={estadoStyle.color}
              className="font-semibold"
            >
              {getEstadoText(visita.estado)}
            </Tag>
          </div>
        </Col>


        <Col span={24}>
          <div className="d-flex align-center mb-8">
            <CalendarOutlined className="mr-8" />
            <Text strong>{visitaDate.locale('es').format('dddd, DD [de] MMMM [de] YYYY [a las] HH:mm')}</Text>
          </div>
        </Col>

        <Col span={24}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
              paddingTop: 8,
              borderTop: `1px solid ${estadoStyle.color}20`,
            }}
          >
            <Text type="secondary" className="text-11">
              Visita-id: {visita.id}
            </Text>
            <Space size="small">
              <Button size="small" type="text" onClick={() => setModalVisible(true)}>
                Editar
              </Button>
            </Space>
          </div>
        </Col>
      </Row>

      <EditVisitaModal
        visible={modalVisible}
        visita={visita}
        onCancel={() => setModalVisible(false)}
        onReload={onReload}
      />
    </Card>
  );
};

export default VisitaCard;
