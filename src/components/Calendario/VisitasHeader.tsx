import React, { useState, useEffect } from 'react';
import { Row, Typography, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CuriosoStatusBadge from './CuriosoStatusBadge';
import { getCuriosoStatus } from '../../services/mock/curiosoActivityService';
import type { CuriosoStatus } from './CuriosoStatusBadge';

const { Title, Text } = Typography;

interface Props {
  onAddVisita: () => void;
}

const VisitasHeader = ({ onAddVisita }: Props) => {
  const [curiosoStatus, setCuriosoStatus] = useState<CuriosoStatus>('activo');

  useEffect(() => {
    const loadStatus = async () => {
      const status = await getCuriosoStatus();
      setCuriosoStatus(status);
    };
    loadStatus();
  }, []);

  return (
    <Row justify="space-between" align="middle" className="mb-24">
      <div>
        <Space align="center" size="middle">
          <Title level={2} className="title-text mb-0">
            Visitas
          </Title>
          <CuriosoStatusBadge status={curiosoStatus} />
        </Space>
        <div className="paragraph-text paragraph-secondary mb-8">
          Gestiona las visitas agendadas. CuriOso está trabajando para ti.
        </div>
      </div>
      <div className="d-flex align-center gap-12">
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddVisita}>
          Agregar Visita
        </Button>
      </div>
    </Row>
  );
};

export default VisitasHeader;