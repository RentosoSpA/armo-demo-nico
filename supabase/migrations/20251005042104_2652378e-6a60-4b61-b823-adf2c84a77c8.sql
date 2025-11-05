-- FASE 1: Extender tabla prospecto con campos completos
-- Agregar campos de nombre completo
ALTER TABLE public.prospecto 
ADD COLUMN IF NOT EXISTS primer_nombre TEXT,
ADD COLUMN IF NOT EXISTS segundo_nombre TEXT,
ADD COLUMN IF NOT EXISTS primer_apellido TEXT,
ADD COLUMN IF NOT EXISTS segundo_apellido TEXT;

-- Agregar campos de documentación
ALTER TABLE public.prospecto
ADD COLUMN IF NOT EXISTS documento TEXT,
ADD COLUMN IF NOT EXISTS tipo_documento TEXT;

-- Agregar campos financieros
ALTER TABLE public.prospecto
ADD COLUMN IF NOT EXISTS ingresos_mensuales NUMERIC,
ADD COLUMN IF NOT EXISTS egresos_mensuales NUMERIC,
ADD COLUMN IF NOT EXISTS situacion_laboral TEXT;

-- Agregar campos demográficos
ALTER TABLE public.prospecto
ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
ADD COLUMN IF NOT EXISTS genero TEXT;

-- Agregar campos de evaluación
ALTER TABLE public.prospecto
ADD COLUMN IF NOT EXISTS evaluado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS aprobado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'nuevo';

-- Agregar código telefónico
ALTER TABLE public.prospecto
ADD COLUMN IF NOT EXISTS codigo_telefonico INTEGER DEFAULT 56;

-- Crear índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_prospecto_documento ON public.prospecto(documento);
CREATE INDEX IF NOT EXISTS idx_prospecto_email ON public.prospecto(email);
CREATE INDEX IF NOT EXISTS idx_prospecto_estado ON public.prospecto(estado);
CREATE INDEX IF NOT EXISTS idx_prospecto_evaluado ON public.prospecto(evaluado);

-- Comentarios para documentación
COMMENT ON COLUMN public.prospecto.primer_nombre IS 'Primer nombre del prospecto';
COMMENT ON COLUMN public.prospecto.segundo_nombre IS 'Segundo nombre del prospecto (opcional)';
COMMENT ON COLUMN public.prospecto.primer_apellido IS 'Primer apellido del prospecto';
COMMENT ON COLUMN public.prospecto.segundo_apellido IS 'Segundo apellido del prospecto (opcional)';
COMMENT ON COLUMN public.prospecto.documento IS 'Número de documento de identidad';
COMMENT ON COLUMN public.prospecto.tipo_documento IS 'Tipo de documento (RUT, DNI, Pasaporte, etc.)';
COMMENT ON COLUMN public.prospecto.ingresos_mensuales IS 'Ingresos mensuales declarados';
COMMENT ON COLUMN public.prospecto.egresos_mensuales IS 'Egresos mensuales declarados';
COMMENT ON COLUMN public.prospecto.situacion_laboral IS 'Situación laboral actual';
COMMENT ON COLUMN public.prospecto.fecha_nacimiento IS 'Fecha de nacimiento';
COMMENT ON COLUMN public.prospecto.genero IS 'Género del prospecto';
COMMENT ON COLUMN public.prospecto.evaluado IS 'Indica si el prospecto ha sido evaluado';
COMMENT ON COLUMN public.prospecto.aprobado IS 'Indica si el prospecto fue aprobado en la evaluación';
COMMENT ON COLUMN public.prospecto.estado IS 'Estado actual del prospecto (nuevo, en_proceso, aprobado, rechazado)';