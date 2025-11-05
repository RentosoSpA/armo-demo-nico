import React from 'react';
import { Col, Layout, Row, Typography, Skeleton } from 'antd';
import type { Empresa } from '../../types/empresa';

const { Text } = Typography;
const { Header } = Layout;

interface CustomHeaderProps {
  height: string;
  setSelectedKey: (key: string) => void;
  empresa: Empresa | null;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ setSelectedKey, empresa }) => {
  return (
    <Header
      className="w-full p-0"
    >
      <Row align="middle" className="h-full" wrap={false}>
        <Col
          className="h-full"
        >
          <a
            href={`/portal/${encodeURIComponent(empresa?.nombre || '')}`}
            className="d-flex align-center justify-center h-full"
          >
            {empresa ? (
              <div className="text-center">
                <div className="font-bold">
                  {empresa.nombre}
                </div>
                {/* TODO: Implement dynamic header icon for every empresa - get it from GCP */}
                <div style={{ fontSize: '12px', color: '#666' }}>Portal de Propiedades</div>
              </div>
            ) : (
              <Skeleton.Input active size="small" />
            )}
          </a>
        </Col>

        <Col
          className="align-center pl-24 pr-24"
        >
          <Row align="middle" justify="center" wrap={false}>
            <Col style={{ flex: '1 1 60%' }}>
              <Row justify="center" gutter={16} wrap={false} id="header-shorcuts">
                <Col>
                  <Text
                    onClick={() => setSelectedKey('SobreNosotros')}
                    className="cursor-pointer"
                  >
                    Sobre Nosotros
                  </Text>
                </Col>
                <Col>
                  <Text
                    onClick={() => setSelectedKey('Contactanos')}
                    className="cursor-pointer"
                  >
                    Contactanos
                  </Text>
                </Col>
                <Col>
                  <Text
                    onClick={() => setSelectedKey('Ayuda')}
                    className="cursor-pointer"
                  >
                    Ayuda
                  </Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col
          className="h-full"
        >
          <div
            onClick={() => setSelectedKey('Portal')}
            className="d-flex align-center justify-center h-full cursor-pointer"
          >
            <div className="text-center">
              <div className="font-bold">RentOso</div>
              <div style={{ fontSize: '10px', color: '#666' }}>Powered by</div>
            </div>
          </div>
        </Col>
      </Row>
    </Header>
  );
};

export default CustomHeader;
