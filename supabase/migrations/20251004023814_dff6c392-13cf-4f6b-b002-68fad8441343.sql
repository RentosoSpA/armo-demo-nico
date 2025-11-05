-- FASE 5: Migración de Datos Existentes (Versión Corregida)
-- Este script maneja usuarios y agentes que no tienen empresa_id asignado

-- Paso 1: Crear empresas temporales para agentes sin empresa
DO $$
DECLARE
  agente_record RECORD;
  nueva_empresa_id uuid;
BEGIN
  FOR agente_record IN 
    SELECT id, user_uid, nombre, email, telefono, codigo_telefonico
    FROM public.agente
    WHERE empresa_id IS NULL
  LOOP
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
      COALESCE(agente_record.nombre, 'Mi Empresa') || ' - Empresa ' || substring(agente_record.id::text, 1, 8),
      'TEMP-' || agente_record.id::text,
      agente_record.email,
      'Dirección por definir',
      agente_record.telefono,
      agente_record.codigo_telefonico,
      'Empresa creada automáticamente durante la migración',
      '',
      ''
    )
    RETURNING id INTO nueva_empresa_id;
    
    UPDATE public.agente
    SET empresa_id = nueva_empresa_id
    WHERE id = agente_record.id;
    
    RAISE NOTICE 'Agente % migrado a empresa %', agente_record.id, nueva_empresa_id;
  END LOOP;
END $$;

-- Paso 2: Sincronizar profiles con sus agentes
UPDATE public.profiles p
SET empresa_id = a.empresa_id
FROM public.agente a
WHERE p.user_id = a.user_uid
  AND p.empresa_id IS NULL
  AND a.empresa_id IS NOT NULL;

-- Paso 3: Para profiles sin agente asociado, crear empresa y agente
DO $$
DECLARE
  profile_record RECORD;
  nueva_empresa_id uuid;
  telefono_val integer;
  codigo_val integer;
  nombre_empresa text;
  email_usuario text;
BEGIN
  FOR profile_record IN 
    SELECT p.id, p.user_id, p.full_name, p.company_name, p.phone
    FROM public.profiles p
    LEFT JOIN public.agente a ON a.user_uid = p.user_id
    WHERE p.empresa_id IS NULL
      AND a.id IS NULL
  LOOP
    BEGIN
      telefono_val := COALESCE(NULLIF(REGEXP_REPLACE(profile_record.phone, '[^0-9]', '', 'g'), '')::integer, 0);
    EXCEPTION WHEN OTHERS THEN
      telefono_val := 0;
    END;
    
    codigo_val := 56;
    
    -- Obtener email del usuario
    SELECT email INTO email_usuario FROM auth.users WHERE id = profile_record.user_id;
    
    -- Generar nombre único para la empresa
    nombre_empresa := COALESCE(
      NULLIF(profile_record.company_name, ''), 
      COALESCE(NULLIF(profile_record.full_name, ''), 'Usuario') || ' - Empresa'
    ) || ' ' || substring(profile_record.user_id::text, 1, 8);
    
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
      nombre_empresa,
      'TEMP-' || profile_record.user_id::text,
      COALESCE(email_usuario, 'sin-email@temp.com'),
      'Dirección por definir',
      telefono_val,
      codigo_val,
      'Empresa creada automáticamente durante la migración',
      '',
      ''
    )
    RETURNING id INTO nueva_empresa_id;
    
    INSERT INTO public.agente (
      user_uid,
      empresa_id,
      nombre,
      email,
      telefono,
      codigo_telefonico,
      time_zone
    )
    VALUES (
      profile_record.user_id,
      nueva_empresa_id,
      COALESCE(NULLIF(profile_record.full_name, ''), 'Agente'),
      COALESCE(email_usuario, 'sin-email@temp.com'),
      telefono_val,
      codigo_val,
      'America/Santiago'
    );
    
    UPDATE public.profiles
    SET empresa_id = nueva_empresa_id
    WHERE id = profile_record.id;
    
    RAISE NOTICE 'Profile % migrado: empresa % y agente creados', profile_record.id, nueva_empresa_id;
  END LOOP;
END $$;

-- Paso 4: Verificar resultados
DO $$
DECLARE
  profiles_sin_empresa integer;
  agentes_sin_empresa integer;
BEGIN
  SELECT COUNT(*) INTO profiles_sin_empresa FROM public.profiles WHERE empresa_id IS NULL;
  SELECT COUNT(*) INTO agentes_sin_empresa FROM public.agente WHERE empresa_id IS NULL;
  
  RAISE NOTICE '=== RESULTADO DE MIGRACIÓN ===';
  RAISE NOTICE 'Profiles sin empresa: %', profiles_sin_empresa;
  RAISE NOTICE 'Agentes sin empresa: %', agentes_sin_empresa;
  
  IF profiles_sin_empresa > 0 OR agentes_sin_empresa > 0 THEN
    RAISE WARNING 'Aún hay registros sin empresa_id. Revise manualmente.';
  ELSE
    RAISE NOTICE '✓ Migración completada exitosamente. Todos los registros tienen empresa_id.';
  END IF;
END $$;