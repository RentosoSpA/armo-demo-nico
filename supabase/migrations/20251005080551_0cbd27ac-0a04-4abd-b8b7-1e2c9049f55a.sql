-- Crear función para obtener valores de enums dinámicamente
-- Esto permite que el frontend obtenga los tipos de propiedad actualizados automáticamente

CREATE OR REPLACE FUNCTION get_enum_values(enum_name text)
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  enum_values text[];
BEGIN
  -- Obtener todos los valores del enum especificado
  SELECT array_agg(e.enumlabel ORDER BY e.enumsortorder)
  INTO enum_values
  FROM pg_type t
  JOIN pg_enum e ON t.oid = e.enumtypid
  JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
  WHERE t.typname = enum_name
    AND n.nspname = 'public';
  
  RETURN enum_values;
END;
$$;

-- Permitir que usuarios autenticados llamen a esta función
GRANT EXECUTE ON FUNCTION get_enum_values(text) TO authenticated;