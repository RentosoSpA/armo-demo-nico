import { Card } from 'antd';
import PropiedadesTable from './PropiedadesTable';
import PropiedadesCardView from './PropiedadesCardView';
import type { Propiedad } from '../../types/propiedad';
import type { ViewMode } from './PropiedadesHeader';
import '../../styles/components/_propiedades.scss';

interface Props {
  data: Propiedad[];
  loading: boolean;
  viewMode: ViewMode;
  onPropiedadClick?: (propiedadId: string) => void;
  onEditClick?: (propiedad: Propiedad) => void;
  onEstadoChange?: (propiedadId: string, newEstado: string) => void;
}

const PropiedadesCard = ({ data, loading, viewMode, onPropiedadClick, onEditClick, onEstadoChange }: Props) => {
  if (viewMode === 'cards') {
    return (
      <PropiedadesCardView
        data={data}
        loading={loading}
        onPropiedadClick={onPropiedadClick}
        onEditClick={onEditClick}
        onEstadoChange={onEstadoChange}
      />
    );
  }

  return (
    <Card className="modern-card table-card">
      <div className="modern-card-content">
        <div className="card-header">
          <h2 className="card-title">Todas las propiedades</h2>
        </div>
        <div className="modern-card-content propiedades-table-container">
          <PropiedadesTable
            data={data}
            loading={loading}
            onPropiedadClick={onPropiedadClick}
            onEditClick={onEditClick}
          />
        </div>
      </div>
    </Card>
  );
};

export default PropiedadesCard;
