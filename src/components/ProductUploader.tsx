import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  uploadToCloudinary,
  saveProduct,
  generateProductSlug,
  ProductData,
  getAllImages,
  invalidateBackendCache,
  PRODUCT_CATEGORIES,
  ProductCategory,
} from '../services/cloudinaryUpload';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

// Mapeo de nombres amigables para las categorías
const CATEGORY_LABELS: Record<ProductCategory, string> = {
  [PRODUCT_CATEGORIES.HOMBRES]: 'Hombres',
  [PRODUCT_CATEGORIES.MUJERES]: 'Mujeres',
  [PRODUCT_CATEGORIES.NINOS]: 'Niños',
  [PRODUCT_CATEGORIES.DEPORTIVOS]: 'Deportivos',
  [PRODUCT_CATEGORIES.MISCELANEA]: 'Miscelánea',
};

// Configuración de redimensionamiento
const TARGET_WIDTH = 1600;
const TARGET_HEIGHT = 1500;

/**
 * Redimensiona una imagen a las dimensiones especificadas manteniendo la proporción
 * @param file Archivo de imagen original
 * @returns Promise con el archivo redimensionado
 */
const resizeImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Crear canvas con las dimensiones objetivo
        const canvas = document.createElement('canvas');
        canvas.width = TARGET_WIDTH;
        canvas.height = TARGET_HEIGHT;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('No se pudo crear el contexto del canvas'));
          return;
        }
        
        // Calcular dimensiones manteniendo proporción
        const sourceAspect = img.width / img.height;
        const targetAspect = TARGET_WIDTH / TARGET_HEIGHT;
        
        let drawWidth = TARGET_WIDTH;
        let drawHeight = TARGET_HEIGHT;
        let offsetX = 0;
        let offsetY = 0;
        
        if (sourceAspect > targetAspect) {
          // Imagen más ancha - ajustar por altura
          drawHeight = TARGET_HEIGHT;
          drawWidth = TARGET_HEIGHT * sourceAspect;
          offsetX = (TARGET_WIDTH - drawWidth) / 2;
        } else {
          // Imagen más alta - ajustar por anchura
          drawWidth = TARGET_WIDTH;
          drawHeight = TARGET_WIDTH / sourceAspect;
          offsetY = (TARGET_HEIGHT - drawHeight) / 2;
        }
        
        // Fondo blanco
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        
        // Dibujar imagen centrada
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Convertir canvas a blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Error al procesar la imagen'));
            return;
          }
          
          // Crear nuevo archivo con el blob
          const resizedFile = new File(
            [blob], 
            file.name, 
            { type: 'image/jpeg', lastModified: Date.now() }
          );
          
          resolve(resizedFile);
        }, 'image/jpeg', 0.92); // Calidad 92%
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsDataURL(file);
  });
};

export function ProductUploader() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    // price: '', // TODO: Deshabilitado temporalmente
    category: PRODUCT_CATEGORIES.MISCELANEA as ProductCategory,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 10MB para el archivo original)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 10MB');
      return;
    }

    try {
      // Mostrar mensaje de procesamiento
      toast.loading('Procesando imagen...', { id: 'resize' });
      
      // Redimensionar imagen a 1600x1500
      const resizedFile = await resizeImage(file);
      
      toast.success(`Imagen redimensionada a ${TARGET_WIDTH}x${TARGET_HEIGHT}px`, { id: 'resize' });
      
      setSelectedFile(resizedFile);
      
      // Crear preview con la imagen redimensionada
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(resizedFile);
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      toast.error('Error al procesar la imagen. Intenta con otra.', { id: 'resize' });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!selectedFile) {
      toast.error('Por favor selecciona una imagen');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }

    // DESHABILITADO: Validación de precio
    // if (!formData.price || parseFloat(formData.price) <= 0) {
    //   toast.error('El precio debe ser mayor a 0');
    //   return;
    // }

    setIsUploading(true);

    try {
      // 1. Generar slug solo con título (formato: titulo)
      const slug = generateProductSlug(formData.title);
      
      // 2. Subir imagen a Cloudinary con categoría
      toast.loading('Subiendo imagen a Cloudinary...', { id: 'upload' });
      const uploadResult = await uploadToCloudinary(selectedFile, slug, formData.category);
      
      // 3. Crear objeto producto
      const newProduct: ProductData = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim() || `${formData.title} - Calidad premium`,
        // price: parseFloat(formData.price), // TODO: Deshabilitado temporalmente
        image: uploadResult.publicId,
        category: formData.category,
        createdAt: new Date().toISOString(),
      };

      // 4. Guardar en localStorage
      saveProduct(newProduct);

      // 5. Invalidar caché del backend
      await invalidateBackendCache();

      // 6. Sincronizar con Cloudinary (refrescar desde la fuente de verdad)
      toast.loading('Sincronizando con Cloudinary...', { id: 'sync' });
      await getAllImages();
      toast.success('Producto sincronizado', { id: 'sync' });

      toast.success('¡Producto creado exitosamente!', { id: 'upload' });

      // 7. Disparar evento para notificar a otros componentes
      window.dispatchEvent(new CustomEvent('products-changed'));

      // 8. Resetear formulario
      setFormData({ 
        title: '', 
        description: '', 
        // price: '', // TODO: Deshabilitado temporalmente
        category: PRODUCT_CATEGORIES.MISCELANEA,
      });
      setSelectedFile(null);
      setPreviewUrl(null);

      // 9. Redirigir al home después de 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error al crear producto:', error);
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Error al crear el producto. Intenta nuevamente.',
        { id: 'upload' }
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Agregar nuevo producto a la tienda</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear Producto</CardTitle>
            <CardDescription>
              Completa todos los campos para agregar un nuevo producto al catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Upload de imagen */}
              <div className="space-y-2">
                <Label htmlFor="image">Imagen del producto *</Label>
                
                {!previewUrl ? (
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click para subir</span> o arrastra una imagen
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        PNG, JPG, WEBP (Máximo 10MB)
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        ✨ Se redimensionará automáticamente a {TARGET_WIDTH}x{TARGET_HEIGHT}px
                      </p>
                    </div>
                    <input
                      id="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">Título del producto *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Ej: Zapatillas Nike Air Max"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isUploading}
                  required
                />
                <p className="text-xs text-gray-500">
                  Este nombre se usará como identificador en Cloudinary
                </p>
              </div>

              {/* Categoría */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, category: value as ProductCategory }))
                  }
                  disabled={isUploading}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Los productos se organizarán en carpetas por categoría en Cloudinary
                </p>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descripción detallada del producto..."
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isUploading}
                  rows={3}
                />
              </div>

              {/* Precio - DESHABILITADO TEMPORALMENTE */}
              {/* 
              <div className="space-y-2">
                <Label htmlFor="price">Precio (ARS) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="99.99"
                  value={formData.price}
                  onChange={handleInputChange}
                  disabled={isUploading}
                  required
                />
              </div>
              */}

              {/* Preview del Public ID */}
              {formData.title && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Public ID en Cloudinary:
                      </p>
                      <code className="text-sm text-blue-700 block mb-2">
                        {formData.category}/{generateProductSlug(formData.title)}
                      </code>
                      <p className="text-xs text-gray-600 mb-1">
                        Formato: <strong>categoría/título</strong>
                      </p>
                      <p className="text-xs text-gray-600">
                        Categoría: <strong>{CATEGORY_LABELS[formData.category]}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Crear Producto
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
