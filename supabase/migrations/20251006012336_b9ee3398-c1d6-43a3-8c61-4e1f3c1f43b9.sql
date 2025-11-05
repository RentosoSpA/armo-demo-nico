-- =====================================================
-- FASE 7: RLS Policies adicionales para gestión de agentes
-- =====================================================

-- 1. Policy para que admins puedan ver todos los agentes de su empresa
CREATE POLICY "Admins can view all agents in their company"
ON public.agente
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id IN (
    SELECT empresa_id 
    FROM public.user_roles 
    WHERE user_id = auth.uid()
  )
);

-- 2. Policy para que admins puedan actualizar agentes de su empresa
CREATE POLICY "Admins can update agents in their company"
ON public.agente
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id IN (
    SELECT empresa_id 
    FROM public.user_roles 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id IN (
    SELECT empresa_id 
    FROM public.user_roles 
    WHERE user_id = auth.uid()
  )
);

-- 3. Policy para que admins puedan ver profiles de su empresa
CREATE POLICY "Admins can view profiles in their company"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id IN (
    SELECT empresa_id 
    FROM public.user_roles 
    WHERE user_id = auth.uid()
  )
);

-- 4. Crear índices para optimizar queries frecuentes
CREATE INDEX IF NOT EXISTS idx_agente_empresa_id ON public.agente(empresa_id);
CREATE INDEX IF NOT EXISTS idx_agente_user_uid ON public.agente(user_uid);
CREATE INDEX IF NOT EXISTS idx_agente_activo ON public.agente(activo);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_empresa ON public.user_roles(user_id, empresa_id);
CREATE INDEX IF NOT EXISTS idx_profiles_empresa_id ON public.profiles(empresa_id);