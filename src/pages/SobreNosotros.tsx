import React from 'react';
import { Typography, Card, Skeleton } from 'antd';
import type { Empresa } from '../types/empresa';

const { Title } = Typography;

interface SobreNosotrosProps {
  empresa: Empresa | null;
}

const SobreNosotros: React.FC<SobreNosotrosProps> = ({ empresa }) => {
  if (!empresa) {
    return (
      <Card className="p-24">
        <Skeleton active />
      </Card>
    );
  }

  return (
    <Card className="p-24">
      <Typography>
        <Title>Sobre Nosotros</Title>
        <div className="paragraph-text">
          <strong>{empresa.nombre}</strong>
        </div>
        <div className="paragraph-text">{empresa.sobreNosotros}</div>
        <Title level={2} className="title-text">Nuestra Misión</Title>
        <div className="paragraph-text">{empresa.mision}</div>
        <Title level={2} className="title-text">Visión</Title>
        <div className="paragraph-text">{empresa.vision}</div>
        <div className="paragraph-text">
          En {empresa.nombre}, trabajamos cada día para que la administración de tu propiedad sea
          simple, segura y eficiente.
        </div>
      </Typography>
    </Card>
  );
};

export default SobreNosotros;
