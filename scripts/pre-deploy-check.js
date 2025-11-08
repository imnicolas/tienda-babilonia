#!/usr/bin/env node

/**
 * 🔍 Pre-Deploy Verification Script
 * Verifica que todo esté listo para deployment a Vercel
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando configuración para deploy...\n');

let hasErrors = false;

// 1. Verificar que existan archivos críticos
const criticalFiles = [
  'package.json',
  'vercel.json',
  'api/health.js',
  'api/products.js',
  'api/delete-product.js',
  'src/App.tsx',
  'src/components/FeaturedProducts.tsx',
  '.gitignore'
];

console.log('📁 Verificando archivos críticos...');
criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - NO ENCONTRADO`);
    hasErrors = true;
  }
});

// 2. Verificar .gitignore
console.log('\n🔒 Verificando .gitignore...');
const gitignorePath = path.join(__dirname, '..', '.gitignore');
const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

const requiredIgnores = ['.env', 'node_modules', '/build'];
requiredIgnores.forEach(pattern => {
  if (gitignoreContent.includes(pattern)) {
    console.log(`   ✅ ${pattern} está en .gitignore`);
  } else {
    console.log(`   ⚠️  ${pattern} NO está en .gitignore`);
    hasErrors = true;
  }
});

// 3. Verificar package.json
console.log('\n📦 Verificando package.json...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDeps = ['cloudinary', 'express', 'cors', 'dotenv'];
requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`   ❌ ${dep} - NO ENCONTRADO en dependencies`);
    hasErrors = true;
  }
});

// 4. Verificar que .env no esté trackeado
console.log('\n🔐 Verificando que archivos sensibles no estén en git...');
const { execSync } = require('child_process');
try {
  const trackedFiles = execSync('git ls-files', { encoding: 'utf8' });
  // Verificar exactamente .env (no .env.example ni .env.production)
  const envLines = trackedFiles.split('\n');
  const hasEnv = envLines.some(line => line.trim() === '.env');
  
  if (hasEnv) {
    console.log('   ⚠️  .env está trackeado en git - ELIMINAR!');
    hasErrors = true;
  } else {
    console.log('   ✅ .env no está trackeado en git');
  }
} catch (error) {
  console.log('   ⚠️  No se pudo verificar git (¿repo no inicializado?)');
}

// 5. Verificar vercel.json
console.log('\n⚙️  Verificando vercel.json...');
const vercelJsonPath = path.join(__dirname, '..', 'vercel.json');
const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

if (vercelJson.rewrites && vercelJson.rewrites.length > 0) {
  console.log(`   ✅ ${vercelJson.rewrites.length} rutas configuradas`);
} else {
  console.log('   ❌ No hay rutas configuradas en vercel.json');
  hasErrors = true;
}

// 6. Verificar estructura de API files
console.log('\n🔌 Verificando serverless functions...');
const apiFunctions = ['health.js', 'products.js', 'delete-product.js'];
apiFunctions.forEach(file => {
  const filePath = path.join(__dirname, '..', 'api', file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('module.exports') && content.includes('cloudinary')) {
    console.log(`   ✅ ${file} - Estructura correcta`);
  } else {
    console.log(`   ⚠️  ${file} - Verificar estructura`);
  }
});

// Resultado final
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ HAY ERRORES - Corregir antes de hacer deploy');
  process.exit(1);
} else {
  console.log('✅ TODO LISTO PARA DEPLOY');
  console.log('\nSiguientes pasos:');
  console.log('1. git add .');
  console.log('2. git commit -m "feat: optimizar llamadas a Cloudinary"');
  console.log('3. git push origin feature/cargar-productos-desde-cloudinary');
  console.log('4. git checkout main && git merge feature/cargar-productos-desde-cloudinary');
  console.log('5. git push origin main');
  console.log('\n🚀 Vercel desplegará automáticamente!');
}
console.log('='.repeat(50) + '\n');
