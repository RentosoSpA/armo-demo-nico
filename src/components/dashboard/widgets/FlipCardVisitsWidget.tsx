import React from 'react';
import FlipCard from '../../common/FlipCard';
import type { Widget } from '../../../types/dashboard-layout';

interface FlipCardWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: Widget;
  config?: any;
}

const FlipCardVisitsWidget: React.FC<FlipCardWidgetProps> = ({ data }) => {
  const visitasData = data?.visitas || {};
  const proximas = visitasData.proximasVisitas || 24;
  const nuevosProspectos = visitasData.nuevosProspectos || 12;

  return (
    <FlipCard
      titleFront="Próximas Visitas"
      valueFront={proximas.toString()}
      iconFront={<span style={{ fontSize: '2rem' }}>📅</span>}
      gradientFrontClass="-grad-purple"
      titleBack="Nuevos Prospectos"
      valueBack={nuevosProspectos.toString()}
      iconBack={<span style={{ fontSize: '2rem' }}>👥</span>}
      gradientBackClass="-grad-purple-dark"
      frontEdgeColor="rgba(168, 85, 247, 0.3)"
      backEdgeColor="rgba(168, 85, 247, 0.5)"
    />
  );
};

export default FlipCardVisitsWidget;
