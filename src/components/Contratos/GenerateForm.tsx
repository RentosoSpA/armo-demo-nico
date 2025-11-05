import { useState } from 'react';
import { Select, Button, App } from 'antd';
import { FileText } from 'lucide-react';
import type { Propiedad, Prospecto, Plantilla } from '../../lib/contratos-mock';

interface GenerateFormProps {
  plantilla: Plantilla;
  propiedades: Propiedad[];
  prospectos: Prospecto[];
  selectedPropiedadId: string | null;
  onGenerate: (propiedadId: string, prospectoId: string) => void;
  onCancel: () => void;
  loading?: boolean;
}

const GenerateForm: React.FC<GenerateFormProps> = ({
  plantilla,
  propiedades,
  prospectos,
  selectedPropiedadId,
  onGenerate,
  onCancel,
  loading = false
}) => {
  const { message } = App.useApp();
  const [propiedadId, setPropiedadId] = useState<string | null>(selectedPropiedadId);
  const [prospectoId, setProspectoId] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!propiedadId) {
      message.warning('Selecciona una propiedad');
      return;
    }
    if (!prospectoId) {
      message.warning('Selecciona un prospecto');
      return;
    }
    onGenerate(propiedadId, prospectoId);
  };

  return (
    <div className="generate-form">
      <div className="generate-form-header">
        <p className="plantilla-name">Plantilla: {plantilla.titulo}</p>
      </div>

      <div className="generate-form-fields">
        <div className="form-field">
          <label>Propiedad</label>
          <Select
            value={propiedadId}
            onChange={setPropiedadId}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            placeholder="Selecciona una propiedad"
            className="w-full"
            options={propiedades.map(p => ({
              value: p.id,
              label: `${p.titulo} · ${p.ciudad}`
            }))}
          />
        </div>

        <div className="form-field">
          <label>Prospecto</label>
          <Select
            value={prospectoId}
            onChange={setProspectoId}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            placeholder="Selecciona un prospecto"
            className="w-full"
            options={prospectos.map(p => ({
              value: p.id,
              label: `${p.nombre} · ${p.email || p.telefono}`
            }))}
          />
        </div>
      </div>

      <div className="generate-form-actions">
        <Button onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="primary"
          icon={<FileText size={16} />}
          onClick={handleGenerate}
          loading={loading}
          disabled={!propiedadId || !prospectoId}
        >
          Generar borrador
        </Button>
      </div>
    </div>
  );
};

export default GenerateForm;
