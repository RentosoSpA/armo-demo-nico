import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import '../../styles/components/CustomReports.scss';

const { Text } = Typography;

const CustomReports: React.FC = () => {
  return (
    <Card id="reportes-custom-reports" className="custom-reports">
      <Space direction="vertical" align="center" size={16} className="full-width">
        <Text className="title-text">Reportes personalizados</Text>
        <Text className="description-text">
          Crea reportes a medida seleccionando las métricas y dimensiones que necesitas analizar.
        </Text>
        <Button type="primary" className="create-button">
          Crear reporte personalizado
        </Button>
      </Space>
    </Card>
  );
};

export default CustomReports;
