import React from 'react';
import FlipCard from '../../common/FlipCard';
import type { Widget } from '../../../types/dashboard-layout';

interface FlipCardWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: Widget;
  config?: any;
}

const FlipCardBillingWidget: React.FC<FlipCardWidgetProps> = () => {
  const mockData = {
    total: 325000000,
    commissionsTotal: 48750000
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    });
  };

  return (
    <FlipCard
      titleFront="Facturación Total"
      valueFront={formatCurrency(mockData.total)}
      iconFront={<span style={{ fontSize: '2rem' }}>💰</span>}
      gradientFrontClass="-grad-green"
      titleBack="Comisiones Totales"
      valueBack={formatCurrency(mockData.commissionsTotal)}
      iconBack={<span style={{ fontSize: '2rem' }}>💵</span>}
      gradientBackClass="-grad-green-dark"
      frontEdgeColor="rgba(52, 245, 197, 0.3)"
      backEdgeColor="rgba(52, 245, 197, 0.5)"
    />
  );
};

export default FlipCardBillingWidget;
