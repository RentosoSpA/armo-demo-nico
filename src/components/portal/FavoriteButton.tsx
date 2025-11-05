import React, { useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useFavoritesStore } from '../../stores/favoritesStore';

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  propertyId, 
  className = '' 
}) => {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const favorite = isFavorite(propertyId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsAnimating(true);
    toggleFavorite(propertyId);
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button 
      className={`btn-favorite ${favorite ? 'is-favorite' : ''} ${isAnimating ? 'is-animating' : ''} ${className}`}
      onClick={handleClick}
      aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {favorite ? (
        <HeartFilled className="heart-icon" />
      ) : (
        <HeartOutlined className="heart-icon" />
      )}
      
      {isAnimating && (
        <div className="favorite-particles">
          <span className="particle particle-1">💖</span>
          <span className="particle particle-2">✨</span>
          <span className="particle particle-3">💕</span>
          <span className="particle particle-4">⭐</span>
          <span className="particle particle-5">💗</span>
          <span className="particle particle-6">✨</span>
        </div>
      )}
    </button>
  );
};
