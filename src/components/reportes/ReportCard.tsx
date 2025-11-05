import React from 'react';
import { Card, Row, Col, Button, Typography, Space, message } from 'antd';
import { Download, Calendar, ArrowRight } from 'lucide-react';

const { Text } = Typography;

export interface ReportCardProps {
  id?: string;
  title: string;
  description: string;
  date: string;
  type: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ id, title, description, date, icon, onClick }) => {
  const handleDownload = () => {
    message.success('Reporte descargado exitosamente');
  };

  return (
    <Card
      id={id}
      hoverable
      className="w-full"
      styles={{
        body: {
          paddingTop: 24,
          paddingBottom: 24,
          paddingLeft: 16,
          paddingRight: 16,
        },
      }}
    >
      <Space direction="vertical" size={10} className="w-full">
        <Row justify="space-between" align="middle" className="w-full">
          <Col
            span={12}
            className="d-flex align-center"
          >
            <div
              className="d-flex align-center justify-center"
            >
              {icon}
            </div>
          </Col>
          <Col span={12} className="d-flex justify-end">
            <Button icon={<Download size={12} color="#6290F1" />} onClick={handleDownload} />
          </Col>
        </Row>
        <Row
          justify="space-between"
          align="middle"
          className="w-full mt-16 mb-16"
        >
          <Col
            span={24}
            className="d-flex align-center justify-center flex-column"
          >
            <Text className="font-semibold">{title}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>{description}</Text>
          </Col>
        </Row>
        <Row justify="space-between" align="middle" className="w-full">
          <Col span={16}>
            <Text
              className="d-flex align-center"
            >
              <Calendar size={16} /> Actualizado: {date}
            </Text>
          </Col>
          <Col span={8} className="d-flex justify-end">
            <Button onClick={onClick}>
              Ver <ArrowRight size={12} />
            </Button>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default ReportCard;
