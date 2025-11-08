// Script para verificar configuración antes de iniciar
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

console.log('\n🔍 Verificando configuración...\n');

// Verificar si existe .env
if (!fs.existsSync(envPath)) {
  console.error('❌ ERROR: No se encontró el archivo .env\n');
  console.log('📝 Pasos para configurar:\n');
  console.log('1. Copiar .env.example a .env:');
  console.log('   cp .env.example .env\n');
  console.log('2. Editar .env y agregar tus credenciales de Cloudinary');
  console.log('3. Obtener credenciales en: https://console.cloudinary.com/console\n');
  process.exit(1);
}

// Leer .env
const dotenv = require('dotenv');
dotenv.config({ path: envPath });

// Verificar variables requeridas
const required = ['CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missing = [];

for (const key of required) {
  if (!process.env[key] || process.env[key].trim() === '') {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error('❌ ERROR: Faltan variables de entorno requeridas:\n');
  missing.forEach(key => console.log(`   • ${key}`));
  console.log('\n📝 Editar el archivo .env y agregar:\n');
  console.log('CLOUDINARY_API_KEY=tu_api_key_aqui');
  console.log('CLOUDINARY_API_SECRET=tu_api_secret_aqui\n');
  console.log('🔗 Obtener en: https://console.cloudinary.com/console\n');
  process.exit(1);
}

console.log('✅ Configuración correcta!\n');
console.log('🔑 Variables configuradas:');
console.log(`   • CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME || 'drigawwbd'}`);
console.log(`   • CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY.substring(0, 4)}...`);
console.log(`   • PORT: ${process.env.PORT || 5000}`);
console.log('');
