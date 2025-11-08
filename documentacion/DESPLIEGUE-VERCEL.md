# 🚀 Guía de Despliegue en Vercel - Frontend + Backend

## 📋 Arquitectura del Proyecto

```
mi-tienda/
├── api/                          # 🔥 Vercel Serverless Functions
│   ├── health.js                 # GET /api/health
│   ├── products.js               # GET /api/products
│   └── delete-product.js         # DELETE /api/products/:publicId
├── server/                       # 💻 Solo para desarrollo local
│   ├── index.js                  # Express server (dev)
│   └── check-config.js           # Validación (dev)
├── src/                          # ⚛️ React Frontend
└── vercel.json                   # ⚙️ Configuración de Vercel
```

## 🎯 Cómo Funciona

### Desarrollo Local (npm run dev)
```
Frontend (React)          Backend (Express)
http://localhost:3000  →  http://localhost:5000
                          /api/health
                          /api/products
                          /api/products/:id
```

### Producción (Vercel)
```
Frontend (React)          Backend (Serverless Functions)
https://tu-app.vercel.app  ↓
├── /                     → React App (build/)
├── /api/health          → api/health.js
├── /api/products        → api/products.js
└── /api/products/:id    → api/delete-product.js
```

---

## 🚀 Paso a Paso: Desplegar en Vercel

### 1️⃣ Preparar el Repositorio

El código ya está listo. Solo necesitas:

```bash
# Asegurarte de que todo esté commiteado
git add .
git commit -m "feat: Vercel Serverless Functions integradas"
git push origin feature/cargar-productos-desde-cloudinary
```

### 2️⃣ Ir a Vercel Dashboard

1. Ir a: https://vercel.com/dashboard
2. Click en **"Add New..."** → **"Project"**
3. Seleccionar tu repositorio: **`tienda-babilonia`**
4. Click en **"Import"**

### 3️⃣ Configurar el Proyecto

**Framework Preset**: `Create React App` (autodetectado)

**Build Command**: `npm run build`

**Output Directory**: `build`

**Install Command**: `npm install`

✅ Vercel detecta automáticamente que es un proyecto CRA

### 4️⃣ Configurar Variables de Entorno

⚠️ **MUY IMPORTANTE**: Agregar las credenciales de Cloudinary

En la página de configuración del proyecto, ir a **"Environment Variables"**:

Agregar estas 3 variables:

| Name | Value |
|------|-------|
| `CLOUDINARY_CLOUD_NAME` | `drigawwbd` |
| `CLOUDINARY_API_KEY` | `481323753241216` |
| `CLOUDINARY_API_SECRET` | `EOJo1WLhYPIkLt2RTkCcJtlArP0` |

**Importante**: 
- ✅ Aplicar a: **Production**, **Preview**, y **Development**
- ✅ Sin comillas
- ✅ Copiar exactamente como están

### 5️⃣ Desplegar

Click en **"Deploy"**

Vercel hará:
1. ✅ Clonar el repositorio
2. ✅ Instalar dependencias (`npm install`)
3. ✅ Construir el frontend (`npm run build`)
4. ✅ Desplegar las Serverless Functions (`api/*.js`)
5. ✅ Asignar un dominio (ej: `tu-app.vercel.app`)

**Tiempo estimado**: 1-2 minutos

### 6️⃣ Verificar el Despliegue

Una vez desplegado, Vercel te dará una URL:

**Ejemplo**: `https://tienda-babilonia.vercel.app`

#### Probar el Frontend
```
https://tienda-babilonia.vercel.app
```

Deberías ver tu tienda funcionando.

#### Probar el Backend
```
https://tienda-babilonia.vercel.app/api/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "Babilonia Calzados API funcionando correctamente",
  "cloudinary": {
    "configured": true,
    "cloud_name": "drigawwbd"
  }
}
```

#### Probar Listar Productos
```
https://tienda-babilonia.vercel.app/api/products
```

Deberías ver:
```json
{
  "success": true,
  "count": X,
  "products": [...]
}
```

---

## 🔄 Actualizaciones Automáticas

Cada vez que hagas push a la rama configurada, Vercel re-desplegará automáticamente:

```bash
git add .
git commit -m "update: nuevas features"
git push
```

Vercel detecta el push → Build automático → Deploy

---

## 🎯 Diferencias: Desarrollo vs Producción

### Variables de Entorno

**Desarrollo** (`.env`):
```env
REACT_APP_API_URL=http://localhost:5000
```
→ Frontend apunta al backend local

**Producción** (`.env.production`):
```env
REACT_APP_API_URL=
```
→ Frontend usa rutas relativas (`/api/...`)

### Backend

**Desarrollo**: 
- Express server en `server/index.js`
- Puerto 5000
- Ejecutar con `npm run dev`

**Producción**: 
- Vercel Serverless Functions en `api/*.js`
- Sin puerto (serverless)
- Deploy automático con Vercel

---

## 📂 Archivos Clave para Vercel

### `vercel.json`

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "create-react-app",
  "rewrites": [
    {
      "source": "/api/health",
      "destination": "/api/health.js"
    },
    {
      "source": "/api/products",
      "destination": "/api/products.js"
    },
    {
      "source": "/api/products/:publicId",
      "destination": "/api/delete-product.js?publicId=:publicId"
    }
  ]
}
```

**Lo que hace**:
- Define qué comando usar para build
- Mapea rutas a Serverless Functions
- Configura el framework

### `api/*.js`

Cada archivo en `api/` se convierte en una Serverless Function.

**Ejemplo**: `api/products.js` → `https://tu-app.vercel.app/api/products`

---

## 🔒 Seguridad en Producción

### Variables de Entorno

✅ Las variables de entorno en Vercel están **encriptadas**  
✅ NO se exponen en el frontend  
✅ Solo accesibles desde Serverless Functions  

### CORS

Las funciones en `api/*.js` tienen CORS configurado:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

**Para producción**, considera restringir:
```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://tu-dominio.com');
```

---

## 🐛 Troubleshooting

### Error: "Function execution timed out"

**Causa**: Cloudinary tarda mucho en responder

**Solución**: Vercel tiene límite de 10s para funciones serverless en plan gratuito. Considera:
- Upgrade a plan Pro (60s timeout)
- Implementar paginación
- Reducir `max_results` en Cloudinary API

### Error: "Missing environment variables"

**Causa**: No se configuraron las variables en Vercel

**Solución**:
1. Ir a: Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Agregar: `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`
3. Redeploy

### Error 404 en `/api/products`

**Causa**: Vercel no detectó las Serverless Functions

**Solución**:
1. Verificar que `api/` está en la raíz del proyecto
2. Verificar que los archivos terminan en `.js`
3. Redeploy

### Frontend funciona pero API no

**Causa**: `vercel.json` no está configurado correctamente

**Solución**:
1. Verificar que `vercel.json` existe en la raíz
2. Verificar sintaxis JSON
3. Redeploy

---

## 📊 Comparación: Antes vs Ahora

| Aspecto | ❌ Antes | ✅ Ahora |
|---------|---------|----------|
| **Frontend** | Deploy OK | Deploy OK ✅ |
| **Backend** | No existía | Serverless Functions ✅ |
| **API** | Error 401 | Funciona ✅ |
| **Infraestructura** | Solo frontend | Frontend + Backend ✅ |
| **Mantenimiento** | - | Automático ✅ |
| **Escalabilidad** | - | Auto-scaling ✅ |

---

## 🎓 Ventajas de Vercel Serverless Functions

✅ **Auto-scaling**: Escala automáticamente con el tráfico  
✅ **Zero config**: No necesitas configurar servidores  
✅ **Global CDN**: Funciones disponibles globalmente  
✅ **Instant deployment**: Deploy en segundos  
✅ **Free tier**: Plan gratuito generoso  
✅ **HTTPS automático**: SSL incluido  

---

## 📝 Checklist de Despliegue

- [ ] Código pusheado a GitHub
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas en Vercel:
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
- [ ] Deploy exitoso
- [ ] Probar frontend: `https://tu-app.vercel.app`
- [ ] Probar backend: `https://tu-app.vercel.app/api/health`
- [ ] Probar productos: `https://tu-app.vercel.app/api/products`
- [ ] Verificar que NO hay error 401
- [ ] Productos se cargan correctamente

---

## 🚀 Comandos Útiles de Vercel CLI (Opcional)

Instalar Vercel CLI:
```bash
npm i -g vercel
```

Desplegar desde terminal:
```bash
vercel
```

Ver logs en tiempo real:
```bash
vercel logs
```

---

## 🎯 Resultado Final

Después del deploy, tendrás:

```
✅ Frontend React funcionando
✅ Backend Serverless Functions funcionando
✅ Cloudinary API integrada
✅ Listar productos desde Cloudinary
✅ Eliminar productos de Cloudinary
✅ HTTPS automático
✅ Dominio .vercel.app (puedes usar dominio custom)
✅ Deploy automático en cada push
```

---

**¡Tu aplicación estará 100% funcional en producción!** 🎉

_Tanto el frontend como el backend estarán hosteados en Vercel._
