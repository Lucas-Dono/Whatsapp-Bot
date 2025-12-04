# Herramientas para Desarrolladores - Cervecería 6600

Este paquete contiene herramientas para que los desarrolladores puedan enviar actualizaciones al sistema de Cervecería 6600 sin necesidad de tener todo el proyecto instalado.

## Contenido

- **publish-update.js**: Script para publicar actualizaciones al servidor remoto
- **.env.example**: Plantilla para configurar el entorno
- **package.json**: Configuración mínima con las dependencias necesarias

## Requisitos

- Node.js 18 o superior
- npm o yarn

## Configuración Inicial

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   - Copiar el archivo `.env.example` a `.env`
   - Verificar que la clave secreta coincida con la del servidor

   ```bash
   cp .env.example .env
   ```

## Uso

### Publicar una actualización

1. **Ejecutar el script de publicación**:
   ```bash
   npm run publish
   ```
   o directamente:
   ```bash
   node publish-update.js
   ```

2. **Seguir las instrucciones interactivas**:
   - Ingresar la versión (formato X.Y.Z)
   - Proporcionar una descripción de la actualización
   - Especificar la ruta del proyecto principal
   - Seleccionar los directorios a incluir
   - Proporcionar la URL del servidor de actualizaciones

### Directorios típicos a incluir

Los directorios más comunes que se suelen actualizar son:

- `src`: Código fuente del backend
- `routes`: Definiciones de rutas API
- `cerveceria-admin-ui/src`: Código fuente del frontend
- `cerveceria-admin-ui/public`: Recursos estáticos del frontend

Por defecto, el script incluirá estos directorios si no se especifica otra cosa.

## Notas importantes

- **No incluyas node_modules**: Estos directorios son muy pesados y no deben enviarse en las actualizaciones.
- **Tamaño máximo**: Las actualizaciones mayores a 50MB pueden fallar dependiendo de la conexión.
- **Arquitectura**: Asegúrate de que el código sea compatible con la plataforma del servidor. 