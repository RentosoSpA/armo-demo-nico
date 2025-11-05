import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Spin, message, Button } from 'antd';
import { ArrowLeft } from 'lucide-react';
import type { Propiedad } from '../../../../types/propiedad';
import { getPropiedadById } from '../../../../services/propiedades/propiedadesService';
import type { PropertyImagesResponse } from '../../../../types/document';
import PropertyHeader from './PropertyHeader';
import PropertyImages from './PropertyImages';
import PropertyDetails from './PropertyDetails';
import LocationSection from './LocationSection';
import DescriptionSection from './DescriptionSection';
import PropertyStats from './PropertyStats';
import ContactSection from './ContactSection';
import AvailabilitySection from './AvailabilitySection';
import AmenitiesSection from './AmenitiesSection';
import { getImages } from '../../../../services/multimedia/imagenesServiceSupabase';

const PublicPropertyFicha: React.FC = () => {
  const { id, empresaNombre } = useParams<{ id: string; empresaNombre?: string }>();
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<PropertyImagesResponse | null>(null);

  const fetchPropiedad = useCallback(async () => {
    try {
      setLoading(true);
      const propiedad = await getPropiedadById(id!);
      if (propiedad) {
        setPropiedad(propiedad);
        // Fetch property files
        const propertyFiles = await getImages(propiedad.id);
        setFiles(propertyFiles);
      } else {
        message.error('Propiedad no encontrada');
        navigate('/404');
      }
    } catch (error) {
      console.error('Error fetching propiedad:', error);
      message.error('Error al cargar la propiedad');
      navigate('/404');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      fetchPropiedad();
    }
  }, [id, fetchPropiedad]);

  if (loading) {
    return (
      <div
        className="d-flex align-center justify-center"
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!propiedad) {
    return null;
  }

  return (
    <div className="p-24">
      {/* Back Button */}
      <div className="mb-16">
        <Button
          icon={<ArrowLeft size={16} />}
          onClick={() => {
            if (empresaNombre) {
              navigate(`/portal/${empresaNombre}`);
            } else {
              navigate('/portal');
            }
          }}
          className="mb-16"
        >
          Volver al Portal
        </Button>
      </div>

      {/* Header */}
      <PropertyHeader propiedad={propiedad} />

      <Row gutter={[24, 24]}>
        {/* Main Content */}
        <Col xs={24} lg={16}>
          {/* Property Images */}
          <PropertyImages files={files} />

          {/* Description */}
          <DescriptionSection propiedad={propiedad} />

          {/* Property Details */}
          <PropertyDetails propiedad={propiedad} />

          {/* Amenities */}
          {propiedad.amenidades && <AmenitiesSection amenidades={propiedad.amenidades} />}

          {/* Location */}
          <LocationSection propiedad={propiedad} />
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* Price and Stats */}
          <PropertyStats propiedad={propiedad} />

          {/* Contact Information */}
          <ContactSection propiedad={propiedad} />

          {/* Availability */}
          <AvailabilitySection propiedad={propiedad} />
        </Col>
      </Row>

     
    </div>
  );
};

export default PublicPropertyFicha;
