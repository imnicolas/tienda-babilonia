# 🔑 Cómo Obtener las Credenciales de Cloudinary

## 📋 Paso a Paso

### 1. Acceder a Cloudinary Console

Ir a: **https://console.cloudinary.com/console**

Si no tienes cuenta, crear una gratis en: https://cloudinary.com/users/register/free

### 2. Ubicar las Credenciales

Una vez dentro del Dashboard, verás un panel como este:

```
╔═══════════════════════════════════════════════════╗
║  Account Details                                  ║
║                                                   ║
║  Cloud name:  drigawwbd                          ║
║  API Key:     123456789012345                    ║
║  API Secret:  abc123XYZ456def789                 ║
║               [Show] [Copy]                       ║
║                                                   ║
║  API Base URL: https://api.cloudinary.com/v1_1/  ║
║                drigawwbd                          ║
╚═══════════════════════════════════════════════════╝
```

### 3. Copiar las Credenciales

**API Key**:
- Click en el ícono de "Copy" 📋
- Es un número de ~15 dígitos
- Ejemplo: `123456789012345`

**API Secret**:
- Click en "Show" para revelarlo
- Click en "Copy" para copiarlo
- Es una cadena alfanumérica
- Ejemplo: `abc123XYZ456def789`
- ⚠️ **NO compartir públicamente**

### 4. Agregar al Archivo `.env`

Abrir el archivo `.env` en la raíz del proyecto:

```env
CLOUDINARY_CLOUD_NAME=drigawwbd
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc123XYZ456def789
PORT=5000
```

**Importante**:
- ✅ Sin comillas
- ✅ Sin espacios extra
- ✅ Pegar exactamente como está en Cloudinary

## 📸 Capturas de Pantalla (Referencia)

### Dashboard Principal

Al entrar a https://console.cloudinary.com/console verás:

```
┌─────────────────────────────────────────────────┐
│ Cloudinary Console                              │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Dashboard                                   │
│  🖼️  Media Library                              │
│  ⚙️  Settings                                   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🔑 Account Details                      │   │
│  │                                         │   │
│  │  Cloud name:  drigawwbd                │   │
│  │  API Key:     ••••••••••••345          │   │
│  │  API Secret:  •••••••••••• [Show]      │   │
│  │                           📋 [Copy]     │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Ubicación de las Credenciales

Las credenciales están en la parte superior derecha del Dashboard.

Si no las ves:
1. Click en "Settings" (⚙️) en el menú lateral
2. Click en "Account" → "API Keys"
3. Ahí verás todas tus credenciales

## 🔒 Seguridad

### ⚠️ API Secret es PRIVADO

El **API Secret** es como una contraseña:
- ❌ **NO** compartir en GitHub
- ❌ **NO** incluir en código frontend
- ❌ **NO** compartir públicamente
- ✅ Solo usar en backend/servidor
- ✅ Mantener en archivo `.env` (que está en `.gitignore`)

### ✅ API Key es PÚBLICO

El **API Key** puede ser público, pero es mejor mantenerlo privado también.

### 🔐 Rotar Credenciales

Si accidentalmente expones tu API Secret:
1. Ir a Cloudinary Console → Settings → Security
2. Click en "Regenerate API Secret"
3. Actualizar el archivo `.env` con el nuevo secret

## 🧪 Verificar que Funciona

Después de configurar `.env`:

### 1. Iniciar el backend

```bash
npm run server
```

**Salida esperada**:
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
║   ☁️  Cloudinary: drigawwbd                          ║
╚═══════════════════════════════════════════════════════╝
```

### 2. Probar endpoint de health

Abrir en navegador: http://localhost:5000/api/health

**Respuesta esperada**:
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

Si `configured: true` → ✅ Todo bien!

### 3. Probar listar productos

Abrir en navegador: http://localhost:5000/api/products

**Respuesta esperada**:
```json
{
  "success": true,
  "count": 5,
  "products": [...]
}
```

## 🐛 Errores Comunes

### Error: "Cloudinary no está completamente configurado"

**Causa**: Falta API Key o Secret en `.env`

**Solución**: 
1. Verificar que `.env` existe
2. Verificar que tiene `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET`
3. Reiniciar el servidor

### Error: "Invalid API Key"

**Causa**: API Key incorrecto

**Solución**:
1. Verificar en Cloudinary Console que el API Key es correcto
2. Copiar de nuevo (sin espacios)
3. Actualizar `.env`

### Error: "Invalid signature"

**Causa**: API Secret incorrecto

**Solución**:
1. En Cloudinary Console, click en "Show" en API Secret
2. Copiar exactamente como aparece
3. Actualizar `.env`
4. Reiniciar servidor

### Error: "Cannot find module 'dotenv'"

**Causa**: Falta instalar dependencias

**Solución**:
```bash
npm install
```

## 📝 Checklist

- [ ] Tengo cuenta en Cloudinary
- [ ] Accedí a https://console.cloudinary.com/console
- [ ] Copié el API Key (15 dígitos)
- [ ] Copié el API Secret (cadena alfanumérica)
- [ ] Creé/edité el archivo `.env`
- [ ] Pegué las credenciales sin comillas ni espacios
- [ ] Ejecuté `npm run server`
- [ ] Vi el mensaje "✅ Configuración correcta!"
- [ ] Probé http://localhost:5000/api/health
- [ ] Vi `"configured": true`

## 🎯 Próximo Paso

Una vez configurado, ejecutar:

```bash
npm run dev
```

Esto iniciará frontend + backend y podrás usar la aplicación completa! 🚀

---

**¿Problemas?** Revisa la documentación completa en `CONFIGURACION-BACKEND.md`
