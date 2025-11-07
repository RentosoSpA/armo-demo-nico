import React from 'react';
import { Select } from 'antd';
import type { Propiedad } from '../../lib/contratos-mock';
import { usePresetLabels } from '../../hooks/usePresetLabels';

interface ContractsHeaderProps {
  propiedades: Propiedad[];
  selectedPropiedadId: string | null;
  onSelectPropiedad: (id: string) => void;
  loading?: boolean;
}

const ContractsHeader: React.FC<ContractsHeaderProps> = ({
  propiedades,
  selectedPropiedadId,
  onSelectPropiedad,
  loading = false
}) => {
  const { getLabel } = usePresetLabels();
  
  return (
    <div className="contracts-header">
      <div className="contracts-header-content">
        <div className="contracts-header-text">
          <h1>{getLabel('Contratos', 'Membresías')}</h1>
          <p>{getLabel('Gestiona tus contratos y documentos legales', 'Gestiona tus membresías y contratos')}</p>
        </div>
        <div className="contracts-header-selector">
          <label>{getLabel('Propiedad', 'Espacio')}</label>
          <Select
            value={selectedPropiedadId}
            onChange={onSelectPropiedad}
            loading={loading}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            placeholder={getLabel('Selecciona una propiedad', 'Selecciona un espacio')}
            className="property-selector"
            options={propiedades.map(p => ({
              value: p.id,
              label: `${p.titulo} · ${p.ciudad || ''}`
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractsHeader;
