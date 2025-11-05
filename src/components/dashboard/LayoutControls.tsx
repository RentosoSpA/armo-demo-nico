import React from 'react';
import { Button } from 'antd';
import { Columns, Grid } from 'lucide-react';
import { useDashboardLayoutStore } from '../../store/dashboardLayoutStore';

const LayoutControls: React.FC = () => {
  const { gridColumns, compactMode, setGridColumns, setCompactMode } = useDashboardLayoutStore();

  const columnOptions = [2, 3, 4, 6];

  return (
    <div className="layout-controls">
      <div className="control-section">
        <div className="section-header">
          <Columns size={18} />
          <h3>Columnas del Grid</h3>
        </div>
        <p className="section-description">
          Ajusta el número de columnas en el dashboard
          {gridColumns && (
            <span style={{ 
              display: 'block', 
              fontWeight: 600, 
              marginTop: '0.5rem',
              color: 'hsl(var(--primary))' 
            }}>
              Actualmente: {gridColumns} columnas
            </span>
          )}
        </p>
        <div className="column-buttons">
          {columnOptions.map(cols => (
            <Button
              key={cols}
              type={gridColumns === cols ? 'primary' : 'default'}
              size="small"
              onClick={() => setGridColumns(cols)}
            >
              {cols} columnas
              {gridColumns === cols && (
                <span style={{ marginLeft: '0.5rem' }}>✓</span>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <div className="section-header">
          <Grid size={18} />
          <h3>Modo Compacto</h3>
        </div>
        <p className="section-description">
          Reduce el espaciado entre widgets
        </p>
        <div className="compact-toggle">
          <Button
            type={compactMode ? 'primary' : 'default'}
            size="small"
            onClick={() => setCompactMode(!compactMode)}
          >
            {compactMode ? 'Desactivar' : 'Activar'} modo compacto
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LayoutControls;
