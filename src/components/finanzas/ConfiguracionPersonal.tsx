import React, { useState } from 'react';
import { Input, Switch, Button, message } from 'antd';
import { Save } from 'lucide-react';
import type { ConfiguracionFinanzas } from '../../types/finanzas';

interface ConfiguracionPersonalProps {
  configuracion: ConfiguracionFinanzas;
  onGuardarConfiguracion: (config: ConfiguracionFinanzas) => void;
}

const ConfiguracionPersonal: React.FC<ConfiguracionPersonalProps> = ({
  configuracion,
  onGuardarConfiguracion,
}) => {
  console.log('🐻 ConfiguracionPersonal: Componente montado con config =', configuracion);

  const [config, setConfig] = useState({
    ...configuracion,
    porcentajeComision: configuracion.porcentajeComision ?? 50
  });

  const handleGuardar = () => {
    onGuardarConfiguracion(config);
  };

  return (
    <div className="configuracion-personal-compact">
      <div className="config-mini-header">
        <span className="config-mini-icon">🐻</span>
        <span className="config-mini-title">Comentale a Oso curioso cómo te gustaría que mejorara tu experiencia.</span>
        
      </div>
      
     
    </div>
  );
};

export default ConfiguracionPersonal;
