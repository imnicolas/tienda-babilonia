# 🚀 Pasos para Deploy en Vercel - Babilonia Calzados

## 📋 Resumen Ejecutivo

Tu proyecto está **100% listo para compilar**, pero Vercel tiene un problema de autenticación con Nexus (tu configuración de trabajo). Ya creamos los archivos necesarios para solucionarlo.

---

## ✅ PASO 1: Verificar Configuración Local (OPCIONAL)

Ejecuta el script de verificación para entender tu configuración actual:

```powershell
.\check-npm-config.ps1
```

Este script te mostrará:
- Qué registro de npm estás usando
- Dónde están tus archivos .npmrc
- Si hay configuración de Nexus activa

---

## ✅ PASO 2: Actualizar Número de WhatsApp

Abre el archivo `src/config/whatsapp.ts` y cambia el número de teléfono:

```typescript
export const WHATSAPP_CONFIG = {
  phoneNumber: '5491234567890', // ⚠️ CAMBIAR POR TU NÚMERO REAL
  storeName: 'Babilonia Calzados',
  greeting: '¡Hola! Me gustaría hacer un pedido:'
};
```

**Formato del número:** Internacional sin el `+`
- ✅ Correcto: `5491123456789` (Argentina)
- ✅ Correcto: `573001234567` (Colombia)
- ❌ Incorrecto: `+5491123456789`
- ❌ Incorrecto: `1123456789`

---

## ✅ PASO 3: Commit de los Archivos de Configuración

Ejecuta estos comandos en la terminal de PowerShell:

```powershell
# Agregar los archivos nuevos al repositorio
git add .npmrc
git add vercel.json
git add src/config/whatsapp.ts
git add VERCEL-DEPLOYMENT.md
git add WHATSAPP-CONFIG.md
git add PASOS-DEPLOYMENT.md
git add check-npm-config.ps1

# Hacer commit
git commit -m "feat: Add Vercel deployment config and WhatsApp integration"

# Subir a GitHub
git push origin main
```

> **Nota:** Si tu rama principal se llama `master` en lugar de `main`, usa:
> ```powershell
> git push origin master
> ```

---

## ✅ PASO 4: Configurar en Vercel

### 4.1 Importar Proyecto (si es la primera vez)

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Add New Project"**
3. Selecciona tu repositorio de GitHub
4. Click en **"Import"**

### 4.2 Configurar el Proyecto

**Framework Preset:** Create React App (se detecta automáticamente)

**Build Settings:**
- **Build Command:** `npm install --registry=https://registry.npmjs.org && npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install --registry=https://registry.npmjs.org`

> **IMPORTANTE:** Estos comandos ya están en `vercel.json`, pero si Vercel te pide configurarlos manualmente, usa estos valores.

### 4.3 Deploy

Click en **"Deploy"** y espera a que termine el build.

---

## ✅ PASO 5: Verificar el Deploy

Una vez que Vercel termine, verás algo como:

```
✓ Build completed successfully
✓ Deployment ready
```

### Probar tu sitio:

1. **URL del sitio:** Click en el enlace que te da Vercel (algo como `https://tu-proyecto.vercel.app`)

2. **Probar el carrito:**
   - Agrega productos al carrito
   - Cierra el navegador y vuelve a abrir
   - El carrito debe mantener los productos (localStorage funcionando)

3. **Probar WhatsApp:**
   - Agrega productos al carrito
   - Click en **"Continuar con la Compra"** (botón verde con ícono de WhatsApp)
   - Debe abrir WhatsApp Web con un mensaje formateado
   - Verifica que el número sea el correcto

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### ❌ Error: "Unable to authenticate, need: BASIC realm='Sonatype Nexus Repository Manager'"

**Causa:** Vercel está intentando usar tu configuración de Nexus del trabajo.

**Solución:**
1. Verifica que `.npmrc` y `vercel.json` estén en tu repositorio
2. Ejecuta: `git status` para confirmar
3. Si no están, repite el PASO 3
4. Haz un **Redeploy** en Vercel

### ❌ Error: "Module not found"

**Causa:** Falta alguna dependencia.

**Solución:**
```powershell
npm install --registry=https://registry.npmjs.org
npm run build
```

Si funciona localmente, haz commit de `package-lock.json`:
```powershell
git add package-lock.json
git commit -m "fix: Update package-lock.json"
git push origin main
```

### ❌ WhatsApp abre pero el número está mal

**Causa:** No actualizaste `src/config/whatsapp.ts`.

**Solución:**
1. Edita `src/config/whatsapp.ts` con tu número real
2. Commit y push:
```powershell
git add src/config/whatsapp.ts
git commit -m "fix: Update WhatsApp phone number"
git push origin main
```

### ❌ El carrito no guarda los productos

**Causa:** El navegador tiene bloqueado el localStorage.

**Solución:**
- Abre las herramientas de desarrollador (F12)
- Ve a la pestaña "Application" > "Local Storage"
- Busca la clave `babilonia-cart`
- Si no existe, revisa la consola en busca de errores

---

## 📱 Configurar Dominio Personalizado (OPCIONAL)

Si tienes un dominio (ej: `www.babiloniacalzados.com`):

1. En Vercel, ve a **Settings** > **Domains**
2. Click en **"Add Domain"**
3. Ingresa tu dominio
4. Sigue las instrucciones para configurar DNS

---

## 📊 Archivos Clave del Proyecto

| Archivo | Propósito |
|---------|-----------|
| `.npmrc` | Fuerza el uso del registro público de npm (soluciona conflicto con Nexus) |
| `vercel.json` | Configuración de build para Vercel |
| `src/config/whatsapp.ts` | Número de WhatsApp y configuración de mensajes |
| `src/components/CartContext.tsx` | Lógica del carrito con localStorage y WhatsApp |
| `src/components/Cart.tsx` | UI del carrito con botón de WhatsApp |

---

## 🎯 Estado Actual del Proyecto

✅ **Compilación:** 0 errores  
✅ **Dependencias:** Todas instaladas  
✅ **LocalStorage:** Implementado y funcionando  
✅ **WhatsApp:** Integrado con mensaje formateado  
✅ **Configuración Vercel:** Lista  
⏳ **Deploy:** Pendiente de tu push a GitHub  

---

## 📞 Contacto de Emergencia

Si después de seguir estos pasos aún tienes problemas:

1. Revisa los logs de Vercel: **Deployments** > Click en el deployment fallido > **View Build Logs**
2. Copia el error exacto
3. Verifica que todos los archivos estén en GitHub
4. Intenta hacer un build local: `npm run build`

---

## 🎉 ¡Éxito!

Una vez que el deploy funcione, tu tienda estará en línea con:

- ✅ Carrito persistente (localStorage)
- ✅ Integración con WhatsApp
- ✅ Diseño responsivo
- ✅ 48 componentes UI de Radix
- ✅ Animaciones y efectos
- ✅ Optimización de producción

**Próximos pasos recomendados:**
1. Agregar productos reales
2. Configurar un dominio personalizado
3. Agregar Google Analytics (opcional)
4. Configurar un favicon personalizado

---

*Última actualización: Script de verificación incluido para diagnóstico de configuración de npm*
