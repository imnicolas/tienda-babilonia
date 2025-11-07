import React from 'react';

const StoreMap: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Visitanos en Rosario</h2>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">📍 Dirección:</span> Av. San Martín 3387, Rosario, Santa Fe
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">📞 Teléfono:</span>{' '}
            <a href="tel:+5493413543521" className="text-blue-600 hover:underline">
              +54 9 341 354-3521
            </a>
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">🕒 Horarios:</span> Lun-Vie 9:00-18:00 | Sáb 9:00-17:00
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg">
          <iframe
            title="Ubicación de Babilonia Calzados"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.1!2d-60.6505!3d-32.9442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab0f0f0f0f0f%3A0x0!2sAv.%20San%20Mart%C3%ADn%203387%2C%20Rosario%2C%20Santa%20Fe!5e0!3m2!1ses!2sar!4v1234567890"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Av.+San+Mart%C3%ADn+3387,+Rosario,+Santa+Fe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Abrir en Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};

export default StoreMap;
