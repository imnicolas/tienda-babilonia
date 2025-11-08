# ⚡ Setup Rápido - Upload Preset de Cloudinary

## 🎯 Objetivo
Configurar el Upload Preset necesario para que funcione el sistema de upload de productos.

---

## 📋 Pasos (5 minutos)

### 1. Login en Cloudinary
```
URL: https://cloudinary.com/console
Usuario: Tu cuenta (drigawwbd)
```

### 2. Ir a Settings → Upload
- Click en el ícono de engranaje (⚙️) arriba a la derecha
- En el menú lateral, click en **"Upload"**
- Scroll hasta **"Upload presets"**

### 3. Crear Nuevo Preset
- Click en **"Add upload preset"** (botón azul)

### 4. Configuración Básica
```
Preset name: babilonia-products
Signing Mode: Unsigned ⚠️ (IMPORTANTE)
Folder: (dejar vacío o poner "productos")
```

### 5. Configuración Avanzada (Opcional pero Recomendada)
```
Allowed formats: jpg, png, webp, jpeg
Max file size: 5 MB (5242880 bytes)
Transformation:
  - Quality: auto
  - Format: auto
  - Fetch format: auto
```

### 6. Guardar
- Scroll hasta abajo
- Click en **"Save"**

---

## ✅ Verificación

Después de crear el preset, deberías ver:

```
Upload preset: babilonia-products
Mode: Unsigned
Status: Active
```

---

## 🧪 Test del Sistema

### 1. Iniciar app
```bash
npm start
```

### 2. Navegar a panel admin
```
http://localhost:3000/argdev
```

### 3. Subir producto de prueba
- Imagen: Cualquier foto de zapatos
- Título: "Test Producto"
- Precio: 99.99
- Click "Crear Producto"

### 4. Verificar en Cloudinary
- Ir a Media Library
- Buscar "test-producto"
- ✅ Debería aparecer la imagen subida

---

## ❌ Troubleshooting

### Error: "Upload preset not found"
**Causa:** El preset no existe o está mal escrito

**Solución:**
1. Verificar nombre exacto: `babilonia-products`
2. Verificar que esté en modo "Unsigned"
3. Verificar que esté guardado

### Error: "Upload failed - 401 Unauthorized"
**Causa:** Signing Mode está en "Signed"

**Solución:**
1. Editar preset
2. Cambiar a "Unsigned"
3. Guardar

### Error: "Invalid image file"
**Causa:** Formato no permitido

**Solución:**
1. Usar JPG, PNG o WEBP
2. Verificar que sea menor a 5MB

---

## 🔐 Notas de Seguridad

⚠️ **Unsigned Mode significa que cualquiera con el nombre del preset puede subir imágenes.**

Para producción, considera:
1. Cambiar a "Signed" mode
2. Implementar backend que firme requests
3. Agregar autenticación en `/argdev`

---

## 📸 Screenshots de Configuración

### Paso 1: Upload Settings
```
Settings → Upload → Upload presets → Add upload preset
```

### Paso 2: Configuración Básica
```
[Screenshot placeholder]
- Preset name: babilonia-products
- Signing Mode: ● Unsigned
- Folder: productos (optional)
```

### Paso 3: Advanced Settings
```
[Screenshot placeholder]
- Allowed formats: jpg,png,webp
- Max file size: 5242880
- Quality: auto
- Format: auto
```

---

## 🎉 ¡Listo!

Una vez configurado el preset, el sistema está listo para:
- ✅ Subir productos desde `/argdev`
- ✅ Almacenar imágenes en Cloudinary
- ✅ Mostrar productos en home automáticamente

---

**Tiempo estimado:** 5 minutos  
**Dificultad:** Fácil ⭐  
**Requerimiento:** Cuenta de Cloudinary activa
