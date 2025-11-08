# 🚀 INICIO RÁPIDO - Configuración del Backend

## ⚡ 3 Pasos para Empezar

### 1️⃣ Obtener Credenciales de Cloudinary

1. Ir a: https://console.cloudinary.com/console
2. Copiar del Dashboard:
   - **API Key** (15 dígitos)
   - **API Secret** (cadena alfanumérica)

### 2️⃣ Configurar `.env`

Abrir el archivo `.env` en la raíz del proyecto y agregar:

```env
CLOUDINARY_CLOUD_NAME=drigawwbd
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123XYZ456def789
PORT=5000
```

### 3️⃣ Iniciar el Proyecto

```bash
npm run dev
```

Esto iniciará:
- 🖥️ **Backend**: http://localhost:5000
- 🌐 **Frontend**: http://localhost:3000

## ✅ Verificar que Funciona

1. **Abrir el frontend**: http://localhost:3000
2. **Abrir DevTools (F12)** → Console
3. **Ver logs**:
   ```
   🔍 Consultando imágenes desde Cloudinary (via backend)...
   ✅ Imágenes obtenidas de Cloudinary: X
   ```
4. **NO debe aparecer error 401** ✅

## 🎯 ¿Qué Pasó?

**Antes**: 
- ❌ Error 401 (Unauthorized)
- ❌ Endpoint `/image/list` no accesible

**Ahora**:
- ✅ Backend local con Express
- ✅ Usa Cloudinary Admin API (con credenciales)
- ✅ Frontend consulta el backend (proxy)
- ✅ Eliminación real de Cloudinary funcional

## 📡 Endpoints Disponibles

- `GET /api/health` - Verificar que el backend funciona
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener un producto
- `DELETE /api/products/:id` - Eliminar un producto

## 🐛 Problemas Comunes

### "Cloudinary no está completamente configurado"

→ Falta agregar API Key/Secret en `.env`

### "Cannot GET /api/products"

→ El backend no está corriendo. Usar `npm run dev` (no solo `npm start`)

### "EADDRINUSE: address already in use"

→ El puerto 5000 está ocupado. Cambiar `PORT` en `.env` a otro valor (ej: 5001)

## 📚 Documentación Completa

Ver: `documentacion/CONFIGURACION-BACKEND.md`

---

**¿Listo?** Configurar `.env` y ejecutar `npm run dev` 🚀
