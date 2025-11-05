import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Space, Checkbox } from 'antd';
import { ClearOutlined, FilterOutlined } from '@ant-design/icons';
import SearchInput from '../common/SearchInput';
import CustomSelect from '../common/CustomSelect';
import type { Propiedad } from '../../types/propiedad';

interface PortalFiltersProps {
  propiedades: Propiedad[];
  onFilterChange: (filtered: Propiedad[]) => void;
}

const PortalFilters: React.FC<PortalFiltersProps> = ({ propiedades, onFilterChange }) => {
  const [titleFilter, setTitleFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [dealTypeFilter, setDealTypeFilter] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const tipoPropiedadesOptions = [
    { key: 'Casa', value: 'Casa', label: 'Casa' },
    { key: 'Departamento', value: 'Departamento', label: 'Departamento' },
    { key: 'Oficina', value: 'Oficina', label: 'Oficina' },
    { key: 'LocalComercial', value: 'LocalComercial', label: 'Local Comercial' },
    { key: 'Parcela', value: 'Parcela', label: 'Parcela' },
    { key: 'Bodega', value: 'Bodega', label: 'Bodega' },
    { key: 'Sitio', value: 'Sitio', label: 'Sitio' },
    { key: 'Loft', value: 'Loft', label: 'Loft' },
    { key: 'Dúplex', value: 'Dúplex', label: 'Dúplex' },
    { key: 'Terreno', value: 'Terreno', label: 'Terreno' },
    { key: 'Industrial', value: 'Industrial', label: 'Industrial' },
    { key: 'Estacionamiento', value: 'Estacionamiento', label: 'Estacionamiento' },
    
  ];

  const tipoVentaOptions = [
    { key: 'venta', value: 'venta', label: 'Venta' },
    { key: 'arriendo', value: 'arriendo', label: 'Arriendo' },
  ];

  const amenitiesOptions = [
    { label: 'Amoblado', value: 'amoblado' },
    { label: 'Cocina', value: 'cocina' },
    { label: 'Mascotas Permitidas', value: 'mascota' },
    { label: 'Estacionamiento', value: 'estacionamiento' },
    { label: 'Balcón', value: 'balcon' },
    { label: 'Jardín', value: 'jardin' },
    { label: 'WiFi', value: 'wifi' },
    { label: 'Garage', value: 'garage' },
    { label: 'Zona de Fumador', value: 'zonaFumador' },
    { label: 'Lavaplatos', value: 'lavaplatos' },
    { label: 'Lavadora', value: 'lavadora' },
    { label: 'TV Cable', value: 'tvCable' },
  ];

  // Apply filters whenever any filter changes
  useEffect(() => {
    let filtered = [...propiedades];

    // Filter by title (case-insensitive search)
    if (titleFilter.trim()) {
      filtered = filtered.filter(
        propiedad =>
          propiedad.titulo.toLowerCase().includes(titleFilter.toLowerCase()) ||
          (propiedad.direccion?.toLowerCase().includes(titleFilter.toLowerCase()) ?? false) ||
          (propiedad.comuna?.toLowerCase().includes(titleFilter.toLowerCase()) ?? false)
      );
    }

    // Filter by property type
    if (typeFilter) {
      filtered = filtered.filter(propiedad => propiedad.tipo === typeFilter);
    }

    // Filter by deal type
    if (dealTypeFilter) {
      if (dealTypeFilter === 'venta') {
        filtered = filtered.filter(propiedad => propiedad.venta === true);
      } else if (dealTypeFilter === 'arriendo') {
        filtered = filtered.filter(propiedad => propiedad.arriendo === true);
      }
    }

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(propiedad => {
        if (!propiedad.amenidades) return false;
        return selectedAmenities.every(
          amenity => propiedad.amenidades![amenity as keyof typeof propiedad.amenidades] === true
        );
      });
    }

    onFilterChange(filtered);
  }, [titleFilter, typeFilter, dealTypeFilter, selectedAmenities, propiedades]);

  const handleClearFilters = () => {
    setTitleFilter('');
    setTypeFilter(null);
    setDealTypeFilter(null);
    setSelectedAmenities([]);
    setShowAdvancedFilters(false);
  };

  const hasActiveFilters =
    titleFilter || typeFilter || dealTypeFilter || selectedAmenities.length > 0;

  return (
    <Col span={24}>
      <Row gutter={16} align="middle">
        <Col flex="1 1 35%">
          <SearchInput
            placeholder="Buscar por título, dirección o comuna..."
            value={titleFilter}
            onChange={setTitleFilter}
            className="w-full"
          />
        </Col>
        <Col flex="1 1 20%">
          <CustomSelect
            placeholder="Tipo de propiedad"
            value={typeFilter ?? undefined}
            onChange={(value) => setTypeFilter(value as string | null)}
            options={tipoPropiedadesOptions}
            className="w-full"
            allowClear
          />
        </Col>
        <Col flex="1 1 20%">
          <CustomSelect
            placeholder="Tipo de operación"
            value={dealTypeFilter ?? undefined}
            onChange={(value) => setDealTypeFilter(value as string | null)}
            options={tipoVentaOptions}
            className="w-full"
            allowClear
          />
        </Col>
        <Col flex="1 1 15%">
          <Space>
            <Button
              type="text"
              icon={<FilterOutlined />}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              size="small"
            >
              {showAdvancedFilters ? 'Ocultar' : 'Más filtros'}
            </Button>
            {hasActiveFilters && (
              <Button
                type="text"
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
                size="small"
              >
                Limpiar
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      {/* Advanced Filters Section */}
      {showAdvancedFilters && (
        <Row className="mt-16">
          <Col span={24}>
            <div
              className="p-16"
            >
              <Row gutter={[24, 16]}>
                {/* Amenities */}
                <Col span={24}>
                  <div>
                    <h4 className="mb-12">Amenidades</h4>
                    <Checkbox.Group
                      options={amenitiesOptions}
                      value={selectedAmenities}
                      onChange={setSelectedAmenities}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      )}
    </Col>
  );
};

export default PortalFilters;
