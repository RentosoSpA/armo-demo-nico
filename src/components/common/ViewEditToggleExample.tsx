import React, { useState } from 'react';
import ViewToggle, { viewEditOptions } from './ViewToggle';
import './ViewEditToggleExample.scss';

type ViewEditMode = 'view' | 'edit';

const ViewEditToggleExample: React.FC = () => {
  const [mode, setMode] = useState<ViewEditMode>('view');

  return (
    <div className="view-edit-toggle-example">
      <h3 className="example-title">Ver/Editar Toggle Example</h3>
      <ViewToggle
        value={mode}
        onChange={(value) => setMode(value as ViewEditMode)}
        options={viewEditOptions}
      />
      <div className="example-mode-display">
        Current mode: {mode === 'view' ? 'Ver' : 'Editar'}
      </div>
    </div>
  );
};

export default ViewEditToggleExample;