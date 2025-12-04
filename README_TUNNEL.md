# Configuración de Túnel para Actualizaciones Remotas

Este documento explica cómo configurar un túnel con Ngrok para hacer accesible el servidor de actualizaciones desde internet sin necesidad de configurar el router ni tener una IP pública fija.

## ¿Qué es Ngrok?

Ngrok es una herramienta que crea un túnel seguro desde internet hacia tu servidor local, asignando una URL pública temporal o permanente que redirige a tu servidor local.

## Instalación de Ngrok en el servidor de la cervecería

1. **Descargar Ngrok**:
   - Visita [https://ngrok.com/download](https://ngrok.com/download)
   - Descarga la versión adecuada para el sistema operativo del servidor

2. **Descomprimir el archivo descargado**:
   ```bash
   unzip /ruta/a/ngrok-*.zip
   ```

3. **Registrarse y autenticarse**:
   - Crea una cuenta gratuita en [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup)
   - Obtén tu token de autenticación desde el dashboard
   - Autentica tu cliente de Ngrok:
   ```bash
   ./ngrok authtoken TU_TOKEN_DE_AUTENTICACION
   ```

## Configuración automática de Ngrok con el servidor de actualizaciones

Vamos a modificar el sistema para que inicie automáticamente Ngrok junto con el servidor de actualizaciones:

1. **Instalar Ngrok como dependencia**:
   ```bash
   npm install ngrok
   ```

2. **Crear archivo de configuración para Ngrok**:
   - Crea un archivo `ngrok.yml` en la raíz del proyecto
   - Configura como mínimo:
   ```yaml
   authtoken: TU_TOKEN_DE_AUTENTICACION
   ```

3. **Configurar variables de entorno**:
   - En el archivo `.env` añade las siguientes variables:
   ```
   NGROK_ENABLED=true
   NGROK_AUTHTOKEN=tu-token-de-ngrok
   NGROK_REGION=us
   ```

## Envío manual de la URL de ngrok

Si la URL de ngrok no se envía automáticamente a tu WhatsApp, puedes usar el comando:

```bash
npm run send-ngrok
```

Este comando:
1. Verifica que el bot de WhatsApp esté funcionando
2. Te pide ingresar manualmente la URL de ngrok que ves en la consola
3. Envía esa URL a tu número de WhatsApp configurado en DEVELOPER_PHONE

Para usar este comando:
1. Asegúrate de que el bot de WhatsApp esté en ejecución (con `npm start` o `npm run start-network`)
2. Ejecuta `npm run start-update-server` en otra ventana
3. Copia la URL de ngrok que aparece en la consola
4. Ejecuta `npm run send-ngrok` y pega la URL cuando te lo solicite

## Uso del túnel para actualizaciones remotas

1. Al iniciar el servidor, se mostrará la URL pública asignada por Ngrok
2. Esta URL se enviará automáticamente a tu WhatsApp si el bot está activo
3. Utiliza esta URL para configurar la herramienta de actualización en tu dispositivo local:
   ```
   UPDATE_SERVER_URL=https://tu-url-de-ngrok.ngrok.io
   ```
4. Ejecuta el proceso de actualización normalmente

## Ventajas de usar Ngrok

- No requiere configuración del router
- Funciona incluso con IPs dinámicas
- Proporciona una URL HTTPS segura
- Incluye dashboard con historial de solicitudes para depuración
- La versión gratuita es suficiente para este caso de uso

## Limitaciones de la versión gratuita

- Las sesiones duran 2 horas (luego cambia la URL)
- Ancho de banda limitado
- Solo permite un túnel simultáneo

Para un uso más permanente, considera actualizar a un plan pago que ofrece dominios fijos y sesiones ilimitadas.

## Solución de problemas con Ngrok

Si experimentas errores como `ECONNRESET`, `ECONNREFUSED` u otros problemas de conexión con ngrok, puedes intentar las siguientes soluciones:

### Errores comunes y soluciones

1. **Error ECONNRESET**

   Este error indica que la conexión se cerró de forma inesperada. Posibles causas:
   - Problemas con tu conexión a internet
   - Firewall bloqueando la conexión
   - Problemas temporales con los servidores de ngrok

   **Soluciones**:
   ```bash
   # Usar el iniciador alternativo de ngrok
   npm run ngrok-alt
   ```

2. **Token de autenticación inválido**

   Si el token que estás usando no es válido o ha expirado:
   - Genera un nuevo token en [dashboard.ngrok.com](https://dashboard.ngrok.com)
   - Actualiza el valor de `NGROK_AUTHTOKEN` en tu archivo `.env`

3. **Otro túnel ya está en ejecución**

   Ngrok tiene limitaciones en la versión gratuita sobre el número de túneles:
   - Cierra todas las terminales donde ngrok esté corriendo
   - En Windows: usa `taskkill /F /IM ngrok.exe` para finalizar procesos
   - Espera unos minutos antes de volver a intentar

4. **WhatsApp no recibe la URL aunque el bot funciona correctamente**

   A veces el sistema no detecta correctamente que el cliente de WhatsApp está listo:
   - Usa el comando para forzar el envío: `npm run force-ngrok`
   - Este comando fuerza al sistema a enviar la URL independientemente del estado reportado

### Envío manual y forzado de la URL de ngrok

Si la URL de ngrok no se envía automáticamente a tu WhatsApp, tienes varias opciones:

1. **Envío asistido (recomendado)**:
   ```bash
   npm run force-ngrok
   ```
   Este comando diagnostica el estado del sistema y fuerza el envío de la URL.

2. **Envío manual**:
   ```bash
   npm run send-ngrok
   ```
   Este comando te pedirá la URL de ngrok que ves en la consola.

3. **Solución a "Cliente WhatsApp no está listo"**:
   Si ves mensajes de error indicando que el cliente no está listo pero el bot está funcionando:
   ```bash
   npm run force-ngrok
   ```
   Este comando corrige la detección del estado y fuerza el envío.

### Uso del iniciador alternativo

Si continúas teniendo problemas, puedes usar el iniciador alternativo:

```bash
npm run ngrok-alt
```

Este comando:
1. Te permitirá seleccionar una región diferente (eu, us, ap, etc.)
2. Usa parámetros de conexión alternativos
3. Proporciona más información sobre posibles errores

Cuando el túnel se establezca correctamente, copia la URL mostrada y úsala para las actualizaciones.

### Alternativas a Ngrok

Si los problemas persisten, puedes considerar alternativas a ngrok:

1. **[Localhost.run](https://localhost.run/)**: Servicio similar a ngrok, generalmente más permisivo
2. **[Serveo.net](https://serveo.net/)**: Alternativa gratuita a ngrok
3. **[Localtunnel](https://localtunnel.github.io/www/)**: Otra opción gratuita

Para usar estas alternativas, necesitarás instalar y configurar estas herramientas por separado. 