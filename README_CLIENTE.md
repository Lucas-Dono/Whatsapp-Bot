# Sistema de Actualizaciones Remotas - Guía para el Cliente

## ¿Qué es el sistema de actualizaciones remotas?

Este sistema permite al desarrollador enviar actualizaciones de código a tu servidor sin necesidad de visitas presenciales. Cuando se inicia la aplicación, automáticamente se crea un canal seguro que permitirá recibir estas actualizaciones.

## Inicio de la aplicación

Para iniciar toda la aplicación (backend y frontend) con un solo comando, tienes varias opciones:

### Opción para acceder desde celulares y tablets (recomendada):
```bash
npm run start-network
```
Este comando detecta automáticamente la IP de la computadora y configura todo para que puedas acceder desde celulares, tablets y otras computadoras conectadas a la misma red WiFi.

El script te mostrará la URL exacta que debes usar en los dispositivos (por ejemplo: http://192.168.0.82:3001).

### Otras opciones de inicio:

#### Inicio directo:
```bash
npm run start-direct
```
Este comando inicia directamente dos ventanas de consola para el backend y frontend.

#### Inicio con PowerShell:
```bash
npm run start-ps
```
Utiliza un script PowerShell con mejor manejo de errores.

#### Inicio con script batch:
```bash
npm run start-windows
```
Utiliza un script batch para iniciar los servicios.

#### Inicio con PM2:
```bash
npm run start-all
```
Esta opción utiliza PM2 para gestionar los procesos.

### Comandos adicionales para gestionar la aplicación:

```bash
# Ver estado de todos los servicios
npm run status

# Detener todos los servicios
npm run stop-all

# Reiniciar todos los servicios
npm run restart-all
```

## ¿Qué necesitas hacer tú como cliente?

**¡Buenas noticias! No necesitas hacer nada especial para las actualizaciones.** El sistema funciona automáticamente.

Todo está configurado para que:
1. Al iniciar la aplicación, el sistema de actualizaciones se inicie automáticamente
2. Se establezca un canal seguro para recibir actualizaciones
3. El desarrollador reciba una notificación automática en su WhatsApp con la URL necesaria para enviar actualizaciones

## ¿Qué pasa cuando se recibe una actualización?

Cuando el desarrollador envía una actualización:
1. El sistema crea automáticamente una copia de seguridad de todos los archivos importantes
2. Se detienen temporalmente los servicios (durante unos segundos)
3. Se aplican los cambios necesarios
4. Se reinician los servicios automáticamente

## Requisitos y consideraciones

- **La aplicación debe estar funcionando**. Si está apagada, no se pueden recibir actualizaciones.
- **No es necesario abrir puertos en el router** o configurar el firewall. El sistema utiliza un túnel seguro.
- **No compartir las credenciales del sistema** con personas no autorizadas.

## Solución de problemas

Si el desarrollador reporta que no puede enviar actualizaciones:

1. Verifica que la aplicación está en ejecución (`npm run start-all`)
2. Reinicia la aplicación si es necesario (`npm run restart-all`)
3. Asegúrate de que hay conexión a internet
4. Contacta al desarrollador para obtener ayuda adicional

## Seguridad

- Solo el desarrollador con la clave secreta correcta puede enviar actualizaciones
- Todas las comunicaciones están cifradas
- Cada actualización queda registrada en el sistema
- Se realiza una copia de seguridad antes de cada actualización

---

*Este documento es para el cliente final. Para información técnica detallada, consulta README_ACTUALIZACIONES.md* 