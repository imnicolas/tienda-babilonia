# 🧪 Guía de Testing: Sincronización con Cloudinary

## 📋 Checklist de Testing

Use esta guía para probar que la sincronización funciona correctamente.

---

## 🧪 Test 1: Sincronización Inicial

### Objetivo
Verificar que al abrir la web, se consulta Cloudinary y se pobla localStorage.

### Pasos

1. **Abrir DevTools** (F12)
   - Ir a la pestaña "Console"

2. **Limpiar caché local**
   ```javascript
   localStorage.removeItem('babilonia-products');
   ```

3. **Recargar la página** (F5)

4. **Verificar console logs**
   ```
   ✅ Esperado:
   🔄 Iniciando carga de productos...
   🔍 Consultando imágenes desde Cloudinary...
   ✅ Imágenes obtenidas de Cloudinary: X
   💾 localStorage actualizado con X productos
   ✅ Productos cargados: X
   ```

5. **Verificar localStorage**
   - Ir a DevTools → Application → Local Storage
   - Verificar que `babilonia-products` tiene datos
   - El valor debe ser un array JSON con productos

6. **Verificar UI**
   - Los productos deben renderizarse en la sección "Productos Destacados"
   - Cada producto debe tener imagen, título, precio y botón "Agregar al Carrito"

### ✅ Resultado Esperado
- Console muestra logs de sincronización
- localStorage se pobla automáticamente
- Productos se muestran en pantalla

### ❌ Si falla
- Ver console para mensajes de error
- Verificar que tienes imágenes en Cloudinary con el preset correcto
- Verificar que los Public IDs tengan formato: `titulo-precio-9999`

---

## 🧪 Test 2: Crear Producto

### Objetivo
Verificar que al crear un producto, se sincroniza con Cloudinary.

### Pre-requisitos
- Activar modo admin: `localStorage.setItem('modo', 'poupe')`
- Recargar página para ver botón "Crear Producto"

### Pasos

1. **Activar modo admin**
   ```javascript
   localStorage.setItem('modo', 'poupe');
   ```
   - Recargar página (F5)
   - Verificar que aparece botón "Crear Producto" en navbar

2. **Ir al panel de admin**
   - Click en "Crear Producto" en navbar
   - Te redirige a `/argdev`

3. **Llenar formulario**
   - **Imagen**: Subir una foto de zapato
   - **Título**: "Zapatillas Running Adidas"
   - **Descripción**: "Zapatillas cómodas para correr"
   - **Precio**: 129.99

4. **Verificar preview del Public ID**
   ```
   ✅ Esperado:
   zapatillas-running-adidas-12999
   ```
   - Formato: titulo-precio (precio sin decimales)

5. **Crear producto**
   - Click en "Crear Producto"
   - Ver toast "Subiendo imagen a Cloudinary..."
   - Ver toast "Sincronizando con Cloudinary..."
   - Ver toast "¡Producto creado exitosamente!"

6. **Verificar console**
   ```
   ✅ Esperado:
   🔄 Iniciando carga de productos...
   🔍 Consultando imágenes desde Cloudinary...
   ✅ Imágenes obtenidas de Cloudinary: X
   💾 localStorage actualizado con X productos
   ```

7. **Verificar home**
   - Serás redirigido al home (/) en 2 segundos
   - El nuevo producto debe aparecer en la lista
   - La imagen debe cargarse desde Cloudinary

### ✅ Resultado Esperado
- Producto se crea exitosamente
- Toast de sincronización aparece
- Producto aparece en home inmediatamente
- localStorage se actualiza con datos de Cloudinary

### ❌ Si falla
- Verificar que el upload preset "babilonia-products" está configurado como unsigned
- Verificar conexión a internet
- Ver console para errores de CORS o Cloudinary

---

## 🧪 Test 3: Fallback Offline

### Objetivo
Verificar que si Cloudinary falla, usa localStorage como fallback.

### Pasos

1. **Crear algunos productos** (Test 2)
   - Tener al menos 2-3 productos en localStorage

2. **Simular offline**
   - DevTools → Network → Throttling → Offline
   - O desconectar WiFi

3. **Recargar página** (F5)

4. **Verificar console**
   ```
   ✅ Esperado:
   🔄 Iniciando carga de productos...
   🔍 Consultando imágenes desde Cloudinary...
   ⚠️ No se pudo acceder a Cloudinary API, usando cache local
   📦 Usando cache local como fallback
   ✅ Productos cargados: X
   ```

5. **Verificar UI**
   - Los productos deben seguir mostrándose
   - Usando datos de localStorage (caché)

### ✅ Resultado Esperado
- Console muestra warning de fallback
- Productos se cargan desde localStorage
- UI sigue funcionando normal

### ❌ Si falla
- Verificar que localStorage tiene datos antes de ir offline
- Ver console para otros errores

---

## 🧪 Test 4: Polling (Auto-Sincronización)

### Objetivo
Verificar que se sincroniza automáticamente cada 5 segundos.

### Pasos

1. **Abrir página de inicio**
   - Ir a `/`
   - Abrir DevTools → Console

2. **Observar console**
   - Cada 5 segundos debe aparecer:
   ```
   🔄 Iniciando carga de productos...
   🔍 Consultando imágenes desde Cloudinary...
   ✅ Imágenes obtenidas de Cloudinary: X
   💾 localStorage actualizado con X productos
   ✅ Productos cargados: X
   ```

3. **Esperar 30 segundos**
   - Deberías ver ~6 sets de logs
   - Uno cada 5 segundos aproximadamente

### ✅ Resultado Esperado
- Logs aparecen cada 5 segundos
- localStorage se mantiene sincronizado
- No hay errores en console

### ❌ Si falla
- Verificar que no hay errores de JavaScript
- El polling solo funciona mientras estás en la página de inicio

---

## 🧪 Test 5: Múltiples Pestañas

### Objetivo
Verificar que los cambios se sincronizan entre pestañas.

### Pasos

1. **Abrir dos pestañas**
   - Pestaña A: `http://localhost:3000/`
   - Pestaña B: `http://localhost:3000/`

2. **En Pestaña A: Crear producto**
   - Activar modo admin si no está activo
   - Ir a `/argdev`
   - Crear producto "Botas Texanas - $199.99"

3. **Volver a Pestaña A home** (`/`)
   - Producto debe aparecer

4. **Ir a Pestaña B**
   - Esperar máximo 5 segundos
   - El nuevo producto debe aparecer automáticamente
   - Sin necesidad de refrescar manualmente

### ✅ Resultado Esperado
- Producto creado en Pestaña A aparece en Pestaña B
- Sincronización automática
- localStorage se actualiza en ambas pestañas

---

## 🧪 Test 6: Eliminar Producto (Admin)

### Objetivo
Verificar que se puede eliminar un producto en modo admin.

### Pre-requisitos
- Modo admin activado: `localStorage.setItem('modo', 'poupe')`
- Al menos 1 producto existente

### Pasos

1. **Activar modo admin**
   ```javascript
   localStorage.setItem('modo', 'poupe');
   ```
   - Recargar página

2. **Verificar botón de eliminar**
   - Cada card de producto debe tener un botón rojo con ícono de basura
   - Posición: esquina superior derecha

3. **Click en botón eliminar**
   - Debe aparecer confirmación:
   ```
   ¿Eliminar "Nombre del Producto"?
   Esta acción no se puede deshacer.
   ```

4. **Confirmar eliminación**
   - Click en "Aceptar"
   - Ver toast "Eliminando [Producto]..."
   - Ver toast "Producto eliminado exitosamente"

5. **Verificar UI**
   - Producto desaparece de la lista inmediatamente
   - localStorage se actualiza
   - Contador de productos disminuye

### ✅ Resultado Esperado
- Botón de eliminar solo visible en modo admin
- Confirmación antes de eliminar
- Producto se elimina instantáneamente de la UI
- localStorage se actualiza

### ⚠️ Nota Importante
**Actualmente solo elimina de localStorage, NO de Cloudinary real.**  
Para eliminar de Cloudinary, requiere backend con API key/secret.

---

## 🧪 Test 7: Public ID Format

### Objetivo
Verificar que los Public IDs tienen el formato correcto.

### Pasos

1. **Crear producto con caracteres especiales**
   - Título: "Zapatillas Nike™ Air Max® 2024"
   - Precio: 149.99

2. **Verificar preview**
   ```
   ✅ Esperado:
   zapatillas-nike-air-max-2024-14999
   ```
   - Sin ™, ®, acentos, espacios
   - Precio: 14999 (sin decimales)

3. **Crear y verificar en Cloudinary**
   - Crear el producto
   - Ir a Cloudinary dashboard
   - Buscar la imagen
   - Public ID debe ser: `zapatillas-nike-air-max-2024-14999`

### ✅ Resultado Esperado
- Caracteres especiales eliminados
- Espacios reemplazados por guiones
- Sin acentos
- Precio en centavos (sin punto decimal)

---

## 🧪 Test 8: Recuperación desde Cloudinary

### Objetivo
Verificar que si se borra localStorage, se recupera de Cloudinary.

### Pasos

1. **Tener productos en Cloudinary**
   - Crear 3-4 productos
   - Verificar que están en home

2. **Borrar localStorage completo**
   ```javascript
   localStorage.clear();
   ```

3. **Recargar página** (F5)

4. **Verificar console**
   ```
   ✅ Esperado:
   🔄 Iniciando carga de productos...
   🔍 Consultando imágenes desde Cloudinary...
   ✅ Imágenes obtenidas de Cloudinary: X
   💾 localStorage actualizado con X productos
   ✅ Productos cargados: X
   ```

5. **Verificar UI**
   - Todos los productos deben reaparecer
   - Provenientes de Cloudinary, no de localStorage

6. **Verificar localStorage**
   - Ir a DevTools → Application → Local Storage
   - `babilonia-products` debe estar poblado nuevamente

### ✅ Resultado Esperado
- localStorage se recupera automáticamente
- Productos reaparecen desde Cloudinary
- No se pierde ningún dato

### 🎯 Esto confirma que Cloudinary es la fuente de verdad

---

## 📊 Checklist Completo

Use este checklist para validar que todo funciona:

- [ ] **Test 1**: Sincronización inicial funciona
- [ ] **Test 2**: Crear producto sincroniza correctamente
- [ ] **Test 3**: Fallback offline usa localStorage
- [ ] **Test 4**: Polling cada 5 segundos funciona
- [ ] **Test 5**: Múltiples pestañas se sincronizan
- [ ] **Test 6**: Eliminar producto funciona (localStorage)
- [ ] **Test 7**: Public ID tiene formato correcto
- [ ] **Test 8**: Recuperación desde Cloudinary funciona

---

## 🐛 Troubleshooting

### Problema: "No se cargan productos"

**Solución**:
1. Verificar console logs para errores
2. Verificar que hay imágenes en Cloudinary con el preset correcto
3. Verificar formato de Public ID: `titulo-precio-9999`

### Problema: "Botón 'Crear Producto' no aparece"

**Solución**:
```javascript
localStorage.setItem('modo', 'poupe');
```
Luego recargar página.

### Problema: "Error CORS al subir imagen"

**Solución**:
1. Ir a Cloudinary Dashboard
2. Settings → Upload → Upload Presets
3. Verificar que `babilonia-products` está configurado como "Unsigned"

### Problema: "Polling no funciona"

**Solución**:
1. Verificar que no hay errores en console
2. El polling solo corre cuando estás en `/` (home)
3. Cerrar y reabrir la página

---

## 📝 Logs de Console Esperados

### Carga Normal
```
🔄 Iniciando carga de productos...
🔍 Consultando imágenes desde Cloudinary...
✅ Imágenes obtenidas de Cloudinary: 5
💾 localStorage actualizado con 5 productos
✅ Productos cargados: 5
```

### Fallback Offline
```
🔄 Iniciando carga de productos...
🔍 Consultando imágenes desde Cloudinary...
❌ Error obteniendo imágenes de Cloudinary: [error]
⚠️ No se pudo acceder a Cloudinary API, usando cache local
📦 Usando cache local como fallback
✅ Productos cargados: 5
```

### Crear Producto
```
Subiendo imagen a Cloudinary...
Sincronizando con Cloudinary...
🔄 Iniciando carga de productos...
🔍 Consultando imágenes desde Cloudinary...
✅ Imágenes obtenidas de Cloudinary: 6
💾 localStorage actualizado con 6 productos
✅ Productos cargados: 6
Producto sincronizado
¡Producto creado exitosamente!
```

---

## ✅ Testing Completado

Si todos los tests pasan, tu sistema de sincronización está funcionando correctamente! 🎉

**Próximo paso**: Implementar backend para:
- Eliminación real de Cloudinary
- Paginación de productos
- Autenticación de admin
