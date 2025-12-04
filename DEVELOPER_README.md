# Instrucciones para Desarrolladores - Cervecería 6600

## Herramientas para Desarrolladores

Se ha creado una carpeta `developer-tools` que contiene un conjunto mínimo de herramientas para trabajar con el proyecto sin necesidad de instalar todas las dependencias. Esta carpeta está diseñada para facilitar el envío de actualizaciones desde el entorno de desarrollo al servidor de producción.

### Contenido de developer-tools

- **Script para publicar actualizaciones**: Permite enviar actualizaciones al servidor sin necesidad de tener todo el entorno configurado
- **Configuración mínima**: Solo incluye las dependencias necesarias para operar con el servidor de actualizaciones
- **Scripts de configuración**: Facilitan la instalación y puesta en marcha de las herramientas

### Ventajas

- **Tamaño reducido**: No incluye `node_modules`, lo que facilita su distribución y respaldo
- **Independencia**: Permite trabajar sin tener que instalar el proyecto completo
- **Facilidad de uso**: Interfaz interactiva para guiar al desarrollador en el proceso de publicación

## Cómo usar las herramientas de desarrollo

1. **Configuración inicial**:
   - Navega a la carpeta `developer-tools`
   - Ejecuta `setup.bat` (Windows) o `setup.sh` (Linux/Mac) para instalar dependencias
   - Verifica que el archivo `.env` tiene la clave correcta

2. **Publicar actualizaciones**:
   - Ejecuta `npm run publish` desde la carpeta `developer-tools`
   - Sigue las instrucciones interactivas para especificar:
     - Versión de la actualización (formato X.Y.Z)
     - Descripción de la actualización
     - Ruta del proyecto principal
     - Directorios a incluir
     - URL del servidor

3. **Verificación de actualizaciones**:
   - El script verificará si el servidor está en línea
   - Comprobará el tamaño del paquete a enviar
   - Realizará la autenticación usando la clave secreta configurada

## Notas importantes

- **No incluir `node_modules`**: Estos directorios son muy pesados y no deben enviarse en las actualizaciones
- **Clave de actualización**: La clave `UPDATE_SECRET_KEY` debe coincidir con la configurada en el servidor
- **Versión semántica**: Usar el formato X.Y.Z (MAYOR.MENOR.PARCHE) para las versiones

Para más detalles sobre el uso de las herramientas, consulta el README en la carpeta `developer-tools`. 