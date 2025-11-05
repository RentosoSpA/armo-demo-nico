-- =====================================================================
-- SOLUCIÓN DEFINITIVA PARA RECURSIÓN INFINITA EN RLS
-- =====================================================================
-- Problema: Las políticas RLS de invitation_links y user_invitations
-- causan recursión infinita al verificar has_role() que consulta user_roles
-- cuyas políticas también verifican has_role().
--
-- Solución: Crear función SECURITY DEFINER que bypassa RLS y simplificar
-- las políticas para evitar subqueries a user_roles.
-- =====================================================================

-- =====================================================================
-- FASE 1: Crear función SECURITY DEFINER para obtener empresa_id
-- =====================================================================
-- Esta función obtiene el empresa_id del usuario sin evaluar políticas RLS,
-- evitando la recursión infinita.

CREATE OR REPLACE FUNCTION public.get_user_empresa_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT empresa_id 
  FROM public.user_roles 
  WHERE user_id = _user_id 
  LIMIT 1
$$;

COMMENT ON FUNCTION public.get_user_empresa_id IS 
'Obtiene el empresa_id de un usuario de forma segura sin causar recursión en RLS. 
Usa SECURITY DEFINER para ejecutar con privilegios del owner y bypassar políticas RLS.';

-- =====================================================================
-- FASE 2: Rediseñar políticas RLS de invitation_links
-- =====================================================================

-- DROP políticas problemáticas que causan recursión
DROP POLICY IF EXISTS "Admins can create invitation links for their company" ON public.invitation_links;
DROP POLICY IF EXISTS "Admins can view invitation links for their company" ON public.invitation_links;
DROP POLICY IF EXISTS "Admins can update invitation links for their company" ON public.invitation_links;
DROP POLICY IF EXISTS "Admins can delete invitation links for their company" ON public.invitation_links;

-- CREATE nuevas políticas sin recursión usando get_user_empresa_id()

CREATE POLICY "Admins can create invitation links for their company"
ON public.invitation_links
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id = get_user_empresa_id(auth.uid())
);

CREATE POLICY "Admins can view invitation links for their company"
ON public.invitation_links
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id = get_user_empresa_id(auth.uid())
);

CREATE POLICY "Admins can update invitation links for their company"
ON public.invitation_links
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id = get_user_empresa_id(auth.uid())
);

CREATE POLICY "Admins can delete invitation links for their company"
ON public.invitation_links
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id = get_user_empresa_id(auth.uid())
);

-- Mantener política pública sin cambios (no causa recursión)
-- "Public can verify active invitation links" - ya existe

-- =====================================================================
-- FASE 3: Rediseñar políticas RLS de user_invitations
-- =====================================================================

-- DROP políticas problemáticas que causan recursión
DROP POLICY IF EXISTS "Admins can insert invitations for their company" ON public.user_invitations;
DROP POLICY IF EXISTS "Admins can view invitations for their company" ON public.user_invitations;
DROP POLICY IF EXISTS "Admins can update invitations for their company" ON public.user_invitations;

-- CREATE nuevas políticas sin recursión usando get_user_empresa_id()

CREATE POLICY "Admins can insert invitations for their company"
ON public.user_invitations
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id = get_user_empresa_id(auth.uid())
);

CREATE POLICY "Admins can view invitations for their company"
ON public.user_invitations
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id = get_user_empresa_id(auth.uid())
);

CREATE POLICY "Admins can update invitations for their company"
ON public.user_invitations
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id = get_user_empresa_id(auth.uid())
);

-- Mantener política pública sin cambios (no causa recursión)
-- "Anyone can view invitation by token" - ya existe

-- =====================================================================
-- FASE 4: Optimización - Crear índice si no existe
-- =====================================================================

-- Índice para optimizar búsquedas por user_id en user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id 
ON public.user_roles(user_id);

-- =====================================================================
-- VERIFICACIÓN FINAL
-- =====================================================================

-- Comentarios de auditoría
COMMENT ON POLICY "Admins can create invitation links for their company" ON public.invitation_links IS 
'Permite a admins crear invitation links. Usa get_user_empresa_id() para evitar recursión RLS.';

COMMENT ON POLICY "Admins can view invitation links for their company" ON public.invitation_links IS 
'Permite a admins ver invitation links de su empresa. Usa get_user_empresa_id() para evitar recursión RLS.';

COMMENT ON POLICY "Admins can update invitation links for their company" ON public.invitation_links IS 
'Permite a admins actualizar invitation links de su empresa. Usa get_user_empresa_id() para evitar recursión RLS.';

COMMENT ON POLICY "Admins can delete invitation links for their company" ON public.invitation_links IS 
'Permite a admins eliminar invitation links de su empresa. Usa get_user_empresa_id() para evitar recursión RLS.';