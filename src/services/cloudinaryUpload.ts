// Servicio para subir imágenes a Cloudinary
const CLOUD_NAME = 'drigawwbd';
const UPLOAD_PRESET = 'babilonia-products'; // Necesitarás crear esto en Cloudinary

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
  image: string; // public_id de Cloudinary
  createdAt: string;
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
 * Genera un slug URL-friendly a partir del título
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
