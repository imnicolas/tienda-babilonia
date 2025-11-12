const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 5000;

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

// Middleware
app.use(cors());
app.use(express.json());

// ======================================
// 🗄️ CACHE SIMPLE PARA REDUCIR LLAMADAS A CLOUDINARY
// ======================================
let productsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos (no hay polling, solo on-demand)

function isCacheValid() {
  return productsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION);
}

// ======================================
// 📋 GET /api/products - Listar todos los productos
// ======================================
app.get('/api/products', async (req, res) => {
  try {
    // Obtener parámetro de categoría si existe
    const { category } = req.query;
    
    // Si el caché es válido Y no hay filtro de categoría, devolver productos en caché
    if (isCacheValid() && !category) {
      return res.json({
        success: true,
        count: productsCache.length,
        products: productsCache,
        cached: true,
      });
    }

    if (category) {
      console.log(`🏷️ Filtrando por categoría: ${category}`);
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
            console.log(`🚫 Rechazando ${resource.public_id} - esperaba ${expectedCategory}, obtuvo ${resourceCategory}`);
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
        
        // Parsear categoría, título y precio (formato: Home/categoria/titulo-precio)
        const parts = publicId.split('/');
        let category = 'miscelanea';
        let slug = publicId;
        
        // Estructura esperada: Home/categoria/titulo-precio
        if (parts.length >= 3 && parts[0] === 'Home') {
          const categoryPath = parts[1]; // ej: "hombres"
          category = categoryPath; // Usar solo el nombre de la categoría
          slug = parts[parts.length - 1]; // Último segmento es el producto
        } else if (parts.length === 2) {
          // Formato legacy: categoria/titulo-precio
          category = parts[0].replace('Home/', '');
          slug = parts[1];
        }
        
        const slugParts = slug.split('-');
        const priceInCents = parseInt(slugParts[slugParts.length - 1], 10);
        const price = priceInCents / 100;
        
        const titleParts = slugParts.slice(0, -1);
        const title = titleParts
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return {
          id: publicId,
          title: title, // Solo el título parseado, NO el public_id
          description: `${title} - Producto de calidad`,
          price: price,
          image: publicId,
          category: category,
          createdAt: resource.created_at,
          url: resource.secure_url,
          width: resource.width,
          height: resource.height,
          format: resource.format,
        };
      });

    
    // Log de debug: mostrar qué productos se están retornando
    if (category) {
      console.log(`🔍 Productos filtrados para categoría "${category}":`);
      products.forEach(p => {
        console.log(`  - ${p.id} (categoria: ${p.category})`);
      });
    }

    // Actualizar caché solo si no hay filtro
    if (!category) {
      productsCache = products;
      cacheTimestamp = Date.now();
    }

    res.json({
      success: true,
      count: products.length,
      products: products,
      ...(category && { category }), // Incluir categoría filtrada en respuesta
      cached: false,
    });

  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al obtener productos',
    });
  }
});

// ======================================
// 🗑️ DELETE /api/delete-product - Eliminar producto (con query parameter)
// ======================================
app.delete('/api/delete-product', async (req, res) => {
  try {
    const { publicId } = req.query;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: 'publicId es requerido',
      });
    }

    console.log(`🗑️ Intentando eliminar: ${publicId}`);

    // Eliminar de Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      console.log(`✅ Producto eliminado: ${publicId}`);
      
      // Invalidar caché
      productsCache = null;
      cacheTimestamp = null;
      
      res.json({
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
});

// ======================================
// 🗑️ DELETE /api/products/:publicId - Eliminar producto (ruta legacy)
// ======================================
app.delete('/api/products/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;

    // Eliminar de Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      console.log(`✅ Producto eliminado: ${publicId}`);
      
      // Invalidar caché
      productsCache = null;
      cacheTimestamp = null;
      
      res.json({
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
});

// ======================================
// 🔍 GET /api/products/:publicId - Obtener un producto específico
// ======================================
app.get('/api/products/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    console.log(`🔍 Buscando producto: ${publicId}`);

    const result = await cloudinary.api.resource(publicId);

    // Parsear título y precio del public_id
    const parts = publicId.split('-');
    const priceInCents = parseInt(parts[parts.length - 1], 10);
    const price = priceInCents / 100;
    
    const titleParts = parts.slice(0, -1);
    const title = titleParts
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const product = {
      id: publicId,
      title: title,
      description: `${title} - Producto de calidad`,
      price: price,
      image: publicId,
      createdAt: result.created_at,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    };

    res.json({
      success: true,
      product: product,
    });

  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    res.status(404).json({
      success: false,
      error: 'Producto no encontrado',
    });
  }
});

// ======================================
// ❤️ Health Check
// ======================================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Babilonia Calzados API funcionando correctamente',
    timestamp: new Date().toISOString(),
    cloudinary: {
      configured: !!(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
      cloud_name: cloudinary.config().cloud_name,
    },
    cache: {
      active: !!productsCache,
      age: cacheTimestamp ? Math.floor((Date.now() - cacheTimestamp) / 1000) : null,
      expiresIn: cacheTimestamp ? Math.max(0, Math.floor((CACHE_DURATION - (Date.now() - cacheTimestamp)) / 1000)) : null,
    },
  });
});

// ======================================
// 🔄 POST /api/cache/invalidate - Invalidar caché manualmente
// ======================================
app.post('/api/cache/invalidate', (req, res) => {
  productsCache = null;
  cacheTimestamp = null;
  
  res.json({
    success: true,
    message: 'Caché invalidado exitosamente',
    timestamp: new Date().toISOString(),
  });
});

// ======================================
// Iniciar servidor
// ======================================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Babilonia Calzados API Server                   ║
║                                                       ║
║   📡 Port: ${PORT}                                     ║
║   🌐 URL: http://localhost:${PORT}                     ║
║   ☁️  Cloudinary: ${cloudinary.config().cloud_name || 'Not configured'}                          ║
║                                                       ║
║   Endpoints disponibles:                             ║
║   • GET    /api/health                               ║
║   • GET    /api/products                             ║
║   • GET    /api/products/:publicId                   ║
║   • DELETE /api/delete-product?publicId=...          ║
║   • POST   /api/cache/invalidate                     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);

  // Verificar configuración de Cloudinary
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn(`
⚠️  ADVERTENCIA: Cloudinary no está completamente configurado
    Por favor, crea un archivo .env con:
    
    CLOUDINARY_CLOUD_NAME=drigawwbd
    CLOUDINARY_API_KEY=tu_api_key
    CLOUDINARY_API_SECRET=tu_api_secret
    `);
  }
});

module.exports = app;
