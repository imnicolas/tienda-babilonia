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

// Middleware
app.use(cors());
app.use(express.json());

// ======================================
// 🗄️ CACHE SIMPLE PARA REDUCIR LLAMADAS A CLOUDINARY
// ======================================
let productsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 1000; // 60 segundos

function isCacheValid() {
  return productsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION);
}

// ======================================
// 📋 GET /api/products - Listar todos los productos
// ======================================
app.get('/api/products', async (req, res) => {
  try {
    // Si el caché es válido, devolver productos en caché
    if (isCacheValid()) {
      console.log('✨ Devolviendo productos desde caché');
      return res.json({
        success: true,
        count: productsCache.length,
        products: productsCache,
        cached: true,
      });
    }

    console.log('📋 Consultando productos desde Cloudinary...');

    // Obtener recursos con el prefix o folder específico
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: '', // Puedes cambiar esto si usas un folder específico
      max_results: 500, // Máximo por request
      resource_type: 'image',
    });

    console.log(`✅ ${result.resources.length} imágenes encontradas en Cloudinary`);

    // Filtrar solo las que tengan el formato: titulo-precio
    const products = result.resources
      .filter(resource => {
        // Verificar que el public_id tenga el formato correcto
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

    // Actualizar caché
    productsCache = products;
    cacheTimestamp = Date.now();

    res.json({
      success: true,
      count: products.length,
      products: products,
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
// 🗑️ DELETE /api/products/:publicId - Eliminar producto
// ======================================
app.delete('/api/products/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    console.log(`🗑️ Eliminando producto: ${publicId}`);

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
║   • DELETE /api/products/:publicId                   ║
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
