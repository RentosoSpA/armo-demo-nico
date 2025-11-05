-- Permitir a usuarios autenticados crear empresas durante el registro
CREATE POLICY "Authenticated users can create company during signup"
ON empresa
FOR INSERT
TO authenticated
WITH CHECK (true);