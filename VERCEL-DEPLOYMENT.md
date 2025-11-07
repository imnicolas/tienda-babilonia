# Instrucciones de Deployment en Vercel

## Problema: Error de autenticación con Nexus

Si trabajas con Nexus en tu máquina local y obtienes este error al deployar en Vercel:

```
npm error code E401
npm error Unable to authenticate, need: BASIC realm="Sonatype Nexus Repository Manager"
```

## Solución Implementada

### 1. Archivo `.npmrc` en el proyecto

Se ha creado un archivo `.npmrc` en la raíz del proyecto que le indica a npm usar el registro público:

```
registry=https://registry.npmjs.org/
```

### 2. Archivo `vercel.json`

Se ha agregado configuración específica para Vercel:

```json
{
  "buildCommand": "npm install --registry=https://registry.npmjs.org && npm run build",
  "installCommand": "npm install --registry=https://registry.npmjs.org"
}
```

### 3. Subir los archivos al repositorio

Asegúrate de que ambos archivos estén en el repositorio:

```bash
git add .npmrc vercel.json
git commit -m "Fix: Configurar npm registry para Vercel"
git push origin main
```

## Deployment en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Importa tu repositorio de GitHub
3. Vercel detectará automáticamente que es un proyecto Create React App
4. Haz clic en "Deploy"

### Configuración del Proyecto en Vercel

**Framework Preset:** Create React App
**Build Command:** `npm run build` (o usa el del vercel.json)
**Output Directory:** `build`
**Install Command:** `npm install` (o usa el del vercel.json)

## Variables de Entorno (Opcional)

Si necesitas configurar el número de WhatsApp como variable de entorno:

1. En tu proyecto de Vercel, ve a Settings > Environment Variables
2. Agrega: `REACT_APP_WHATSAPP_NUMBER` con el valor del número
3. Actualiza `src/config/whatsapp.ts` para usar la variable:

```typescript
export const WHATSAPP_CONFIG = {
  phoneNumber: process.env.REACT_APP_WHATSAPP_NUMBER || '5491234567890',
  // ...
};
```

## Verificar el Deploy

Una vez deployado:

1. Abre la URL que te proporciona Vercel
2. Agrega productos al carrito
3. Verifica que se guarden en localStorage
4. Prueba el botón de WhatsApp

## Problemas Comunes

### El sitio no carga correctamente
- Verifica que el build haya sido exitoso en el dashboard de Vercel
- Revisa los logs de build para errores

### LocalStorage no funciona
- Verifica que la URL use HTTPS (Vercel lo hace por defecto)
- Abre las DevTools y revisa la pestaña Application > Local Storage

### WhatsApp no abre correctamente
- Asegúrate de que el número en `src/config/whatsapp.ts` sea correcto
- Verifica que el formato sea internacional sin el `+`

## Dominios Personalizados

Para agregar tu propio dominio:

1. En Vercel, ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar los DNS

## Actualizaciones Automáticas

Cada vez que hagas push a la rama `main`:
- Vercel detectará el cambio automáticamente
- Iniciará un nuevo build
- Deployará la nueva versión

---

**Tip:** Usa las Preview Deployments para probar cambios antes de mergear a main.
