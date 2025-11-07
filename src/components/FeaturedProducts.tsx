import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { useCart, Product } from './CartContext';
import { toast } from 'sonner';

const products: Product[] = [
  {
    id: 1,
    name: 'Zapatos Clásicos de Cuero',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=400&fit=crop',
    category: 'hombres',
  },
  {
    id: 2,
    name: 'Zapatillas Deportivas',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: 'deportivo',
  },
  {
    id: 3,
    name: 'Botas de Mujer Elegantes',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
    category: 'mujeres',
  },
  {
    id: 4,
    name: 'Sandalias de Verano',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=400&fit=crop',
    category: 'mujeres',
  },
  {
    id: 5,
    name: 'Zapatos Casuales',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    category: 'hombres',
  },
  {
    id: 6,
    name: 'Zapatillas para Niños',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop',
    category: 'niños',
  },
];

export function FeaturedProducts() {
  const { addToCart } = useCart();

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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
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
