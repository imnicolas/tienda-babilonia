# 📖 Ejemplos de Uso - Sistema de Upload

## 🎯 Casos de Uso Reales

---

## Ejemplo 1: Subir Zapatillas Nike

### Datos del Producto:
```
Título: Zapatillas Nike Air Max 2024
Descripción: Zapatillas deportivas con tecnología Air Max, ideales para running y uso casual
Precio: 149.99
Imagen: nike-air-max-2024.jpg
```

### Proceso:
1. **Preparar imagen**
   - Nombre: `nike-air-max-2024.jpg`
   - Tamaño: 2.3 MB ✅
   - Dimensiones: 1200x800px

2. **Ir a panel admin**
   ```
   http://localhost:3000/argdev
   ```

3. **Completar formulario**
   - Upload imagen → Ver preview
   - Título: "Zapatillas Nike Air Max 2024"
   - Descripción: "Zapatillas deportivas con tecnología Air Max..."
   - Precio: 149.99

4. **Public ID generado**
   ```
   zapatillas-nike-air-max-2024
   ```

5. **Resultado en Cloudinary**
   ```
   URL: https://res.cloudinary.com/drigawwbd/image/upload/zapatillas-nike-air-max-2024
   Public ID: zapatillas-nike-air-max-2024
   ```

6. **Visualización en Home**
   - Aparece como primera card
   - Con imagen optimizada
   - Botón "Agregar al Carrito" funcional

---

## Ejemplo 2: Subir Botas de Cuero

### Datos del Producto:
```
Título: Botas de Cuero Premium
Descripción: (vacío)
Precio: 199.99
Imagen: botas-cuero.jpg
```

### Particularidades:
- ✅ Descripción opcional → Se genera automática
- ✅ Descripción generada: "Botas de Cuero Premium - Calidad premium"

### Public ID:
```
botas-de-cuero-premium
```

### localStorage Entry:
```json
{
  "id": "1704628800000",
  "title": "Botas de Cuero Premium",
  "description": "Botas de Cuero Premium - Calidad premium",
  "price": 199.99,
  "image": "botas-de-cuero-premium",
  "createdAt": "2025-01-07T12:00:00.000Z"
}
```

---

## Ejemplo 3: Producto con Caracteres Especiales

### Input del Usuario:
```
Título: Sandalias "Playa & Sol" 100%
```

### Slug Generado (automático):
```
sandalias-playa-sol-100
```

### Transformaciones aplicadas:
- `"` → eliminado
- `&` → eliminado
- `%` → eliminado
- Espacios → `-`
- Mayúsculas → minúsculas

### Resultado:
```
Public ID: sandalias-playa-sol-100
```

---

## Ejemplo 4: Producto con Acentos

### Input:
```
Título: Zapatos Clásicos Más Vendidos
```

### Slug Generado:
```
zapatos-clasicos-mas-vendidos
```

### Normalización:
- `á` → `a`
- `é` → `e`
- `í` → `i`
- `ó` → `o`
- `ú` → `u`

---

## Ejemplo 5: Lote de Productos

### Escenario:
Subir 5 productos nuevos de una colección de verano.

### Productos:
1. **Sandalias Casual**
   - Imagen: sandalia-casual.jpg
   - Precio: 59.99
   - Public ID: `sandalias-casual`

2. **Ojotas Deportivas**
   - Imagen: ojotas-deportivas.jpg
   - Precio: 39.99
   - Public ID: `ojotas-deportivas`

3. **Zapatos Náuticos**
   - Imagen: zapatos-nauticos.jpg
   - Precio: 89.99
   - Public ID: `zapatos-nauticos`

4. **Alpargatas Clásicas**
   - Imagen: alpargatas-clasicas.jpg
   - Precio: 49.99
   - Public ID: `alpargatas-clasicas`

5. **Mocasines Verano**
   - Imagen: mocasines-verano.jpg
   - Precio: 79.99
   - Public ID: `mocasines-verano`

### Proceso:
1. Subir productos uno por uno en `/argdev`
2. Cada producto se guarda en localStorage
3. Todos aparecen automáticamente en home
4. Orden: Más reciente primero

### Resultado en Home:
```
[Mocasines Verano]    [Alpargatas Clásicas]  [Zapatos Náuticos]
[Ojotas Deportivas]   [Sandalias Casual]     [Zapatos Clásicos] ← estático
```

---

## Ejemplo 6: Validación de Errores

### Caso A: Imagen muy grande
```
Archivo: zapato-4k.jpg (8 MB)
Error: "La imagen no debe superar los 5MB"
Acción: Comprimir imagen y reintentar
```

### Caso B: Archivo no válido
```
Archivo: catalogo.pdf
Error: "Por favor selecciona un archivo de imagen válido"
Acción: Seleccionar JPG/PNG/WEBP
```

### Caso C: Sin título
```
Título: (vacío)
Precio: 99.99
Error: "El título es obligatorio"
Acción: Completar campo
```

### Caso D: Precio inválido
```
Título: "Zapatos Test"
Precio: 0
Error: "El precio debe ser mayor a 0"
Acción: Ingresar precio válido
```

---

## Ejemplo 7: Editar Producto Existente (Manual)

Actualmente no hay UI para editar, pero se puede hacer desde DevTools:

### Pasos:
1. **Abrir DevTools** (F12)
2. **Ir a Console**
3. **Obtener productos:**
   ```javascript
   const products = JSON.parse(localStorage.getItem('babilonia-products'));
   console.log(products);
   ```

4. **Modificar producto:**
   ```javascript
   products[0].price = 129.99; // Cambiar precio
   products[0].title = "Nuevo Título"; // Cambiar título
   ```

5. **Guardar cambios:**
   ```javascript
   localStorage.setItem('babilonia-products', JSON.stringify(products));
   ```

6. **Refrescar página** (F5)

---

## Ejemplo 8: Eliminar Producto (Manual)

### Desde DevTools:
```javascript
// Obtener productos
const products = JSON.parse(localStorage.getItem('babilonia-products'));

// Filtrar (eliminar el primero)
const filtered = products.filter((p, index) => index !== 0);

// Guardar
localStorage.setItem('babilonia-products', JSON.stringify(filtered));

// Refrescar
location.reload();
```

### Programáticamente:
```javascript
import { deleteProduct } from '../services/cloudinaryUpload';

deleteProduct('1704628800000'); // ID del producto
```

---

## Ejemplo 9: Ver Datos en localStorage

### Desde DevTools:
```javascript
// Ver productos
const products = JSON.parse(localStorage.getItem('babilonia-products'));
console.table(products);

// Ver carrito
const cart = JSON.parse(localStorage.getItem('babilonia-cart'));
console.table(cart);
```

### Resultado:
```
┌─────────┬──────────────────┬────────────────────┬─────────┬─────────────────────┐
│ (index) │        id        │       title        │  price  │        image        │
├─────────┼──────────────────┼────────────────────┼─────────┼─────────────────────┤
│    0    │ '1704628800000' │ 'Nike Air Max'     │  149.99 │ 'nike-air-max'      │
│    1    │ '1704629000000' │ 'Botas Cuero'      │  199.99 │ 'botas-cuero'       │
└─────────┴──────────────────┴────────────────────┴─────────┴─────────────────────┘
```

---

## Ejemplo 10: Backup de Productos

### Exportar datos:
```javascript
// En DevTools Console
const products = localStorage.getItem('babilonia-products');
console.log(products); // Copiar el JSON
```

### Importar datos:
```javascript
// Pegar el JSON copiado
const backup = '[{"id":"...","title":"..."}]';
localStorage.setItem('babilonia-products', backup);
location.reload();
```

---

## Ejemplo 11: Testing de Integración

### Test Completo:
```javascript
// 1. Limpiar datos
localStorage.removeItem('babilonia-products');

// 2. Ir a /argdev y subir producto
// Título: "Test Product"
// Precio: 99.99

// 3. Verificar en localStorage
const products = JSON.parse(localStorage.getItem('babilonia-products'));
console.assert(products.length === 1, 'Debe haber 1 producto');
console.assert(products[0].title === 'Test Product', 'Título correcto');
console.assert(products[0].price === 99.99, 'Precio correcto');

// 4. Verificar en home
// → Debe aparecer card con "Test Product"

// 5. Agregar al carrito
// → Click en "Agregar al Carrito"

// 6. Verificar carrito
const cart = JSON.parse(localStorage.getItem('babilonia-cart'));
console.assert(cart.length === 1, 'Debe haber 1 item en carrito');

console.log('✅ Test pasado!');
```

---

## Ejemplo 12: Producto con Descripción Larga

### Input:
```
Título: Zapatillas Running Pro
Descripción: Zapatillas de alta gama diseñadas para corredores profesionales. 
Cuentan con amortiguación avanzada, suela de carbono, upper transpirable y 
tecnología de retorno de energía. Ideales para maratones y entrenamientos 
intensivos.
Precio: 249.99
```

### Resultado:
```json
{
  "id": "1704628900000",
  "title": "Zapatillas Running Pro",
  "description": "Zapatillas de alta gama diseñadas para corredores profesionales. Cuentan con amortiguación avanzada, suela de carbono, upper transpirable y tecnología de retorno de energía. Ideales para maratones y entrenamientos intensivos.",
  "price": 249.99,
  "image": "zapatillas-running-pro",
  "createdAt": "2025-01-07T12:15:00.000Z"
}
```

### Consideración:
- ✅ localStorage soporta strings largos
- ⚠️ Límite aproximado: 5-10MB total

---

## 📊 Estadísticas de Uso

### Capacidad Estimada:
```
1 producto promedio: ~500 bytes (0.5 KB)
Límite localStorage: ~5 MB
Capacidad teórica: ~10,000 productos
Capacidad práctica: ~100-200 productos (recomendado)
```

### Tamaño por Campo:
```
id: 13 bytes
title: 20-50 bytes
description: 50-200 bytes
price: 8 bytes
image: 20-50 bytes
createdAt: 24 bytes
Total: ~150-400 bytes por producto
```

---

## 🎯 Mejores Prácticas

### Nombres de Productos:
- ✅ Descriptivos: "Zapatillas Nike Air Max 2024"
- ❌ Genéricos: "Producto 1"

### Precios:
- ✅ Con decimales: 99.99
- ✅ Sin decimales: 100
- ❌ Negativos: -50

### Imágenes:
- ✅ Formato: JPG, PNG, WEBP
- ✅ Tamaño: < 5MB
- ✅ Dimensiones: 800x600 a 2000x1500
- ❌ GIF animados (no recomendado)

### Descripciones:
- ✅ Concisas y claras
- ✅ 100-300 caracteres
- ❌ HTML o código

---

**Última actualización:** Enero 2025
