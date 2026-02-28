export default async function handler(req, res) {
  const origin = req.headers.origin || '*';

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Get the target path from query parameter
  const targetPath = req.query.path;
  if (!targetPath) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  const targetUrl = `https://o76fno8oxh.execute-api.eu-central-1.amazonaws.com/api/${targetPath}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Accept': req.headers.accept || 'application/json, text/plain, */*',
        'Authorization': req.headers.authorization || '',
      },
    });

    const data = await response.text();
    const contentType = response.headers.get('Content-Type') || 'text/plain';
    res.setHeader('Content-Type', contentType);
    return res.status(response.status).send(data);
  } catch (error) {
    return res.status(502).json({ error: 'Proxy Error: ' + error.message });
  }
}
