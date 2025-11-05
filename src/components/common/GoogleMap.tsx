import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from 'antd';
import { ExternalLink, MapPin } from 'lucide-react';
import './GoogleMap.scss';

const { Text } = Typography;

interface GoogleMapProps {
  address: string;
  height?: number;
  width?: string;
  zoom?: number;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  address,
  height = 300,
  width = '100%',
  zoom = 15,
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Reset states when address changes
    setMapLoaded(false);
    setMapError(false);
  }, [address]);

  // Create the Google Maps URL for embedded view
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}&zoom=${zoom}`;

  // Fallback content when map is loading or has error
  const renderFallback = () => (
    <div className="google-map-fallback">
      <MapPin size={48} color="#1890ff" className="map-icon" />
      <Text strong className="map-title">
        {mapError ? 'Error al cargar el mapa' : 'Cargando mapa...'}
      </Text>
      <Text type="secondary" className="map-address">
        {address}
      </Text>
      <Button
        type="primary"
        icon={<ExternalLink size={16} />}
        onClick={() => window.open(mapUrl, '_blank')}
      >
        Ver en Google Maps
      </Button>
    </div>
  );

  return (
    <Card className="google-map-card">
      <div
        className="google-map-container"
        style={{ height: `${height}px`, width }}
      >
        {mapError ? (
          renderFallback()
        ) : (
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            className="google-map-iframe"
            title="Google Maps"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setMapLoaded(true)}
            onError={() => setMapError(true)}
          />
        )}
        {!mapLoaded && !mapError && renderFallback()}
      </div>
    </Card>
  );
};

export default GoogleMap;
