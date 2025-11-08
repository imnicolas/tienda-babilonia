# 🔄 Sincronización con Cloudinary

## 📋 Resumen

Este documento explica cómo funciona el sistema de sincronización entre Cloudinary (fuente de verdad) y localStorage (caché local) para los productos de la tienda.

## 🎯 Objetivo

**Cloudinary es la fuente de verdad, localStorage es el caché**

- ✅ Al iniciar la aplicación, consultar todas las imágenes desde Cloudinary
- ✅ Poblar localStorage con los productos obtenidos de Cloudinary
- ✅ Usar localStorage solo como caché para mejorar el rendimiento
- ✅ Sincronizar periódicamente con Cloudinary

## 🔧 Función Principal: `getAllImages()`

### Ubicación
`src/services/cloudinaryUpload.ts`

### Código
```typescript
export async function getAllImages(): Promise<ProductData[]> {
  try {
    console.log('🔍 Consultando imágenes desde Cloudinary...');
    
    // Construir la URL para listar imágenes
    const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${UPLOAD_PRESET}.json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('⚠️ No se pudo acceder a Cloudinary API, usando cache local');
      return getProducts();
    }

    const data = await response.json();
    console.log('✅ Imágenes obtenidas de Cloudinary:', data.resources?.length || 0);
    
    // Convertir las imágenes de Cloudinary a ProductData
    const products: ProductData[] = [];
    
    if (data.resources && Array.isArray(data.resources)) {
      for (const resource of data.resources) {
        const publicId = resource.public_id;
        
        // Parsear título y precio del public_id
        const parsed = parseProductId(publicId);
        
        if (parsed) {
          products.push({
            id: publicId,
            title: parsed.title,
            description: `${parsed.title} - Producto de calidad`,
            price: parsed.price,
            image: publicId,
            createdAt: resource.created_at || new Date().toISOString(),
          });
        }
      }
    }
    
    // Sincronizar con localStorage (usar Cloudinary como fuente de verdad)
    localStorage.setItem('babilonia-products', JSON.stringify(products));
    console.log('💾 localStorage actualizado con', products.length, 'productos');
    
    return products;
  } catch (error) {
    console.error('❌ Error obteniendo imágenes de Cloudinary:', error);
    console.log('📦 Usando cache local como fallback');
    return getProducts();
  }
}
```

### ¿Qué hace?

1. **Consulta Cloudinary**: Obtiene la lista de imágenes con el tag/prefix del preset
2. **Parsea Public IDs**: Extrae título y precio de cada public_id (formato: `titulo-precio`)
3. **Crea objetos Product**: Convierte cada imagen en un objeto ProductData
4. **Sincroniza localStorage**: Guarda todos los productos en localStorage (caché)
5. **Fallback**: Si falla la consulta, usa el caché local existente

## 🔄 Flujo de Sincronización

### Al Iniciar la Aplicación

```
Usuario abre la web
        ↓
FeaturedProducts.useEffect()
        ↓
getAllImages() - Consulta Cloudinary API
        ↓
Obtiene lista de imágenes con sus Public IDs
        ↓
Parsea cada Public ID (titulo-precio-9999)
        ↓
Convierte a ProductData[]
        ↓
Actualiza localStorage
        ↓
Renderiza Cards de productos
```

### Cuando se Crea un Producto

```
Usuario llena formulario en /argdev
        ↓
ProductUploader.handleSubmit()
        ↓
1. Genera slug: generateProductSlug(titulo, precio)
        ↓
2. Sube imagen a Cloudinary con ese Public ID
        ↓
3. Guarda producto en localStorage
        ↓
4. Llama a getAllImages() para sincronizar
        ↓
5. Actualiza localStorage con datos frescos
        ↓
Productos sincronizados ✅
```

## 📍 Implementación en Componentes

### FeaturedProducts.tsx

```typescript
useEffect(() => {
  const loadProducts = async () => {
    console.log('🔄 Iniciando carga de productos...');
    
    // 1. PRIMERO: Consultar Cloudinary
    const cloudinaryProducts = await getAllImages();
    
    // 2. Convertir a formato Product
    const converted = cloudinaryProducts.map(convertToProduct);
    setProducts(converted);
    
    console.log('✅ Productos cargados:', converted.length);
  };

  // Ejecutar al montar el componente
  loadProducts();

  // Listener para cambios en localStorage
  window.addEventListener('storage', handleStorageChange);

  // Polling cada 5 segundos para mantener sincronizado
  const interval = setInterval(loadProducts, 5000);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    clearInterval(interval);
  };
}, []);
```

**Características:**
- ✅ Consulta Cloudinary al iniciar
- ✅ Sincroniza cada 5 segundos
- ✅ Escucha cambios en localStorage (para múltiples pestañas)
- ✅ Limpia listeners al desmontar

### ProductUploader.tsx

```typescript
// Después de subir la imagen
await uploadToCloudinary(selectedFile, slug);

// Guardar en localStorage
saveProduct(newProduct);

// 🔄 Sincronizar con Cloudinary
toast.loading('Sincronizando con Cloudinary...', { id: 'sync' });
await getAllImages();
toast.success('Producto sincronizado', { id: 'sync' });
```

**Características:**
- ✅ Sincroniza después de crear producto
- ✅ Muestra feedback al usuario
- ✅ Asegura que localStorage tenga datos frescos

## 🌐 Cloudinary List API

### Endpoint
```
https://res.cloudinary.com/{CLOUD_NAME}/image/list/{UPLOAD_PRESET}.json
```

### Ejemplo de Respuesta
```json
{
  "resources": [
    {
      "public_id": "zapatillas-nike-14999",
      "format": "jpg",
      "version": 1699123456,
      "resource_type": "image",
      "type": "upload",
      "created_at": "2024-11-01T10:30:00Z",
      "bytes": 150000,
      "width": 800,
      "height": 600,
      "url": "http://res.cloudinary.com/.../zapatillas-nike-14999.jpg",
      "secure_url": "https://res.cloudinary.com/.../zapatillas-nike-14999.jpg"
    },
    // ... más recursos
  ]
}
```

### Ventajas de este Endpoint

✅ **Público**: No requiere autenticación  
✅ **Filtrado**: Solo devuelve imágenes con el upload_preset especificado  
✅ **Información completa**: Incluye metadatos como fecha de creación  
✅ **Sin CORS**: Accessible desde el navegador  

## 💾 localStorage como Caché

### Estructura en localStorage

**Key**: `babilonia-products`

**Value** (JSON):
```json
[
  {
    "id": "zapatillas-nike-14999",
    "title": "Zapatillas Nike",
    "description": "Zapatillas Nike - Producto de calidad",
    "price": 149.99,
    "image": "zapatillas-nike-14999",
    "createdAt": "2024-11-01T10:30:00Z"
  },
  // ... más productos
]
```

### Ventajas del Caché

- ⚡ **Rendimiento**: Acceso instantáneo sin esperar red
- 🔌 **Offline**: Funciona sin conexión (con datos previos)
- 💰 **Gratis**: No consume cuota de Cloudinary en cada vista
- 🎯 **Simple**: No requiere backend adicional

## 🔄 Frecuencia de Sincronización

### Actual
- **Al iniciar**: Inmediatamente al montar `FeaturedProducts`
- **Polling**: Cada 5 segundos mientras el componente está montado
- **Eventos**: Al crear/eliminar un producto
- **Storage events**: Cuando cambia localStorage (otras pestañas)

### Optimización Futura

Puedes ajustar la frecuencia según necesidad:

```typescript
// Sincronización menos frecuente (cada minuto)
const interval = setInterval(loadProducts, 60000);

// Sincronización más frecuente (cada segundo)
const interval = setInterval(loadProducts, 1000);

// Sin polling (solo al montar y en eventos)
// No crear el interval
```

## 🚨 Limitaciones Actuales

### 1. Endpoint List API

El endpoint `/image/list/{preset}.json` tiene limitaciones:

- ⚠️ Máximo 1000 imágenes por respuesta
- ⚠️ No soporta paginación desde el cliente
- ⚠️ Solo funciona con upload_preset configurado

**Solución para Producción**: Implementar backend con Admin API

### 2. Sin Paginación

Actualmente carga todas las imágenes de una vez.

**Impacto**:
- ✅ OK para <100 productos
- ⚠️ Lento para >500 productos
- ❌ No viable para >1000 productos

**Solución**: Implementar paginación con backend

### 3. Eliminación

`deleteFromCloudinary()` solo elimina de localStorage, no de Cloudinary.

**Solución**: Backend con API key/secret para eliminar de Cloudinary real

## 🎯 Mejoras Futuras (Backend)

### Admin API con Backend

```javascript
// Backend Express con Cloudinary SDK
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Listar todas las imágenes con paginación
app.get('/api/products', async (req, res) => {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'babilonia-products/',
    max_results: 100,
    next_cursor: req.query.cursor
  });
  
  res.json(result);
});

// Eliminar imagen de Cloudinary
app.delete('/api/products/:publicId', async (req, res) => {
  await cloudinary.uploader.destroy(req.params.publicId);
  res.json({ success: true });
});
```

### Base de Datos

Para escalar mejor, considera guardar productos en DB:

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  cloudinary_public_id VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

### Probar Sincronización

1. **Limpiar caché**:
```javascript
localStorage.removeItem('babilonia-products');
```

2. **Recargar página**: Debería consultar Cloudinary automáticamente

3. **Ver console logs**:
```
🔄 Iniciando carga de productos...
🔍 Consultando imágenes desde Cloudinary...
✅ Imágenes obtenidas de Cloudinary: 5
💾 localStorage actualizado con 5 productos
✅ Productos cargados: 5
```

### Probar Creación de Producto

1. Crear producto en `/argdev`
2. Ver toast "Sincronizando con Cloudinary..."
3. Verificar que aparece en home inmediatamente
4. Recargar página → Producto persiste (viene de Cloudinary)

### Probar Fallback

1. Desconectar internet
2. Recargar página
3. Debería usar caché local:
```
⚠️ No se pudo acceder a Cloudinary API, usando cache local
📦 Usando cache local como fallback
```

## 📊 Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────┐
│                    INICIO DE APLICACIÓN                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌───────────────────────────┐
        │  FeaturedProducts monta   │
        └────────────┬──────────────┘
                     │
                     ▼
        ┌───────────────────────────┐
        │  Llama getAllImages()     │
        └────────────┬──────────────┘
                     │
                     ▼
        ┌───────────────────────────────────┐
        │  Fetch Cloudinary List API        │
        │  /image/list/preset.json          │
        └────────────┬──────────────────────┘
                     │
           ┌─────────┴─────────┐
           │                   │
        ✅ OK              ❌ Error
           │                   │
           ▼                   ▼
  ┌─────────────────┐   ┌──────────────┐
  │ Parse resources │   │ getProducts()│
  │ (Public IDs)    │   │ (localStorage)│
  └────────┬────────┘   └──────┬───────┘
           │                   │
           └─────────┬─────────┘
                     │
                     ▼
        ┌───────────────────────────┐
        │  Update localStorage      │
        │  (Cloudinary = verdad)    │
        └────────────┬──────────────┘
                     │
                     ▼
        ┌───────────────────────────┐
        │  Renderizar Cards         │
        └────────────┬──────────────┘
                     │
                     ▼
        ┌───────────────────────────────┐
        │  Polling cada 5s              │
        │  (mantener sincronizado)      │
        └───────────────────────────────┘
```

## 📝 Conclusión

Este sistema asegura que:

1. ✅ **Cloudinary es la fuente de verdad** - Siempre consulta al inicio
2. ✅ **localStorage es solo caché** - Se actualiza desde Cloudinary
3. ✅ **Sincronización automática** - Polling cada 5 segundos
4. ✅ **Fallback inteligente** - Usa caché si Cloudinary falla
5. ✅ **Experiencia fluida** - Productos se cargan rápido desde caché
6. ✅ **Datos consistentes** - La verdad viene siempre de Cloudinary

**Próximo paso**: Implementar backend para Admin API y eliminación real de Cloudinary.
