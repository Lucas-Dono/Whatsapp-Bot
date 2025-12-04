#!/bin/bash

echo "===== CONFIGURACION DE HERRAMIENTAS PARA DESARROLLADORES ====="
echo

echo "Instalando dependencias..."
npm install

echo
echo "Creando archivo .env..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Archivo .env creado correctamente."
else
    echo "El archivo .env ya existe. No se ha sobrescrito."
fi

echo
echo "===== CONFIGURACION COMPLETADA ====="
echo
echo "Para publicar actualizaciones, ejecuta:"
echo "npm run publish"
echo 