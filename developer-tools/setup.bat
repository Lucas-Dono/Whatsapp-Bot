@echo off
echo ===== CONFIGURACION DE HERRAMIENTAS PARA DESARROLLADORES =====
echo.

echo Instalando dependencias...
call npm install

echo.
echo Creando archivo .env...
if not exist .env (
    copy .env.example .env
    echo Archivo .env creado correctamente.
) else (
    echo El archivo .env ya existe. No se ha sobrescrito.
)

echo.
echo ===== CONFIGURACION COMPLETADA =====
echo.
echo Para publicar actualizaciones, ejecuta:
echo npm run publish
echo.
pause 