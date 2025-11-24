import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('productos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categorias');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
      {/* Fondo con imagen de calzados */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/banner-v1.jpg)',
        }}
      >
        {/* Overlay con gradiente del color de marca (rojo) */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 via-red-700/85 to-red-800/90"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30 shadow-2xl">
            <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight drop-shadow-lg" 
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Babilonia
            </h1>
            <p className="text-3xl md:text-4xl font-light text-white/95 mt-1 tracking-wide">
              Calzados
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl mb-4 text-white font-medium drop-shadow-md">
          Estilo y Calidad para Toda la Familia
        </p>
        <p className="text-lg md:text-xl mb-10 text-white/90 max-w-2xl mx-auto">
          Descubre nuestra colección de calzados para hombres, mujeres y niños
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-white text-red-600 hover:bg-gray-100 font-semibold text-lg px-8 py-6 shadow-xl"
            onClick={scrollToProducts}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Ver Productos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-semibold text-lg px-8 py-6 backdrop-blur-sm bg-white/10"
            onClick={scrollToCategories}
          >
            Explorar Categorías
          </Button>
        </div>

        {/* Badges informativos */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/90">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm font-medium">Buenos precios</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm font-medium">Buena atención</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm font-medium">Calidad garantizada</span>
          </div>
        </div>
      </div>

      {/* Decoración inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
