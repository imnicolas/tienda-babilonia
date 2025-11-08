# 🎯 CONFIGURACIÓN INMEDIATA - 5 Minutos

## ⚡ Sigue Estos Pasos

### Paso 1: Abrir Cloudinary Dashboard

```
🌐 Ir a: https://console.cloudinary.com/console
```

### Paso 2: Ubicar las Credenciales

En la parte superior del dashboard verás:

```
┌─────────────────────────────────────────────┐
│ Account Details                             │
├─────────────────────────────────────────────┤
│ Cloud name:  drigawwbd                     │
│ API Key:     123456789012345               │ ← Copiar esto
│ API Secret:  ••••••••••  [Show] [Copy]    │ ← Click Show, luego copiar
└─────────────────────────────────────────────┘
```

### Paso 3: Editar el Archivo `.env`

**Abrir**: `c:\Users\windows\Escritorio\babilonia-calzados\mi-tienda\.env`

**Pegar tus credenciales**:

```env
CLOUDINARY_CLOUD_NAME=drigawwbd
CLOUDINARY_API_KEY=TU_API_KEY_AQUI
CLOUDINARY_API_SECRET=TU_API_SECRET_AQUI
PORT=5000
```

**Ejemplo real** (con tus datos):
```env
CLOUDINARY_CLOUD_NAME=drigawwbd
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123XYZ456def789
PORT=5000
```

⚠️ **Importante**:
- Sin comillas
- Sin espacios extra
- Reemplazar los valores con los tuyos

### Paso 4: Guardar el Archivo

- Presiona `Ctrl + S` para guardar
- Cerrar el archivo

### Paso 5: Abrir Terminal

**En VS Code**:
- Menú: `Terminal` → `New Terminal`
- O presionar `` Ctrl + ` ``

### Paso 6: Ejecutar el Proyecto

Escribir en la terminal:

```powershell
npm run dev
```

Presionar `Enter`

### Paso 7: Ver los Logs

**Terminal Backend** (primera ventana):
```
🔍 Verificando configuración...

✅ Configuración correcta!

🔑 Variables configuradas:
   • CLOUDINARY_CLOUD_NAME: drigawwbd
   • CLOUDINARY_API_KEY: 1234...
   • PORT: 5000

╔═══════════════════════════════════════════════════════╗
║   🚀 Babilonia Calzados API Server                   ║
║   📡 Port: 5000                                       ║
╚═══════════════════════════════════════════════════════╝
```

**Terminal Frontend** (segunda ventana):
```
webpack compiled successfully
```

### Paso 8: Abrir el Navegador

Ir a: **http://localhost:3000**

### Paso 9: Verificar en Console

1. Presionar `F12` (abrir DevTools)
2. Click en pestaña "Console"
3. Ver logs:

```
🔄 Iniciando carga de productos...
🔍 Consultando imágenes desde Cloudinary (via backend)...
✅ Imágenes obtenidas de Cloudinary: X
💾 localStorage actualizado con X productos
✅ Productos cargados: X
```

### ✅ ¡LISTO!

Si ves esos logs sin error 401, **¡todo está funcionando!** 🎉

---

## 🐛 Si Algo Sale Mal

### Error: "Faltan variables de entorno requeridas"

**Solución**:
1. Verificar que el archivo `.env` existe
2. Verificar que tiene `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`
3. Verificar que no hay espacios extra
4. Reiniciar: `Ctrl + C` en terminal, luego `npm run dev` de nuevo

### Error: "Cannot GET /api/products"

**Solución**:
- Asegúrate de usar `npm run dev` (no `npm start`)
- Esto ejecuta frontend + backend juntos

### Error: "EADDRINUSE"

**Solución**:
- El puerto 5000 está ocupado
- Editar `.env` y cambiar: `PORT=5001`
- Reiniciar

### Sigo viendo error 401

**Solución**:
1. Verificar en Cloudinary Console que las credenciales son correctas
2. Click en "Show" en API Secret
3. Copiar exactamente como aparece
4. Pegar en `.env` sin espacios
5. Guardar `.env`
6. `Ctrl + C` en terminal
7. `npm run dev` de nuevo

---

## 📞 ¿Necesitas Ayuda?

1. Verificar que seguiste todos los pasos
2. Leer `documentacion/CONFIGURACION-BACKEND.md`
3. Leer `documentacion/COMO-OBTENER-CREDENCIALES.md`
4. Ver los logs en consola para errores específicos

---

## 🎯 Resumen Visual

```
┌─────────────────────────────────────────────────────┐
│ 1. Cloudinary Console                               │
│    → Copiar API Key + Secret                        │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ 2. Editar .env                                      │
│    → Pegar credenciales                             │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ 3. Terminal                                         │
│    → npm run dev                                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ 4. Navegador                                        │
│    → http://localhost:3000                          │
│    → F12 para ver console                           │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ 5. ✅ Verificar                                     │
│    → "✅ Imágenes obtenidas de Cloudinary"         │
│    → Sin error 401                                  │
└─────────────────────────────────────────────────────┘
```

---

**¡5 minutos y está listo!** ⏱️
