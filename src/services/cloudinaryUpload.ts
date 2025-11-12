// Servicio para subir y gestionar imágenes en Cloudinary
const CLOUD_NAME = 'drigawwbd';
const UPLOAD_PRESET = 'babilonia-products'; // Unsigned preset

// API Base URL - funciona tanto en desarrollo como en producción
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Categorías disponibles en Cloudinary
// IMPORTANTE: En Cloudinary las carpetas están dentro de "Home/"
export const PRODUCT_CATEGORIES = {
  HOMBRES: 'Home/hombres',
  MUJERES: 'Home/mujeres',
  NINOS: 'Home/ninos',
  DEPORTIVOS: 'Home/deportivos',
  MISCELANEA: 'Home/miscelanea',
} as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[keyof typeof PRODUCT_CATEGORIES];

export interface UploadResult {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
}

export interface ProductData {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string; // public_id de Cloudinary (formato: categoria/titulo-precio)
  category: ProductCategory; // Categoría del producto
  createdAt: string;
}

export interface CloudinaryImage {
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  url: string;
  secure_url: string;
}

/**
 * Sube una imagen a Cloudinary
 * @param file - Archivo de imagen a subir
 * @param publicId - ID público opcional para la imagen
 * @param category - Categoría del producto (carpeta en Cloudinary)
 * @returns Promise con los datos de la imagen subida
 */
export async function uploadToCloudinary(
  file: File,
  publicId?: string,
  category?: ProductCategory
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  
  // IMPORTANTE: Usar 'folder' para crear jerarquía visual en Cloudinary
  if (category) {
    formData.append('folder', category);
  }
  
  // El public_id es solo el nombre del archivo (sin ruta)
  if (publicId) {
    formData.append('public_id', publicId);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al subir la imagen');
    }

    const data = await response.json();
    
    return {
      publicId: data.public_id,
      secureUrl: data.secure_url,
      width: data.width,
      height: data.height,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

/**
 * Genera un slug URL-friendly con título y precio
 * Formato: titulo-del-producto-12999 (precio sin decimales)
 */
export function generateProductSlug(title: string, price: number): string {
  const titleSlug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^\w\s-]/g, '') // Elimina caracteres especiales
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/-+/g, '-') // Reemplaza múltiples guiones con uno solo
    .trim();
  
  // Convertir precio a string sin decimales (ej: 99.99 -> 9999)
  const priceString = Math.round(price * 100).toString();
  
  return `${titleSlug}-${priceString}`;
}

/**
 * Parsea un Public ID para extraer título, precio y categoría
 * Formato esperado: Home/categoria/titulo-del-producto-12999
 * @returns {title, price, category} o null si no se puede parsear
 */
export function parseProductId(publicId: string): { title: string; price: number; category: ProductCategory } | null {
  try {
    // Separar partes (formato: Home/categoria/titulo-precio)
    const parts = publicId.split('/');
    let category: ProductCategory = PRODUCT_CATEGORIES.MISCELANEA;
    let productSlug = publicId;
    
    // Estructura esperada: Home/categoria/titulo-precio
    if (parts.length >= 3 && parts[0] === 'Home') {
      const categoryName = parts[1]; // ej: "hombres"
      const fullCategoryPath = `Home/${categoryName}`;
      
      // Verificar si es una categoría válida
      if (Object.values(PRODUCT_CATEGORIES).includes(fullCategoryPath as ProductCategory)) {
        category = fullCategoryPath as ProductCategory;
        productSlug = parts[parts.length - 1]; // Último segmento es el producto
      }
    } else if (parts.length === 2) {
      // Formato con categoría sin Home: categoria/titulo-precio
      const possibleCategory = `Home/${parts[0]}`;
      if (Object.values(PRODUCT_CATEGORIES).includes(possibleCategory as ProductCategory)) {
        category = possibleCategory as ProductCategory;
        productSlug = parts[1];
      }
    }
    
    // Buscar el último segmento numérico del slug
    const slugParts = productSlug.split('-');
    const lastPart = slugParts[slugParts.length - 1];
    
    // Verificar si el último segmento es un número
    if (!/^\d+$/.test(lastPart)) {
      return null;
    }
    
    // Extraer precio (dividir por 100 para obtener decimales)
    const priceInCents = parseInt(lastPart, 10);
    const price = priceInCents / 100;
    
    // Extraer título (todo excepto el último segmento)
    const titleParts = slugParts.slice(0, -1);
    const title = titleParts
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return { title, price, category };
  } catch (error) {
    console.error('Error parsing product ID:', publicId, error);
    return null;
  }
}

/**
 * Genera un slug URL-friendly a partir del título (función legacy)
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^\w\s-]/g, '') // Elimina caracteres especiales
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/-+/g, '-') // Reemplaza múltiples guiones con uno solo
    .trim();
}

/**
 * FUNCIÓN PRINCIPAL: Obtiene todas las imágenes desde Cloudinary
 * Esta función ahora usa el backend local o Vercel Serverless Functions
 * @param category - Filtrar por categoría específica (opcional)
 */
export async function getAllImages(category?: ProductCategory): Promise<ProductData[]> {
  try {
    // Convertir categoría de "Home/nombre" a "nombre" para la API
    let apiCategory: string | undefined;
    if (category) {
      apiCategory = category.replace('Home/', '');
    }
    
    // Usar el backend (local o Vercel) con filtro de categoría si se proporciona
    const url = apiCategory 
      ? `${API_BASE_URL}/api/products?category=${apiCategory}`
      : `${API_BASE_URL}/api/products`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return getProducts(category);
    }

    const data = await response.json();
    
    if (!data.success || !Array.isArray(data.products)) {
      return getProducts(category);
    }
    
    const products: ProductData[] = data.products.map((product: any) => {
      // Si el título no viene parseado, parsearlo del public_id
      let title = product.title;
      if (!title || title.includes('/')) {
        const parsed = parseProductId(product.image);
        if (parsed) {
          title = parsed.title;
        }
      }
      
      return {
        id: product.id,
        title: title,
        description: product.description,
        price: product.price,
        image: product.image,
        // Convertir categoría de "nombre" a "Home/nombre" (con validación)
        category: (product.category && typeof product.category === 'string' && product.category.includes('Home/'))
          ? product.category 
          : `Home/${product.category || 'miscelanea'}` as ProductCategory,
        createdAt: product.createdAt,
      };
    });
    
    // Sincronizar con localStorage (usar Cloudinary como fuente de verdad)
    // Solo actualizar si no hay filtro de categoría (para no perder productos)
    if (!category) {
      localStorage.setItem('babilonia-products', JSON.stringify(products));
    }
    
    return products;
  } catch (error) {
    console.error('❌ Error obteniendo imágenes de Cloudinary:', error);
    return getProducts(category);
  }
}

/**
 * Obtiene todas las imágenes de Cloudinary (función legacy)
 * DEPRECATED: Usar getAllImages() en su lugar
 */
export async function fetchCloudinaryImages(): Promise<CloudinaryImage[]> {
  try {
    const products = getProducts();
    
    return products.map(product => ({
      public_id: product.image,
      format: 'jpg',
      version: 1,
      resource_type: 'image',
      type: 'upload',
      created_at: product.createdAt,
      bytes: 0,
      width: 800,
      height: 600,
      url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${product.image}`,
      secure_url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${product.image}`,
    }));
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    return [];
  }
}

/**
 * Invalida el caché del backend para forzar una recarga desde Cloudinary
 */
export async function invalidateBackendCache(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cache/invalidate`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      // Silently fail
    }
  } catch (error) {
    // Silently fail - cache will expire naturally
  }
}

/**
 * Elimina una imagen de Cloudinary usando el backend o Vercel Functions
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    // Codificar el publicId para la URL (escapar caracteres especiales y barras)
    const encodedPublicId = encodeURIComponent(publicId);
    
    // Usar el backend (local o Vercel) con query parameter
    const response = await fetch(`${API_BASE_URL}/api/delete-product?publicId=${encodedPublicId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    
    if (data.success) {
      
      // También eliminar de localStorage
      const products = getProducts();
      const filtered = products.filter(p => p.image !== publicId);
      localStorage.setItem('babilonia-products', JSON.stringify(filtered));
      
      // Invalidar caché del backend
      await invalidateBackendCache();
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error al eliminar de Cloudinary:', error);
    return false;
  }
}

/**
 * Guarda un producto en localStorage
 */
export function saveProduct(product: ProductData): void {
  const products = getProducts();
  products.push(product);
  localStorage.setItem('babilonia-products', JSON.stringify(products));
}

/**
 * Obtiene todos los productos guardados
 * @param category - Filtrar por categoría específica (opcional)
 */
export function getProducts(category?: ProductCategory): ProductData[] {
  const data = localStorage.getItem('babilonia-products');
  if (!data) return [];
  
  try {
    const products: ProductData[] = JSON.parse(data);
    
    // Filtrar por categoría si se especifica
    if (category) {
      return products.filter(p => p.category === category);
    }
    
    return products;
  } catch {
    return [];
  }
}

/**
 * Elimina un producto por ID
 */
export function deleteProduct(id: string): void {
  const products = getProducts().filter(p => p.id !== id);
  localStorage.setItem('babilonia-products', JSON.stringify(products));
}

/**
 * Actualiza un producto existente
 */
export function updateProduct(id: string, updates: Partial<ProductData>): void {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    localStorage.setItem('babilonia-products', JSON.stringify(products));
  }
}
