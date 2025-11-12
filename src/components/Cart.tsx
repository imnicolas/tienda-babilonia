import React from 'react';
import { ShoppingCart, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from './CartContext';
import { Button } from './ui/button';
import { CloudinaryImage } from './CloudinaryImage';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalItems, sendToWhatsApp } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 border-b"
                  >
                    <CloudinaryImage
                      publicId={item.image}
                      alt={item.name}
                      transformation="thumbnail"
                      className="w-20 h-20 rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {/* PRECIO DESHABILITADO TEMPORALMENTE */}
                      {/* <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p> */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-auto"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4">
                {/* TOTAL DESHABILITADO TEMPORALMENTE */}
                {/* 
                <div className="flex justify-between text-lg font-semibold mb-4">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                */}
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  size="lg"
                  onClick={sendToWhatsApp}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Continuar con la Compra
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
