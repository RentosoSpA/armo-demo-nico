import React from 'react';
import type { Oso } from '../../services/mock/brigada';
import StatusPill from './StatusPill';
import InfoModal from './InfoModal';

interface BearCardProps {
  oso: Oso;
  onClick: () => void;
}

const BearCard: React.FC<BearCardProps> = ({ oso, onClick }) => {
  const getEmoji = (id: string) => {
    switch (id) {
      case 'curioso': return '🐻‍❄️';
      case 'cauteloso': return '🧸';
      case 'notarioso': return '🐻';
      case 'cuidadoso': return '🐨';
      case 'armonioso': return '🐼';
      default: return '🐻';
    }
  };

  return (
    <InfoModal message={`Click para ajustar ${oso.nombre}`} position="top">
      <li className={`bear-card bear-card--${oso.id}`} onClick={onClick}>
        <span className="bear-card__bar" />
        <div className="bear-card__icon">
          <span role="img" aria-label={oso.nombre}>
            {getEmoji(oso.id)}
          </span>
        </div>
        <div className="bear-card__body">
          <div className="bear-card__header">
            <h3 className="bear-card__title">{oso.nombre}</h3>
            <StatusPill status={oso.status} />
          </div>
          <p className="bear-card__desc">{oso.descripcion}</p>
          <div className="bear-card__meta">
            <span>Alcance: {oso.alcance}</span>
            <span>Última actividad: {oso.lastUpdate}</span>
          </div>
        </div>
      </li>
    </InfoModal>
  );
};

export default BearCard;