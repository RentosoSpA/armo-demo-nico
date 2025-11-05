import React from 'react';
import FlipCard from '../../common/FlipCard';
import type { Widget } from '../../../types/dashboard-layout';

interface FlipCardWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: Widget;
  config?: any;
}

const FlipCardPropertiesWidget: React.FC<FlipCardWidgetProps> = ({ data }) => {
  const propiedadesData = data?.propiedades || {};
  const totalPropiedades = propiedadesData.total || 156;
  const valorTotal = propiedadesData.valorTotal || 28500000000;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    });
  };

  return (
    <FlipCard
      titleFront="Total Propiedades"
      valueFront={totalPropiedades.toString()}
      iconFront={<span style={{ fontSize: '2rem' }}>🏠</span>}
      gradientFrontClass="-grad-pink"
      titleBack="Valor Total Propiedades"
      valueBack={formatCurrency(valorTotal)}
      iconBack={<span style={{ fontSize: '2rem' }}>📊</span>}
      gradientBackClass="-grad-pink-dark"
      frontEdgeColor="rgba(236, 72, 153, 0.3)"
      backEdgeColor="rgba(236, 72, 153, 0.5)"
    />
  );
};

export default FlipCardPropertiesWidget;
