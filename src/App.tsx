import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { CartProvider } from './components/CartContext';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Toaster } from 'sonner';
import { CategorySection } from './components/CategorySection';
import { Footer } from './components/Footer';
import StoreMap from './components/StoreMap';
import { ProductUploader } from './components/ProductUploader';

// Página principal (Home)
function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <CategorySection />
      <StoreMap />
      <Footer />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Ruta principal */}
            <Route path="/" element={<HomePage />} />
            
            {/* Ruta de administración - Panel para subir productos */}
            <Route path="/argdev" element={<ProductUploader />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
