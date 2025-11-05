import React from 'react';
import { Select } from 'antd';
import type { Propiedad } from '../../lib/contratos-mock';

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
  return (
    <div className="contracts-header">
      <div className="contracts-header-content">
        <div className="contracts-header-text">
          <h1>Contratos</h1>
          <p>Gestiona tus contratos y documentos legales</p>
        </div>
        <div className="contracts-header-selector">
          <label>Propiedad</label>
          <Select
            value={selectedPropiedadId}
            onChange={onSelectPropiedad}
            loading={loading}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            placeholder="Selecciona una propiedad"
            className="property-selector"
            options={propiedades.map(p => ({
              value: p.id,
              label: `${p.titulo} · ${p.ciudad}`
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default ContractsHeader;
