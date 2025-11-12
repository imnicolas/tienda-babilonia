import React from 'react';
import { Card, CardContent } from './ui/card';
import { PRODUCT_CATEGORIES, ProductCategory } from '../services/cloudinaryUpload';

interface Category {
  id: ProductCategory;
  name: string;
  image: string;
  description: string;
}

const categories: Category[] = [
  {
    id: PRODUCT_CATEGORIES.HOMBRES,
    name: 'Hombres',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop',
    description: 'Estilo y comodidad para él',
  },
  {
    id: PRODUCT_CATEGORIES.MUJERES,
    name: 'Mujeres',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=400&fit=crop',
    description: 'Elegancia en cada paso',
  },
  {
    id: PRODUCT_CATEGORIES.NINOS,
    name: 'Niños',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&h=400&fit=crop',
    description: 'Diversión y protección',
  },
  {
    id: PRODUCT_CATEGORIES.DEPORTIVOS,
    name: 'Deportivo',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
    description: 'Rendimiento máximo',
  },
];

export function CategorySection() {
  const handleCategoryClick = (categoryId: ProductCategory) => {
    // Scroll a la sección de productos
    const productsSection = document.getElementById('productos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Pequeño delay para que el scroll se complete primero
    setTimeout(() => {
      // Emitir evento para filtrar productos por categoría
      window.dispatchEvent(
        new CustomEvent('category-selected', { detail: { category: categoryId } })
      );
    }, 300);
  };

  return (
    <section className="py-16 px-4" id="categorias">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Comprar por Categoría
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm">{category.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
