# Script PowerShell para iniciar todos los servicios de la Cervecería

Write-Host "`n===== INICIANDO TODOS LOS SERVICIOS =====`n" -ForegroundColor Cyan

# Actualizar configuración de IP
Write-Host "Actualizando configuración de IP..." -ForegroundColor Yellow
node src/pre-start.js

# Detener procesos existentes de Node.js
Write-Host "Deteniendo posibles servicios anteriores..." -ForegroundColor Yellow
try {
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Write-Host "Procesos Node.js detenidos correctamente" -ForegroundColor Green
} catch {
    Write-Host "No se encontraron procesos de Node.js en ejecución" -ForegroundColor Yellow
}

# Esperar un momento
Write-Host "Esperando 2 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Ruta base del script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Iniciar backend
Write-Host "`nIniciando Backend (WhatsApp Bot)..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd $scriptPath && node src/index.js"

# Esperar un momento antes de iniciar el frontend
Start-Sleep -Seconds 1

# Iniciar frontend
Write-Host "`nIniciando Frontend (Panel de Administración)..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd $scriptPath\cerveceria-admin-ui && npm start"

# Mensaje final
Write-Host "`n===== SERVICIOS INICIADOS =====`n" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:3000" -ForegroundColor Magenta
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Magenta
Write-Host "`nPara detener los servicios, cierra las ventanas de comandos.`n" -ForegroundColor Yellow 