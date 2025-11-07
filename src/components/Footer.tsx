import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { Separator } from './ui/separator';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand & Social */}
          <div>
            <div className="flex items-center mb-4 text-white">
              <ShoppingBag className="h-6 w-6 mr-2" />
              <span className="text-lg">Babilonia Calzados</span>
            </div>
            <p className="text-sm mb-4">
              Tu destino confiable para calzado de calidad desde 1985. 
              Dale estilo a tus pasos con nuestra colección seleccionada.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/babiloniacalzados/?hl=en" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white mb-4">Información de Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>Av. San Martín 3387, Rosario, Santa Fe</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+54 9 34 1354-3521</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@babiloniacalzados.com.ar</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-gray-700 mb-6" />

        <div className="text-center text-sm">
          <p>&copy; 2025 Babilonia Calzados. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
