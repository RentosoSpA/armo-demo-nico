import { Row, Col } from 'antd';
import type { Oportunidad } from '../../types/oportunidad';
import BearStatCard from '../common/BearStatCard';

interface Props {
  data: Oportunidad[];
  loading: boolean;
  onFilterProspectos?: (filter: 'nuevos' | 'abiertas' | 'negociacion' | null) => void;
}

const OportunidadesStats = ({ data, loading, onFilterProspectos }: Props) => {
  // Count opportunities in "Negociacion" stage 
  const negociacionCount = data.filter(o => o.etapa === 'Negociacion').length;

  // Count opportunities in "Exploracion" stage
  const exploracionCount = data.filter(o => o.etapa === 'Exploracion').length;

  // Count opportunities with "Evaluacion" or "Visita" stage (etapa)
  const evaluacionVisitaCount = data.filter(o => o.etapa === 'Evaluacion' || o.etapa === 'Visita').length;

  const handleNuevosProspectosClick = () => {
    onFilterProspectos?.('nuevos');
  };

  const handleOportunidadesAbiertasClick = () => {
    onFilterProspectos?.('abiertas');
  };

  const handleNegociacionClick = () => {
    onFilterProspectos?.('negociacion');
  };

  return (
    <Row gutter={[24, 24]} className="mt-24">
      <Col xs={24} md={12} xl={8}>
        <BearStatCard
          bear="curioso"
          caption="Oso Curioso ha encontrado"
          value={exploracionCount}
          label="NUEVOS PROSPECTOS"
          onClick={handleNuevosProspectosClick}
          loading={loading}
        />
      </Col>
      <Col xs={24} md={12} xl={8}>
        <BearStatCard
          bear="cauteloso"
          caption="Oso Cauteloso ha evaluado"
          value={evaluacionVisitaCount}
          label="PROSPECTOS CALIFICADOS"
          onClick={handleOportunidadesAbiertasClick}
          loading={loading}
        />
      </Col>
      <Col xs={24} md={12} xl={8}>
        <BearStatCard
          bear="notarioso"
          caption="Oso Notarioso ha enviado"
          value={negociacionCount}
          label="CONTRATOS EN NEGOCIACIÓN"
          onClick={handleNegociacionClick}
          loading={loading}
        />
      </Col>
    </Row>
  );
};

export default OportunidadesStats;