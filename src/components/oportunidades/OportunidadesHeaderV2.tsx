import React from 'react';
import { Select, Card, Row, Col } from 'antd';
import { EyeOutlined, CheckCircleOutlined, SendOutlined } from '@ant-design/icons';

const { Option } = Select;

interface OportunidadesHeaderV2Props {
  propiedades: any[];
  selectedPropiedadId: string | null;
  onSelectPropiedad: (id: string | null) => void;
  stats: {
    encontrados: number;
    evaluados: number;
    enviados: number;
  };
}

export const OportunidadesHeaderV2: React.FC<OportunidadesHeaderV2Props> = ({
  propiedades,
  selectedPropiedadId,
  onSelectPropiedad,
  stats
}) => {
  return (
    <div className="oportunidades-header-v2">
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="stat-card stat-encontrados">
            <div className="stat-icon">
              <EyeOutlined />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.encontrados}</div>
              <div className="stat-label">🐻 CuriOso ha encontrado</div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card className="stat-card stat-evaluados">
            <div className="stat-icon">
              <CheckCircleOutlined />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.evaluados}</div>
              <div className="stat-label">🐻 CuriOso ha evaluado</div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card className="stat-card stat-enviados">
            <div className="stat-icon">
              <SendOutlined />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.enviados}</div>
              <div className="stat-label">🐻 CuriOso ha enviado</div>
            </div>
          </Card>
        </Col>
      </Row>
      
      <div className="propiedad-selector">
        <label>Seleccionar Propiedad para ver Leads:</label>
        <Select
          size="large"
          placeholder="Selecciona una propiedad para ver sus chats"
          style={{ width: '100%', maxWidth: 600 }}
          value={selectedPropiedadId}
          onChange={onSelectPropiedad}
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {propiedades.map(prop => (
            <Option key={prop.id} value={prop.id}>
              {prop.titulo} - {prop.comuna} (${prop.precio.toLocaleString('es-CL')})
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};
