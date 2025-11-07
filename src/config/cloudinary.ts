// Configuración de Cloudinary para Babilonia Calzados
// Documentación: https://cloudinary.com/documentation/react_integration

export const CLOUDINARY_CONFIG = {
  // 🔧 CONFIGURACIÓN REQUERIDA
  // Reemplaza 'demo' con tu Cloud Name de Cloudinary
  // Lo puedes encontrar en: https://console.cloudinary.com/settings
  cloudName: 'drigawwbd', // ⚠️ CAMBIAR POR TU CLOUD NAME
  
  // 🎨 CONFIGURACIÓN DE IMÁGENES
  // Carpetas donde se organizarán las imágenes en Cloudinary
  // Nota: Nombres simples sin barras (/) para evitar errores en Cloudinary
  folders: {
    products: 'productos',
    categories: 'categorias',
    banners: 'banners',
    logos: 'logos'
  },
  
  // ⚙️ TRANSFORMACIONES PREDEFINIDAS
  // Optimizaciones comunes para diferentes usos
  transformations: {
    thumbnail: {
      width: 150,
      height: 150,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    },
    productCard: {
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    },
    productDetail: {
      width: 800,
      height: 800,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    },
    banner: {
      width: 1920,
      height: 600,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    },
    hero: {
      width: 1920,
      height: 800,
      crop: 'fill',
      gravity: 'center',
      quality: 'auto',
      fetch_format: 'auto'
    }
  }
};

// 🖼️ Función helper para construir URLs de Cloudinary
export const buildCloudinaryUrl = (
  publicId: string,
  transformation?: keyof typeof CLOUDINARY_CONFIG.transformations | string,
  customParams?: Record<string, string | number>
): string => {
  const { cloudName, transformations } = CLOUDINARY_CONFIG;
  
  // URL base de Cloudinary
  let url = `https://res.cloudinary.com/${cloudName}/image/upload/`;
  
  // Aplicar transformación predefinida si existe
  if (transformation && typeof transformation === 'string' && transformation in transformations) {
    const preset = transformations[transformation as keyof typeof transformations];
    const params = Object.entries(preset)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    url += `${params}/`;
  }
  
  // Aplicar parámetros personalizados
  if (customParams) {
    const params = Object.entries(customParams)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    url += `${params}/`;
  }
  
  // Agregar el public ID de la imagen
  url += publicId;
  
  return url;
};

// 🔗 Función helper para obtener URL con transformación específica
export const getProductImage = (productId: string, size: 'thumbnail' | 'card' | 'detail' = 'card'): string => {
  const folder = CLOUDINARY_CONFIG.folders.products;
  const publicId = `${folder}/${productId}`;
  
  const transformationMap = {
    thumbnail: 'thumbnail',
    card: 'productCard',
    detail: 'productDetail'
  };
  
  return buildCloudinaryUrl(publicId, transformationMap[size]);
};

// 🏷️ Función helper para obtener imagen de categoría
export const getCategoryImage = (categoryId: string): string => {
  const folder = CLOUDINARY_CONFIG.folders.categories;
  const publicId = `${folder}/${categoryId}`;
  return buildCloudinaryUrl(publicId, 'productCard');
};

// 🎯 Función helper para obtener imagen de banner
export const getBannerImage = (bannerId: string): string => {
  const folder = CLOUDINARY_CONFIG.folders.banners;
  const publicId = `${folder}/${bannerId}`;
  return buildCloudinaryUrl(publicId, 'banner');
};

// 🦸 Función helper para obtener imagen hero
export const getHeroImage = (heroId: string): string => {
  const folder = CLOUDINARY_CONFIG.folders.banners;
  const publicId = `${folder}/${heroId}`;
  return buildCloudinaryUrl(publicId, 'hero');
};

// 🎨 Imagen placeholder mientras no hay imágenes subidas
export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400?text=Babilonia+Calzados';

// 🔍 Función para verificar si Cloudinary está configurado
export const isCloudinaryConfigured = (): boolean => {
  return CLOUDINARY_CONFIG.cloudName !== 'demo';
};

// 📝 Tipos TypeScript para productos con imágenes
export interface ProductImage {
  publicId: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  images: ProductImage[];
  // Campos adicionales según necesites
}
