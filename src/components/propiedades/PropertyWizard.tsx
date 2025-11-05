import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import type { FormInstance } from 'antd';
import { ChevronLeft } from 'lucide-react';
import { TipoPropiedad, TipoOperacion, EstadoPropiedad } from '../../types/propiedad';
import { useMobile } from '../../hooks/useMobile';
import PropertyTypeSelector from './PropertyTypeSelector';
import OperationSelector from './OperationSelector';
import '../../styles/components/_property-wizard.scss';

interface PropertyWizardProps {
  form: FormInstance;
  onComplete: () => void;
}

const PropertyWizard: React.FC<PropertyWizardProps> = ({ form, onComplete }) => {
  const [subStep, setSubStep] = useState<'tipo' | 'operacion'>('tipo');
  const [tipoPropiedad, setTipoPropiedad] = useState<TipoPropiedad | null>(null);
  const [selectedOperations, setSelectedOperations] = useState<TipoOperacion[]>([]);
  const [estado, setEstado] = useState<EstadoPropiedad>(EstadoPropiedad.Disponible);
  const [comision, setComision] = useState<number>(50);
  const isMobile = useMobile();

  // Load initial values from form
  useEffect(() => {
    const tipo = form.getFieldValue('tipo');
    const ops = form.getFieldValue('operacion') || [];
    const est = form.getFieldValue('estado') || EstadoPropiedad.Disponible;
    const com = form.getFieldValue('comision') || 50;

    if (tipo) {
      setTipoPropiedad(tipo);
      if (ops.length > 0) {
        setSubStep('operacion');
      }
    }
    if (ops.length > 0) setSelectedOperations(ops);
    setEstado(est);
    setComision(com);
  }, [form]);

  const handleTipoChange = (tipo: TipoPropiedad) => {
    setTipoPropiedad(tipo);
    form.setFieldValue('tipo', tipo);
    
    // Auto-advance after 600ms for smooth animation
    setTimeout(() => {
      setSubStep('operacion');
    }, 600);
  };

  const handleOperationChange = (field: string, value: any) => {
    if (field === 'operations') {
      setSelectedOperations(value);
      form.setFieldValue('operacion', value);
    } else if (field === 'estado') {
      setEstado(value);
      form.setFieldValue('estado', value);
    } else if (field === 'comision') {
      setComision(value);
      form.setFieldValue('comision', value);
    }
  };

  const canContinue = () => {
    if (subStep === 'tipo') return tipoPropiedad !== null;
    return selectedOperations.length > 0;
  };

  const handleContinue = () => {
    if (subStep === 'tipo') {
      if (!tipoPropiedad) return;
      
      // ✅ Forzar actualización del formulario
      form.setFieldsValue({
        tipo: tipoPropiedad
      });
      
      setSubStep('operacion');
    } else {
      if (selectedOperations.length === 0) return;
      
      // ✅ Forzar actualización del formulario antes de completar
      form.setFieldsValue({
        operacion: selectedOperations,
        estado: estado,
        comision: comision
      });
      
      // ✅ setTimeout para dar tiempo al form a actualizarse
      setTimeout(() => {
        onComplete();
      }, 100);
    }
  };

  return (
    <div className="property-wizard">
      {/* Wizard Slides */}
      <div className="property-wizard__slides">
        <div className={`property-wizard__slide ${
          subStep === 'tipo'
            ? 'property-wizard__slide--tipo-active'
            : 'property-wizard__slide--tipo-exit'
        }`}>
          <PropertyTypeSelector
            value={tipoPropiedad}
            onChange={handleTipoChange}
            isMobile={isMobile}
          />
        </div>

        <div className={`property-wizard__slide ${
          subStep === 'operacion'
            ? 'property-wizard__slide--operacion-active'
            : 'property-wizard__slide--operacion-enter'
        }`}>
          {tipoPropiedad && (
            <OperationSelector
              operations={selectedOperations}
              estado={estado}
              comision={comision}
              onChange={handleOperationChange}
              tipoPropiedad={tipoPropiedad}
            />
          )}
        </div>
      </div>

      {/* Navigation - Only show for operation step */}
      {subStep === 'operacion' && (
        <div className="property-wizard__navigation">
          <Button
            size="large"
            icon={<ChevronLeft size={20} />}
            onClick={() => setSubStep('tipo')}
          >
            Atrás
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={handleContinue}
            disabled={!canContinue()}
          >
            Siguiente Paso
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertyWizard;
