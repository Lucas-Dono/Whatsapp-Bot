# Guía para el Desarrollador - Sistema de Actualizaciones Remotas

## Componentes del Sistema

El sistema de actualizaciones remotas consta de dos partes principales:

1. **Servidor de Actualizaciones** (`src/update-server.js`):
   - Se ejecuta en el servidor del cliente
   - Recibe y aplica las actualizaciones
   - Utiliza Ngrok para crear un túnel
   - Envía notificaciones por WhatsApp

2. **Cliente de Publicación** (`publish-update.js`):
   - Se ejecuta en tu máquina (del desarrollador)
   - Empaqueta y envía actualizaciones al servidor
   - Recibe notificaciones de estado

## Solución de Problemas Comunes

### Conflicto de puertos (EADDRINUSE)

Si ves el error `Error: listen EADDRINUSE: address already in use :::3333`, significa que el puerto 3333 ya está en uso. Posibles soluciones:

1. **Deshabilitar temporalmente el servidor de actualizaciones**:
   - Modifica el archivo `.env` y cambia `DISABLE_UPDATE_SERVER=true`
   - Reinicia la aplicación

2. **Cambiar el puerto del servidor de actualizaciones**:
   - Modifica el archivo `.env` y cambia `UPDATE_PORT=XXXX` (donde XXXX es un puerto libre)
   - Asegúrate de usar el mismo puerto en la configuración de Ngrok

3. **Detener procesos conflictivos**:
   - Ejecuta `taskkill /f /im node.exe` para detener todos los procesos de Node.js
   - Reinicia la aplicación con `npm run start-windows`

### Ngrok no se inicia correctamente

Si Ngrok no se inicia o no recibe la URL por WhatsApp:

1. Verifica que `NGROK_ENABLED=true` en el archivo `.env`
2. Asegúrate de tener un token de autenticación de Ngrok (regístrate en ngrok.com)
3. Agrega el token a la variable `NGROK_AUTHTOKEN=` en el archivo `.env`

### No recibo notificaciones en WhatsApp

1. Verifica que el número en `DEVELOPER_PHONE` es correcto (formato: CODPAIS+NUMERO@c.us)
2. Asegúrate de que el bot de WhatsApp esté correctamente autenticado
3. Reinicia la aplicación para que el bot se conecte correctamente

## Actualizando el Código del Cliente

### Cambios en el Backend

1. Modifica los archivos en `/src` o `/routes`
2. Prueba los cambios localmente
3. Empaqueta y envía con `node publish-update.js`

### Cambios en el Frontend

1. Modifica los archivos en `/cerveceria-admin-ui/src`
2. Prueba los cambios localmente
3. Empaqueta y envía con `node publish-update.js`

## Mejores Prácticas

1. **Siempre haz respaldos** antes de enviar actualizaciones
2. **Prueba los cambios localmente** antes de enviarlos
3. **Envía actualizaciones pequeñas** para minimizar riesgos
4. **Documenta tus cambios** en la descripción de la actualización
5. **Verifica el estado** mediante las notificaciones de WhatsApp

## Variables de Entorno Importantes

```
# Clave compartida entre cliente y servidor
UPDATE_SECRET_KEY=SdJkq5PvbTBs82AEt7VLyzNx9F4CwDG3

# Puerto del servidor de actualizaciones (3333 por defecto)
UPDATE_PORT=3333

# Deshabilitar servidor de actualizaciones (false por defecto)
DISABLE_UPDATE_SERVER=false

# Configuración de Ngrok
NGROK_ENABLED=true
NGROK_AUTHTOKEN=tu-token
NGROK_REGION=us

# Número de WhatsApp para notificaciones
DEVELOPER_PHONE=542324543762@c.us
```

Recuerda que estas variables deben estar configuradas en ambos lados (cliente y desarrollador) según corresponda. 