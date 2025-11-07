#!/bin/bash
# vercel-build.sh

# Limpiar cualquier configuración de npm existente
rm -f .npmrc
rm -f ~/.npmrc

# Forzar el registry público
npm config set registry https://registry.npmjs.org/

# Instalar dependencias
npm install

# Build del proyecto
npm run build