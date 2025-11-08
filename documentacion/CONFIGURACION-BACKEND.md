# 🚀 Configuración del Backend Local

## 📋 Resumen

Este proyecto ahora incluye un **backend Express** integrado que permite:
- ✅ Listar todos los productos desde Cloudinary (Admin API)
- ✅ Eliminar productos de Cloudinary
- ✅ Obtener información detallada de un producto

## 🔧 Configuración

### Paso 1: Obtener Credenciales de Cloudinary

1. **Ir a Cloudinary Console**: https://console.cloudinary.com/console
2. **Iniciar sesión** con tu cuenta
3. **Copiar las credenciales** del Dashboard:
   - Cloud Name: `drigawwbd` (ya lo tienes)
   - API Key: (número de 15 dígitos)
   - API Secret: (cadena alfanumérica)

### Paso 2: Configurar Variables de Entorno

1. **Abrir el archivo `.env`** en la raíz del proyecto
2. **Agregar las credenciales**:

```env
CLOUDINARY_CLOUD_NAME=drigawwbd
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=tu_secret_aqui
PORT=5000
```

⚠️ **IMPORTANTE**: 
- NO compartas tu API Secret públicamente
- NO subas el archivo `.env` a GitHub (ya está en `.gitignore`)

### Paso 3: Instalar Dependencias

Si ya no lo hiciste:

```bash
npm install
```

### Paso 4: Ejecutar el Proyecto

**Opción 1: Frontend y Backend juntos (recomendado)**

```bash
npm run dev
```

Esto iniciará:
- 🖥️ Backend en `http://localhost:5000`
- 🌐 Frontend en `http://localhost:3000`

**Opción 2: Solo Backend**

```bash
npm run server
```

**Opción 3: Solo Frontend**

```bash
npm start
```

## 📡 Endpoints del Backend

### Health Check
```
GET http://localhost:5000/api/health
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Babilonia Calzados API funcionando correctamente",
  "timestamp": "2024-11-08T10:30:00.000Z",
  "cloudinary": {
    "configured": true,
    "cloud_name": "drigawwbd"
  }
}
```

### Listar Productos
```
GET http://localhost:5000/api/products
```

**Respuesta:**
```json
{
  "success": true,
  "count": 5,
  "products": [
    {
      "id": "zapatillas-nike-14999",
      "title": "Zapatillas Nike",
      "description": "Zapatillas Nike - Producto de calidad",
      "price": 149.99,
      "image": "zapatillas-nike-14999",
      "createdAt": "2024-11-01T10:30:00Z",
      "url": "https://res.cloudinary.com/.../zapatillas-nike-14999.jpg",
      "width": 800,
      "height": 600,
      "format": "jpg"
    }
  ]
}
```

### Obtener Producto Específico
```
GET http://localhost:5000/api/products/zapatillas-nike-14999
```

### Eliminar Producto
```
DELETE http://localhost:5000/api/products/zapatillas-nike-14999
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente",
  "result": {
    "result": "ok"
  }
}
```

## 🔄 Cómo Funciona el Sistema

### Arquitectura

```
┌─────────────────┐
│   React App     │ (http://localhost:3000)
│   (Frontend)    │
└────────┬────────┘
         │
         │ HTTP Requests
         │ (proxy configurado)
         │
         ▼
┌─────────────────┐
│  Express Server │ (http://localhost:5000)
│   (Backend)     │
└────────┬────────┘
         │
         │ Admin API
         │ (con credentials)
         │
         ▼
┌─────────────────┐
│   Cloudinary    │
│   (Cloud)       │
└─────────────────┘
```

### Flujo de Datos

1. **Frontend** hace fetch a `/api/products`
2. **Proxy** redirige la petición a `http://localhost:5000/api/products`
3. **Backend** consulta Cloudinary Admin API (con credenciales)
4. **Cloudinary** devuelve lista de imágenes
5. **Backend** parsea los Public IDs y extrae título/precio
6. **Backend** devuelve JSON al frontend
7. **Frontend** actualiza localStorage y renderiza productos

## 🧪 Testing

### Verificar que el backend está funcionando

1. **Iniciar el backend**:
   ```bash
   npm run server
   ```

2. **Ver la consola**:
   ```
   ╔═══════════════════════════════════════════════════════╗
   ║                                                       ║
   ║   🚀 Babilonia Calzados API Server                   ║
   ║                                                       ║
   ║   📡 Port: 5000                                       ║
   ║   🌐 URL: http://localhost:5000                       ║
   ║   ☁️  Cloudinary: drigawwbd                          ║
   ║                                                       ║
   ╚═══════════════════════════════════════════════════════╝
   ```

3. **Probar endpoint de health**:
   - Abrir en navegador: http://localhost:5000/api/health
   - Debe mostrar: `"cloudinary": { "configured": true }`

4. **Probar endpoint de productos**:
   - Abrir en navegador: http://localhost:5000/api/products
   - Debe mostrar lista de productos en JSON

### Verificar integración Frontend-Backend

1. **Iniciar ambos**:
   ```bash
   npm run dev
   ```

2. **Abrir frontend**: http://localhost:3000

3. **Abrir DevTools** (F12) → Console

4. **Ver logs**:
   ```
   🔍 Consultando imágenes desde Cloudinary (via backend)...
   ✅ Imágenes obtenidas de Cloudinary: 5
   💾 localStorage actualizado con 5 productos
   ```

5. **Verificar que no hay error 401**

## 🐛 Troubleshooting

### Error: "Cloudinary no está completamente configurado"

**Problema**: El archivo `.env` no tiene las credenciales.

**Solución**:
1. Abrir `.env`
2. Agregar `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`
3. Reiniciar el servidor

### Error: "Cannot GET /api/products"

**Problema**: El backend no está corriendo.

**Solución**:
```bash
npm run dev
```

### Error: "EADDRINUSE: address already in use :::5000"

**Problema**: El puerto 5000 ya está ocupado.

**Solución 1**: Cerrar la aplicación que usa el puerto 5000
**Solución 2**: Cambiar el puerto en `.env`:
```env
PORT=5001
```

### Error: "Proxy error: Could not proxy request"

**Problema**: El backend no está corriendo.

**Solución**: Asegúrate de usar `npm run dev` (no solo `npm start`)

### Error 401 en Cloudinary

**Problema**: API Key o Secret incorrectos.

**Solución**:
1. Verificar credenciales en Cloudinary Console
2. Copiar exactamente (sin espacios extra)
3. Reiniciar el servidor

## 📦 Estructura de Archivos

```
mi-tienda/
├── .env                        # ⚠️ Credenciales (NO subir a Git)
├── .env.example               # Template de ejemplo
├── package.json               # Scripts: dev, server, start
├── server/
│   └── index.js              # Backend Express
└── src/
    └── services/
        └── cloudinaryUpload.ts  # Frontend API client
```

## 🔒 Seguridad

### Variables de Entorno

- ✅ `.env` está en `.gitignore`
- ✅ NO subir credenciales a GitHub
- ✅ API Secret es privado
- ✅ Solo usar en backend, no en frontend

### CORS

El backend tiene CORS habilitado para desarrollo:
```javascript
app.use(cors());
```

Para producción, restringir a tu dominio:
```javascript
app.use(cors({
  origin: 'https://tu-dominio.com'
}));
```

## 🚀 Despliegue (Producción)

### Opción 1: Vercel (Frontend) + Vercel Functions (Backend)

1. Convertir `server/index.js` a Vercel Function
2. Configurar variables de entorno en Vercel
3. Deploy

### Opción 2: Netlify (Frontend) + Netlify Functions (Backend)

Similar a Vercel, usando Netlify Functions.

### Opción 3: Railway / Render (Backend separado)

1. Deploy backend en Railway/Render
2. Deploy frontend en Vercel/Netlify
3. Configurar URL del backend en frontend

### Opción 4: Full Stack en Railway

1. Deploy todo el proyecto
2. Configurar variables de entorno
3. Railway detecta y ejecuta ambos

## 📚 Próximos Pasos

- [ ] Implementar autenticación (JWT)
- [ ] Agregar rate limiting
- [ ] Logs con Winston o Morgan
- [ ] Tests con Jest/Supertest
- [ ] Documentación con Swagger
- [ ] Caché con Redis
- [ ] Paginación de productos

## 💡 Tips

1. **Usar `npm run dev`** durante desarrollo (frontend + backend)
2. **Verificar `.env`** antes de iniciar
3. **Ver console logs** en ambos terminales
4. **Probar endpoints** con Postman o navegador
5. **Reiniciar servidor** después de cambiar `.env`

---

¿Necesitas ayuda? Revisa los logs en consola o abre un issue. 🤝
