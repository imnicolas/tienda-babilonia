# Sistema de Upload de Productos - Babilonia Calzados

## 📋 Descripción General

Sistema completo para que el dueño de la tienda pueda subir productos nuevos desde la web, con integración automática a Cloudinary y visualización en el home.

---

## 🎯 Funcionalidades Implementadas

### 1. **Panel de Administración** (`/argdev`)
- ✅ Formulario completo para agregar productos
- ✅ Upload de imágenes con preview
- ✅ Validaciones de formulario
- ✅ Feedback visual con toasts
- ✅ Redirección automática al home después de crear

### 2. **Upload a Cloudinary**
- ✅ Integración con API de Cloudinary
- ✅ Generación automática de Public IDs (slugs)
- ✅ Validación de tipo y tamaño de imagen (máx 5MB)
- ✅ Manejo de errores robusto

### 3. **Persistencia de Datos**
- ✅ Almacenamiento en localStorage
- ✅ Sincronización automática entre pestañas
- ✅ Combinación de productos estáticos + dinámicos

### 4. **Visualización en Home**
- ✅ Cards de productos con imágenes de Cloudinary
- ✅ Actualización automática al agregar productos
- ✅ Integración con sistema de carrito existente

---

## 🏗️ Arquitectura del Sistema

```
src/
├── services/
│   └── cloudinaryUpload.ts      # Servicio de upload y gestión de productos
├── components/
│   ├── ProductUploader.tsx       # Panel de administración (/argdev)
│   └── FeaturedProducts.tsx      # Grid de productos (actualizado)
└── App.tsx                       # Router con rutas
```

---

## 📝 Estructura de Datos

### ProductData (localStorage)
```typescript
interface ProductData {
  id: string;              // Timestamp
  title: string;           // "Zapatillas Nike Air Max"
  description: string;     // Descripción del producto
  price: number;           // 129.99
  image: string;           // Public ID: "zapatillas-nike-air-max"
  createdAt: string;       // ISO timestamp
}
```

### Product (CarritoContext)
```typescript
interface Product {
  id: number;              // ID numérico
  name: string;            // Nombre del producto
  price: number;           // Precio
  image: string;           // Public ID de Cloudinary
  category: string;        // Categoría
}
```

---

## 🔧 Configuración Requerida en Cloudinary

### ⚠️ IMPORTANTE: Crear Upload Preset

Antes de usar el sistema, debes configurar un **Upload Preset** en Cloudinary:

1. **Ir a Cloudinary Dashboard**
   - URL: https://cloudinary.com/console
   - Login con tu cuenta (`drigawwbd`)

2. **Navegar a Settings → Upload**
   - Click en "Upload presets" en el menú lateral
   - Scroll hasta la sección "Upload presets"

3. **Crear nuevo preset**
   - Click en "Add upload preset"
   - **Preset name:** `babilonia-products`
   - **Signing Mode:** `Unsigned` ⚠️ (muy importante)
   - **Folder:** (opcional) puedes dejarlo vacío o poner "productos"
   - **Use filename:** No
   - **Unique filename:** Yes

4. **Configuración adicional recomendada**
   ```
   Allowed formats: jpg, png, webp
   Max file size: 5 MB
   Transformation:
     - Quality: auto
     - Format: auto
   ```

5. **Guardar**
   - Click en "Save"

### Verificar configuración
En `src/services/cloudinaryUpload.ts`:
```typescript
const CLOUD_NAME = 'drigawwbd';
const UPLOAD_PRESET = 'babilonia-products';
```

---

## 🚀 Uso del Sistema

### 1. Acceder al Panel de Administración
```
http://localhost:3000/argdev
```

### 2. Subir un Producto Nuevo

**Paso a Paso:**

1. **Seleccionar imagen**
   - Click en el área de upload
   - Seleccionar archivo (JPG, PNG, WEBP)
   - Máximo 5MB

2. **Completar formulario**
   - **Título:** "Zapatillas Nike Air Max 2024"
   - **Descripción:** (opcional) "Zapatillas deportivas de alta calidad..."
   - **Precio:** 129.99

3. **Preview del Public ID**
   - Se muestra automáticamente: `zapatillas-nike-air-max-2024`
   - Este será el identificador en Cloudinary

4. **Crear Producto**
   - Click en "Crear Producto"
   - Loading state mientras sube
   - Toast de éxito
   - Redirección automática al home

### 3. Ver Producto en Home
- El producto aparece PRIMERO en la grilla
- Se muestra con la imagen desde Cloudinary
- Tiene botón "Agregar al Carrito" funcional

---

## 🔍 Flujo Técnico

### Upload Process
```
1. Usuario selecciona imagen
   ↓
2. Validación (tipo, tamaño)
   ↓
3. Preview local (FileReader)
   ↓
4. Usuario completa formulario
   ↓
5. Generación de slug: "Nike Air" → "nike-air"
   ↓
6. Upload a Cloudinary API
   ↓
7. Cloudinary devuelve: {publicId, secureUrl, width, height}
   ↓
8. Guardar en localStorage: 'babilonia-products'
   ↓
9. FeaturedProducts detecta cambio (polling 1s)
   ↓
10. Re-render con nuevo producto
```

### Sincronización localStorage
```javascript
// FeaturedProducts.tsx
useEffect(() => {
  // Polling cada 1 segundo
  const interval = setInterval(() => {
    const savedProducts = getProducts();
    setDynamicProducts(savedProducts);
  }, 1000);

  // Storage event (otras pestañas)
  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    clearInterval(interval);
    window.removeEventListener('storage', handleStorageChange);
  };
}, []);
```

---

## 📊 API de Cloudinary

### Endpoint de Upload
```
POST https://api.cloudinary.com/v1_1/{cloud_name}/image/upload
```

### Request Body (FormData)
```javascript
{
  file: File,                    // Imagen
  upload_preset: 'babilonia-products',
  public_id: 'zapatillas-nike'   // Opcional
}
```

### Response
```json
{
  "public_id": "zapatillas-nike",
  "secure_url": "https://res.cloudinary.com/drigawwbd/image/upload/v1234/zapatillas-nike.jpg",
  "width": 1200,
  "height": 800,
  "format": "jpg",
  "resource_type": "image",
  "created_at": "2025-01-07T12:00:00Z"
}
```

---

## 🛠️ Funciones del Servicio

### `uploadToCloudinary(file, publicId?)`
Sube una imagen a Cloudinary.
```typescript
const result = await uploadToCloudinary(selectedFile, 'mi-producto');
// result: {publicId, secureUrl, width, height}
```

### `generateSlug(title)`
Genera slug URL-friendly.
```typescript
generateSlug('Zapatillas Nike Air Max');
// → "zapatillas-nike-air-max"
```

### `saveProduct(product)`
Guarda producto en localStorage.
```typescript
saveProduct({
  id: '1704628800000',
  title: 'Nike Air',
  description: 'Zapatillas deportivas',
  price: 129.99,
  image: 'nike-air',
  createdAt: '2025-01-07T12:00:00.000Z'
});
```

### `getProducts()`
Obtiene todos los productos.
```typescript
const products = getProducts();
// → ProductData[]
```

### `deleteProduct(id)`
Elimina un producto.
```typescript
deleteProduct('1704628800000');
```

---

## 🎨 Componentes UI

### ProductUploader
**Ruta:** `/argdev`

**Props:** Ninguna

**Features:**
- Drag & drop de imágenes
- Preview de imagen
- Validaciones en tiempo real
- Loading states
- Toast notifications
- Navegación con React Router

**Ejemplo de uso:**
```tsx
<Route path="/argdev" element={<ProductUploader />} />
```

### FeaturedProducts (Actualizado)
**Features:**
- Carga productos estáticos + dinámicos
- Polling para detectar cambios
- Conversión automática de formatos
- Contador de productos nuevos

---

## ⚠️ Limitaciones y Consideraciones

### 1. **localStorage tiene límite**
- Capacidad: ~5-10MB por dominio
- Recomendación: Máximo 50-100 productos con descripciones cortas

### 2. **Polling cada 1 segundo**
- Puede impactar performance si hay muchos productos
- Alternativa: Usar Context API con estado global

### 3. **Sin autenticación**
- `/argdev` es accesible públicamente
- Recomendación: Agregar autenticación antes de producción

### 4. **Sin base de datos**
- Los productos se pierden si se limpia localStorage
- Recomendación: Migrar a backend con MongoDB/PostgreSQL

### 5. **Cloudinary Unsigned Upload**
- Cualquiera con el preset puede subir imágenes
- Recomendación: Usar signed uploads con backend

---

## 🔐 Seguridad - TODO

### Implementaciones Recomendadas:

1. **Autenticación en `/argdev`**
```typescript
// Agregar ProtectedRoute
<Route 
  path="/argdev" 
  element={
    <ProtectedRoute>
      <ProductUploader />
    </ProtectedRoute>
  } 
/>
```

2. **Backend para Upload**
```typescript
// En lugar de upload directo a Cloudinary
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(productData)
});
```

3. **Rate Limiting**
- Limitar número de uploads por hora
- Prevenir abuse del sistema

---

## 🧪 Testing Manual

### Test 1: Upload exitoso
1. Ir a `/argdev`
2. Subir imagen válida (< 5MB)
3. Completar título: "Test Product"
4. Completar precio: 99.99
5. Click "Crear Producto"
6. ✅ Debe mostrar toast de éxito
7. ✅ Debe redirigir a `/`
8. ✅ Producto debe aparecer en home

### Test 2: Validaciones
1. Intentar submit sin imagen → ❌ Error
2. Subir archivo no-imagen → ❌ Error
3. Subir imagen > 5MB → ❌ Error
4. Título vacío → ❌ Error
5. Precio = 0 → ❌ Error

### Test 3: Persistencia
1. Crear producto
2. Refrescar página (F5)
3. ✅ Producto sigue visible

### Test 4: Cloudinary Integration
1. Crear producto "test-cloudinary"
2. Ir a Cloudinary dashboard
3. ✅ Verificar imagen subida
4. ✅ Public ID correcto

---

## 📱 Responsive Design

El panel de administración es completamente responsive:

- **Desktop:** Formulario centrado, ancho máximo 3xl
- **Tablet:** Layout adaptado
- **Mobile:** Formulario en columna, botones fullwidth

---

## 🔗 Rutas del Sistema

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | HomePage | Página principal con productos |
| `/argdev` | ProductUploader | Panel de administración |

---

## 💾 localStorage Keys

| Key | Contenido |
|-----|-----------|
| `babilonia-products` | Array de ProductData (JSON) |
| `babilonia-cart` | Array de Product (JSON) |

---

## 🚀 Próximos Pasos Recomendados

### Corto Plazo:
1. ✅ Sistema funcionando con localStorage
2. ⏳ Agregar botón de "Eliminar" en cards
3. ⏳ Panel para editar productos existentes
4. ⏳ Filtros en home (por categoría, precio)

### Mediano Plazo:
1. ⏳ Backend con Express/NestJS
2. ⏳ Base de datos (MongoDB/PostgreSQL)
3. ⏳ Autenticación (JWT)
4. ⏳ Signed uploads a Cloudinary

### Largo Plazo:
1. ⏳ Panel de administración completo
2. ⏳ Analytics de ventas
3. ⏳ Sistema de inventario
4. ⏳ Notificaciones por email

---

## 📚 Referencias

- [Cloudinary Upload API](https://cloudinary.com/documentation/upload_images)
- [React Router v6](https://reactrouter.com/en/main)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Fecha de implementación:** Enero 2025  
**Estado:** ✅ Completado y funcionando  
**Branch:** `feature/boton-upload-to-cloudinary`
