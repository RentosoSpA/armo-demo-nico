import { Row, Typography, Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ReportesHeader = () => (
  <Row justify="space-between" align="middle" className="mb-24">
    <div>
      <Title level={2} className="title-text d-flex align-center mb-0 gap-8">
        Reportes
      </Title>
      <div className="paragraph-text paragraph-secondary mb-0">
        Gestión de reportes y análisis
      </div>
    </div>

    <div className="d-flex align-center gap-8">
      <Tooltip title="Función de generación de reportes próximamente disponible">
        <Button icon={<PlusOutlined />} type="primary" style={{ height: 40 }} disabled>
          Generar Reporte
        </Button>
      </Tooltip>
    </div>
  </Row>
);

export default ReportesHeader;
