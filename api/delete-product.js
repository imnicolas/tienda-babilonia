// Vercel Serverless Function: Delete Product
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
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Obtener publicId de la query string
    const { publicId } = req.query;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: 'publicId es requerido',
      });
    }


    // Eliminar de Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Producto eliminado exitosamente',
        result: result,
      });
    } else {
      console.warn(`⚠️ No se pudo eliminar: ${publicId}`, result);
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado o ya eliminado',
        result: result,
      });
    }

  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al eliminar producto',
    });
  }
};
