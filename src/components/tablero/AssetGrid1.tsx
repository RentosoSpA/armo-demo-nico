import React from 'react';
import { Col, Row, Progress } from 'antd';
import StatCard from '../common/StatCard';
import type { DashboardData } from '../../types/salud-data';
import { currencyFormatter } from '../../utils/formatters';
import '../../styles/components/AssetGrid1.scss';

interface AssetGrid1Props {
  id: string;
  data: DashboardData;
  loading: boolean;
}

const AssetGrid1: React.FC<AssetGrid1Props> = ({ id, data, loading }) => {
  const borderColor = '#22f477';
  return (
    <Row gutter={[16, 16]} id={id} className="asset-row">
      <Col span={6} className="asset-col">
        <StatCard
          loading={loading}
          title="Propiedades Activas"
          value={data.totalProperties}
          borderColor={borderColor}
          className="asset-statcard"
        />
      </Col>
      <Col span={6} className="asset-col">
        <StatCard
          loading={loading}
          title="Visitas Programadas"
          value={data.totalVisitas}
          borderColor={borderColor}
          className="asset-statcard"
        />
      </Col>
      <Col span={6} className="asset-col">
        <StatCard
          loading={loading}
          title="Tasa de Ocupación"
          value={data.ocupationRate + '%'}
          borderColor={borderColor}
          footer={
            <Progress
              percent={data.ocupationRate}
              showInfo={false}
              strokeColor={borderColor}
              className="asset-progress"
            />
          }
          className="asset-statcard"
        />
      </Col>
      <Col span={6} className="asset-col">
        <StatCard
          loading={loading}
          title="Ingresos Mensuales"
          value={'$' + currencyFormatter(data.totalIngresos)}
          borderColor={borderColor}
          className="asset-statcard"
        />
      </Col>
    </Row>
  );
};

export default AssetGrid1;
