-- Crear política RLS de UPDATE para propietarios
-- Permite a los agentes actualizar propietarios de su empresa
CREATE POLICY "Agents can update owners from their company"
ON propietario
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM agente
    WHERE agente.empresa_id = propietario.empresa_id
    AND agente.user_uid = auth.uid()
  )
);