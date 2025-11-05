import React, { useState } from 'react';
import { Card } from 'antd';
import PropietariosTable from './PropietariosTable';
import SearchInput from '../common/SearchInput';
import type { Propietario } from '../../types/propietario';

interface Props {
  data: Propietario[];
  loading?: boolean;
  onEditClick?: (p: Propietario) => void;
}

const PropietariosCard = ({ data = [], loading = false, onEditClick }: Props) => {
  const [searchText, setSearchText] = useState('');

  if (loading) return <div>Cargando...</div>;

  return (
    <Card className="modern-card table-card">
      <div className="modern-card-content">
        <div className="card-header">
          <h2 className="card-title">Todos los propietarios</h2>
          <div className="card-filters">
            <SearchInput
              placeholder="Buscar propietarios..."
              value={searchText}
              onChange={setSearchText}
              style={{ width: 300 }}
            />
          </div>
        </div>
        <div className="modern-card-content">
          <PropietariosTable
            data={data}
            loading={loading}
            searchTerm={searchText}
            onEditClick={onEditClick}
          />
        </div>
      </div>
    </Card>
  );
};

export default React.memo(PropietariosCard);