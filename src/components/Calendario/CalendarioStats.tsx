import { Row, Col, Typography } from 'antd';
import { Calendar, CheckCircle, Clock, Eye } from 'lucide-react';
import type { Visita } from '../../types/visita';
/* import WalkthroughButton from '../common/WalkthroughButton';
import { getCalendarioWalkthrough } from '../../services/walkthroughs/CalendarioWt'; */
import '../../styles/components/_dashboard-stats.scss';

const { Title } = Typography;

interface Props {
  data: Visita[];
}

const CalendarioStats = ({ data }: Props) => {
  // Filter visits by status
  const visitasAgendada = data.filter(v => v.estado === 'Agendada').length;
  const visitasCompletada = data.filter(v => v.estado === 'Completada').length;
  const visitasAprobada = data.filter(v => v.estado === 'Aprobada').length;
  const totalVisitas = data.length;

  return (
    <div  id="calendario-stats">
      <Title
        level={2}
        className="mb-24"
      >
        Estadísticas de visitas {/* <WalkthroughButton walkthrough={getCalendarioWalkthrough} /> */}
      </Title>
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <div className="dashboard-stat-card prospecto">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {totalVisitas}
              </div>
              <div className="stat-title">Total de visitas</div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="dashboard-stat-card pendientes">
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {visitasAprobada}
              </div>
              <div className="stat-title">Aprobadas</div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="dashboard-stat-card evaluados">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {visitasAgendada}
              </div>
              <div className="stat-title">Visitas agendadas</div>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="dashboard-stat-card prospecto">
            <div className="stat-icon">
              <Eye size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {visitasCompletada}
              </div>
              <div className="stat-title">Completadas</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CalendarioStats;
