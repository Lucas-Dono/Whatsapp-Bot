# Sistema de Actualizaciones Remotas - Cervecería

Este documento explica cómo utilizar el sistema de actualizaciones remotas para la aplicación de la Cervecería. Este sistema te permite enviar actualizaciones de código desde tu computadora al servidor de la cervecería, sin necesidad de visitas presenciales.

## Componentes del Sistema

El sistema consta de tres partes principales:

1. **Servidor de actualizaciones**: Se ejecuta en el servidor de la cervecería y está esperando recibir paquetes de actualización.
2. **Cliente de publicación**: Es un script que se ejecuta en tu computadora para enviar actualizaciones al servidor.
3. **Túnel Ngrok**: Hace que el servidor sea accesible desde internet sin necesidad de configurar el router.
4. **Notificaciones por WhatsApp**: Envía automáticamente la URL de actualización y notificaciones de estado a tu número de WhatsApp.

## Cómo Publicar Actualizaciones

### Requisitos Previos

1. Asegúrate de que el servidor esté en línea y funcionando.
2. Debes tener la misma clave secreta configurada tanto en tu computadora como en el servidor (en el archivo `.env`).
3. Necesitas tener conexión a internet.

### Pasos para Publicar una Actualización

1. **Realiza tus cambios en el código**
   - Modifica los archivos necesarios en tu copia local del proyecto.
   - Prueba que todo funciona correctamente antes de publicar.

2. **Recibe la URL del servidor remoto**
   - Al iniciar, el servidor enviará automáticamente un mensaje a tu WhatsApp con la URL pública generada por Ngrok
   - El mensaje incluirá instrucciones y detalles sobre la URL
   - Esta URL cambia cada vez que se reinicia el servidor (en la versión gratuita de Ngrok)

3. **Ejecuta el script de publicación**:
   ```bash
   npm run publish-update
   ```

4. **Sigue las instrucciones interactivas**:
   - Introduce la versión de la actualización (ej. 1.0.1)
   - Proporciona una descripción de los cambios
   - Selecciona los directorios a incluir (o deja vacío para usar los predeterminados)
   - **Introduce la URL del servidor** que recibiste por WhatsApp

5. **Recibe notificaciones en tiempo real**:
   - Recibirás un mensaje cuando se inicie la instalación
   - Recibirás un mensaje cuando la actualización se complete correctamente
   - Recibirás un mensaje si ocurre algún error durante la actualización

## Configuración del Sistema

### En tu computadora de desarrollo:

1. Asegúrate de tener configurado el archivo `.env` con:
   ```
   UPDATE_SECRET_KEY=clave-secreta-para-actualizaciones-cambiar-esto
   ```

2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

### En el servidor de la cervecería:

1. El servidor de actualizaciones se inicia automáticamente con la aplicación principal.
2. Asegúrate de que el archivo `.env` tenga la siguiente configuración:
   ```
   UPDATE_SECRET_KEY=clave-secreta-para-actualizaciones-cambiar-esto
   UPDATE_PORT=3333
   NGROK_ENABLED=true
   NGROK_AUTHTOKEN=tu-token-de-ngrok  # Opcional pero recomendado
   NGROK_REGION=us  # Región de Ngrok (us, eu, ap, au, sa, jp, in)
   DEVELOPER_PHONE=5423XXXXXXXX@c.us  # Tu número de WhatsApp con código de país
   ```

3. Si deseas mejorar la experiencia, regístrate en [ngrok.com](https://ngrok.com/signup) para obtener un token de autenticación gratuito.

## Notificaciones por WhatsApp

El sistema aprovecha el bot de WhatsApp ya implementado para enviar automáticamente:

1. **URL del servidor de actualizaciones**:
   - Se envía cuando el servidor inicia
   - Contiene la URL de Ngrok necesaria para las actualizaciones
   - Incluye instrucciones y advertencia sobre el tiempo de vida de la URL

2. **Estado de las actualizaciones**:
   - Notificación cuando se recibe una actualización
   - Notificación cuando se completa la instalación
   - Notificación si ocurre algún error

Esto elimina la necesidad de tener acceso físico al servidor para obtener la URL y verificar el estado de las actualizaciones.

## Conexión mediante Ngrok

El sistema utiliza Ngrok para crear un túnel seguro desde internet hasta el servidor local. Esto elimina la necesidad de:
- Configurar reenvío de puertos en el router
- Tener una IP pública fija
- Abrir puertos en el firewall

### Ventajas de Ngrok
- Proporciona una URL HTTPS segura
- Funciona a través de cualquier red, incluso con restricciones
- Incluye un dashboard para monitorear las solicitudes (útil para depuración)

### Limitaciones de la versión gratuita de Ngrok
- Las sesiones duran 2 horas (luego la URL cambia)
- Ancho de banda limitado (pero suficiente para las actualizaciones)
- Un solo túnel activo a la vez

## Solución de Problemas

### No puedo conectar con el servidor

1. Verifica que el servidor esté en línea
2. La URL de Ngrok puede haber cambiado si el servidor se reinició
3. Verifica la conexión a internet

### Error de autenticación

1. Asegúrate de que la `UPDATE_SECRET_KEY` es la misma en ambos lados
2. Verifica que la fecha en ambos sistemas sea correcta (el token depende de la fecha)

### La actualización se envía pero no se aplica

1. Revisa los logs del servidor
2. Verifica que PM2 está funcionando correctamente
3. Comprueba que los permisos de archivos son correctos

## Registro de Actualizaciones

El servidor mantiene un registro de todas las actualizaciones recibidas en el directorio `updates/` con el formato:
```
updates/update_X_Y_Z.zip
```

Donde X_Y_Z es la versión de la actualización.

## Seguridad

- El sistema utiliza un token HMAC-SHA256 para autenticar las actualizaciones
- El token cambia diariamente para mayor seguridad
- Se recomienda cambiar la clave secreta (`UPDATE_SECRET_KEY`) periódicamente
- Las actualizaciones se transmiten como datos binarios seguros
- La conexión a través de Ngrok utiliza HTTPS por defecto

## Notas Importantes

- Siempre se realiza una copia de seguridad antes de aplicar una actualización
- El sistema detiene temporalmente los servicios durante la actualización
- El proceso completo suele tardar menos de un minuto, dependiendo del tamaño de la actualización
- Limita el tamaño de las actualizaciones a menos de 50MB para evitar problemas de transferencia 