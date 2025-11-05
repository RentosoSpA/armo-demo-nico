import React from 'react';
import { Row, Col, Typography } from 'antd';
import { User, Phone, Mail, FileText } from 'lucide-react';
import type { Oportunidad } from '../../types/oportunidad';
import { prospectoToContacto } from '../../utils/prospecto';

const { Title, Text } = Typography;

interface InformacionProspectoProps {
  oportunidad: Oportunidad;
}

const InformacionProspecto: React.FC<InformacionProspectoProps> = ({ oportunidad }) => {
  const contacto = oportunidad.prospecto ? prospectoToContacto(oportunidad.prospecto) : {
    nombre: 'Sin información',
    telefono: '',
    email: ''
  };

  const contactItems = [
    {
      icon: User,
      title: 'Nombre Completo',
      subtitle: contacto.nombre,
    },
    {
      icon: FileText,
      title: 'Documento ID',
      subtitle: '11234348497',
    },
    {
      icon: Phone,
      title: 'Teléfono Móvil',
      subtitle: contacto.telefono,
    },
    {
      icon: Mail,
      title: 'Email Personal',
      subtitle: contacto.email,
    }
  ];

  return (
    <div className="mt-48" style={{ marginTop: '16px' }}>
      <Row gutter={[48, 32]}>
        {/* Left Side - Title and Description */}
        <Col xs={24} lg={8}>
          <div className="pr-24">
            <Title level={2} className="mb-16" style={{ color: '#ffffff'}}>
              Información del Prospecto
            </Title>
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '16px',
                lineHeight: '1.6'
              }}
            >
              Detalles completos del prospecto para evaluación y seguimiento.
            </Text>
          </div>
        </Col>

        {/* Right Side - Contact Info Grid */}
        <Col xs={24} lg={16}>
          <Row gutter={[24, 24]}>
            {contactItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Col xs={24} sm={12} key={index}>
                  <div
                    className="liquid-glass"
                    style={{
                      padding: '20px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(51, 244, 145, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent size={24} style={{ color: '#33F491' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Title
                        level={5}
                        className="m-0 mb-4"
                        style={{ color: '#ffffff', fontSize: '16px' }}
                      >
                        {item.title}
                      </Title>
                      <Text
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                          wordBreak: 'break-word'
                        }}
                      >
                        {item.subtitle}
                      </Text>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default InformacionProspecto;
