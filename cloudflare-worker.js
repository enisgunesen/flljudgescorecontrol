// Cloudflare Worker - CORS Proxy for FLL API
// Deploy this to Cloudflare Workers (free tier: 100k requests/day)

const ALLOWED_ORIGINS = [
  'https://enisgunesen.github.io',
  'http://localhost',
  'http://127.0.0.1'
];

const TARGET_API = 'https://o76fno8oxh.execute-api.eu-central-1.amazonaws.com';

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    
    // Only allow requests to the FLL API path
    if (!url.pathname.startsWith('/api/')) {
      return new Response('Not Found', { status: 404 });
    }

    // Validate origin
    const isAllowedOrigin = ALLOWED_ORIGINS.some(allowed => 
      origin.startsWith(allowed) || origin === ''
    );
    
    if (!isAllowedOrigin) {
      return new Response('Forbidden', { status: 403 });
    }

    // Forward request to target API
    const targetUrl = TARGET_API + url.pathname + url.search;
    
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });

    try {
      const response = await fetch(modifiedRequest);
      
      // Clone response and add CORS headers
      const modifiedResponse = new Response(response.body, response);
      modifiedResponse.headers.set('Access-Control-Allow-Origin', origin || '*');
      modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
      
      return modifiedResponse;
    } catch (error) {
      return new Response('Proxy Error: ' + error.message, { status: 502 });
    }
  }
};

function handleOptions(request) {
  const origin = request.headers.get('Origin') || '*';
  
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept',
      'Access-Control-Max-Age': '86400'
    }
  });
}
