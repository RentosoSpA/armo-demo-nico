-- ============================================================================
-- FASE 1: Trigger Definitivo para Onboarding Automático de Usuarios
-- ============================================================================
-- VERSIÓN CORREGIDA: No eliminar trigger en auth.users (schema protegido)
-- Solo reemplazar la función handle_new_user
-- ============================================================================

-- 1. REEMPLAZAR FUNCIÓN handle_new_user (sin tocar el trigger)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_empresa_id uuid;
  v_profile_id uuid;
  v_empresa_email text;
  v_empresa_telefono integer;
  v_empresa_codigo integer;
  v_nit text;
  v_direccion text;
  v_company_name text;
  v_agente_telefono integer;
  v_agente_codigo integer;
BEGIN
  -- ========================================================================
  -- PASO 1: VALIDAR Y PREPARAR DATOS DE EMPRESA
  -- ========================================================================
  
  -- Extraer company_name
  v_company_name := COALESCE(NEW.raw_user_meta_data->>'company_name', 'Mi Empresa');
  
  -- Validar y preparar NIT (obligatorio)
  v_nit := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'nit'), ''),
    'TEMP-' || NEW.id::text
  );
  
  -- Validar y preparar dirección
  v_direccion := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'direccion'), ''),
    'Dirección por definir'
  );
  
  -- Validar email de empresa (usar email del usuario si no viene)
  v_empresa_email := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'email'), ''),
    NEW.email
  );
  
  -- Validar teléfono de empresa
  BEGIN
    v_empresa_telefono := COALESCE(
      (NEW.raw_user_meta_data->>'telefono')::integer,
      (NEW.raw_user_meta_data->>'phone')::integer,
      0
    );
  EXCEPTION WHEN OTHERS THEN
    v_empresa_telefono := 0;
  END;
  
  -- Si el teléfono de empresa es 0, intentar usar el del agente
  IF v_empresa_telefono = 0 THEN
    BEGIN
      v_empresa_telefono := COALESCE(
        (NEW.raw_user_meta_data->>'agente_telefono')::integer,
        0
      );
    EXCEPTION WHEN OTHERS THEN
      v_empresa_telefono := 0;
    END;
  END IF;
  
  -- Validar código telefónico (default Chile: 56)
  BEGIN
    v_empresa_codigo := COALESCE(
      (NEW.raw_user_meta_data->>'codigo_telefonico')::integer,
      56
    );
  EXCEPTION WHEN OTHERS THEN
    v_empresa_codigo := 56;
  END;
  
  RAISE NOTICE 'Procesando nuevo usuario: % (email: %)', NEW.id, NEW.email;
  RAISE NOTICE 'Empresa a crear/buscar: % (NIT: %, Email: %)', v_company_name, v_nit, v_empresa_email;
  
  -- ========================================================================
  -- PASO 2: VERIFICAR SI EMPRESA YA EXISTE (por email)
  -- ========================================================================
  BEGIN
    SELECT id INTO v_empresa_id
    FROM public.empresa
    WHERE email = v_empresa_email
    LIMIT 1;
    
    IF v_empresa_id IS NOT NULL THEN
      RAISE NOTICE 'Empresa existente encontrada (ID: %) para email: %', v_empresa_id, v_empresa_email;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error al verificar empresa existente: %', SQLERRM;
    v_empresa_id := NULL;
  END;
  
  -- ========================================================================
  -- PASO 3: CREAR EMPRESA SI NO EXISTE
  -- ========================================================================
  IF v_empresa_id IS NULL AND v_company_name IS NOT NULL THEN
    BEGIN
      INSERT INTO public.empresa (
        nombre,
        nit,
        email,
        direccion,
        telefono,
        codigo_telefonico,
        sobre_nosotros,
        mision,
        vision
      )
      VALUES (
        v_company_name,
        v_nit,
        v_empresa_email,
        v_direccion,
        v_empresa_telefono,
        v_empresa_codigo,
        COALESCE(NEW.raw_user_meta_data->>'sobre_nosotros', ''),
        COALESCE(NEW.raw_user_meta_data->>'mision', ''),
        COALESCE(NEW.raw_user_meta_data->>'vision', '')
      )
      RETURNING id INTO v_empresa_id;
      
      RAISE NOTICE 'Empresa creada exitosamente (ID: %)', v_empresa_id;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error al crear empresa: %', SQLERRM;
      v_empresa_id := NULL;
    END;
  END IF;
  
  -- ========================================================================
  -- PASO 4: CREAR PERFIL DEL USUARIO
  -- ========================================================================
  BEGIN
    INSERT INTO public.profiles (
      user_id,
      full_name,
      company_name,
      phone,
      empresa_id
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      v_company_name,
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      v_empresa_id
    )
    RETURNING id INTO v_profile_id;
    
    RAISE NOTICE 'Perfil creado exitosamente (ID: %, empresa_id: %)', v_profile_id, v_empresa_id;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error al crear perfil: %', SQLERRM;
    -- No bloquear el registro si falla el perfil
  END;
  
  -- ========================================================================
  -- PASO 5: CREAR AGENTE SI HAY EMPRESA_ID
  -- ========================================================================
  IF v_empresa_id IS NOT NULL THEN
    -- Preparar datos del agente
    BEGIN
      v_agente_telefono := COALESCE(
        (NEW.raw_user_meta_data->>'telefono')::integer,
        (NEW.raw_user_meta_data->>'phone')::integer,
        v_empresa_telefono,
        0
      );
    EXCEPTION WHEN OTHERS THEN
      v_agente_telefono := v_empresa_telefono;
    END;
    
    BEGIN
      v_agente_codigo := COALESCE(
        (NEW.raw_user_meta_data->>'codigo_telefonico')::integer,
        v_empresa_codigo
      );
    EXCEPTION WHEN OTHERS THEN
      v_agente_codigo := v_empresa_codigo;
    END;
    
    -- Insertar agente
    BEGIN
      INSERT INTO public.agente (
        user_uid,
        empresa_id,
        nombre,
        email,
        telefono,
        codigo_telefonico,
        time_zone,
        lunes_inicio,
        lunes_fin,
        martes_inicio,
        martes_fin,
        miercoles_inicio,
        miercoles_fin,
        jueves_inicio,
        jueves_fin,
        viernes_inicio,
        viernes_fin,
        sabado_inicio,
        sabado_fin,
        domingo_inicio,
        domingo_fin
      )
      VALUES (
        NEW.id,
        v_empresa_id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Agente'),
        NEW.email,
        v_agente_telefono,
        v_agente_codigo,
        COALESCE(NEW.raw_user_meta_data->>'time_zone', 'America/Santiago'),
        (NEW.raw_user_meta_data->>'lunes_inicio')::numeric,
        (NEW.raw_user_meta_data->>'lunes_fin')::numeric,
        (NEW.raw_user_meta_data->>'martes_inicio')::numeric,
        (NEW.raw_user_meta_data->>'martes_fin')::numeric,
        (NEW.raw_user_meta_data->>'miercoles_inicio')::numeric,
        (NEW.raw_user_meta_data->>'miercoles_fin')::numeric,
        (NEW.raw_user_meta_data->>'jueves_inicio')::numeric,
        (NEW.raw_user_meta_data->>'jueves_fin')::numeric,
        (NEW.raw_user_meta_data->>'viernes_inicio')::numeric,
        (NEW.raw_user_meta_data->>'viernes_fin')::numeric,
        (NEW.raw_user_meta_data->>'sabado_inicio')::numeric,
        (NEW.raw_user_meta_data->>'sabado_fin')::numeric,
        (NEW.raw_user_meta_data->>'domingo_inicio')::numeric,
        (NEW.raw_user_meta_data->>'domingo_fin')::numeric
      );
      
      RAISE NOTICE 'Agente creado exitosamente para usuario: %', NEW.id;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error al crear agente: %', SQLERRM;
      -- No bloquear el registro si falla el agente
    END;
  ELSE
    RAISE NOTICE 'No se creó agente porque no hay empresa_id para usuario: %', NEW.id;
  END IF;
  
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Capturar cualquier error no manejado
    RAISE NOTICE 'Error general en handle_new_user para usuario %: %', NEW.id, SQLERRM;
    RETURN NEW; -- Permitir que el usuario se cree de todos modos
END;
$$;

-- 2. CREAR ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

-- Índice para búsqueda rápida de empresas por email (prevenir duplicados)
CREATE INDEX IF NOT EXISTS idx_empresa_email ON public.empresa(email);

-- Índice para lookup rápido de agentes por user_uid
CREATE INDEX IF NOT EXISTS idx_agente_user_uid ON public.agente(user_uid);

-- Índice para lookup rápido de profiles por user_id
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Índice para joins eficientes entre profiles y empresa
CREATE INDEX IF NOT EXISTS idx_profiles_empresa_id ON public.profiles(empresa_id);

-- 3. COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================
COMMENT ON FUNCTION public.handle_new_user() IS 
'Trigger function que crea automáticamente empresa, perfil y agente al registrarse un nuevo usuario.
Características:
- Validaciones robustas de todos los campos obligatorios
- Valores por defecto inteligentes si falta metadata
- Prevención de duplicados de empresas por email
- Manejo transaccional con bloques EXCEPTION
- Logging extensivo con RAISE NOTICE para debugging
- No bloquea el registro del usuario ante errores
VERSIÓN: 2.0 - Producción Ready';

-- ============================================================================
-- FIN DE MIGRACIÓN FASE 1
-- ============================================================================