import React, { useEffect, useState } from 'react';
import { Trash2, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { useCart, Product } from './CartContext';
import { toast } from 'sonner';
import { ProductImage } from './CloudinaryImage';
import { 
  ProductData, 
  deleteFromCloudinary,
  getAllImages,
  PRODUCT_CATEGORIES,
  ProductCategory,
} from '../services/cloudinaryUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

// Mapeo de nombres amigables para las categorías
const CATEGORY_LABELS: Record<ProductCategory | 'all', string> = {
  all: 'Todas las categorías',
  [PRODUCT_CATEGORIES.HOMBRES]: 'Hombres',
  [PRODUCT_CATEGORIES.MUJERES]: 'Mujeres',
  [PRODUCT_CATEGORIES.NINOS]: 'Niños',
  [PRODUCT_CATEGORIES.DEPORTIVOS]: 'Deportivos',
  [PRODUCT_CATEGORIES.MISCELANEA]: 'Miscelánea',
};

// Mapeo de categorías para el API (sin el prefijo Home/)
const CATEGORY_API_NAMES: Record<ProductCategory, string> = {
  [PRODUCT_CATEGORIES.HOMBRES]: 'hombres',
  [PRODUCT_CATEGORIES.MUJERES]: 'mujeres',
  [PRODUCT_CATEGORIES.NINOS]: 'ninos',
  [PRODUCT_CATEGORIES.DEPORTIVOS]: 'deportivos',
  [PRODUCT_CATEGORIES.MISCELANEA]: 'miscelanea',
};

/**
 * Convierte ProductData (de localStorage) a Product (del carrito)
 */
function convertToProduct(productData: ProductData): Product {
  // Generar un ID numérico único basado en el publicId
  const numericId = generateNumericId(productData.id);
  
  return {
    id: numericId,
    name: productData.title,
    price: productData.price,
    image: productData.image,
    category: 'general',
  };
}

/**
 * Genera un ID numérico único a partir de un string
 */
function generateNumericId(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [showAdminButtons, setShowAdminButtons] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  // Cargar productos desde Cloudinary
  useEffect(() => {
    const loadProducts = async () => {
      console.log('🔄 [FeaturedProducts] Iniciando carga de productos...');
      console.log('🏷️ [FeaturedProducts] Categoría seleccionada actual:', selectedCategory);
      
      // 1. PRIMERO: Consultar Cloudinary para obtener todas las imágenes
      // Si hay categoría seleccionada, filtrar por ella
      const category = selectedCategory !== 'all' ? selectedCategory : undefined;
      console.log('📤 [FeaturedProducts] Enviando categoría a getAllImages:', category);
      
      const cloudinaryProducts = await getAllImages(category);
      
      console.log('📦 [FeaturedProducts] Productos recibidos de Cloudinary:', cloudinaryProducts.length);
      
      // 2. Convertir a formato Product para renderizar
      const converted = cloudinaryProducts.map(convertToProduct);
      setProducts(converted);
      
      console.log('✅ [FeaturedProducts] Productos convertidos y cargados en estado:', converted.length);
      console.log('📋 [FeaturedProducts] IDs de productos:', converted.map(p => p.id));
    };

    loadProducts();
  }, [selectedCategory]); // Recargar cuando cambie la categoría

  // Event listeners en useEffect separado para evitar re-registro
  useEffect(() => {
    // Evento personalizado para recargar productos cuando se agregue/elimine
    const handleProductsChange = () => {
      console.log('🔔 [Event] Evento products-changed detectado');
      // Forzar recarga completa sin filtro
      setSelectedCategory('all');
    };

    // Evento personalizado para filtrar por categoría desde CategorySection
    const handleCategorySelected = (event: Event) => {
      const customEvent = event as CustomEvent<{ category: ProductCategory }>;
      console.log('🏷️ [Event] Categoría seleccionada desde CategorySection:', customEvent.detail.category);
      setSelectedCategory(customEvent.detail.category);
    };

    // Escuchar eventos personalizados
    window.addEventListener('products-changed', handleProductsChange);
    window.addEventListener('category-selected', handleCategorySelected as EventListener);

    return () => {
      window.removeEventListener('products-changed', handleProductsChange);
      window.removeEventListener('category-selected', handleCategorySelected as EventListener);
    };
  }, []); // Solo montar/desmontar, no re-registrar

  // Verificar modo admin
  useEffect(() => {
    const checkAdminMode = () => {
      const modo = localStorage.getItem('modo');
      setShowAdminButtons(modo === 'poupe');
    };

    checkAdminMode();
    window.addEventListener('storage', checkAdminMode);
    const interval = setInterval(checkAdminMode, 1000);

    return () => {
      window.removeEventListener('storage', checkAdminMode);
      clearInterval(interval);
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`✓ ${product.name} agregado al carrito`, {
      description: 'El producto se guardó correctamente',
      duration: 2000,
    });
  };

  const handleDeleteProduct = async (product: Product) => {
    // Confirmar eliminación
    if (!window.confirm(`¿Eliminar "${product.name}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingId(product.id);
    toast.loading(`Eliminando ${product.name}...`, { id: 'delete' });

    try {
      // Eliminar de Cloudinary y localStorage
      const success = await deleteFromCloudinary(product.image);

      if (success) {
        toast.success('Producto eliminado exitosamente', { id: 'delete' });
        
        // Actualizar lista localmente primero (para UX inmediata)
        setProducts(prev => prev.filter(p => p.id !== product.id));
        
        // Disparar evento para que otros componentes se enteren del cambio
        window.dispatchEvent(new CustomEvent('products-changed'));
      } else {
        throw new Error('No se pudo eliminar el producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar el producto',
        { id: 'delete' }
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-50" id="productos">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Productos Destacados
          </h2>
          {products.length > 0 && (
            <p className="text-sm text-gray-600">
              {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Filtro de categorías */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-md flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as ProductCategory | 'all')}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory !== 'all' && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedCategory('all')}
                title="Limpiar filtro"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No hay productos disponibles
              {selectedCategory !== 'all' && ` en la categoría ${CATEGORY_LABELS[selectedCategory]}`}
            </p>
            {showAdminButtons && (
              <p className="text-sm text-gray-400">
                Usa el botón "Crear Producto" en el navbar para agregar productos
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-4 text-sm text-gray-500">
              Mostrando {products.length} producto(s)
              {selectedCategory !== 'all' && ` de categoría: ${CATEGORY_LABELS[selectedCategory]}`}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                console.log('🎨 [Render] Renderizando producto:', product.id, product.name);
                return (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow relative">
                    {/* Botón de eliminar - Solo visible en modo admin */}
                    {showAdminButtons && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 z-10 shadow-lg"
                    onClick={() => handleDeleteProduct(product)}
                    disabled={deletingId === product.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                
                <CardContent className="p-0">
                  {/* 🖼️ Componente de imagen de Cloudinary */}
                  <ProductImage
                    productId={product.image}
                    alt={product.name}
                    size="card"
                    className="w-full h-64"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={deletingId === product.id}
                  >
                    Agregar al Carrito
                  </Button>
                </CardFooter>
              </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
