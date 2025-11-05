import { Row, Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Props {
  onNuevoContrato: () => void;
}

const ContratosHeader = ({ onNuevoContrato }: Props) => (
  <Row justify="space-between" align="middle" className="mb-24">
    <div>
      <Title level={2} className="title-text d-flex align-center mb-0 gap-8">
        Contratos {/* {<WalkthroughButton walkthrough={getContratosWalkthrough} />} */}
      </Title>
      <div className="paragraph-text paragraph-secondary mb-0">
        Gestión de contratos digitales
      </div>
    </div>

    <div className="d-flex align-center gap-8">
      <Button
        icon={<PlusOutlined />}
        type="primary"
        style={{ height: 40 }}
        onClick={onNuevoContrato}
      >
        Subir Documento
      </Button>
    </div>
  </Row>
);

export default ContratosHeader;
