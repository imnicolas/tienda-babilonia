// Vercel Serverless Function: Health Check
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'drigawwbd',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.status(200).json({
      success: true,
      message: 'Babilonia Calzados API funcionando correctamente',
      timestamp: new Date().toISOString(),
      cloudinary: {
        configured: !!(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
        cloud_name: cloudinary.config().cloud_name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error en health check',
    });
  }
};
