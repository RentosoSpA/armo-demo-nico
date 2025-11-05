import React from 'react';
import { Button } from 'antd';
import { Edit, Eye, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PropiedadResumen, Propietario } from '../../types/propietario';

interface PropertyRowProps {
  property: PropiedadResumen;
  owner: Propietario;
}

const PropertyRow: React.FC<PropertyRowProps> = ({ property }) => {
  const navigate = useNavigate();

  const formatCurrency = (value?: number) => {
    if (!value) return 'No especificado';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(value);
  };

  const precio = property.precio_arriendo || property.precio_venta || 0;
  const tipoOperacion = property.precio_arriendo ? 'Arriendo' : 'Venta';

  return (
    <div className="property-row">
      <div className="property-column image-column">
        <div className="property-image">
          {property.imagen_url ? (
            <img src={property.imagen_url} alt={property.titulo} />
          ) : (
            <Home size={24} />
          )}
        </div>
      </div>

      <div className="property-column property-info-column">
        <div className="property-title">{property.titulo}</div>
        <div className="property-address">📍 {property.direccion}</div>
        <div className="property-status">
          {property.tipo} • {property.estado} • {tipoOperacion}: {formatCurrency(precio)}
        </div>
      </div>

      <div className="property-column actions-column">
        <Button
          type="default"
          icon={<Eye size={16} />}
          onClick={() => navigate(`/propiedades/${property.id}`)}
          size="small"
        >
          Ver
        </Button>
        <Button
          type="primary"
          icon={<Edit size={16} />}
          onClick={() => navigate(`/propiedades/editar/${property.id}`)}
          size="small"
        >
          Editar
        </Button>
      </div>
    </div>
  );
};

export default PropertyRow;
