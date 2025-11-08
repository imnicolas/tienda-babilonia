# 🚀 Guía de Inicio - Modo Desarrollo

## 📋 Requisitos Previos
- Node.js instalado (v14 o superior)
- npm instalado
- Credenciales de Cloudinary configuradas

## 🔧 Configuración de Variables de Entorno

### 1. Backend (.env)
El archivo `.env` en la raíz del proyecto debe contener:
```env
CLOUDINARY_CLOUD_NAME=drigawwbd
CLOUDINARY_API_KEY=481323753241216
CLOUDINARY_API_SECRET=EOJo1WLhYPIkLt2RTkCcJtlArP0
PORT=5000
```

### 2. Frontend (.env.local)
El archivo `.env.local` en la raíz del proyecto debe contener:
```env
PORT=3000
REACT_APP_API_URL=http://localhost:5000
```

## ▶️ Iniciar el Proyecto

### Opción 1: Todo en uno (Recomendado)
```bash
npm run dev
```

Este comando:
- ✅ Inicia el backend en puerto 5000
- ✅ Inicia el frontend en puerto 3000
- ✅ Ambos servicios corren simultáneamente

### Opción 2: Servicios por separado

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:3000 | Aplicación React |
| Backend | http://localhost:5000 | API Express |
| Health Check | http://localhost:5000/api/health | Estado del servidor |
| Productos | http://localhost:5000/api/products | Lista de productos |

## 🐛 Solución de Problemas

### Puerto ocupado
Si obtienes error de "port already in use":

```powershell
# Matar procesos en puertos 3000 y 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Módulos no encontrados
```bash
npm install
```

### Variables de entorno no cargadas
1. Verifica que los archivos `.env` y `.env.local` existan
2. Reinicia el servidor después de modificar variables de entorno
3. No uses comillas en los valores de las variables

## 📦 Endpoints Disponibles

### GET /api/health
Verifica el estado del servidor
```json
{
  "success": true,
  "message": "Babilonia Calzados API funcionando correctamente",
  "timestamp": "2025-11-08T...",
  "cloudinary": {
    "configured": true,
    "cloud_name": "drigawwbd"
  }
}
```

### GET /api/products
Obtiene todos los productos desde Cloudinary
```json
{
  "success": true,
  "count": 10,
  "products": [...]
}
```

### GET /api/products/:publicId
Obtiene un producto específico

### DELETE /api/products/:publicId
Elimina un producto de Cloudinary

## 🚢 Despliegue a Producción

### Vercel
1. Asegúrate de que las variables de entorno estén configuradas en Vercel:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

2. Realiza commit y push:
```bash
git add .
git commit -m "feat: configuración lista para producción"
git push origin main
```

3. Vercel desplegará automáticamente

### Variables de Entorno en Vercel
Ve a tu proyecto en Vercel → Settings → Environment Variables y agrega:
- `CLOUDINARY_CLOUD_NAME=drigawwbd`
- `CLOUDINARY_API_KEY=481323753241216`
- `CLOUDINARY_API_SECRET=EOJo1WLhYPIkLt2RTkCcJtlArP0`

## ✅ Verificación de Configuración

Ejecuta este comando para verificar la configuración:
```bash
node server/check-config.js
```

Deberías ver:
```
🔍 Verificando configuración...
✅ Configuración correcta!
🔑 Variables configuradas:
   • CLOUDINARY_CLOUD_NAME: drigawwbd
   • CLOUDINARY_API_KEY: 4813...
   • PORT: 5000
```
