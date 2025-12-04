# Instrucciones para el Desarrollador

## Archivos para el Cliente (ya preparados)

El proyecto que has duplicado y que estás entregando al cliente ya contiene:

1. **Servidor de actualizaciones** (`src/update-server.js`)
   - Recibe actualizaciones remotas
   - Utiliza Ngrok para crear un túnel seguro
   - Envía notificaciones por WhatsApp
   - Se inicia automáticamente cuando arranca la aplicación

2. **Sistema de respaldo** (`backup.js`)
   - Crea copias de seguridad antes de cada actualización

3. **Configuración**
   - Archivo `.env` con las variables necesarias
   - Clave secreta segura: `SdJkq5PvbTBs82AEt7VLyzNx9F4CwDG3`
   - Número de WhatsApp configurado: `542324543762@c.us`

4. **Documentación para el cliente**
   - `README_CLIENTE.md`: Guía simplificada para el cliente
   - `README_ACTUALIZACIONES.md`: Documentación técnica detallada

## Herramienta para Ti como Desarrollador

1. **Cliente de publicación** (`publish-update.js`)
   - Este es el único archivo que necesitas conservar en tu máquina
   - Te permite enviar actualizaciones al servidor del cliente

## Cómo Usar el Sistema

1. **Configuración en tu máquina**:
   - Crea un archivo `.env` en la misma carpeta que `publish-update.js` con:
   ```
   UPDATE_SECRET_KEY=SdJkq5PvbTBs82AEt7VLyzNx9F4CwDG3
   ```
   - Instala las dependencias necesarias:
   ```bash
   npm install node-fetch crypto readline dotenv
   ```

2. **Flujo de trabajo**:
   - El cliente inicia la aplicación con `npm start`
   - Recibirás automáticamente un mensaje en WhatsApp con la URL de actualización
   - Cuando necesites publicar una actualización:
     ```bash
     node publish-update.js
     ```
   - Sigue las instrucciones interactivas
   - Introduce la URL que recibiste por WhatsApp
   - Recibirás notificaciones sobre el proceso

3. **Importante**:
   - La clave secreta `UPDATE_SECRET_KEY` debe ser la misma en tu máquina y en el servidor
   - La URL de Ngrok cambia cada vez que se reinicia el servidor (aprox. cada 2 horas en versión gratuita)
   - Necesitarás la última URL enviada a tu WhatsApp para enviar actualizaciones

## Consejos de Seguridad

- No compartas la clave secreta con nadie
- No subas el archivo `publish-update.js` con tu clave secreta a repositorios públicos
- Guarda una copia de seguridad de tu clave secreta y de `publish-update.js`

## Notas sobre la Implementación

- El sistema utiliza el bot de WhatsApp existente para enviar notificaciones
- Las actualizaciones se aplican deteniendo y reiniciando brevemente los servicios
- Se crea automáticamente una copia de seguridad antes de cada actualización 