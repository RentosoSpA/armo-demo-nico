import { Card, Alert } from 'antd';
import { useState, useEffect } from 'react';
import ReportesTable from './ReportesTable';
import SearchInput from '../common/SearchInput';
import CustomSelect from '../common/CustomSelect';
import type { GCP_FILES } from '../../types/document';
import type { Propiedad } from '../../types/propiedad';
import { getPropiedades } from '../../services/mock/propiedadesServiceMock';

interface Props {
  data: GCP_FILES | null;
  loading: boolean;
  onPropertyFilterChange?: (propiedadId: string | undefined) => void;
}

const ReportesCard = ({ data, loading, onPropertyFilterChange }: Props) => {
  const [searchText, setSearchText] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<string | undefined>();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loadingPropiedades, setLoadingPropiedades] = useState(false);

  useEffect(() => {
    fetchPropiedades();
  }, []);

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
    const stringValue = typeof value === 'number' ? value.toString() : value;
    setSelectedProperty(stringValue);
    onPropertyFilterChange?.(stringValue);
  };

  // Filter the GCP_FILES data based on search text and exclude directories (files ending with '/')
  const filteredData: GCP_FILES | null =
    data && data.files && data.files.length > 0
      ? {
          files: data.files.filter(
            file =>
              file && file.name && !file.name.endsWith('/') && file.name.toLowerCase().includes(searchText.toLowerCase())
          ),
          signedUrls: data.signedUrls || {},
        }
      : null;

  return (
    <Card id="reportes-card" className="modern-card table-card">
      <div className="modern-card-content">
        <div className="card-header">
          <h2 className="card-title">Todos los reportes</h2>
          <div className="card-filters">
            <CustomSelect
              placeholder="Filtrar por propiedad"
              style={{ width: 250 }}
              allowClear
              loading={loadingPropiedades}
              value={selectedProperty}
              onChange={handlePropertyChange}
              showSearch
              options={propiedades?.map(propiedad => ({
                key: propiedad.id,
                value: propiedad.id,
                label: `${propiedad.titulo} - ${propiedad.direccion}`
              })) || []}
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
            description="Por favor, seleccione una propiedad del filtro superior para ver sus reportes."
            type="info"
            showIcon
            style={{ margin: '16px 0' }}
          />
        ) : (
          <div className="modern-card-content">
            <ReportesTable data={filteredData} loading={loading} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReportesCard;
