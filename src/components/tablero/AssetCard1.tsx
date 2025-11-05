import React from 'react';
import { Card, Typography, Row, Col, Space, Progress } from 'antd';
import { TrendingUp, TrendingDown } from 'lucide-react';
import '../../styles/components/AssetCard1.scss';

const { Text } = Typography;

interface AssetCard1Props {
  title: string;
  description: string;
  value: string;
  percentage: number;
  isPositive: boolean;
  isProgress: boolean;
}

const AssetCard1: React.FC<AssetCard1Props> = ({
  title,
  description,
  value,
  percentage,
  isPositive,
  isProgress,
}) => {
  const positiveColor = '#37803D';
  const positiveBgColor = '#F0FDF4';
  const positiveBorderColor = '#BBF7D0';

  const negativeColor = '#B91C1C';
  const negativeBgColor = '#FEF2F2';
  const negativeBorderColor = '#FF5454';

  return (
    <Card className="asset-card1 card-height">
      <Space direction="vertical" size={16} className="full-width">
        <Row className="center-flex">
          <Text className="title-text">{title}</Text>
        </Row>
        <Row>
          <Col span={12} className="center-flex">
            <Text className="value-text">
              {value}
              {isProgress ? '%' : ''}
            </Text>
          </Col>
          <Col span={12} className="center-flex">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                borderRadius: '9999px',
                border: isPositive
                  ? `1px solid ${positiveBorderColor}`
                  : `1px solid ${negativeBorderColor}`,
                backgroundColor: isPositive ? positiveBgColor : negativeBgColor,
                padding: '2px 10px',
                color: isPositive ? positiveColor : negativeColor,
              }}
            >
              {isPositive ? (
                <TrendingUp size={12} color={positiveColor} />
              ) : (
                <TrendingDown size={12} color={negativeColor} />
              )}
              <span className="percentage-span">{percentage}%</span>
            </div>
          </Col>
        </Row>
        <Row className="center-flex">
          {isProgress ? (
            <Col span={24}>
              <Progress percent={Number(value)} size="small" showInfo={false} />
            </Col>
          ) : (
            <Col>
              <Text className="description-text">
                {description}
              </Text>
            </Col>
          )}
        </Row>
      </Space>
    </Card>
  );
};

export default AssetCard1;
