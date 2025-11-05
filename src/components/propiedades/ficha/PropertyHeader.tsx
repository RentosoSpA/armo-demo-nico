import React, { useState } from 'react';
import { Card, Typography, Row, Col, Tag, Button, Space, message } from 'antd';
import { EditOutlined, ShareAltOutlined } from '@ant-design/icons';
import type { Propiedad } from '../../../types/propiedad';
import EditPropiedadModal from '../EditPropiedadModal';
import '../../../styles/components/_propiedades.scss';

const { Title, Text } = Typography;

interface PropertyHeaderProps {
  propiedad: Propiedad;
  onPropertyUpdated?: () => void;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ propiedad, onPropertyUpdated }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
 

  const handleShare = async () => {
    const publicUrl = `${window.location.origin}/p/propiedad/${propiedad.id}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      message.success('Enlace copiado al portapapeles');
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = publicUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      message.success('Enlace copiado al portapapeles');
    }
  };

  return (
    <>
      <Card className="modern-card property-ficha-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={1} className="property-ficha-title">
              {propiedad.titulo}
            </Title>
            <Text type="secondary" className="property-ficha-address">
              {propiedad.direccion}
            </Text>
          </Col>
          
        </Row>
      </Card>

      <EditPropiedadModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false);
          onPropertyUpdated?.();
        }}
        propiedad={propiedad}
      />
    </>
  );
};

export default PropertyHeader;
