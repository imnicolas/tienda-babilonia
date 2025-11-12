import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Cart } from './Cart';

export function Navbar() {
  const navigate = useNavigate();
  const navLinks = ["Inicio", "Hombres", "Mujeres", "Niños", "Ofertas", "Contacto"];
  const [showAdminButton, setShowAdminButton] = useState(false);

  // Verificar si existe 'modo' = 'poupe' en localStorage
  useEffect(() => {
    const checkAdminMode = () => {
      const modo = localStorage.getItem('modo');
      setShowAdminButton(modo === 'poupe');
    };

    checkAdminMode();

    // Escuchar cambios en localStorage
    window.addEventListener('storage', checkAdminMode);
    
    // Polling para detectar cambios en la misma pestaña
    const interval = setInterval(checkAdminMode, 1000);

    return () => {
      window.removeEventListener('storage', checkAdminMode);
      clearInterval(interval);
    };
  }, []);

  const handleCreateProduct = () => {
    navigate('/argdev');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="/bc-logo.jpg" 
              alt="Babilonia Calzados Logo" 
              className="h-10 w-10 rounded-lg shadow-sm"
            />
            <span className="text-xl font-semibold text-gray-900">Babilonia Calzados</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-gray-700 hover:text-black transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Botón Crear Producto - Solo visible en modo admin */}
            {showAdminButton && (
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateProduct}
                className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Crear Producto
              </Button>
            )}
            
            <Cart />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link}
                      href={`#${link.toLowerCase()}`}
                      className="text-lg hover:text-gray-600 transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                  
                  {/* Botón móvil para crear producto */}
                  {showAdminButton && (
                    <>
                      <div className="border-t my-4" />
                      <Button
                        variant="default"
                        onClick={handleCreateProduct}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Producto
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}