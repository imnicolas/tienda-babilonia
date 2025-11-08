// Vercel Serverless Function: Invalidate Cache
// Nota: En Vercel, cada function es stateless, así que esto es más simbólico
// El verdadero caché está en el backend local durante desarrollo

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // En Vercel, las serverless functions son stateless
    // Este endpoint existe principalmente para compatibilidad con desarrollo local
    console.log('🔄 Cache invalidation request received');
    
    res.status(200).json({
      success: true,
      message: 'Cache invalidation acknowledged (Vercel functions are stateless)',
      timestamp: new Date().toISOString(),
      note: 'Vercel serverless functions do not maintain state between invocations',
    });
  } catch (error) {
    console.error('❌ Error in cache invalidation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error invalidating cache',
    });
  }
};
