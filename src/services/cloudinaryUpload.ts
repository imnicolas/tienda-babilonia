// Servicio para subir y gestionar imágenes en Cloudinary
const CLOUD_NAME = 'drigawwbd';
const UPLOAD_PRESET = 'babilonia-products'; // Unsigned preset

// API Base URL - funciona tanto en desarrollo como en producción
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

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
  image: string; // public_id de Cloudinary (formato: titulo-precio)
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
 * @returns Promise con los datos de la imagen subida
 */
export async function uploadToCloudinary(
  file: File,
  publicId?: string
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  
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
 * Parsea un Public ID para extraer título y precio
 * Formato esperado: titulo-del-producto-12999
 * @returns {title, price} o null si no se puede parsear
 */
export function parseProductId(publicId: string): { title: string; price: number } | null {
  try {
    // Buscar el último segmento numérico
    const parts = publicId.split('-');
    const lastPart = parts[parts.length - 1];
    
    // Verificar si el último segmento es un número
    if (!/^\d+$/.test(lastPart)) {
      return null;
    }
    
    // Extraer precio (dividir por 100 para obtener decimales)
    const priceInCents = parseInt(lastPart, 10);
    const price = priceInCents / 100;
    
    // Extraer título (todo excepto el último segmento)
    const titleParts = parts.slice(0, -1);
    const title = titleParts
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return { title, price };
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
 */
export async function getAllImages(): Promise<ProductData[]> {
  try {
    console.log('🔍 Consultando imágenes desde Cloudinary (via backend)...');
    
    // Usar el backend (local o Vercel)
    const url = `${API_BASE_URL}/api/products`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('⚠️ No se pudo acceder al backend, usando cache local');
      return getProducts();
    }

    const data = await response.json();
    
    if (!data.success || !Array.isArray(data.products)) {
      console.warn('⚠️ Respuesta inválida del backend, usando cache local');
      return getProducts();
    }

    console.log('✅ Imágenes obtenidas de Cloudinary:', data.products.length);
    
    const products: ProductData[] = data.products.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      createdAt: product.createdAt,
    }));
    
    // Sincronizar con localStorage (usar Cloudinary como fuente de verdad)
    localStorage.setItem('babilonia-products', JSON.stringify(products));
    console.log('💾 localStorage actualizado con', products.length, 'productos');
    
    return products;
  } catch (error) {
    console.error('❌ Error obteniendo imágenes de Cloudinary:', error);
    console.log('📦 Usando cache local como fallback');
    return getProducts();
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
    console.log('🔄 Invalidando caché del backend...');
    const response = await fetch(`${API_BASE_URL}/api/cache/invalidate`, {
      method: 'POST',
    });
    
    if (response.ok) {
      console.log('✅ Caché del backend invalidado');
    } else {
      console.warn('⚠️ No se pudo invalidar el caché del backend');
    }
  } catch (error) {
    console.warn('⚠️ Error al invalidar caché del backend:', error);
  }
}

/**
 * Elimina una imagen de Cloudinary usando el backend o Vercel Functions
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    console.log('🗑️ Eliminando de Cloudinary:', publicId);
    
    // Usar el backend (local o Vercel)
    const response = await fetch(`${API_BASE_URL}/api/products/${publicId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      console.error('❌ Error al eliminar de Cloudinary');
      return false;
    }

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Eliminado de Cloudinary exitosamente');
      
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
 */
export function getProducts(): ProductData[] {
  const data = localStorage.getItem('babilonia-products');
  if (!data) return [];
  
  try {
    return JSON.parse(data);
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
