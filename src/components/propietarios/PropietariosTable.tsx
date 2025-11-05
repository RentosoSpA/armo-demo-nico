import React, { useState, useMemo, useEffect } from 'react';
import OwnerGroup from './OwnerGroup';
import PropertyRow from './PropertyRow';
import { usePropietarioStore } from '../../store/propietarioStore';
import type { Propietario, PropiedadResumen } from '../../types/propietario';

interface Props {
  data: Propietario[];
  loading: boolean;
  searchTerm?: string;
  onEditClick?: (propietario: Propietario) => void;
}

const PropietariosTable: React.FC<Props> = ({ data = [], loading = false, searchTerm = '', onEditClick }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [propiedadesByOwner, setPropiedadesByOwner] = useState<Record<string, PropiedadResumen[]>>({});
  const [loadingProps, setLoadingProps] = useState<Set<string>>(new Set());
  const { getPropiedadesByPropietario } = usePropietarioStore();

  // Pre-inicializar propietarios con 0 propiedades
  useEffect(() => {
    const initialCounts: Record<string, PropiedadResumen[]> = {};
    data.forEach(owner => {
      if (owner.propiedades_asociadas === 0) {
        initialCounts[owner.id] = [];
      }
    });
    setPropiedadesByOwner(prev => ({ ...prev, ...initialCounts }));
  }, [data]);

  const loadPropiedades = async (propietarioId: string) => {
    if (propiedadesByOwner[propietarioId]) return;
    
    setLoadingProps(prev => new Set(prev).add(propietarioId));
    try {
      const props = await getPropiedadesByPropietario(propietarioId);
      setPropiedadesByOwner(prev => ({ ...prev, [propietarioId]: props }));
    } catch (error) {
      console.error('Error loading properties:', error);
      setPropiedadesByOwner(prev => ({ ...prev, [propietarioId]: [] }));
    } finally {
      setLoadingProps(prev => {
        const next = new Set(prev);
        next.delete(propietarioId);
        return next;
      });
    }
  };

  const toggleGroup = (ownerId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(ownerId)) {
      newExpanded.delete(ownerId);
    } else {
      newExpanded.add(ownerId);
      loadPropiedades(ownerId);
    }
    setExpandedGroups(newExpanded);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    
    return data.filter(owner => {
      // Search in owner data
      const ownerMatch = 
        owner.nombre.toLowerCase().includes(term) ||
        owner.email?.toLowerCase().includes(term) ||
        owner.documento?.toLowerCase().includes(term);
      
      if (ownerMatch) return true;
      
      // Search in loaded properties
      const properties = propiedadesByOwner[owner.id] || [];
      const propertyMatch = properties.some(prop => 
        prop.titulo.toLowerCase().includes(term) ||
        prop.direccion?.toLowerCase().includes(term)
      );
      
      return propertyMatch;
    });
  }, [data, searchTerm, propiedadesByOwner]);

  if (loading) {
    return <div className="propietarios-table-container loading">Cargando...</div>;
  }

  return (
    <div className="propietarios-table-container">
      <div className="table-content">
        <div className="table-columns-header">
          <div className="column-header image-column">Imagen</div>
          <div className="column-header property-column">Propiedad</div>
          <div className="column-header actions-column">Acciones</div>
        </div>
        
        {filteredData.map((owner) => {
          const properties = propiedadesByOwner[owner.id] || [];
          const isExpanded = expandedGroups.has(owner.id);
          const isLoadingProps = loadingProps.has(owner.id);

          return (
            <OwnerGroup
              key={owner.id}
              owner={owner}
              properties={properties}
              isExpanded={isExpanded}
              onToggle={() => toggleGroup(owner.id)}
              onEditOwner={() => onEditClick?.(owner)}
            >
              {isLoadingProps ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF' }}>
                  Cargando propiedades...
                </div>
              ) : properties.length > 0 ? (
                properties.map(prop => (
                  <PropertyRow
                    key={prop.id}
                    property={prop}
                    owner={owner}
                  />
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF' }}>
                  Este propietario no tiene propiedades asociadas
                </div>
              )}
            </OwnerGroup>
          );
        })}
        
        {filteredData.length === 0 && (
          <div className="no-results">
            No se encontraron propietarios que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PropietariosTable);
