# 📋 Lista de Public IDs para Cloudinary - Babilonia Calzados

## ✅ Cloud Name Configurado
**Tu Cloud Name:** `drigawwbd`

---

## 📁 Estructura de Carpetas en Cloudinary

Debes crear estas carpetas simples en tu Media Library (sin subcarpetas):

```
productos/        ← Aquí van las imágenes de productos
categorias/       ← Aquí van las imágenes de categorías
banners/          ← Aquí van los banners promocionales
logos/            ← Aquí va el logo de la tienda
```

**Nota:** Cloudinary no permite caracteres como `/` en nombres de carpetas dentro del path, por eso usamos nombres simples.

---

## 🛍️ PRODUCTOS (Prioridad Alta)

### Carpeta en Cloudinary: `productos/`

| # | Nombre del Producto | Public ID Requerido | Categoría |
|---|---------------------|---------------------|-----------|
| 1 | Zapatos Clásicos de Cuero | `zapatos-clasicos-cuero` | Hombres |
| 2 | Zapatillas Deportivas | `zapatillas-deportivas` | Deportivo |
| 3 | Botas de Mujer Elegantes | `botas-mujer-elegantes` | Mujeres |
| 4 | Sandalias de Verano | `sandalias-verano` | Mujeres |
| 5 | Zapatos Casuales | `zapatos-casuales` | Hombres |
| 6 | Zapatillas para Niños | `zapatillas-ninos` | Niños |

### ⚠️ IMPORTANTE - Reglas para los Public IDs:
- ✅ Todo en minúsculas
- ✅ Sin tildes (ó → o, á → a, í → i)
- ✅ Palabras separadas por guiones (-)
- ✅ Sin espacios
- ✅ Sin extensión (.jpg, .png, etc.)
- ✅ Sin caracteres especiales (!, @, #, etc.)

---

## 📸 Cómo Subir las Imágenes

### Opción 1: Subir con el Public ID correcto desde el inicio

1. Ve a Cloudinary: https://console.cloudinary.com
2. Click en **Media Library** (menú izquierdo)
3. Navega o crea la carpeta: `productos/` (solo "productos", sin más subcarpetas)
4. Click en **Upload**
5. Selecciona tu imagen
6. **ANTES de confirmar**, click en **Edit**
7. En el campo **Public ID**, escribe exactamente: `zapatos-clasicos-cuero`
8. Click en **Save**
9. Repite para las 6 imágenes

### Opción 2: Renombrar después de subir

1. Sube la imagen a `productos/`
2. En la Media Library, busca la imagen
3. Click en los 3 puntos (⋮) → **Manage**
4. En **Public ID**, cambia al nombre correcto
5. Click en **Save**

---

## 🎯 URLs Generadas Automáticamente

Una vez subidas, las URLs serán:

```
https://res.cloudinary.com/drigawwbd/image/upload/w_400,h_400,c_fill,g_auto,q_auto,f_auto/productos/zapatos-clasicos-cuero

https://res.cloudinary.com/drigawwbd/image/upload/w_400,h_400,c_fill,g_auto,q_auto,f_auto/productos/zapatillas-deportivas

https://res.cloudinary.com/drigawwbd/image/upload/w_400,h_400,c_fill,g_auto,q_auto,f_auto/productos/botas-mujer-elegantes

https://res.cloudinary.com/drigawwbd/image/upload/w_400,h_400,c_fill,g_auto,q_auto,f_auto/productos/sandalias-verano

https://res.cloudinary.com/drigawwbd/image/upload/w_400,h_400,c_fill,g_auto,q_auto,f_auto/productos/zapatos-casuales

https://res.cloudinary.com/drigawwbd/image/upload/w_400,h_400,c_fill,g_auto,q_auto,f_auto/productos/zapatillas-ninos
```

**Nota:** El sistema genera estas URLs automáticamente con optimizaciones (WebP, compresión, recorte inteligente).

---

## 📝 Checklist de Subida

Marca cada imagen cuando la subas:

### Productos
- [ ] `zapatos-clasicos-cuero` - Zapatos Clásicos de Cuero
- [ ] `zapatillas-deportivas` - Zapatillas Deportivas
- [ ] `botas-mujer-elegantes` - Botas de Mujer Elegantes
- [ ] `sandalias-verano` - Sandalias de Verano
- [ ] `zapatos-casuales` - Zapatos Casuales
- [ ] `zapatillas-ninos` - Zapatillas para Niños

---

## 🏷️ CATEGORÍAS (Opcional - Para Futuro)

Si quieres agregar imágenes para las categorías:

### Carpeta en Cloudinary: `categorias/`

| Categoría | Public ID Requerido |
|-----------|---------------------|
| Hombres | `hombres` |
| Mujeres | `mujeres` |
| Niños | `ninos` |
| Deportivo | `deportivo` |

**Uso en el código:**
```tsx
<CategoryImage
  categoryId="hombres"
  alt="Calzado para Hombres"
/>
```

---

## 🎨 BANNERS (Opcional - Para Futuro)

### Carpeta en Cloudinary: `banners/`

| Tipo | Public ID Sugerido | Uso |
|------|-------------------|-----|
| Hero Principal | `hero-principal` | Imagen grande de portada (1920x800) |
| Oferta de Verano | `oferta-verano` | Banner promocional (1920x600) |
| Oferta de Invierno | `oferta-invierno` | Banner promocional (1920x600) |
| Black Friday | `black-friday` | Banner temporal (1920x600) |

**Uso en el código:**
```tsx
<HeroImage
  heroId="hero-principal"
  alt="Bienvenido a Babilonia Calzados"
/>

<BannerImage
  bannerId="oferta-verano"
  alt="Ofertas de Verano"
/>
```

---

## 🎨 LOGOS (Opcional)

### Carpeta en Cloudinary: `logos/`

| Tipo | Public ID Sugerido |
|------|-------------------|
| Logo Principal | `logo-babilonia` |
| Logo Blanco | `logo-babilonia-blanco` |
| Favicon | `favicon` |

---

## 🔍 Verificar que las Imágenes se Subieron Correctamente

### Método 1: Desde Cloudinary
1. Ve a Media Library
2. Navega a `productos/`
3. Verifica que veas las 6 imágenes
4. Verifica que cada Public ID sea exacto (sin .jpg, sin mayúsculas)

### Método 2: URL Directa
Abre en el navegador:
```
https://res.cloudinary.com/drigawwbd/image/upload/productos/zapatos-clasicos-cuero
```
Si ves la imagen, está correcta.

### Método 3: En tu Aplicación
```powershell
npm start
```
- Ve a la sección "Productos Destacados"
- Si configuraste todo bien, deberías ver tus imágenes
- Si ves placeholders con "Sin imagen", revisa el Public ID

---

## 🛠️ Solución de Problemas

### ❌ "No se muestra la imagen, solo placeholder"

**Revisa:**
1. ✅ El Public ID en Cloudinary es exactamente: `zapatos-clasicos-cuero`
2. ✅ No tiene extensión (.jpg)
3. ✅ Está en la carpeta: `productos/`
4. ✅ El Cloud Name es: `drigawwbd`

**Prueba esta URL en el navegador:**
```
https://res.cloudinary.com/drigawwbd/image/upload/productos/zapatos-clasicos-cuero
```

### ❌ "Error 404 - Not Found"

**Causas:**
- La imagen no está subida
- El Public ID no coincide
- La carpeta es incorrecta

**Solución:**
1. Ve a Media Library en Cloudinary
2. Busca la imagen
3. Verifica que el path completo sea: `productos/zapatos-clasicos-cuero`

### ❌ "Las imágenes se ven mal o pixeladas"

**Solución:**
Sube imágenes de mayor resolución. Recomendaciones:
- Mínimo: 800x800 px
- Ideal: 1200x1200 px
- Formato: JPG o PNG
- Tamaño: Menos de 5 MB

Cloudinary las optimizará automáticamente.

---

## 📊 Resumen de Public IDs

### NECESARIOS AHORA (6 imágenes)
```
productos/zapatos-clasicos-cuero
productos/zapatillas-deportivas
productos/botas-mujer-elegantes
productos/sandalias-verano
productos/zapatos-casuales
productos/zapatillas-ninos
```

### OPCIONALES PARA FUTURO
```
categorias/hombres
categorias/mujeres
categorias/ninos
categorias/deportivo

banners/hero-principal
banners/oferta-verano

logos/logo-babilonia
```

---

## 🎯 Próximo Paso

1. **Sube las 6 imágenes de productos** con los Public IDs exactos
2. **Ejecuta:** `npm start`
3. **Verifica** que se muestren en la sección "Productos Destacados"
4. **Si funciona:** ¡Listo! Ya puedes hacer deploy
5. **Si no funciona:** Revisa la sección "Solución de Problemas"

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
1. Verifica que el Public ID sea exactamente igual (copia y pega)
2. Revisa la consola del navegador (F12) en busca de errores
3. Prueba la URL directa en el navegador
4. Verifica que la imagen esté en `productos/`

---

**¡Todo está listo en el código! Solo falta subir las imágenes con los Public IDs correctos.** 🚀
