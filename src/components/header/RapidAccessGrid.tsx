import React from 'react';
import { Row, Col, Card } from 'antd';
import RapidAccessItem from './RapidAccessItem';
import type { RapidAccessItemProps } from './RapidAccessItem';
import './RapidAccessGrid.scss';

interface RapidAccessGridProps {
  items: RapidAccessItemProps[];
}

const RapidAccessGrid: React.FC<RapidAccessGridProps> = ({ items }) => {
  return (
    <Card
      className="rapid-access-grid-card"
      styles={{ body: { padding: 16 } }}
    >
      <Row
        gutter={[12, 12]}
        justify="center"
        align="middle"
        className="rapid-access-grid-row"
      >
        {items.map((item, idx) => (
          <Col key={idx} span={12} className="rapid-access-grid-col">
            <RapidAccessItem
              icon={item.icon}
              title={item.title}
              description={item.description}
              onClick={item.onClick}
            />
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default RapidAccessGrid;
