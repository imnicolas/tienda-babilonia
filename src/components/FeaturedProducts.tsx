import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { useCart, Product } from './CartContext';
import { toast } from 'sonner';
import { ProductImage } from './CloudinaryImage';
import { getProducts, ProductData } from '../services/cloudinaryUpload';

// 🛍️ Productos de ejemplo (estáticos)
// Nota: Las imágenes se cargan desde Cloudinary
// El Public ID es SOLO el nombre, sin carpetas (Cloudinary lo asigna así cuando subes sin especificar carpeta)
// Ejemplo: 'zapatos-clasicos-cuero' (no 'productos/zapatos-clasicos-cuero')
const staticProducts: Product[] = [
  {
    id: 1,
    name: 'Zapatos Clásicos de Cuero',
    price: 89.99,
    image: 'zapatos-clasicos-cuero', // Solo el nombre, sin carpeta
    category: 'hombres',
  },
  {
    id: 2,
    name: 'Zapatillas Deportivas',
    price: 119.99,
    image: 'zapatillas-deportivas', // Solo el nombre, sin carpeta
    category: 'deportivo',
  },
  {
    id: 3,
    name: 'Botas de Mujer Elegantes',
    price: 149.99,
    image: 'botas-mujer-elegantes', // Solo el nombre, sin carpeta
    category: 'mujeres',
  },
  {
    id: 4,
    name: 'Sandalias de Verano',
    price: 59.99,
    image: 'sandalias-verano', // Solo el nombre, sin carpeta
    category: 'mujeres',
  },
  {
    id: 5,
    name: 'Zapatos Casuales',
    price: 79.99,
    image: 'zapatos-casuales', // Solo el nombre, sin carpeta
    category: 'hombres',
  },
  {
    id: 6,
    name: 'Zapatillas para Niños',
    price: 49.99,
    image: 'zapatillas-ninos', // Solo el nombre, sin carpeta
    category: 'niños',
  },
];

/**
 * Convierte ProductData (de localStorage) a Product (del carrito)
 */
function convertToProduct(productData: ProductData): Product {
  return {
    id: parseInt(productData.id),
    name: productData.title,
    price: productData.price,
    image: productData.image,
    category: 'general',
  };
}

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const [dynamicProducts, setDynamicProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>(staticProducts);

  // Cargar productos dinámicos desde localStorage
  useEffect(() => {
    const loadDynamicProducts = () => {
      const savedProducts = getProducts();
      const converted = savedProducts.map(convertToProduct);
      setDynamicProducts(converted);
      
      // Combinar productos estáticos con dinámicos
      // Los productos dinámicos aparecen primero
      setAllProducts([...converted, ...staticProducts]);
    };

    loadDynamicProducts();

    // Listener para actualizar cuando se agregue un producto nuevo
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'babilonia-products') {
        loadDynamicProducts();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // También escuchar cambios en la misma pestaña
    const interval = setInterval(loadDynamicProducts, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
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

  return (
    <section className="py-16 px-4 bg-gray-50" id="productos">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Productos Destacados
          </h2>
          {dynamicProducts.length > 0 && (
            <p className="text-sm text-gray-600">
              {dynamicProducts.length} producto{dynamicProducts.length !== 1 ? 's' : ''} nuevo{dynamicProducts.length !== 1 ? 's' : ''} agregado{dynamicProducts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* 🖼️ Componente de imagen de Cloudinary con fallback automático */}
                <ProductImage
                  productId={product.image}
                  alt={product.name}
                  size="card"
                  className="w-full h-64"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                >
                  Agregar al Carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
