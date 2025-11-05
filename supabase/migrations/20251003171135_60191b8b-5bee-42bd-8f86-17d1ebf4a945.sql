-- Actualizar trigger handle_new_user para crear también registro en tabla agente
-- cuando se registra un nuevo usuario

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
BEGIN
  -- Crear perfil básico del usuario
  INSERT INTO public.profiles (user_id, full_name, company_name, phone, empresa_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'company_name', NULL),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    COALESCE((NEW.raw_user_meta_data ->> 'empresa_id')::uuid, NULL)
  )
  RETURNING empresa_id INTO v_empresa_id;

  -- Si hay empresa_id en metadata, crear registro de agente
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