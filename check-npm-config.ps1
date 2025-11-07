# Script para verificar la configuración de npm

Write-Host "=== Verificación de configuración de npm ===" -ForegroundColor Cyan
Write-Host ""

# Verificar el registro actual
Write-Host "1. Registro de npm configurado:" -ForegroundColor Yellow
npm config get registry
Write-Host ""

# Verificar si hay un .npmrc global
Write-Host "2. Ubicación del .npmrc global:" -ForegroundColor Yellow
$globalNpmrc = npm config get globalconfig
Write-Host $globalNpmrc
Write-Host ""

# Verificar si hay un .npmrc en el proyecto
Write-Host "3. .npmrc del proyecto:" -ForegroundColor Yellow
if (Test-Path ".npmrc") {
    Write-Host "✓ Existe .npmrc en el proyecto" -ForegroundColor Green
    Get-Content .npmrc
} else {
    Write-Host "✗ No existe .npmrc en el proyecto" -ForegroundColor Red
}
Write-Host ""

# Verificar si hay un .npmrc en el directorio home
Write-Host "4. .npmrc en el directorio home:" -ForegroundColor Yellow
$homeNpmrc = Join-Path $env:USERPROFILE ".npmrc"
if (Test-Path $homeNpmrc) {
    Write-Host "✓ Existe .npmrc en: $homeNpmrc" -ForegroundColor Green
    Write-Host "Contenido (primeras 5 líneas):"
    Get-Content $homeNpmrc | Select-Object -First 5
} else {
    Write-Host "✗ No existe .npmrc en el home" -ForegroundColor Red
}
Write-Host ""

# Verificar configuración de Nexus
Write-Host "5. Buscando configuración de Nexus:" -ForegroundColor Yellow
$nexusConfig = npm config list | Select-String "nexus"
if ($nexusConfig) {
    Write-Host "⚠ Configuración de Nexus encontrada:" -ForegroundColor Yellow
    $nexusConfig
} else {
    Write-Host "✓ No se encontró configuración de Nexus" -ForegroundColor Green
}
Write-Host ""

Write-Host "=== Recomendaciones ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para este proyecto (Babilonia Calzados):" -ForegroundColor White
Write-Host "1. El archivo .npmrc del proyecto debe contener:" -ForegroundColor White
Write-Host "   registry=https://registry.npmjs.org/" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Si tienes Nexus configurado globalmente, el .npmrc del proyecto lo sobrescribirá" -ForegroundColor White
Write-Host ""
Write-Host "3. Para probar localmente:" -ForegroundColor White
Write-Host "   npm install --registry=https://registry.npmjs.org" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Para verificar que funciona:" -ForegroundColor White
Write-Host "   npm run build" -ForegroundColor Gray
Write-Host ""

# Preguntar si quiere hacer una prueba de instalación
Write-Host "¿Deseas probar la instalación con el registro público? (S/N): " -NoNewline -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "S" -or $response -eq "s") {
    Write-Host ""
    Write-Host "Ejecutando: npm install --registry=https://registry.npmjs.org" -ForegroundColor Cyan
    npm install --registry=https://registry.npmjs.org
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Instalación exitosa!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "✗ Error en la instalación" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Verificación completa ===" -ForegroundColor Cyan
