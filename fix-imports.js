const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');

// Leer todos los archivos .tsx en el directorio ui
const files = fs.readdirSync(uiDir).filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(uiDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar todos los imports con versiones
  content = content.replace(/@radix-ui\/([^@\s"']+)@[\d.]+/g, '@radix-ui/$1');
  content = content.replace(/lucide-react@[\d.]+/g, 'lucide-react');
  content = content.replace(/class-variance-authority@[\d.]+/g, 'class-variance-authority');
  content = content.replace(/sonner@[\d.]+/g, 'sonner');
  content = content.replace(/next-themes@[\d.]+/g, 'next-themes');
  content = content.replace(/react-day-picker@[\d.]+/g, 'react-day-picker');
  content = content.replace(/embla-carousel-react@[\d.]+/g, 'embla-carousel-react');
  content = content.replace(/recharts@[\d.]+/g, 'recharts');
  content = content.replace(/cmdk@[\d.]+/g, 'cmdk');
  content = content.replace(/vaul@[\d.]+/g, 'vaul');
  content = content.replace(/react-hook-form@[\d.]+/g, 'react-hook-form');
  content = content.replace(/input-otp@[\d.]+/g, 'input-otp');
  content = content.replace(/react-resizable-panels@[\d.]+/g, 'react-resizable-panels');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('Done! All imports fixed.');
