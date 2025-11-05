import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Resend } from 'npm:resend@2.0.0';
import { corsHeaders } from '../_shared/cors.ts';
import { validateInvitationRequest } from './_lib/validation.ts';
import { checkRateLimit } from './_lib/rate-limiter.ts';
import { generateEmailTemplate } from './_lib/email-template.ts';

// Validate required environment variables on startup
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Log configuration status (without exposing secrets)
console.log('🔧 Configuration check:');
console.log('  RESEND_API_KEY:', RESEND_API_KEY ? '✅ Configured' : '❌ Missing');
console.log('  SUPABASE_URL:', supabaseUrl ? '✅ Configured' : '❌ Missing');
console.log('  SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Configured' : '❌ Missing');

if (!RESEND_API_KEY) {
  console.error('❌ CRITICAL: RESEND_API_KEY is not configured. Email sending will fail.');
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check endpoint (no auth required)
  if (req.method === 'GET') {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      config: {
        resend: !!RESEND_API_KEY,
        supabase_url: !!supabaseUrl,
        supabase_key: !!supabaseServiceKey,
      }
    };
    console.log('🏥 Health check:', healthStatus);
    return new Response(JSON.stringify(healthStatus), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Main handler wrapped in try-catch to ALWAYS return a response
  try {
    console.log('📨 Invitation request received');

    // Check if Resend is configured
    if (!resend || !RESEND_API_KEY) {
      console.error('❌ Resend API key not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Servicio de email no configurado',
          details: 'La API key de Resend no está configurada. Por favor contacta al administrador del sistema.',
          code: 'RESEND_NOT_CONFIGURED'
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate Supabase configuration
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Supabase configuration incomplete');
      return new Response(
        JSON.stringify({ 
          error: 'Configuración incompleta',
          details: 'La configuración de Supabase no está completa.',
          code: 'SUPABASE_NOT_CONFIGURED'
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate Authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      console.error('❌ No Authorization header provided');
      return new Response(
        JSON.stringify({ 
          error: 'No se proporcionó token de autenticación',
          details: 'El header de Authorization es requerido.',
          code: 'AUTH_HEADER_MISSING'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔑 Authorization header present');

    // Create Supabase client with service role key for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the user's JWT token manually - WRAPPED IN TRY-CATCH
    let user;
    try {
      const token = authHeader.replace('Bearer ', '');
      const { data: userData, error: authError } = await supabase.auth.getUser(token);

      if (authError || !userData?.user) {
        console.error('❌ Authentication failed:', authError?.message || 'Invalid token');
        
        // Check if token is expired
        if (authError?.message?.includes('expired')) {
          return new Response(
            JSON.stringify({ 
              error: 'Tu sesión ha expirado',
              details: 'Por favor recarga la página e inicia sesión nuevamente.',
              code: 'SESSION_EXPIRED'
            }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            error: 'Token de autenticación inválido',
            details: authError?.message || 'No se pudo verificar la identidad del usuario.',
            code: 'AUTH_INVALID'
          }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      user = userData.user;
      console.log('✅ User authenticated:', user.email);
    } catch (authException) {
      console.error('❌ Exception during authentication:', authException);
      return new Response(
        JSON.stringify({ 
          error: 'Error al verificar autenticación',
          details: authException.message || 'Error interno al verificar token',
          code: 'AUTH_EXCEPTION'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
      console.log('📦 Request body parsed:', { email: body.email, rol: body.rol });
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Datos de invitación inválidos',
          details: 'No se pudo procesar el cuerpo de la petición',
          code: 'INVALID_JSON'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validation = validateInvitationRequest(body);
    
    if (!validation.success) {
      console.error('❌ Validation error:', validation.error);
      return new Response(
        JSON.stringify({ error: 'Datos de invitación inválidos', details: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, rol: role, empresaId } = validation.data;

    // Check if user is admin
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role, empresa_id')
      .eq('user_id', user.id)
      .eq('empresa_id', empresaId)
      .single();

    if (rolesError || !userRoles || userRoles.role !== 'admin') {
      console.error('❌ User is not admin:', user.id, rolesError);
      return new Response(
        JSON.stringify({ error: 'Solo administradores pueden enviar invitaciones' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    const rateLimitOk = await checkRateLimit(supabase, user.id, empresaId);
    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ error: 'Límite de invitaciones alcanzado. Intenta más tarde.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get company information
    const { data: empresa, error: empresaError } = await supabase
      .from('empresa')
      .select('*')
      .eq('id', empresaId)
      .single();

    if (empresaError || !empresa) {
      console.error('❌ Company not found:', empresaError);
      return new Response(
        JSON.stringify({ error: 'Empresa no encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check for existing pending invitation
    const { data: existingInvitation } = await supabase
      .from('user_invitations')
      .select('id')
      .eq('email', email)
      .eq('empresa_id', empresaId)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      return new Response(
        JSON.stringify({ error: 'Ya existe una invitación pendiente para este email' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique token
    const token = crypto.randomUUID() + '-' + Date.now();

    // Create invitation record
    const { data: invitation, error: invitationError } = await supabase
      .from('user_invitations')
      .insert({
        email,
        role,
        token,
        empresa_id: empresaId,
        invited_by: user.id,
        status: 'pending',
      })
      .select()
      .single();

    if (invitationError) {
      console.error('❌ Failed to create invitation:', invitationError);
      return new Response(
        JSON.stringify({ error: 'Error al crear la invitación' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate invitation link
    const origin = req.headers.get('origin') || 'https://your-app.com';
    const invitationLink = `${origin}/aceptar-invitacion?token=${token}`;

    // Generate email HTML
    const emailHtml = generateEmailTemplate({
      companyName: empresa.nombre,
      invitationLink,
      role,
      expiresInDays: 7,
    });

    // Send email via Resend
    console.log('📧 Sending email to:', email);
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'RentOso <onboarding@resend.dev>',
      to: [email],
      subject: `Invitación a ${empresa.nombre} en RentOso`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('❌ Failed to send email:', emailError);
      
      // Update invitation with error
      await supabase
        .from('user_invitations')
        .update({ 
          metadata: { email_error: emailError.message },
          status: 'cancelled'
        })
        .eq('id', invitation.id);

      return new Response(
        JSON.stringify({ 
          error: 'Error al enviar el correo electrónico',
          details: emailError.message,
          code: 'EMAIL_SEND_FAILED'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Email sent successfully:', emailData?.id);

    // Update invitation with sent_at timestamp
    await supabase
      .from('user_invitations')
      .update({ sent_at: new Date().toISOString() })
      .eq('id', invitation.id);

    console.log('✅ Invitation sent successfully:', { email, role, invitationId: invitation.id });

    return new Response(
      JSON.stringify({
        success: true,
        invitationId: invitation.id,
        invitationLink,
        message: 'Invitación enviada exitosamente',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('❌ CRITICAL: Unexpected error in main handler:', error);
    console.error('Stack trace:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: 'Error interno del servidor', 
        details: error.message || 'Error desconocido',
        code: 'INTERNAL_ERROR'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
