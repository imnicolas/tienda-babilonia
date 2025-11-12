// Vercel Serverless Function: Get All Products
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'drigawwbd',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Categorías válidas (con prefijo Home/ según estructura de Cloudinary)
const VALID_CATEGORIES = [
  'Home/hombres', 
  'Home/mujeres', 
  'Home/ninos', 
  'Home/deportivos', 
  'Home/miscelanea'
];

// Mapeo de nombres cortos a rutas completas
const CATEGORY_PATHS = {
  'hombres': 'Home/hombres',
  'mujeres': 'Home/mujeres',
  'ninos': 'Home/ninos',
  'deportivos': 'Home/deportivos',
  'miscelanea': 'Home/miscelanea'
};

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
    // Obtener parámetro de categoría si existe
    const { category } = req.query;
    
    if (category) {
    }

    // Si se especifica categoría, convertir a ruta completa de Cloudinary
    let prefix = '';
    if (category && CATEGORY_PATHS[category]) {
      prefix = `${CATEGORY_PATHS[category]}/`;
    } else if (!category) {
      // Sin categoría, buscar en toda la carpeta Home
      prefix = 'Home/';
    }


    // Obtener recursos con el prefix o folder específico
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: prefix,
      max_results: 500,
      resource_type: 'image',
    });


    // Filtrar y parsear productos
    const products = result.resources
      .filter(resource => {
        // Extraer el slug sin Home y categoría (formato: Home/categoria/titulo-precio)
        const parts = resource.public_id.split('/');
        if (parts.length < 3) return false; // Debe tener al menos: Home/categoria/producto
        
        // Si hay categoría seleccionada, validar que el recurso pertenezca a esa categoría
        if (category && CATEGORY_PATHS[category]) {
          const resourceCategory = `${parts[0]}/${parts[1]}`; // ej: "Home/hombres"
          const expectedCategory = CATEGORY_PATHS[category]; // ej: "Home/miscelanea"
          if (resourceCategory !== expectedCategory) {
            return false;
          }
        }
        
        const slug = parts[parts.length - 1]; // Último segmento es el producto
        const slugParts = slug.split('-');
        const lastPart = slugParts[slugParts.length - 1];
        return /^\d+$/.test(lastPart); // Último segmento debe ser numérico
      })
      .map(resource => {
        const publicId = resource.public_id;
        
        // Parsear categoría y título (formato: Home/categoria/titulo)
        const parts = publicId.split('/');
        let category = 'miscelanea';
        let slug = publicId;
        
        // Estructura esperada: Home/categoria/titulo
        if (parts.length >= 3 && parts[0] === 'Home') {
          const categoryPath = parts[1]; // ej: "hombres"
          category = categoryPath; // Usar solo el nombre de la categoría
          slug = parts[parts.length - 1]; // Último segmento es el producto
        } else if (parts.length === 2) {
          // Formato legacy: categoria/titulo
          category = parts[0].replace('Home/', '');
          slug = parts[1];
        }
        
        // DESHABILITADO: Parsing de precio del slug
        // const slugParts = slug.split('-');
        // const priceInCents = parseInt(slugParts[slugParts.length - 1], 10);
        // const price = priceInCents / 100;
        // const titleParts = slugParts.slice(0, -1);
        
        // Extraer título (todo el slug)
        const slugParts = slug.split('-');
        const title = slugParts
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return {
          id: publicId,
          title: title, // Solo el título parseado, NO el public_id
          description: `${title} - Producto de calidad`,
          price: 0, // TODO: Precio deshabilitado temporalmente
          image: publicId,
          category: category,
          createdAt: resource.created_at,
          url: resource.secure_url,
          width: resource.width,
          height: resource.height,
          format: resource.format,
        };
      });

    res.status(200).json({
      success: true,
      count: products.length,
      products: products,
      ...(category && { category }), // Incluir categoría filtrada en respuesta
    });

  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener productos',
    });
  }
};
