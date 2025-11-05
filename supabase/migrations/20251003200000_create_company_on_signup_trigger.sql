-- Actualizar trigger para crear empresa automáticamente cuando se registra un nuevo usuario
-- Esto reemplaza la lógica manual del frontend

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_empresa_id uuid;
  v_company_name text;
BEGIN
  -- Obtener el nombre de la empresa del metadata
  v_company_name := NEW.raw_user_meta_data ->> 'company_name';

  -- Si hay company_name en metadata, crear la empresa automáticamente
  IF v_company_name IS NOT NULL THEN
    -- Crear empresa
    INSERT INTO public.empresa (
      nombre,
      nit,
      email,
      telefono,
      codigo_telefonico,
      direccion,
      sobre_nosotros,
      mision,
      vision,
      activo
    )
    VALUES (
      v_company_name,
      COALESCE(NEW.raw_user_meta_data ->> 'nit', ''),
      NEW.email,
      COALESCE((NEW.raw_user_meta_data ->> 'telefono')::integer, 0),
      COALESCE((NEW.raw_user_meta_data ->> 'codigo_telefonico')::integer, 56),
      COALESCE(NEW.raw_user_meta_data ->> 'direccion', ''),
      COALESCE(NEW.raw_user_meta_data ->> 'sobre_nosotros', ''),
      COALESCE(NEW.raw_user_meta_data ->> 'mision', ''),
      COALESCE(NEW.raw_user_meta_data ->> 'vision', ''),
      true
    )
    RETURNING id INTO v_empresa_id;
  ELSE
    -- Si no hay company_name, usar empresa_id del metadata si existe
    v_empresa_id := (NEW.raw_user_meta_data ->> 'empresa_id')::uuid;
  END IF;

  -- Crear perfil del usuario
  INSERT INTO public.profiles (
    user_id,
    full_name,
    company_name,
    phone,
    empresa_id
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    v_empresa_id
  );

  -- Si hay empresa_id (creado o existente), crear registro de agente
  IF v_empresa_id IS NOT NULL THEN
    INSERT INTO public.agente (
      user_uid,
      empresa_id,
      nombre,
      email,
      telefono,
      codigo_telefonico,
      activo
    )
    VALUES (
      NEW.id,
      v_empresa_id,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Agente'),
      NEW.email,
      COALESCE((NEW.raw_user_meta_data ->> 'telefono')::integer, 0),
      COALESCE((NEW.raw_user_meta_data ->> 'codigo_telefonico')::integer, 56),
      true
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Recrear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
