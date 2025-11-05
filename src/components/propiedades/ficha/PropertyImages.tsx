import React, { useState } from 'react';
import { Card, Typography, Image } from 'antd';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PropertyImagesResponse } from '../../../types/document';
import type { Propiedad } from '../../../types/propiedad';

import '../../../styles/components/_property-images.scss';

const { Title } = Typography;

interface PropertyImagesProps {
  files: PropertyImagesResponse | null;
  propiedad?: Propiedad;
}

const PropertyImages: React.FC<PropertyImagesProps> = ({ files, propiedad }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!files || files.files.length === 0) {
    return null;
  }

  const validFiles = files.files.filter((file: any) => file.url);

  if (validFiles.length === 0) {
    return null;
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? validFiles.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === validFiles.length - 1 ? 0 : prev + 1));
  };

  const currentFile = validFiles[currentImageIndex];

  const formatPrice = (price: number, divisa: string) => {
    if (divisa === 'UF') {
      return `UF ${price.toLocaleString('es-CL')}`;
    }
    return `$${price.toLocaleString('es-CL')}`;
  };

  return (
    <Card className="modern-card mb-24">
      <Title level={4}>Imágenes</Title>
      <div className="property-images-carousel">
        <div className="property-image-container">
          <Image
            src={currentFile.url}
            alt={currentFile.nombre_archivo || 'Imagen de propiedad'}
            className="property-main-image"
          />

          {validFiles.length > 1 && (
            <>
              <button
                className="property-nav-button property-nav-button-prev"
                onClick={handlePrevImage}
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                className="property-nav-button property-nav-button-next"
                onClick={handleNextImage}
                aria-label="Imagen siguiente"
              >
                <ChevronRight size={32} />
              </button>

              <div className="property-image-counter">
                {currentImageIndex + 1} / {validFiles.length}
              </div>
            </>
          )}

          {propiedad && (
            <div className="property-price-badge">
              {formatPrice(propiedad.precio, propiedad.divisa as string)}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PropertyImages;
