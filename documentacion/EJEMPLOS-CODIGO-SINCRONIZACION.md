# 💻 Ejemplos de Código: Sincronización con Cloudinary

## 📚 Índice

1. [Usar getAllImages() básico](#usar-getallimages-básico)
2. [Cargar productos al montar componente](#cargar-productos-al-montar-componente)
3. [Sincronizar después de crear producto](#sincronizar-después-de-crear-producto)
4. [Manejo de errores](#manejo-de-errores)
5. [Custom hook para sincronización](#custom-hook-para-sincronización)
6. [Integración con React Query](#integración-con-react-query)

---

## 1. Usar getAllImages() básico

### Importar la función

```typescript
import { getAllImages, ProductData } from '../services/cloudinaryUpload';
```

### Ejemplo simple

```typescript
async function loadProducts() {
  const products: ProductData[] = await getAllImages();
  console.log('Productos obtenidos:', products.length);
  return products;
}

// Usar
const myProducts = await loadProducts();
```

### Con manejo de errores

```typescript
async function loadProductsSafe() {
  try {
    const products = await getAllImages();
    
    if (products.length === 0) {
      console.log('No hay productos disponibles');
      return [];
    }
    
    console.log(`✅ ${products.length} productos cargados`);
    return products;
    
  } catch (error) {
    console.error('Error cargando productos:', error);
    return [];
  }
}
```

---

## 2. Cargar productos al montar componente

### Ejemplo básico con useEffect

```typescript
import React, { useEffect, useState } from 'react';
import { getAllImages, ProductData } from '../services/cloudinaryUpload';

function ProductList() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await getAllImages();
      setProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, []); // Solo al montar

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Con polling (auto-sincronización)

```typescript
function ProductListWithPolling() {
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    // Función de carga
    async function loadProducts() {
      const data = await getAllImages();
      setProducts(data);
    }

    // Carga inicial
    loadProducts();

    // Polling cada 5 segundos
    const interval = setInterval(loadProducts, 5000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Total: {products.length} productos</p>
      {/* Render products */}
    </div>
  );
}
```

### Con listener de storage events

```typescript
function ProductListWithStorageListener() {
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getAllImages();
      setProducts(data);
    }

    // Carga inicial
    loadProducts();

    // Listener para cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'babilonia-products') {
        loadProducts(); // Re-cargar cuando cambia
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <div>{/* Render products */}</div>;
}
```

---

## 3. Sincronizar después de crear producto

### En formulario de creación

```typescript
import { uploadToCloudinary, saveProduct, getAllImages } from '../services/cloudinaryUpload';
import { toast } from 'sonner';

async function handleCreateProduct(formData: {
  title: string;
  price: number;
  file: File;
}) {
  try {
    // 1. Subir imagen a Cloudinary
    toast.loading('Subiendo imagen...', { id: 'upload' });
    
    const uploadResult = await uploadToCloudinary(
      formData.file,
      `${formData.title.toLowerCase()}-${formData.price * 100}`
    );

    // 2. Crear objeto producto
    const newProduct = {
      id: Date.now().toString(),
      title: formData.title,
      description: `${formData.title} - Calidad premium`,
      price: formData.price,
      image: uploadResult.publicId,
      createdAt: new Date().toISOString(),
    };

    // 3. Guardar en localStorage
    saveProduct(newProduct);
    
    // 4. Sincronizar con Cloudinary
    toast.loading('Sincronizando...', { id: 'sync' });
    await getAllImages(); // ⭐ Esto actualiza localStorage desde Cloudinary
    toast.success('¡Producto creado!', { id: 'sync' });

    return newProduct;
    
  } catch (error) {
    toast.error('Error al crear producto', { id: 'upload' });
    throw error;
  }
}
```

### Con callback de éxito

```typescript
async function createProductWithCallback(
  formData: any,
  onSuccess?: (product: ProductData) => void
) {
  try {
    // Crear producto...
    const newProduct = { /* ... */ };
    saveProduct(newProduct);
    
    // Sincronizar
    await getAllImages();
    
    // Callback de éxito
    onSuccess?.(newProduct);
    
  } catch (error) {
    console.error(error);
  }
}

// Usar
createProductWithCallback(formData, (product) => {
  console.log('Producto creado:', product.title);
  navigate('/'); // Redirigir
});
```

---

## 4. Manejo de errores

### Con try-catch completo

```typescript
async function loadProductsWithErrorHandling() {
  try {
    const products = await getAllImages();
    
    // Validar que sea un array
    if (!Array.isArray(products)) {
      throw new Error('Formato de datos inválido');
    }
    
    // Validar que tenga elementos
    if (products.length === 0) {
      console.warn('No hay productos disponibles');
    }
    
    return products;
    
  } catch (error) {
    // Log detallado
    console.error('Error al cargar productos:', {
      message: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString(),
    });
    
    // Retornar array vacío como fallback
    return [];
  }
}
```

### Con estados de error en React

```typescript
function ProductListWithErrorHandling() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getAllImages();
        setProducts(data);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (products.length === 0) return <div>No hay productos</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

---

## 5. Custom Hook para sincronización

### Hook reutilizable

```typescript
// hooks/useCloudinaryProducts.ts
import { useState, useEffect } from 'react';
import { getAllImages, ProductData } from '../services/cloudinaryUpload';

interface UseCloudinaryProductsOptions {
  pollingInterval?: number; // En milisegundos
  autoLoad?: boolean;
}

export function useCloudinaryProducts(
  options: UseCloudinaryProductsOptions = {}
) {
  const {
    pollingInterval = 5000,
    autoLoad = true,
  } = options;

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Función para cargar productos
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAllImages();
      setProducts(data);
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
      
    } finally {
      setLoading(false);
    }
  };

  // Cargar automáticamente
  useEffect(() => {
    if (!autoLoad) return;

    loadProducts();

    // Polling
    const interval = setInterval(loadProducts, pollingInterval);

    // Storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'babilonia-products') {
        loadProducts();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [autoLoad, pollingInterval]);

  return {
    products,
    loading,
    error,
    reload: loadProducts, // Función para recargar manualmente
  };
}
```

### Usar el hook

```typescript
function MyComponent() {
  const { products, loading, error, reload } = useCloudinaryProducts({
    pollingInterval: 10000, // 10 segundos
    autoLoad: true,
  });

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={reload}>🔄 Recargar</button>
      <p>Total: {products.length}</p>
      {products.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

---

## 6. Integración con React Query

### Setup básico

```bash
npm install @tanstack/react-query
```

### Query key y función

```typescript
// queries/products.ts
import { getAllImages } from '../services/cloudinaryUpload';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
};

export async function fetchProducts() {
  return getAllImages();
}
```

### Hook con React Query

```typescript
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, productKeys } from '../queries/products';

export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: fetchProducts,
    staleTime: 5000, // 5 segundos
    refetchInterval: 5000, // Polling cada 5s
    refetchOnWindowFocus: true,
  });
}
```

### Usar en componente

```typescript
import { useProducts } from '../hooks/useProducts';

function ProductListWithReactQuery() {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

### Mutación para crear producto

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadToCloudinary, saveProduct, getAllImages } from '../services/cloudinaryUpload';
import { productKeys } from '../queries/products';

function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; price: number; file: File }) => {
      // Subir a Cloudinary
      const uploadResult = await uploadToCloudinary(data.file, `${data.title}-${data.price * 100}`);
      
      // Crear producto
      const newProduct = {
        id: Date.now().toString(),
        title: data.title,
        description: `${data.title} - Calidad premium`,
        price: data.price,
        image: uploadResult.publicId,
        createdAt: new Date().toISOString(),
      };
      
      // Guardar
      saveProduct(newProduct);
      
      // Sincronizar
      await getAllImages();
      
      return newProduct;
    },
    onSuccess: () => {
      // Invalidar cache para refetch
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

// Usar
function CreateProductForm() {
  const createProduct = useCreateProduct();

  const handleSubmit = (formData: any) => {
    createProduct.mutate(formData, {
      onSuccess: (product) => {
        console.log('Producto creado:', product.title);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={createProduct.isPending}>
        {createProduct.isPending ? 'Creando...' : 'Crear Producto'}
      </button>
    </form>
  );
}
```

---

## 🎯 Casos de Uso Comunes

### Caso 1: Mostrar contador de productos

```typescript
function ProductCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function updateCount() {
      const products = await getAllImages();
      setCount(products.length);
    }

    updateCount();
    const interval = setInterval(updateCount, 5000);

    return () => clearInterval(interval);
  }, []);

  return <div>Total de productos: {count}</div>;
}
```

### Caso 2: Filtrar productos por precio

```typescript
function ExpensiveProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    async function loadExpensiveProducts() {
      const allProducts = await getAllImages();
      const expensive = allProducts.filter(p => p.price > 100);
      setProducts(expensive);
    }

    loadExpensiveProducts();
  }, []);

  return (
    <div>
      <h2>Productos Premium (más de $100)</h2>
      {products.map(product => (
        <div key={product.id}>
          {product.title} - ${product.price}
        </div>
      ))}
    </div>
  );
}
```

### Caso 3: Buscar productos por título

```typescript
function ProductSearch() {
  const [allProducts, setAllProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadProducts() {
      const data = await getAllImages();
      setAllProducts(data);
      setFilteredProducts(data);
    }

    loadProducts();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, allProducts]);

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <p>Mostrando {filteredProducts.length} de {allProducts.length} productos</p>
      {filteredProducts.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

---

## 📚 Referencia Rápida

### Importaciones necesarias

```typescript
import {
  getAllImages,        // 🔄 Sincronizar con Cloudinary
  ProductData,        // 📦 Tipo de producto
  saveProduct,        // 💾 Guardar en localStorage
  getProducts,        // 📖 Leer de localStorage
  deleteProduct,      // 🗑️ Eliminar de localStorage
} from '../services/cloudinaryUpload';
```

### Funciones principales

```typescript
// Obtener todos los productos desde Cloudinary
const products: ProductData[] = await getAllImages();

// Guardar producto en localStorage
saveProduct({
  id: '123',
  title: 'Producto',
  description: 'Descripción',
  price: 99.99,
  image: 'producto-9999',
  createdAt: new Date().toISOString(),
});

// Leer productos de localStorage (sin sincronizar)
const cachedProducts = getProducts();

// Eliminar producto de localStorage
deleteProduct('123');
```

---

## 🎓 Mejores Prácticas

1. **Siempre usar `getAllImages()`** al iniciar la app
2. **Sincronizar después de crear/actualizar** productos
3. **Implementar polling** (cada 5-10 segundos)
4. **Listener de storage events** para múltiples pestañas
5. **Manejo de errores** con try-catch
6. **Estados de loading/error** en UI
7. **Cleanup** de intervals y listeners en useEffect

---

## 🚀 Próximos Pasos

Para producción, considera:
- Backend con Cloudinary Admin API
- React Query para cache management
- Websockets para actualizaciones en tiempo real
- Base de datos para metadatos adicionales
- Autenticación para operaciones de admin

---

¿Necesitas más ejemplos? Abre un issue o pregunta en el canal de desarrollo.
