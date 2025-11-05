import { Row, Col } from 'antd';
import type { CobroStats } from '../../types/cobro';
import BearStatCard from '../common/BearStatCard';

interface CobrosStatsProps {
  stats: CobroStats;
  loading?: boolean;
}

const CobrosStats: React.FC<CobrosStatsProps> = ({ stats, loading }) => {
  return (
    <Row gutter={[24, 24]} className="mt-24">
      <Col xs={24} md={12} xl={8}>
        <BearStatCard
          bear="cuidadoso"
          caption="Oso Cuidadoso ha identificado"
          value={stats.pendientesCobrar}
          label="PENDIENTES POR COBRAR"
          loading={loading}
        />
      </Col>
      <Col xs={24} md={12} xl={8}>
        <BearStatCard
          bear="cuidadoso"
          caption="Oso Cuidadoso ha detectado"
          value={stats.atrasados}
          label="ATRASADOS"
          loading={loading}
        />
      </Col>
      <Col xs={24} md={12} xl={8}>
        <BearStatCard
          bear="cuidadoso"
          caption="Oso Cuidadoso ha gestionado"
          value={stats.cobradosExito}
          label="COBRADOS CON ÉXITO"
          loading={loading}
        />
      </Col>
    </Row>
  );
};

export default CobrosStats;