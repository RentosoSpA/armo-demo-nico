-- PASO 3: Actualizar políticas RLS para tabla prospecto
-- Solo agentes autenticados pueden crear prospectos

-- Eliminar la política pública de INSERT
DROP POLICY IF EXISTS "Public can insert prospects" ON prospecto;

-- Crear política para que agentes autenticados puedan insertar prospectos
CREATE POLICY "Authenticated agents can insert prospects"
ON prospecto
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Crear política para que agentes puedan actualizar prospectos
CREATE POLICY "Authenticated agents can update prospects"
ON prospecto
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Mantener la política de SELECT pública para compatibilidad con formularios públicos
-- Si necesitas restringirla en el futuro, puedes cambiarla