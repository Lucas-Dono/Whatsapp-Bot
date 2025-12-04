@echo off
echo ===== INICIANDO TODOS LOS SERVICIOS =====

echo.
echo Actualizando configuracion de IP...
node src/pre-start.js

echo.
echo Deteniendo posibles servicios anteriores...
taskkill /f /im node.exe 2>nul
echo Esperando 2 segundos...
ping 127.0.0.1 -n 3 > nul

echo.
echo Iniciando Backend (WhatsApp Bot)...
start cmd /k "cd %~dp0 && node src/index.js"

echo.
echo Iniciando Frontend (Panel de Administracion)...
start cmd /k "cd %~dp0cerveceria-admin-ui && npm start"

echo.
echo ===== SERVICIOS INICIADOS =====
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3001
echo.
echo Para detener los servicios, cierra las ventanas de comandos.
echo. 