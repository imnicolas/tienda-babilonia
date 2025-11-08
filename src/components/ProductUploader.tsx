import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  uploadToCloudinary,
  saveProduct,
  generateSlug,
  ProductData,
} from '../services/cloudinaryUpload';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function ProductUploader() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
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

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Generar slug para el public_id
      const slug = generateSlug(formData.title);
      
      // 2. Subir imagen a Cloudinary
      toast.loading('Subiendo imagen a Cloudinary...', { id: 'upload' });
      const uploadResult = await uploadToCloudinary(selectedFile, slug);
      
      // 3. Crear objeto producto
      const newProduct: ProductData = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim() || `${formData.title} - Calidad premium`,
        price: parseFloat(formData.price),
        image: uploadResult.publicId,
        createdAt: new Date().toISOString(),
      };

      // 4. Guardar en localStorage
      saveProduct(newProduct);

      toast.success('¡Producto creado exitosamente!', { id: 'upload' });

      // 5. Resetear formulario
      setFormData({ title: '', description: '', price: '' });
      setSelectedFile(null);
      setPreviewUrl(null);

      // 6. Redirigir al home después de 2 segundos
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
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP (Máximo 5MB)
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

              {/* Precio */}
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

              {/* Preview del Public ID */}
              {formData.title && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Public ID en Cloudinary:
                      </p>
                      <code className="text-sm text-blue-700">
                        {generateSlug(formData.title)}
                      </code>
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
