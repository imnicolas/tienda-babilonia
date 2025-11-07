# Babilonia Calzados - E-commerce

Tienda en línea de Babilonia Calzados, especializada en calzado de calidad para toda la familia.

## 🚀 Características

- **Diseño Moderno y Responsivo**: Interfaz optimizada para todos los dispositivos
- **Carrito de Compras con LocalStorage**: Los productos se guardan automáticamente en el navegador
- **Integración con WhatsApp**: Envío directo de pedidos a la dueña de la tienda
- **Categorías**: Organización por Hombres, Mujeres, Niños y Deportivo
- **Productos Destacados**: Sección con los productos más populares
- **Notificaciones**: Sistema de notificaciones con Sonner
- **Componentes UI**: Biblioteca completa de componentes con Radix UI
- **Persistencia de Datos**: El carrito se mantiene incluso al cerrar el navegador

## 🛠️ Tecnologías Utilizadas

- **React 18.3**: Framework principal
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de estilos
- **Radix UI**: Componentes accesibles
- **Lucide React**: Iconos
- **Sonner**: Notificaciones toast
- **Context API**: Gestión de estado del carrito

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm start
```

3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## 🏗️ Estructura del Proyecto

```
mi-tienda/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes de React
│   │   ├── ui/         # Componentes UI reutilizables
│   │   ├── Cart.tsx    # Carrito de compras
│   │   ├── CartContext.tsx  # Contexto del carrito
│   │   ├── Navbar.tsx  # Barra de navegación
│   │   ├── Hero.tsx    # Sección hero
│   │   ├── FeaturedProducts.tsx  # Productos destacados
│   │   ├── CategorySection.tsx   # Categorías
│   │   └── Footer.tsx  # Pie de página
│   ├── styles/          # Estilos globales
│   ├── App.tsx          # Componente principal
│   └── index.tsx        # Punto de entrada
├── tailwind.config.js   # Configuración de Tailwind
└── package.json         # Dependencias del proyecto
```

## 🎨 Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm build`: Crea una build de producción
- `npm test`: Ejecuta las pruebas
- `npm run eject`: Expone las configuraciones (irreversible)

## 📝 Características Principales

### Carrito de Compras
- Agregar/eliminar productos
- Modificar cantidades
- Ver total en tiempo real
- **Persistencia en localStorage**: Los productos se mantienen al cerrar el navegador
- **Integración con WhatsApp**: Envío automático del pedido

### WhatsApp Integration
- Botón "Continuar con la Compra" con icono de WhatsApp
- Mensaje pre-formateado con todos los detalles del pedido
- Incluye: productos, cantidades, precios y total
- Abre WhatsApp directamente con el mensaje listo para enviar

### Configuración de WhatsApp
Para cambiar el número de WhatsApp, edita el archivo:
```
src/config/whatsapp.ts
```

Ver documentación completa en: [WHATSAPP-CONFIG.md](./WHATSAPP-CONFIG.md)

### Productos
- Imágenes de alta calidad
- Información detallada de precios
- Categorización por tipo
- Sistema de búsqueda (próximamente)

### Diseño Responsivo
- Móvil first
- Adaptable a tablets y desktop
- Menú hamburguesa en móviles
- Grid system flexible

## 🚧 Próximas Mejoras

- [ ] Integración con backend
- [ ] Sistema de pagos
- [ ] Filtros avanzados
- [ ] Sistema de búsqueda
- [ ] Página de producto individual
- [ ] Sistema de usuarios y autenticación
- [ ] Historial de pedidos
- [ ] Wishlist / Favoritos

## 📄 Licencia

Proyecto privado - Babilonia Calzados © 2024

---

Desarrollado con ❤️ para Babilonia Calzados
