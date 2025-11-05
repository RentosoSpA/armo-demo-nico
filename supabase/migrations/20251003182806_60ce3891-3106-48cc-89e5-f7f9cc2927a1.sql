-- Eliminar política anterior que solo permitía authenticated
DROP POLICY IF EXISTS "Authenticated users can create company during signup" ON public.empresa;

-- Crear política que permita INSERT para public (incluye anon y authenticated)
CREATE POLICY "Public can create company during signup"
ON public.empresa
FOR INSERT
TO public
WITH CHECK (true);