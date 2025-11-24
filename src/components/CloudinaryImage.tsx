import React, { useState } from 'react';
import { PLACEHOLDER_IMAGE, buildCloudinaryUrl, CLOUDINARY_CONFIG } from '../config/cloudinary';

interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  transformation?: keyof typeof CLOUDINARY_CONFIG.transformations | string;
  customParams?: Record<string, string | number>;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
  usePlaceholder?: boolean;
}

/**
 * Componente para renderizar imágenes de Cloudinary con optimizaciones automáticas
 * 
 * @example
 * ```tsx
 * // Imagen básica
 * <CloudinaryImage 
 *   publicId="babilonia/productos/zapato-01" 
 *   alt="Zapato de cuero"
 * />
 * 
 * // Con transformación predefinida
 * <CloudinaryImage 
 *   publicId="babilonia/productos/zapato-01" 
 *   alt="Zapato de cuero"
 *   transformation="productCard"
 * />
 * 
 * // Con parámetros personalizados
 * <CloudinaryImage 
 *   publicId="babilonia/productos/zapato-01" 
 *   alt="Zapato de cuero"
 *   customParams={{ width: 500, height: 500, crop: 'fill' }}
 * />
 * ```
 */
export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  publicId,
  alt,
  transformation,
  customParams,
  className = '',
  width,
  height,
  onLoad,
  onError,
  usePlaceholder = true
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Construir la URL de Cloudinary
  const imageUrl = buildCloudinaryUrl(publicId, transformation, customParams);

  const handleImageLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
    if (onError) onError();
  };

  // Si hay error y usePlaceholder está habilitado, mostrar placeholder
  const finalImageUrl = (imageError && usePlaceholder) ? PLACEHOLDER_IMAGE : imageUrl;

  return (
    <div className={`relative ${className}`}>
      {/* Skeleton loader mientras carga */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      {/* Imagen principal */}
      <img
        src={finalImageUrl}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />
      
      {/* Badge de placeholder si hay error */}
      {imageError && usePlaceholder && (
        <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          Sin imagen
        </div>
      )}
    </div>
  );
};

// Componente especializado para imágenes de productos
export const ProductImage: React.FC<{
  productId: string;
  alt: string;
  size?: 'thumbnail' | 'card' | 'detail';
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}> = ({ productId, alt, size = 'card', className, objectFit = 'contain' }) => {
  // Cuando subes una imagen a la carpeta "productos/" en Cloudinary,
  // el Public ID que Cloudinary asigna YA incluye la carpeta: "productos/zapatos-clasicos-cuero"
  // Por lo tanto, aquí pasamos el productId directamente SIN agregar la carpeta
  const publicId = productId;
  
  const transformationMap = {
    thumbnail: 'thumbnail',
    card: 'productCard',
    detail: 'productDetail'
  };

  return (
    <CloudinaryImage
      publicId={publicId}
      alt={alt}
      transformation={transformationMap[size]}
      className={`${className} ${objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
    />
  );
};

// Componente especializado para imágenes de categorías
export const CategoryImage: React.FC<{
  categoryId: string;
  alt: string;
  className?: string;
}> = ({ categoryId, alt, className }) => {
  // Si subes dentro de la carpeta "categorias/" en Cloudinary,
  // el categoryId debe incluir la carpeta: "categorias/hombres"
  const publicId = categoryId;

  return (
    <CloudinaryImage
      publicId={publicId}
      alt={alt}
      transformation="productCard"
      className={className}
    />
  );
};

// Componente especializado para banners
export const BannerImage: React.FC<{
  bannerId: string;
  alt: string;
  className?: string;
}> = ({ bannerId, alt, className }) => {
  // Si subes dentro de la carpeta "banners/" en Cloudinary,
  // el bannerId debe incluir la carpeta: "banners/hero-principal"
  const publicId = bannerId;

  return (
    <CloudinaryImage
      publicId={publicId}
      alt={alt}
      transformation="banner"
      className={className}
    />
  );
};

// Componente especializado para hero images
export const HeroImage: React.FC<{
  heroId: string;
  alt: string;
  className?: string;
}> = ({ heroId, alt, className }) => {
  // Si subes dentro de la carpeta "banners/" en Cloudinary,
  // el heroId debe incluir la carpeta: "banners/hero-principal"
  const publicId = heroId;

  return (
    <CloudinaryImage
      publicId={publicId}
      alt={alt}
      transformation="hero"
      className={className}
    />
  );
};

export default CloudinaryImage;
