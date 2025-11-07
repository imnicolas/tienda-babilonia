// 📸 Ejemplos de uso de Cloudinary en Babilonia Calzados
// Este archivo muestra todas las formas de usar imágenes de Cloudinary

import React from 'react';
import { 
  CloudinaryImage, 
  ProductImage, 
  CategoryImage, 
  BannerImage, 
  HeroImage 
} from './components/CloudinaryImage';
import { 
  getProductImage, 
  getCategoryImage, 
  getBannerImage,
  buildCloudinaryUrl 
} from './config/cloudinary';

export const CloudinaryExamples = () => {
  return (
    <div className="space-y-8 p-8">
      
      {/* 1️⃣ USO BÁSICO - Componente ProductImage (RECOMENDADO) */}
      <section>
        <h2 className="text-2xl font-bold mb-4">1. ProductImage - Uso Básico</h2>
        
        {/* Tamaño card (400x400) - predeterminado */}
        <ProductImage
          productId="zapatos-clasicos-cuero"
          alt="Zapatos Clásicos de Cuero"
          className="w-64 h-64 rounded-lg shadow"
        />
        
        {/* Tamaño thumbnail (150x150) */}
        <ProductImage
          productId="zapatos-clasicos-cuero"
          alt="Zapatos Clásicos de Cuero"
          size="thumbnail"
          className="w-32 h-32 rounded-lg shadow"
        />
        
        {/* Tamaño detail (800x800) */}
        <ProductImage
          productId="zapatos-clasicos-cuero"
          alt="Zapatos Clásicos de Cuero"
          size="detail"
          className="w-full max-w-2xl rounded-lg shadow"
        />
      </section>

      {/* 2️⃣ USO CON TRANSFORMACIONES PREDEFINIDAS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">2. CloudinaryImage con Transformaciones</h2>
        
        <CloudinaryImage
          publicId="babilonia/productos/zapatillas-deportivas"
          alt="Zapatillas Deportivas"
          transformation="productCard"
          className="w-80 h-80 rounded-lg shadow"
        />
      </section>

      {/* 3️⃣ USO CON PARÁMETROS PERSONALIZADOS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">3. Transformaciones Personalizadas</h2>
        
        <CloudinaryImage
          publicId="babilonia/productos/botas-mujer-elegantes"
          alt="Botas de Mujer"
          customParams={{
            width: 600,
            height: 600,
            crop: 'fill',
            gravity: 'center',
            quality: 85,
            effect: 'sharpen'
          }}
          className="w-96 h-96 rounded-lg shadow"
        />
      </section>

      {/* 4️⃣ IMÁGENES DE CATEGORÍAS */}
      <section>
        <h2 className="text-2xl font-bold mb-4">4. Imágenes de Categorías</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <CategoryImage
            categoryId="hombres"
            alt="Calzado para Hombres"
            className="w-full h-48 rounded-lg shadow"
          />
          <CategoryImage
            categoryId="mujeres"
            alt="Calzado para Mujeres"
            className="w-full h-48 rounded-lg shadow"
          />
          <CategoryImage
            categoryId="ninos"
            alt="Calzado para Niños"
            className="w-full h-48 rounded-lg shadow"
          />
        </div>
      </section>

      {/* 5️⃣ BANNERS Y HERO IMAGES */}
      <section>
        <h2 className="text-2xl font-bold mb-4">5. Banners y Hero Images</h2>
        
        {/* Banner horizontal (1920x600) */}
        <BannerImage
          bannerId="oferta-verano"
          alt="Oferta de Verano"
          className="w-full h-auto rounded-lg shadow mb-4"
        />
        
        {/* Hero image (1920x800) */}
        <HeroImage
          heroId="hero-principal"
          alt="Babilonia Calzados"
          className="w-full h-auto rounded-lg shadow"
        />
      </section>

      {/* 6️⃣ USANDO SOLO LA URL (sin componente) */}
      <section>
        <h2 className="text-2xl font-bold mb-4">6. Obtener Solo la URL</h2>
        
        <div className="space-y-2">
          <p><strong>URL de producto:</strong></p>
          <code className="block bg-gray-100 p-2 rounded text-sm">
            {getProductImage('zapatos-casuales', 'card')}
          </code>
          
          <p><strong>URL de categoría:</strong></p>
          <code className="block bg-gray-100 p-2 rounded text-sm">
            {getCategoryImage('deportivo')}
          </code>
          
          <p><strong>URL de banner:</strong></p>
          <code className="block bg-gray-100 p-2 rounded text-sm">
            {getBannerImage('oferta-verano')}
          </code>
        </div>
      </section>

      {/* 7️⃣ CONSTRUIR URL PERSONALIZADA */}
      <section>
        <h2 className="text-2xl font-bold mb-4">7. URL Personalizada Avanzada</h2>
        
        <code className="block bg-gray-100 p-2 rounded text-sm">
          {buildCloudinaryUrl(
            'babilonia/productos/sandalias-verano',
            undefined,
            {
              width: 300,
              height: 300,
              crop: 'thumb',
              gravity: 'faces',
              radius: 'max',
              effect: 'art:hokusai'
            }
          )}
        </code>
      </section>

      {/* 8️⃣ GRID DE PRODUCTOS CON CLOUDINARY */}
      <section>
        <h2 className="text-2xl font-bold mb-4">8. Grid de Productos</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { id: 'zapatos-clasicos-cuero', name: 'Zapatos Clásicos' },
            { id: 'zapatillas-deportivas', name: 'Zapatillas Deportivas' },
            { id: 'botas-mujer-elegantes', name: 'Botas Elegantes' },
            { id: 'sandalias-verano', name: 'Sandalias Verano' },
            { id: 'zapatos-casuales', name: 'Zapatos Casuales' },
            { id: 'zapatillas-ninos', name: 'Zapatillas Niños' }
          ].map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              <ProductImage
                productId={product.id}
                alt={product.name}
                size="card"
                className="w-full h-48"
              />
              <div className="p-3">
                <h3 className="font-semibold text-sm">{product.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9️⃣ CARRUSEL DE IMÁGENES (múltiples vistas del mismo producto) */}
      <section>
        <h2 className="text-2xl font-bold mb-4">9. Múltiples Vistas (Carrusel)</h2>
        
        <div className="flex gap-4 overflow-x-auto">
          {[
            'zapatos-clasicos-cuero',
            'zapatos-clasicos-cuero-lateral',
            'zapatos-clasicos-cuero-suela',
            'zapatos-clasicos-cuero-detalle'
          ].map((imageId, index) => (
            <ProductImage
              key={imageId}
              productId={imageId}
              alt={`Vista ${index + 1}`}
              size="card"
              className="flex-shrink-0 w-64 h-64 rounded-lg shadow"
            />
          ))}
        </div>
      </section>

      {/* 🔟 IMAGEN CON LOADING STATE */}
      <section>
        <h2 className="text-2xl font-bold mb-4">10. Con Gestión de Carga y Errores</h2>
        
        <CloudinaryImage
          publicId="babilonia/productos/producto-que-no-existe"
          alt="Producto sin imagen"
          transformation="productCard"
          className="w-80 h-80 rounded-lg shadow"
          onLoad={() => console.log('Imagen cargada')}
          onError={() => console.log('Error al cargar imagen')}
          usePlaceholder={true}
        />
        
        <p className="mt-2 text-sm text-gray-600">
          ⬆️ Esta imagen no existe, se muestra el placeholder automáticamente
        </p>
      </section>

    </div>
  );
};

// 📝 EJEMPLO EN UN COMPONENTE DE PRODUCTO REAL
export const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
      
      {/* Imagen del producto */}
      <ProductImage
        productId={product.imageId}
        alt={product.name}
        size="card"
        className="w-full h-64"
      />
      
      {/* Información del producto */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">${product.price}</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

// 🎯 EJEMPLO DE USO EN LISTAS
export const ProductList = ({ products }: { products: any[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div key={product.id} className="group">
          {/* Imagen con efecto hover */}
          <div className="relative overflow-hidden rounded-lg">
            <ProductImage
              productId={product.imageId}
              alt={product.name}
              size="card"
              className="w-full h-64 group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Overlay con información al hacer hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <button className="opacity-0 group-hover:opacity-100 bg-white px-4 py-2 rounded-lg font-semibold transition-opacity">
                Ver Detalles
              </button>
            </div>
          </div>
          
          {/* Info del producto */}
          <div className="mt-3">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-xl font-bold mt-1">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CloudinaryExamples;
