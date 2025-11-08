// Vercel Serverless Function: Get All Products
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
    console.log('📋 Consultando productos desde Cloudinary...');

    // Obtener recursos con el prefix o folder específico
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: '', // Puedes cambiar esto si usas un folder específico
      max_results: 500,
      resource_type: 'image',
    });

    console.log(`✅ ${result.resources.length} imágenes encontradas en Cloudinary`);

    // Filtrar solo las que tengan el formato: titulo-precio
    const products = result.resources
      .filter(resource => {
        const parts = resource.public_id.split('-');
        const lastPart = parts[parts.length - 1];
        return /^\d+$/.test(lastPart); // Último segmento debe ser numérico
      })
      .map(resource => {
        const publicId = resource.public_id;
        
        // Parsear título y precio
        const parts = publicId.split('-');
        const priceInCents = parseInt(parts[parts.length - 1], 10);
        const price = priceInCents / 100;
        
        const titleParts = parts.slice(0, -1);
        const title = titleParts
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return {
          id: publicId,
          title: title,
          description: `${title} - Producto de calidad`,
          price: price,
          image: publicId,
          createdAt: resource.created_at,
          url: resource.secure_url,
          width: resource.width,
          height: resource.height,
          format: resource.format,
        };
      });

    console.log(`📦 ${products.length} productos parseados correctamente`);

    res.status(200).json({
      success: true,
      count: products.length,
      products: products,
    });

  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener productos',
    });
  }
};
