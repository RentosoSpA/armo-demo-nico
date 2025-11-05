import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import './RapidAccessItem.scss';

const { Text } = Typography;

export interface RapidAccessItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const RapidAccessItem: React.FC<RapidAccessItemProps> = ({ icon, title, description, onClick }) => {
  return (
    <Card
      hoverable
      className="rapid-access-item-card"
      styles={{ body: { padding: 12 } }}
      onClick={onClick}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col span={4} className="rapid-access-icon-col">
          {icon}
        </Col>
        <Col span={20} className="rapid-access-content-col">
          <Text className="rapid-access-title">{title}</Text>
          <Text className="rapid-access-description">{description}</Text>
        </Col>
      </Row>
    </Card>
  );
};

export default RapidAccessItem;
