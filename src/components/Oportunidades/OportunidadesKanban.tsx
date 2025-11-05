import React, { useState } from 'react';
import { Row, Col, Card, Avatar, Typography, Button, Tooltip } from 'antd';
import { User, Calendar, Home, Handshake, CheckCircle, Eye } from 'lucide-react';
import type { Oportunidad } from '../../types/oportunidad';
import { prospectoToContacto } from '../../utils/oportunidadHelpers';

const { Text, Title } = Typography;

interface Props {
  oportunidades: Oportunidad[];
  onOportunidadClick?: (oportunidad: Oportunidad) => void;
  onEstadoChange?: (oportunidadId: string, newEstado: string) => void;
}

const OportunidadesKanban: React.FC<Props> = ({ oportunidades, onOportunidadClick, onEstadoChange }) => {
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  const etapas = [
    { 
      key: 'Exploracion', 
      title: 'Captación', 
      icon: <User size={20} />, 
      color: '#3B82F6' 
    },
    { 
      key: 'Evaluacion', 
      title: 'Evaluación', 
      icon: <Calendar size={20} />, 
      color: '#F59E0B' 
    },
    { 
      key: 'Visita', 
      title: 'Visita', 
      icon: <Home size={20} />, 
      color: '#8B5CF6' 
    },
    { 
      key: 'Negociacion', 
      title: 'Negociación', 
      icon: <Handshake size={20} />, 
      color: '#06B6D4' 
    },
    { 
      key: 'Cierre', 
      title: 'Cierre', 
      icon: <CheckCircle size={20} />, 
      color: '#10B981' 
    }
  ];

  const getOportunidadesByEtapa = (etapa: string) => {
    return oportunidades.filter(oportunidad => oportunidad.etapa === etapa);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
  };

  const formatPrice = (precio: number, divisa: string) => {
    return new Intl.NumberFormat('es-CL').format(precio) + ' ' + divisa;
  };

  const handleDragStart = (e: React.DragEvent, oportunidad: Oportunidad) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(oportunidad));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, etapaKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(etapaKey);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, newEstado: string) => {
    e.preventDefault();
    setDraggedOver(null);
    
    try {
      const oportunidadData = JSON.parse(e.dataTransfer.getData('text/plain'));
      console.log('Dropped opportunity:', oportunidadData.id, 'to estado:', newEstado);
      
      if (oportunidadData.etapa !== newEstado) {
        console.log('Estado change:', oportunidadData.id, 'from', oportunidadData.etapa, 'to', newEstado);
        onEstadoChange?.(oportunidadData.id, newEstado);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const OportunidadCard = ({ oportunidad }: { oportunidad: Oportunidad }) => {
    const contacto = prospectoToContacto(oportunidad.prospecto);
    const propiedad = oportunidad.propiedad;
    
    return (
      <Card
        size="small"
        draggable
        onDragStart={(e) => handleDragStart(e, oportunidad)}
        className="mb-12 animate-scale-in hover-scale"
        hoverable
      >
        <div className="d-flex align-center mb-8">
          <Avatar
            className="mr-8"
            size={32}
          >
            {getInitials(contacto.nombre)}
          </Avatar>
          <div className="flex-1">
            <Text strong style={{ color: '#ffffff', fontSize: '13px' }}>
              {contacto.nombre}
            </Text>
          </div>
        </div>
        
        <div className="mb-8">
          <Text style={{ color: '#9CA3AF', fontSize: '12px' }}>
            {contacto.email}
          </Text>
        </div>
        
        <div className="mb-8">
          <Text style={{ color: '#9CA3AF', fontSize: '12px' }}>
            📞 {contacto.telefono}
          </Text>
        </div>
        
        {propiedad && (
          <div className="mt-8 pt-8">
            <Text className="font-medium">
              {propiedad.titulo}
            </Text>
            <div className="d-flex align-center justify-between mt-4">
              <Text className="font-semibold">
                {formatPrice(propiedad.precio_arriendo || propiedad.precio_venta || 0, propiedad.divisa || 'CLP')}
              </Text>
              <Tooltip title="Ver prospecto">
                <Button
                  type="default"
                  size="small"
                  icon={<Eye size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOportunidadClick?.(oportunidad);
                  }}
                  className="d-flex align-center"
                >
                  Ver
                </Button>
              </Tooltip>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <Row gutter={[8, 16]} className="w-full">
      {etapas.map(etapa => {
        const oportunidadesEtapa = getOportunidadesByEtapa(etapa.key);
        const isOver = draggedOver === etapa.key;
        
        return (
          <Col key={etapa.key} xs={24} sm={24} md={24} lg={24/5} xl={24/5} xxl={24/5} style={{ minWidth: 0, flex: '1 1 20%' }}>
            <div 
              style={{
                background: isOver ? '#2A3441' : '#1B2A3A',
                border: `2px solid ${isOver ? etapa.color : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '12px',
                padding: '16px',
                minHeight: '500px',
                transition: 'all 0.3s ease'
              }}
              onDragOver={(e) => handleDragOver(e, etapa.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, etapa.key)}
            >
              {/* Column Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: `2px solid ${etapa.color}`,
                width: '100%'
              }}>
                <div className="mr-8">
                  {etapa.icon}
                </div>
                <Title 
                  level={5} 
                  className="font-semibold m-0"
                >
                  {etapa.title}
                </Title>
                <div className="d-flex align-center justify-center font-semibold">
                  {oportunidadesEtapa.length}
                </div>
              </div>

              {/* Opportunities Cards */}
              <div>
                {oportunidadesEtapa.length > 0 ? (
                  oportunidadesEtapa.map(oportunidad => (
                    <OportunidadCard 
                      key={oportunidad.id} 
                      oportunidad={oportunidad} 
                    />
                  ))
                ) : (
                  <div className="d-flex align-center justify-center text-center p-24">
                    <Text style={{ color: '#6B7280', fontSize: '14px' }}>
                      Sin oportunidades
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default OportunidadesKanban;