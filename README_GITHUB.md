# Sistema de Actualizaciones Basado en GitHub

Este documento explica cómo usar el nuevo sistema de actualizaciones basado en GitHub para la Cervecería 6600. Este sistema sustituye al anterior basado en ngrok, ofreciendo mayor estabilidad, facilidad de uso y control sobre las versiones.

## Visión General

El sistema de actualizaciones basado en GitHub permite:

1. **Actualizar el sistema con simples commits** a un repositorio en GitHub
2. **Desplegar cambios automáticamente** en el servidor de la Cervecería
3. **Recibir notificaciones por WhatsApp** de actualizaciones exitosas o errores
4. **Controlar versiones** con un historial completo de cambios

## Configuración Inicial

### 1. Crear un repositorio en GitHub

Lo primero es crear un repositorio en GitHub donde se almacenará el código:

1. Visita [GitHub](https://github.com) y crea una cuenta si no tienes una
2. Crea un nuevo repositorio (puede ser público o privado)
3. Toma nota del nombre del repositorio en formato `usuario/repositorio`

### 2. Configurar variables de entorno

En el servidor de la Cervecería, edita el archivo `.env` y añade:

```
# Configuración para actualizaciones basadas en GitHub
ENABLE_GITHUB_UPDATES=true
GITHUB_REPO=usuario/repositorio
GITHUB_BRANCH=main
CHECK_INTERVAL_MINUTES=30
```

Reemplaza `usuario/repositorio` con el nombre real de tu repositorio.

### 3. Inicializar el repositorio local

Si estás partiendo de un sistema existente:

```bash
# Inicializar Git en la carpeta actual
git init

# Añadir el repositorio remoto
git remote add origin https://github.com/usuario/repositorio.git

# Añadir todos los archivos existentes
git add .

# Crear el primer commit
git commit -m "Versión inicial"

# Subir al repositorio remoto
git push -u origin main
```

## Uso Diario (Desarrollador)

### Enviar actualizaciones al servidor

1. **Haz cambios en tu copia local del código**
2. **Commit y push a GitHub**:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

3. **El servidor se actualizará automáticamente**:
   - Al reiniciar el sistema, verificará e instalará actualizaciones automáticamente
   - También verificará periódicamente cada 30 minutos si hay actualizaciones
   - Cuando encuentra cambios, los aplica automáticamente
   - Recibirás una notificación por WhatsApp con los cambios aplicados

### Actualizaciones Automáticas al Inicio

El sistema ahora verifica e instala actualizaciones automáticamente cada vez que se inicia:

1. **Sin intervención del usuario**: No se requiere ninguna acción por parte del personal
2. **Mensajes claros**: Muestra información en la consola sobre las actualizaciones 
3. **Reinicio automático**: Si se actualizan archivos críticos, el sistema se reinicia automáticamente
4. **Notificaciones**: Envía mensajes de WhatsApp al desarrollador sobre las actualizaciones aplicadas

Este comportamiento es ideal para entornos donde el personal no tiene conocimientos técnicos,
ya que mantiene el sistema actualizado de forma completamente automática.

### Verificar el estado

Puedes verificar manualmente si hay actualizaciones ejecutando:

```bash
npm run check-updates
```

## Uso en el Servidor

### Iniciar el sistema de actualizaciones

El sistema de actualizaciones se inicia automáticamente con el servidor principal.
También puedes ejecutarlo independientemente:

```bash
npm run github-updater
```

Este comando ahora:
1. Verifica si hay actualizaciones disponibles
2. Muestra un resumen detallado de los cambios (commits y archivos)
3. Permite aplicar las actualizaciones inmediatamente o simplemente monitorear
4. Inicia el sistema de verificación automática

### Verificar actualizaciones manualmente

Si necesitas forzar una verificación inmediata:

```bash
npm run check-updates
```

### Características de seguridad mejoradas

El nuevo sistema incluye:

1. **Copia de seguridad automática**: Antes de aplicar actualizaciones, se crea una copia de seguridad de los archivos que serán modificados
2. **Verificación selectiva**: Solo actualiza los archivos realmente modificados
3. **Informe detallado**: Muestra exactamente qué archivos y carpetas cambiarán
4. **Análisis de impacto**: Detecta cambios en archivos críticos como package.json y actúa en consecuencia

### API HTTP

El sistema también expone un API HTTP para control remoto:

- `GET /api/github/status` - Obtener estado del sistema de actualizaciones
- `GET /api/github/preview` - Previsualizar cambios sin aplicarlos
- `POST /api/github/check` - Verificar y aplicar actualizaciones (requiere autenticación)
- `POST /api/github/webhook` - Endpoint para webhooks de GitHub

## Ventajas sobre el Sistema Anterior

| Característica | Sistema GitHub | Sistema ngrok |
|----------------|---------------|--------------|
| Facilidad de uso | Simple commit y push | Requiere generar y enviar paquetes ZIP |
| Estabilidad | No expira | URLs expiran cada 2 horas |
| Control de versiones | Completo historial | Solo versión actual |
| Rollback | Soportado | No soportado |
| Dependencia externa | Mínima | Alta (servicio ngrok) |

## Solución de Problemas

### El servidor no recibe las actualizaciones

1. Verifica que `ENABLE_GITHUB_UPDATES=true` en el archivo `.env`
2. Asegúrate de que `GITHUB_REPO` tenga el formato correcto `usuario/repositorio`
3. Ejecuta manualmente `npm run check-updates` para ver si hay errores

### Errores de permisos Git

Si ves errores relacionados con permisos de Git:

1. Verifica que el usuario que ejecuta la aplicación tenga permisos para la carpeta `.git`
2. Considera usar un token de acceso personal de GitHub para repositorios privados

### Cómo revertir una actualización problemática

Si una actualización causa problemas:

1. Haz un revert en GitHub del commit problemático
2. Haz push al repositorio
3. El sistema aplicará automáticamente la reversión

## Webhooks de GitHub (Avanzado)

Para actualización inmediata al hacer push:

1. En GitHub, ve a tu repositorio > Settings > Webhooks
2. Añade un nuevo webhook:
   - Payload URL: `https://tu-servidor.com/api/github/webhook`
   - Content type: `application/json`
   - Eventos: Selecciona solo "Push"
3. El servidor se actualizará automáticamente en cada push 