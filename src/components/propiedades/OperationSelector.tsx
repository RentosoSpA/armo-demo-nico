import React, { useState } from 'react';
import { Popover, InputNumber, Button, Space } from 'antd';
import { TipoOperacion, EstadoPropiedad, TipoPropiedad } from '../../types/propiedad';

interface OperationSelectorProps {
  operations: TipoOperacion[];
  estado: EstadoPropiedad;
  comision: number;
  onChange: (field: 'operations' | 'estado' | 'comision', value: any) => void;
  tipoPropiedad: TipoPropiedad;
  isMobile?: boolean;
}

const OperationSelector: React.FC<OperationSelectorProps> = ({
  operations,
  estado,
  comision,
  onChange,
  tipoPropiedad,
}) => {
  const [estadoPopoverOpen, setEstadoPopoverOpen] = useState(false);
  const [comisionPopoverOpen, setComisionPopoverOpen] = useState(false);
  const [tempComision, setTempComision] = useState(comision);

  const availableOperations = [
    TipoOperacion.Venta,
    TipoOperacion.Renta,
    ...(tipoPropiedad === TipoPropiedad.Casa || tipoPropiedad === TipoPropiedad.Departamento
      ? [TipoOperacion.RentaTemporal]
      : [])
  ];

  const toggleOperation = (op: TipoOperacion) => {
    const newOps = operations.includes(op)
      ? operations.filter(o => o !== op)
      : [...operations, op];
    onChange('operations', newOps);
  };

  // Estado Popover Content
  const estadoContent = (
    <Space direction="vertical" style={{ width: 200 }}>
      {Object.values(EstadoPropiedad).map(est => (
        <Button
          key={est}
          type={estado === est ? 'primary' : 'text'}
          block
          onClick={() => {
            onChange('estado', est);
            setEstadoPopoverOpen(false);
          }}
          className="wizard-popover-estado-item"
        >
          {est}
        </Button>
      ))}
    </Space>
  );

  // Comisión Popover Content
  const comisionContent = (
    <Space direction="vertical" style={{ width: 200 }}>
      <InputNumber
        value={tempComision}
        onChange={(val) => setTempComision(val || 0)}
        min={0}
        max={100}
        formatter={value => `${value}%`}
        parser={value => Number(value?.replace('%', '') || '0')}
        style={{ width: '100%' }}
        className="wizard-popover-comision-input"
      />
      <Button
        type="primary"
        block
        onClick={() => {
          onChange('comision', tempComision);
          setComisionPopoverOpen(false);
        }}
      >
        Aplicar
      </Button>
    </Space>
  );

  return (
    <div className="property-wizard__view">
      {/* Bear Guide */}
      <div className="property-wizard__bear">
        <div className="property-wizard__bear-avatar">
          🐻
        </div>
        <div className="property-wizard__bear-message">
          ¿Qué operación quieres registrar para esta propiedad? Puedes ajustar la comisión o el estado si lo necesitas 🐾
        </div>
      </div>

      {/* Content */}
      <div className="property-wizard__content">
      

        {/* Operation Pills */}
        <div className="property-wizard__operation-pills">
          {availableOperations.map(op => (
            <div
              key={op}
              onClick={() => toggleOperation(op)}
              className={`property-wizard__operation-pill ${
                operations.includes(op) ? 'property-wizard__operation-pill--selected' : ''
              }`}
            >
              {op}
            </div>
          ))}
        </div>

        {/* Summary with Inline Editing */}
        <div className="property-wizard__summary">
          La propiedad quedará como{' '}
          <Popover
            content={estadoContent}
            trigger="click"
            open={estadoPopoverOpen}
            onOpenChange={setEstadoPopoverOpen}
            overlayClassName="wizard-popover"
          >
            <span className="property-wizard__editable-text">
              {estado}
            </span>
          </Popover>
          {' '}con una comisión de{' '}
          <Popover
            content={comisionContent}
            trigger="click"
            open={comisionPopoverOpen}
            onOpenChange={(open) => {
              setComisionPopoverOpen(open);
              if (open) setTempComision(comision);
            }}
            overlayClassName="wizard-popover"
          >
            <span className="property-wizard__editable-text">
              {comision}%
            </span>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default OperationSelector;
