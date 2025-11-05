import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { propertyData, ownerData, images } = await req.json();
    
    console.log('Creating property with data:', { propertyData, ownerData, imageCount: images?.length });

    // Validate required fields
    if (!propertyData || !ownerData || !images || images.length === 0) {
      throw new Error('Missing required data: propertyData, ownerData, or images');
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get empresa_id from authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error('Invalid authentication token');
    }

    // Get user's empresa_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('empresa_id')
      .eq('user_id', userData.user.id)
      .single();

    if (profileError || !profile?.empresa_id) {
      throw new Error('User does not have an associated empresa');
    }

    const empresaId = profile.empresa_id;

    // Step 1: Create or get propietario
    let propietarioId: string;
    
    const { data: existingOwner } = await supabase
      .from('propietario')
      .select('id')
      .eq('email', ownerData.email)
      .eq('empresa_id', empresaId)
      .single();

    if (existingOwner) {
      propietarioId = existingOwner.id;
      console.log('Using existing owner:', propietarioId);
    } else {
      const { data: newOwner, error: ownerError } = await supabase
        .from('propietario')
        .insert({
          nombre: ownerData.nombre,
          email: ownerData.email,
          telefono: ownerData.telefono,
          codigo_telefonico: ownerData.codigo_telefonico || 56,
          documento: ownerData.documento,
          tipo_documento: ownerData.tipo_documento || 'RUT',
          empresa_id: empresaId
        })
        .select('id')
        .single();

      if (ownerError) {
        console.error('Error creating owner:', ownerError);
        throw new Error(`Failed to create owner: ${ownerError.message}`);
      }

      propietarioId = newOwner.id;
      console.log('Created new owner:', propietarioId);
    }

    // Step 2: Create propiedad
    const { data: propiedad, error: propiedadError } = await supabase
      .from('propiedad')
      .insert({
        titulo: `${propertyData.tipo} en ${propertyData.comuna || propertyData.direccion}`,
        tipo: propertyData.tipo || 'Departamento',
        direccion: propertyData.direccion,
        comuna: propertyData.comuna || 'Por definir',
        region: propertyData.region || 'Metropolitana',
        habitaciones: propertyData.habitaciones || 0,
        banos: propertyData.banos || 0,
        area_total: propertyData.area_total || 0,
        precio_arriendo: propertyData.precio_arriendo || null,
        precio_venta: propertyData.precio_venta || null,
        arriendo: !!propertyData.precio_arriendo,
        venta: !!propertyData.precio_venta,
        estado: 'Disponible',
        propietario_id: propietarioId,
        empresa_id: empresaId,
        permite_mascotas: propertyData.amenidades?.permite_mascotas || false,
        visible: true
      })
      .select('id')
      .single();

    if (propiedadError) {
      console.error('Error creating property:', propiedadError);
      throw new Error(`Failed to create property: ${propiedadError.message}`);
    }

    console.log('Created property:', propiedad.id);

    // Step 3: Upload images and create records
    const uploadedImages = [];
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageData = image.data.split(',')[1]; // Remove data:image/xxx;base64, prefix
      const imageBytes = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
      
      const fileName = `${propiedad.id}/${Date.now()}_${i}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, imageBytes, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        continue; // Skip this image but continue with others
      }

      const { data: publicUrlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // Create image record
      const { error: imageRecordError } = await supabase
        .from('propiedad_imagenes')
        .insert({
          propiedad_id: propiedad.id,
          url: imageUrl,
          nombre_archivo: fileName,
          tipo_imagen: i === 0 ? 'principal' : 'adicional',
          orden: i + 1
        });

      if (imageRecordError) {
        console.error('Error creating image record:', imageRecordError);
      } else {
        uploadedImages.push(imageUrl);
      }
    }

    console.log('Uploaded images:', uploadedImages.length);

    // Step 4: Create amenidades if provided
    if (propertyData.amenidades && Object.keys(propertyData.amenidades).length > 0) {
      const { error: amenidadesError } = await supabase
        .from('amenidades')
        .insert({
          propiedad_id: propiedad.id,
          ...propertyData.amenidades
        });

      if (amenidadesError) {
        console.error('Error creating amenidades:', amenidadesError);
        // Don't throw, amenidades are optional
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        propertyId: propiedad.id,
        imagesUploaded: uploadedImages.length,
        message: 'Propiedad creada exitosamente'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Create property error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
