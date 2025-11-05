import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    console.log('Received audio data, length:', audio.length);

    // Decode base64 audio to binary
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    console.log('Binary audio size:', binaryAudio.length, 'bytes');

    // Prepare multipart form data
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36);
    const formDataParts: Uint8Array[] = [];

    // Add audio file part
    const fileHeader = new TextEncoder().encode(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="audio"; filename="audio.wav"\r\n` +
      `Content-Type: audio/wav\r\n\r\n`
    );
    formDataParts.push(fileHeader);
    formDataParts.push(binaryAudio);
    formDataParts.push(new TextEncoder().encode('\r\n'));

    // Add config part
    const configHeader = new TextEncoder().encode(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="config"\r\n` +
      `Content-Type: application/json\r\n\r\n`
    );
    const configData = new TextEncoder().encode(JSON.stringify({
      encoding: 'LINEAR16',
      sampleRateHertz: 48000,
      languageCode: 'es-ES',
      enableAutomaticPunctuation: true
    }));
    formDataParts.push(configHeader);
    formDataParts.push(configData);
    formDataParts.push(new TextEncoder().encode('\r\n'));

    // Add closing boundary
    formDataParts.push(new TextEncoder().encode(`--${boundary}--\r\n`));

    // Combine all parts
    const totalLength = formDataParts.reduce((acc, part) => acc + part.length, 0);
    const formData = new Uint8Array(totalLength);
    let offset = 0;
    for (const part of formDataParts) {
      formData.set(part, offset);
      offset += part.length;
    }

    const apiKey = Deno.env.get('GOOGLE_STT_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_STT_API_KEY not configured');
    }

    console.log('Sending to Google STT API...');

    // Call Google Speech-to-Text API
    const response = await fetch(
      'https://speech.googleapis.com/v1/speech:recognize?key=' + apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google STT API error:', response.status, errorText);
      throw new Error(`Google STT API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Google STT response:', JSON.stringify(result));

    const transcript = result.results?.[0]?.alternatives?.[0]?.transcript || '';
    
    if (!transcript) {
      throw new Error('No transcript generated');
    }

    console.log('Transcription successful:', transcript);

    return new Response(
      JSON.stringify({ text: transcript }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
