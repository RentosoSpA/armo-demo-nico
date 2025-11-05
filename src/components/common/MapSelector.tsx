import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Button, Typography, Tooltip, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface MapSelectorProps {
  lat?: number | null;
  lng?: number | null;
  onChange?: (lat: number | null, lng: number | null) => void;
  direccion?: string;
}

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

// Centro de Chile por defecto (Santiago)
const defaultCenter = {
  lat: -33.4489,
  lng: -70.6693,
};

const MapSelector = ({ lat, lng, onChange }: MapSelectorProps) => {
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(
    lat && lng ? { lat, lng } : null
  );
  const [mapCenter] = useState<google.maps.LatLngLiteral>(
    lat && lng ? { lat, lng } : defaultCenter
  );

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const onLoad = useCallback(() => {
    // Map loaded
  }, []);

  const onUnmount = useCallback(() => {
    // Map unmounted
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newPosition = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        setMarkerPosition(newPosition);
        onChange?.(newPosition.lat, newPosition.lng);
        message.success('Ubicación actualizada');
      }
    },
    [onChange]
  );

  const handleClearGeoreference = useCallback(() => {
    setMarkerPosition(null);
    onChange?.(null, null);
    message.info('Georreferenciación eliminada');
  }, [onChange]);

  if (!isLoaded) {
    return (
      <div style={{
        ...containerStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Text style={{ color: '#9CA3AF' }}>Cargando mapa...</Text>
      </div>
    );
  }

  return (
    <div className="map-selector">
      <div className="mb-16 d-flex align-center gap-8">
        <Tooltip title="Haz click sobre el mapa para ubicar la propiedad. El marcador indicará la posición exacta que se usará para georreferenciarla.">
          <InfoCircleOutlined style={{ fontSize: '16px', color: '#1890ff', cursor: 'pointer' }} />
        </Tooltip>
        <Text style={{ color: '#9CA3AF', fontSize: '13px' }}>
          La dirección escrita servirá como ubicación referencial. Si agregas un marcador y activas 'Enviar coordenadas a portales',
          esa ubicación exacta se mostrará en los mapas de los portales inmobiliarios.
        </Text>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={markerPosition ? 16 : 12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
          },
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>

      <div className="mt-16 d-flex gap-16 align-center flex-wrap">
        
        {markerPosition && (
          <Button onClick={handleClearGeoreference} danger>
            Limpiar georreferenciación
          </Button>
        )}
      </div>

      {markerPosition && (
        <div className="mt-16">
          <Text style={{ color: '#52c41a', fontSize: '13px' }}>
            <strong>Coordenadas guardadas:</strong> Latitud: {markerPosition.lat.toFixed(6)},
            Longitud: {markerPosition.lng.toFixed(6)}
          </Text>
        </div>
      )}
    </div>
  );
};

export default MapSelector;
