import React from 'react';
import type { Oso } from '../../services/mock/brigada';
import { bearProfiles } from '../../services/mock/brigada';

interface BearProfileProps {
  oso: Oso;
}

const BearProfile: React.FC<BearProfileProps> = ({ oso }) => {
  const profile = bearProfiles[oso.id];
  
  if (!profile) return null;

  return (
    <div className={`bear-profile bear-profile--${oso.id}`}>
      <div className="bear-profile__header">
        <div className="bear-profile__avatar">
          <span role="img" aria-label={oso.nombre}>
            {profile.emoji}
          </span>
        </div>
        <div className="bear-profile__info">
          <h3 className="bear-profile__title">{oso.nombre}</h3>
          <p className="bear-profile__role">{profile.role}</p>
        </div>
      </div>
    </div>
  );
};

export default BearProfile;