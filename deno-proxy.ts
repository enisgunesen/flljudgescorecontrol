// Deno Deploy - CORS Proxy for FLL API
// Deploy at: https://dash.deno.com → New Project → Playground → Paste this code → Save & Deploy

const TARGET_API = 'https://o76fno8oxh.execute-api.eu-central-1.amazonaws.com';

Deno.serve(async (request: Request) => {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || '*';

  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Only allow /api/ paths
  if (!url.pathname.startsWith('/api/')) {
    return new Response('Use /api/... path', { status: 404, headers: corsHeaders });
  }

  // Forward to target API
  const targetUrl = TARGET_API + url.pathname + url.search;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Accept': request.headers.get('Accept') || 'application/json, text/plain, */*',
        'Authorization': request.headers.get('Authorization') || '',
      },
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'text/plain',
      },
    });
  } catch (error) {
    return new Response('Proxy Error: ' + error.message, { status: 502, headers: corsHeaders });
  }
});
