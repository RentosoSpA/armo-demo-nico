-- Agregar nuevos tipos de propiedad: Loft y Duplex
-- Los valores se agregan al final del enum existente

ALTER TYPE tipo_propiedad ADD VALUE IF NOT EXISTS 'Loft';
ALTER TYPE tipo_propiedad ADD VALUE IF NOT EXISTS 'Duplex';