// Cloudflare Worker - CORS Proxy for FLL API
// Copy this entire code to your Cloudflare Worker

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin') || '*';
  
  // CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Only allow /api/ paths
  if (!url.pathname.startsWith('/api/')) {
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders
    });
  }

  // Forward to target API
  const targetUrl = 'https://o76fno8oxh.execute-api.eu-central-1.amazonaws.com' + url.pathname + url.search;
  
  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Accept': request.headers.get('Accept') || 'application/json, text/plain, */*',
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': request.headers.get('Content-Type') || 'application/json'
      },
      body: request.method !== 'GET' ? request.body : undefined
    });

    const responseBody = await response.text();
    
    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'text/plain'
      }
    });
  } catch (error) {
    return new Response('Proxy Error: ' + error.message, {
      status: 502,
      headers: corsHeaders
    });
  }
}
