import React, { useState } from 'react';
import { TipoPropiedad } from '../../types/propiedad';
import { Building, Home, Warehouse, MapPin, Store, Briefcase, TreePine, ParkingSquare } from 'lucide-react';

interface PropertyTypeSelectorProps {
  value: TipoPropiedad | null;
  onChange: (tipo: TipoPropiedad) => void;
  isMobile?: boolean;
}

const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const [hoveredType, setHoveredType] = useState<TipoPropiedad | null>(null);

  const getIconForType = (tipo: TipoPropiedad) => {
    const iconProps = { size: 32, strokeWidth: 1.5 };
    switch (tipo) {
      case TipoPropiedad.Casa:
        return <Home {...iconProps} />;
      case TipoPropiedad.Departamento:
        return <Building {...iconProps} />;
      case TipoPropiedad.Oficina:
        return <Briefcase {...iconProps} />;
      case TipoPropiedad.Bodega:
        return <Warehouse {...iconProps} />;
      case TipoPropiedad.LocalComercial:
        return <Store {...iconProps} />;
      case TipoPropiedad.Terreno:
      case TipoPropiedad.Parcela:
        return <MapPin {...iconProps} />;
      case TipoPropiedad.Agricola:
        return <TreePine {...iconProps} />;
      case TipoPropiedad.Estacionamiento:
        return <ParkingSquare {...iconProps} />;
      default:
        return <Building {...iconProps} />;
    }
  };

  const getAvatarIconForType = (tipo: TipoPropiedad) => {
    const iconProps = { size: 48, strokeWidth: 1.5 };
    switch (tipo) {
      case TipoPropiedad.Casa:
        return <Home {...iconProps} />;
      case TipoPropiedad.Departamento:
        return <Building {...iconProps} />;
      case TipoPropiedad.Oficina:
        return <Briefcase {...iconProps} />;
      case TipoPropiedad.Bodega:
        return <Warehouse {...iconProps} />;
      case TipoPropiedad.LocalComercial:
        return <Store {...iconProps} />;
      case TipoPropiedad.Terreno:
      case TipoPropiedad.Parcela:
        return <MapPin {...iconProps} />;
      case TipoPropiedad.Agricola:
        return <TreePine {...iconProps} />;
      case TipoPropiedad.Estacionamiento:
        return <ParkingSquare {...iconProps} />;
      default:
        return <Building {...iconProps} />;
    }
  };

  const bearMessage = value
    ? `Perfecto, una propiedad tipo ${value} 🏠. Sigamos con la operación.`
    : "¿Qué tipo de propiedad quieres añadir?";

  return (
    <div className="property-wizard__view">
      {/* Bear Guide */}
      <div className="property-wizard__bear">
        <div className={`property-wizard__bear-avatar ${hoveredType ? 'property-wizard__bear-avatar--icon' : ''}`}>
          {hoveredType ? getAvatarIconForType(hoveredType) : '🐻'}
        </div>
        <div className="property-wizard__bear-message">
          {bearMessage}
        </div>
      </div>

      {/* Content */}
      <div className="property-wizard__content">


        {/* Property Type Grid */}
        <p className="property-wizard__subtitle">
          Selecciona una categoría para continuar.
        </p>
        <div className="property-wizard__type-grid">
          {Object.values(TipoPropiedad).map(tipo => (
            <div
              key={tipo}
              onClick={() => onChange(tipo)}
              onMouseEnter={() => setHoveredType(tipo)}
              onMouseLeave={() => setHoveredType(null)}
              className={`property-wizard__type-card ${
                value === tipo ? 'property-wizard__type-card--selected' : ''
              }`}
            >
              <div className="property-wizard__type-icon">
                {getIconForType(tipo)}
              </div>
              <span className="property-wizard__type-label">
                {tipo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyTypeSelector;
