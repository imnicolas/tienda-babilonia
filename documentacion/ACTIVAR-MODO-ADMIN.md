# 🔐 Modo Administrador - Activación

## 🎯 Cómo Activar el Botón "Crear Producto"

El botón "Crear Producto" en el Navbar solo es visible cuando se activa el **modo administrador**.

---

## 📋 Pasos para Activar

### Método 1: Desde DevTools (Recomendado)

1. **Abrir DevTools**
   - Presiona `F12` o `Ctrl+Shift+I` (Windows/Linux)
   - O `Cmd+Option+I` (Mac)

2. **Ir a la pestaña Console**

3. **Ejecutar comando:**
   ```javascript
   localStorage.setItem('modo', 'poupe');
   ```

4. **Refrescar la página** (F5)

5. **✅ El botón "Crear Producto" aparecerá en el Navbar**

---

### Método 2: Desde la Aplicación (Consola del Navegador)

```javascript
// Activar modo admin
localStorage.setItem('modo', 'poupe');
location.reload();
```

---

## 🔓 Cómo Desactivar

Para ocultar el botón nuevamente:

```javascript
// Desactivar modo admin
localStorage.removeItem('modo');
location.reload();
```

O cambiar el valor:

```javascript
// Cambiar a cualquier otro valor
localStorage.setItem('modo', 'normal');
location.reload();
```

---

## 👁️ Verificación

### Ver estado actual:
```javascript
// En DevTools Console
const modo = localStorage.getItem('modo');
console.log('Modo actual:', modo);

// Resultado esperado para ver el botón:
// Modo actual: poupe
```

---

## 🎨 Comportamiento del Botón

### Desktop (Pantallas grandes):
- Aparece entre el botón de búsqueda y el carrito
- Color azul (`bg-blue-600`)
- Icono de `+` (Plus)
- Texto: "Crear Producto"

### Mobile (Pantallas pequeñas):
- Aparece en el menú hamburguesa (Sheet)
- Al final de la lista de navegación
- Separado con una línea divisoria
- Botón full-width

---

## 🔄 Sincronización

El sistema verifica el modo admin de dos formas:

1. **Storage Event**: Detecta cambios en otras pestañas
2. **Polling**: Verifica cada 1 segundo (misma pestaña)

Esto significa que el botón aparece/desaparece automáticamente sin necesidad de refrescar.

---

## 🧪 Testing

### Test 1: Activar modo admin
```javascript
// 1. Verificar que no existe
console.log('Antes:', localStorage.getItem('modo')); // null

// 2. Activar
localStorage.setItem('modo', 'poupe');

// 3. Esperar 1 segundo y verificar botón
// → Debe aparecer "Crear Producto" en Navbar
```

### Test 2: Desactivar modo admin
```javascript
// 1. Verificar que existe
console.log('Antes:', localStorage.getItem('modo')); // "poupe"

// 2. Desactivar
localStorage.removeItem('modo');

// 3. Esperar 1 segundo y verificar botón
// → Botón debe desaparecer
```

### Test 3: Valor incorrecto
```javascript
// 1. Setear valor incorrecto
localStorage.setItem('modo', 'admin'); // ❌ No es "poupe"

// 2. Verificar
// → Botón NO debe aparecer (solo funciona con "poupe")
```

---

## 🔒 Seguridad

### ⚠️ Importante:

Este es un método de **seguridad por oscuridad** básico:
- No es seguro para producción
- Cualquiera que conozca la key puede activarlo
- Solo oculta el botón visualmente

### Para Producción:

Implementar autenticación real:
- JWT tokens
- Backend con validación
- Roles de usuario
- Middleware de autorización

---

## 💡 Ejemplos de Uso

### Caso 1: Activar para una sesión de trabajo
```javascript
// Al inicio del día
localStorage.setItem('modo', 'poupe');

// Trabajar agregando productos...

// Al final del día
localStorage.removeItem('modo');
```

### Caso 2: Script de activación rápida
```javascript
// Crear bookmark en el navegador con este código:
javascript:(function(){localStorage.setItem('modo','poupe');location.reload();})();

// Click en el bookmark para activar modo admin instantáneamente
```

### Caso 3: Activación desde URL (Bonus)
```javascript
// Agregar a App.tsx o index.tsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('admin') === 'true') {
    localStorage.setItem('modo', 'poupe');
  }
}, []);

// Uso: http://localhost:3000/?admin=true
```

---

## 🎯 Resumen Rápido

```javascript
// ✅ ACTIVAR (mostrar botón)
localStorage.setItem('modo', 'poupe');

// ❌ DESACTIVAR (ocultar botón)
localStorage.removeItem('modo');

// 👁️ VERIFICAR
console.log(localStorage.getItem('modo'));
```

---

## 📝 Notas Técnicas

### Implementación:
```typescript
// En Navbar.tsx
const [showAdminButton, setShowAdminButton] = useState(false);

useEffect(() => {
  const checkAdminMode = () => {
    const modo = localStorage.getItem('modo');
    setShowAdminButton(modo === 'poupe');
  };

  checkAdminMode();
  window.addEventListener('storage', checkAdminMode);
  const interval = setInterval(checkAdminMode, 1000);

  return () => {
    window.removeEventListener('storage', checkAdminMode);
    clearInterval(interval);
  };
}, []);
```

### Condición de renderizado:
```tsx
{showAdminButton && (
  <Button onClick={() => navigate('/argdev')}>
    <Plus /> Crear Producto
  </Button>
)}
```

---

## 🐛 Troubleshooting

### El botón no aparece después de activar
**Causa:** Polling aún no ejecutó o valor incorrecto

**Solución:**
```javascript
// Verificar valor exacto
const modo = localStorage.getItem('modo');
console.log('Valor actual:', modo, 'Tipo:', typeof modo);

// Debe ser: "poupe" (string)
// ❌ No: "Poupe", "POUPE", null, undefined
```

### El botón aparece y desaparece intermitentemente
**Causa:** Múltiples pestañas con valores diferentes

**Solución:**
```javascript
// Limpiar en todas las pestañas
localStorage.clear();
localStorage.setItem('modo', 'poupe');
```

### El botón no se oculta al remover la key
**Causa:** Caché del navegador

**Solución:**
```javascript
// Hard reload
// Ctrl+Shift+R (Windows/Linux)
// Cmd+Shift+R (Mac)
```

---

**Última actualización:** Enero 2025  
**Método:** localStorage con key `modo = "poupe"`  
**Sincronización:** Storage events + polling (1s)
