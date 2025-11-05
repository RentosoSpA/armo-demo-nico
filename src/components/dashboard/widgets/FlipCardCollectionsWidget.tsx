import React from 'react';
import FlipCard from '../../common/FlipCard';
import type { Widget } from '../../../types/dashboard-layout';

interface FlipCardWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: Widget;
  config?: any;
}

const FlipCardCollectionsWidget: React.FC<FlipCardWidgetProps> = () => {
  const mockData = {
    cobranzasPagadas: 42,
    cobranzasATiempo: 38
  };

  return (
    <FlipCard
      titleFront="Cobranzas Pagadas"
      valueFront={mockData.cobranzasPagadas.toString()}
      iconFront={<span style={{ fontSize: '2rem' }}>💵</span>}
      gradientFrontClass="-grad-amber"
      titleBack="Cobranza a Tiempo"
      valueBack={mockData.cobranzasATiempo.toString()}
      iconBack={<span style={{ fontSize: '2rem' }}>⏱️</span>}
      gradientBackClass="-grad-amber-dark"
      frontEdgeColor="rgba(251, 191, 36, 0.3)"
      backEdgeColor="rgba(251, 191, 36, 0.5)"
    />
  );
};

export default FlipCardCollectionsWidget;
