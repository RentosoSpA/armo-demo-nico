-- ========================================================================
-- FASE 1: Sistema de Links de Invitación
-- ========================================================================

-- 1. Crear tabla invitation_links
CREATE TABLE invitation_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresa(id) ON DELETE CASCADE NOT NULL,
  token text UNIQUE NOT NULL,
  role app_role NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  max_uses integer DEFAULT NULL,
  current_uses integer DEFAULT 0,
  expires_at timestamptz DEFAULT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_uses CHECK (max_uses IS NULL OR current_uses <= max_uses)
);

-- 2. Crear índices para mejor performance
CREATE INDEX idx_invitation_links_empresa ON invitation_links(empresa_id);
CREATE INDEX idx_invitation_links_token ON invitation_links(token);
CREATE INDEX idx_invitation_links_active ON invitation_links(is_active) WHERE is_active = true;

-- 3. Habilitar RLS
ALTER TABLE invitation_links ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS para admins de la empresa
CREATE POLICY "Admins can view invitation links for their company"
ON invitation_links FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id IN (
    SELECT empresa_id FROM user_roles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can create invitation links for their company"
ON invitation_links FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id IN (
    SELECT empresa_id FROM user_roles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update invitation links for their company"
ON invitation_links FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id IN (
    SELECT empresa_id FROM user_roles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can delete invitation links for their company"
ON invitation_links FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND empresa_id IN (
    SELECT empresa_id FROM user_roles WHERE user_id = auth.uid()
  )
);

-- 5. Política para acceso público (verificación de tokens)
CREATE POLICY "Public can verify active invitation links"
ON invitation_links FOR SELECT
TO anon
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- 6. Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_invitation_links_updated_at
BEFORE UPDATE ON invitation_links
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Función para incrementar el contador de usos de forma atómica
CREATE OR REPLACE FUNCTION increment_link_usage(link_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE invitation_links
  SET current_uses = current_uses + 1
  WHERE id = link_id;
END;
$$;