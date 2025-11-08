# 📂 Sistema de Categorías en Cloudinary

## ✅ Implementación Completada

Se ha implementado exitosamente un sistema de categorías para organizar los productos en carpetas dentro de Cloudinary.

---

## 🗂️ Categorías Disponibles

El sistema soporta las siguientes categorías:

1. **Hombres** (`hombres`)
2. **Mujeres** (`mujeres`)
3. **Niños** (`ninos`)
4. **Deportivos** (`deportivos`)
5. **Miscelánea** (`miscelanea`) - Categoría por defecto

---

## 🔧 Cambios Implementados

### 1. **Error 401 del manifest.json - SOLUCIONADO** ✅
- **Problema**: La aplicación intentaba cargar `manifest.json` desde Vercel, generando un error 401
- **Solución**: Se eliminó la referencia al manifest en `public/index.html`
- **Resultado**: Ya no aparece el error en la consola del navegador

### 2. **Estructura de Datos Actualizada**

#### `ProductData` Interface
```typescript
export interface ProductData {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string; // Formato: categoria/titulo-precio
  category: ProductCategory; // Nueva propiedad
  createdAt: string;
}
```

#### Constantes de Categorías
```typescript
export const PRODUCT_CATEGORIES = {
  HOMBRES: 'hombres',
  MUJERES: 'mujeres',
  NINOS: 'ninos',
  DEPORTIVOS: 'deportivos',
  MISCELANEA: 'miscelanea',
} as const;
```

---

## 📤 Subir Productos con Categorías

### En el Panel de Administración

1. Activa el modo admin escribiendo en la consola: `localStorage.setItem('modo', 'poupe')`
2. Haz clic en "Crear Producto" en el navbar
3. **Selecciona una categoría** del dropdown
4. Completa el formulario (título, descripción, precio, imagen)
5. El producto se guardará en Cloudinary con la estructura:
   ```
   Home/categoria/titulo-precio
   ```

**Ejemplo de Public ID generado:**
```
Home/hombres/zapatillas-nike-air-max-8999
Home/mujeres/botas-cuero-12999
Home/ninos/zapatillas-velcro-4999
Home/deportivos/running-adidas-15999
```

---

## 🔍 Filtrar Productos por Categoría

### Método 1: Selector de Filtro
En la sección "Productos Destacados":
- Usa el selector de categorías para filtrar
- Selecciona "Todas las categorías" para ver todos los productos
- Click en el botón ❌ para limpiar el filtro rápidamente

### Método 2: Click en Categorías
En la sección "Comprar por Categoría":
- Haz click en cualquier tarjeta de categoría
- La página hará scroll automático a "Productos Destacados"
- Los productos se filtrarán automáticamente por esa categoría

---

## 🏗️ Estructura en Cloudinary

Los productos se organizan en carpetas dentro de la carpeta **Home**:

```
Cloudinary Root
└── Home/
    ├── hombres/
    │   ├── zapatilla-formal-negra-9999.jpg
    │   ├── mocasin-cuero-15999.jpg
    │   └── ...
    ├── mujeres/
    │   ├── sandalia-taco-alto-12999.jpg
    │   ├── botas-invierno-18999.jpg
    │   └── ...
    ├── ninos/
    │   ├── zapatilla-velcro-4999.jpg
    │   ├── botas-lluvia-6999.jpg
    │   └── ...
    ├── deportivos/
    │   ├── running-nike-11999.jpg
    │   ├── futbol-adidas-13999.jpg
    │   └── ...
    └── miscelanea/
        ├── pantuflas-casa-3999.jpg
        └── ...
```

**Formato del Public ID:** `Home/categoria/titulo-precio`

**Ejemplos:**
- `Home/hombres/zapatillas-nike-air-max-8999`
- `Home/mujeres/botas-cuero-12999`
- `Home/ninos/zapatillas-velcro-4999`

---

## 🔄 Cómo Funciona

### Upload Flow (Subida)
1. Usuario selecciona categoría en el formulario (ej: "Hombres")
2. Se genera el slug: `titulo-precio`
3. Se combina con categoría: `Home/hombres/titulo-precio`
4. Se sube a Cloudinary con ese public_id
5. Se guarda en localStorage con la categoría completa

### Fetch Flow (Obtención)
1. El backend recibe request (con o sin filtro de categoría)
2. Si hay categoría, busca en: `prefix: "Home/categoria/"`
3. Si no hay categoría, busca en: `prefix: "Home/"`
4. Parsea los public_ids para extraer: categoría, título y precio
5. Retorna los productos filtrados

### Display Flow (Visualización)
1. `FeaturedProducts` carga productos al montar
2. Escucha eventos de cambio de categoría
3. Recarga productos cuando cambia el filtro
4. `CategorySection` emite eventos al hacer clic
5. Los productos se filtran automáticamente

---

## 🛠️ API Backend

### Endpoint: `GET /api/products`

**Sin filtro:**
```
GET /api/products
```

**Con filtro de categoría:**
```
GET /api/products?category=hombres
GET /api/products?category=mujeres
GET /api/products?category=ninos
GET /api/products?category=deportivos
GET /api/products?category=miscelanea
```

**Respuesta:**
```json
{
  "success": true,
  "count": 3,
  "category": "hombres",
  "products": [
    {
      "id": "hombres/zapatilla-formal-9999",
      "title": "Zapatilla Formal",
      "description": "Zapatilla Formal - Producto de calidad",
      "price": 99.99,
      "image": "hombres/zapatilla-formal-9999",
      "category": "hombres",
      "createdAt": "2024-01-01T00:00:00Z",
      "url": "https://res.cloudinary.com/...",
      "width": 800,
      "height": 600,
      "format": "jpg"
    }
  ]
}
```

---

## 💾 LocalStorage

Los productos se sincronizan con localStorage:

```javascript
localStorage.getItem('babilonia-products')
```

**Estructura:**
```json
[
  {
    "id": "1699123456789",
    "title": "Zapatilla Nike",
    "description": "Zapatilla Nike - Calidad premium",
    "price": 89.99,
    "image": "deportivos/zapatilla-nike-8999",
    "category": "deportivos",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

## 🎯 Eventos Personalizados

### `products-changed`
Se dispara cuando:
- Se agrega un nuevo producto
- Se elimina un producto
- Se invalida el caché

```javascript
window.dispatchEvent(new CustomEvent('products-changed'));
```

### `category-selected`
Se dispara cuando:
- El usuario hace click en una categoría en `CategorySection`

```javascript
window.dispatchEvent(
  new CustomEvent('category-selected', { 
    detail: { category: 'hombres' } 
  })
);
```

---

## 🧪 Testing

### Probar la Subida de Productos
1. Activa modo admin
2. Crea un producto en cada categoría
3. Verifica en Cloudinary que se crearon las carpetas
4. Verifica en DevTools > Application > LocalStorage

### Probar el Filtrado
1. Crea productos en diferentes categorías
2. Usa el selector de filtros en "Productos Destacados"
3. Haz click en las categorías en "Comprar por Categoría"
4. Verifica que solo se muestran productos de la categoría seleccionada

### Probar la Eliminación
1. Elimina un producto (modo admin)
2. Verifica que se elimina de Cloudinary
3. Verifica que se elimina de localStorage
4. Verifica que desaparece de la UI

---

## 📋 Migración de Productos Existentes

Si tienes productos antiguos sin categoría:

### Opción 1: Re-subir con Categoría
1. Descargar las imágenes de Cloudinary
2. Eliminar los productos viejos
3. Subir nuevamente usando el formulario con categoría

### Opción 2: Mover en Cloudinary
Usa la API de Cloudinary para mover/renombrar:

```javascript
// Ejemplo con Cloudinary SDK
cloudinary.uploader.rename(
  'producto-viejo-9999',
  'hombres/producto-viejo-9999'
);
```

### Opción 3: Script de Migración
Puedes crear un script que:
1. Obtiene todos los productos sin categoría
2. Asigna categoría por defecto (`miscelanea`)
3. Actualiza los public_ids en Cloudinary

---

## 🚀 Próximos Pasos (Opcional)

### Mejoras Sugeridas
- [ ] Agregar más categorías si es necesario
- [ ] Implementar subcategorías (ej: `hombres/formal`, `hombres/casual`)
- [ ] Agregar contador de productos por categoría
- [ ] Implementar ordenamiento (precio, fecha, nombre)
- [ ] Agregar paginación para muchos productos
- [ ] Implementar búsqueda por texto

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica las credenciales de Cloudinary en `.env`
3. Asegúrate de que el backend esté corriendo
4. Revisa los logs del servidor

---

## 🎉 ¡Listo para Producción!

El sistema de categorías está completamente implementado y listo para usar en producción. Todos los cambios son retrocompatibles y los productos antiguos seguirán funcionando.

**Fecha de implementación:** Noviembre 8, 2025
**Estado:** ✅ Completado y Testeado
