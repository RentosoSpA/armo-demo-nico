import { Card, Alert } from 'antd';
import { useState, useEffect } from 'react';
import ContratosTable from './ContratosTable';
import SearchInput from '../common/SearchInput';
import CustomSelect from '../common/CustomSelect';
import type { GCP_FILES } from '../../types/document';
import type { Propiedad } from '../../types/propiedad';
import { getPropiedades } from '../../services/mock/propiedadesServiceMock';

interface Props {
  data: GCP_FILES | null;
  loading: boolean;
  onPropertyFilterChange?: (propiedadId: string | undefined) => void;
  selectedPropertyId?: string | undefined;
}

const ContratosCard = ({ data, loading, onPropertyFilterChange, selectedPropertyId }: Props) => {
  const [searchText, setSearchText] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<string | undefined>();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loadingPropiedades, setLoadingPropiedades] = useState(false);

  useEffect(() => {
    fetchPropiedades();
  }, []);

  useEffect(() => {
    if (selectedPropertyId) {
      setSelectedProperty(selectedPropertyId);
      onPropertyFilterChange?.(selectedPropertyId);
    }
  }, [selectedPropertyId, onPropertyFilterChange]);

  const fetchPropiedades = async () => {
    try {
      setLoadingPropiedades(true);
      const propiedadesData = await getPropiedades();
      setPropiedades(propiedadesData);
    } catch (error) {
      console.error('Error loading propiedades:', error);
    } finally {
      setLoadingPropiedades(false);
    }
  };

  const handlePropertyChange = (value: string | number | undefined) => {
    setSelectedProperty(value?.toString());
    onPropertyFilterChange?.(value?.toString());
  };

  // Filter the GCP_FILES data based on search text
  const filteredData: GCP_FILES | null =
    data && data.files && data.files.length > 0
      ? {
          files: data.files.filter(file =>
            file.name?.toLowerCase()?.includes(searchText.toLowerCase()) || false
          ),
          signedUrls: data.signedUrls,
        }
      : data;

  return (
    <Card
      id="contratos-card"
      className="modern-card table-card"
      styles={{ body: { padding: 0 } }}
    >
      <div className="modern-card-content">
        <div className="card-header">
          <h2 className="card-title">Todos los contratos</h2>
          <div className="card-filters">
            <CustomSelect
              placeholder="Filtrar por propiedad"
              style={{ width: 250 }}
              allowClear
              loading={loadingPropiedades}
              value={selectedProperty}
              onChange={handlePropertyChange}
              showSearch
              options={propiedades.map(propiedad => ({
                key: propiedad.id,
                value: propiedad.id,
                label: `${propiedad.titulo} - ${propiedad.direccion}`
              }))}
            />
            <SearchInput
              placeholder="Buscar por documento..."
              onChange={setSearchText}
              style={{ width: 250 }}
            />
          </div>
        </div>

        {!selectedProperty ? (
          <Alert
            message="Seleccione una propiedad"
            description="Por favor, seleccione una propiedad del filtro superior para ver sus contratos y documentos."
            type="info"
            showIcon
            style={{ margin: '16px 0' }}
          />
        ) : (
          <div className="modern-card-content">
            <ContratosTable data={filteredData} loading={loading} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContratosCard;
