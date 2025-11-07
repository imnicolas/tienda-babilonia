import React from 'react';
import './App.css';
import { CartProvider } from './components/CartContext';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Toaster } from 'sonner';
import { CategorySection } from './components/CategorySection';
import { Footer } from './components/Footer';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <FeaturedProducts />
        <CategorySection />
        <Footer />
        <Toaster />
      </div>
    </CartProvider>
  );
}

export default App;
