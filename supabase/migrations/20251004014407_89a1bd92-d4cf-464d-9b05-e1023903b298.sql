-- ============================================================================
-- FASE 3: Ajuste de Políticas RLS para Seguridad
-- ============================================================================
-- Objetivo: Eliminar acceso público a empresa y permitir solo usuarios autenticados
-- ============================================================================

-- 1. ELIMINAR POLÍTICA PÚBLICA DE INSERT EN EMPRESA
-- ============================================================================
-- Ya no necesitamos que sea pública porque el trigger con SECURITY DEFINER
-- se encarga de crear la empresa automáticamente

DROP POLICY IF EXISTS "Public can create company during signup" ON public.empresa;

-- 2. DOCUMENTAR POLÍTICA DE SELECT EXISTENTE
-- ============================================================================
-- Esta política permite que los usuarios vean solo las empresas a las que pertenecen

COMMENT ON POLICY "Users can view companies they belong to" ON public.empresa IS
'Permite que usuarios autenticados vean únicamente las empresas donde son agentes.
Verifica membresía a través de la tabla agente.';

-- 3. CREAR POLÍTICA DE UPDATE PARA EMPRESA
-- ============================================================================
-- Permitir que los agentes de una empresa puedan actualizar la información de su empresa

CREATE POLICY "Agents can update their company information"
ON public.empresa
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.agente
    WHERE agente.empresa_id = empresa.id
      AND agente.user_uid = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.agente
    WHERE agente.empresa_id = empresa.id
      AND agente.user_uid = auth.uid()
  )
);

COMMENT ON POLICY "Agents can update their company information" ON public.empresa IS
'Permite que los agentes actualicen la información de su empresa.
Verifica que el usuario sea un agente activo de la empresa.';

-- 4. DOCUMENTAR POLÍTICAS DE PROFILES EXISTENTES
-- ============================================================================

COMMENT ON POLICY "Users can view their own profile" ON public.profiles IS
'Permite que usuarios autenticados vean solo su propio perfil.';

COMMENT ON POLICY "Users can insert their own profile" ON public.profiles IS
'Permite que usuarios creen su propio perfil durante el registro.
Nota: Normalmente el trigger handle_new_user crea el perfil automáticamente.';

COMMENT ON POLICY "Users can update their own profile" ON public.profiles IS
'Permite que usuarios actualicen solo su propio perfil.';

-- 5. CREAR ÍNDICE PARA OPTIMIZAR VERIFICACIÓN DE POLÍTICAS
-- ============================================================================
-- Optimizar las consultas de las políticas RLS

CREATE INDEX IF NOT EXISTS idx_agente_empresa_user 
ON public.agente(empresa_id, user_uid);

-- ============================================================================
-- RESUMEN DE SEGURIDAD POST-MIGRACIÓN
-- ============================================================================
-- 
-- Tabla EMPRESA:
--   ✅ INSERT: Solo a través del trigger SECURITY DEFINER (no acceso directo)
--   ✅ SELECT: Solo usuarios autenticados que pertenecen a la empresa
--   ✅ UPDATE: Solo agentes de la empresa pueden actualizar
--   ✅ DELETE: Bloqueado (no hay política)
--
-- Tabla PROFILES:
--   ✅ INSERT: Solo el propio usuario (user_id = auth.uid())
--   ✅ SELECT: Solo el propio usuario
--   ✅ UPDATE: Solo el propio usuario
--   ✅ DELETE: Bloqueado (no hay política)
--
-- Tabla AGENTE:
--   ✅ SELECT: Solo el propio agente (user_uid = auth.uid())
--   ✅ UPDATE: Solo el propio agente
--   ✅ INSERT: Solo a través del trigger (no acceso directo)
--   ✅ DELETE: Bloqueado (no hay política)
--
-- ============================================================================