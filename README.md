# Cervecería 6600 - Bot de WhatsApp y Panel de Administración

Sistema completo de atención al cliente automatizada vía WhatsApp con panel de administración web para gestión de productos, pedidos y conversaciones.

## Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Inicio de la Aplicación](#inicio-de-la-aplicación)
- [Uso](#uso)
- [Arquitectura](#arquitectura)
- [Desarrollo](#desarrollo)
- [Documentación Adicional](#documentación-adicional)

## Características

### Bot de WhatsApp
- ✅ Atención automatizada al cliente 24/7
- ✅ Procesamiento de pedidos mediante conversación natural
- ✅ Integración con OpenAI para respuestas inteligentes
- ✅ Soporte para mensajes de voz con transcripción automática
- ✅ Gestión de imágenes y documentos (menús, catálogos)
- ✅ Sistema de clasificación de mensajes
- ✅ Información sobre negocios asociados
- ✅ Almacenamiento automático en Google Sheets

### Panel de Administración
- ✅ Interfaz web responsive (desktop y móvil)
- ✅ Gestión de productos (cervezas y catálogo)
- ✅ Visualización y gestión de pedidos en tiempo real
- ✅ Personalización de prompts del bot
- ✅ Dashboard con métricas y estadísticas
- ✅ Acceso desde múltiples dispositivos en red local

### Características Técnicas
- ✅ Múltiples modos de inicio y despliegue
- ✅ Sistema de actualizaciones remotas automáticas
- ✅ Notificaciones por WhatsApp al desarrollador
- ✅ Gestión con PM2 para producción
- ✅ Túnel Ngrok para acceso externo
- ✅ Auto-actualización desde repositorio GitHub

## Requisitos

### Software Necesario
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Python 3.x** (para transcripción de audio)
- **PM2** (opcional, para producción)

### Cuentas y API Keys
- Cuenta de **OpenAI** con API Key
- Cuenta de **Google Cloud Platform** con:
  - Service Account configurada
  - Google Sheets API habilitada
- Cuenta de **Ngrok** (opcional, para túnel)
- Repositorio de **GitHub** (opcional, para auto-actualización)

### Requisitos del Sistema
- Sistema Operativo: Windows, Linux o macOS
- RAM: Mínimo 2GB
- Espacio en disco: 500MB
- Conexión a internet estable

## Instalación

### 1. Clonar o descargar el repositorio

```bash
git clone <url-del-repositorio>
cd Whatsapp-Bot
```

### 2. Instalar dependencias del backend

```bash
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd cerveceria-admin-ui
npm install
cd ..
```

### 4. Instalar dependencias de Python (para audio)

```bash
pip install -r requirements.txt
```

### 5. Configurar variables de entorno

Copia el archivo de ejemplo y edita con tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus datos (ver sección [Configuración](#configuración)).

## Configuración

### Variables de Entorno Esenciales

Edita el archivo `.env` con las siguientes configuraciones:

```bash
# OpenAI
OPENAI_API_KEY=tu-api-key-de-openai

# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=email@proyecto.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FACTORY_SPREADSHEET_ID=id-de-hoja-fabrica
BAR_SPREADSHEET_ID=id-de-hoja-bar
FEEDBACK_SPREADSHEET_ID=id-de-hoja-feedback

# Puerto del servidor backend
PORT=3000
```

### Variables Opcionales

```bash
# Sistema de actualizaciones (sistema antiguo)
UPDATE_SECRET_KEY=clave-secreta-compartida
UPDATE_PORT=5000
DISABLE_UPDATE_SERVER=false

# Ngrok (túnel para acceso externo)
NGROK_ENABLED=true
NGROK_AUTHTOKEN=tu-token-de-ngrok
NGROK_REGION=us

# Actualizaciones automáticas vía GitHub
ENABLE_GITHUB_UPDATES=true
GITHUB_REPO=usuario/repositorio
GITHUB_BRANCH=main
CHECK_INTERVAL_MINUTES=30

# Notificaciones al desarrollador
DEVELOPER_PHONE=541112345678@c.us
```

Para más detalles sobre configuración, consulta el archivo `.env.example`.

## Inicio de la Aplicación

### Método Recomendado: Modo Red

Ideal para acceder desde múltiples dispositivos en la red local:

```bash
npm run start-network
```

Este comando:
- Detecta automáticamente tu IP local
- Configura el frontend para usar esa IP
- Inicia backend y frontend
- Muestra la URL de acceso para dispositivos en la red

### Otros Métodos de Inicio

#### Inicio con PM2 (Producción)
```bash
npm run start-all      # Iniciar con PM2
npm run status         # Ver estado
npm run stop-all       # Detener
npm run restart-all    # Reiniciar
```

#### Inicio Directo (Windows)
```bash
npm run start-direct   # Abre dos ventanas de consola
```

#### Inicio con PowerShell
```bash
npm run start-ps       # Script PowerShell robusto
```

#### Inicio con Batch Script
```bash
npm run start-windows  # Script batch para Windows
```

#### Actualizar solo la IP (sin reiniciar)
```bash
npm run update-ip      # Actualiza configuración de IP
```

#### Inicio Manual (Desarrollo)

Terminal 1 (Backend):
```bash
npm start
```

Terminal 2 (Frontend):
```bash
cd cerveceria-admin-ui
npm start
```

### URLs de Acceso

Una vez iniciada la aplicación:

- **Backend**: http://localhost:3000
- **Frontend (local)**: http://localhost:3001
- **Frontend (red local)**: http://[TU-IP-LOCAL]:3001

> Para más detalles sobre acceso en red, consulta [README_NETWORK.md](./README_NETWORK.md)

## Uso

### Primera Ejecución

1. **Autenticación de WhatsApp**:
   - Al iniciar por primera vez, se mostrará un código QR en la terminal
   - Escanea el QR con WhatsApp en tu celular (Configuración > Dispositivos vinculados)
   - El bot se conectará automáticamente y guardará la sesión

2. **Acceder al Panel de Administración**:
   - Abre tu navegador en http://localhost:3001
   - Desde dispositivos móviles: http://[IP-LOCAL]:3001

### Gestión de Productos

1. Accede a la sección "Gestión de Productos"
2. Agrega, edita o elimina cervezas del catálogo
3. Los cambios se sincronizan automáticamente con el bot
4. Los productos también se reflejan en Google Sheets

### Visualización de Pedidos

1. Accede a la sección "Pedidos"
2. Visualiza pedidos en tiempo real
3. Filtra por estado, fecha o cliente
4. Los pedidos se almacenan en Google Sheets

### Personalización del Bot

1. Accede a "Gestión de Prompts"
2. Edita los prompts del sistema para personalizar las respuestas
3. Los cambios se aplican inmediatamente
4. Los prompts también se pueden editar en `src/utils/prompts.js`

### Acceso desde Dispositivos Móviles

Para acceder desde celulares o tablets en la misma red WiFi:

1. Ejecuta: `npm run start-network`
2. El sistema mostrará la URL de acceso (ej: http://192.168.0.110:3001)
3. Conecta tu dispositivo a la misma red WiFi
4. Abre la URL en el navegador móvil

Consulta [README_NETWORK.md](./README_NETWORK.md) para solución de problemas.

## Arquitectura

### Estructura del Proyecto

```
Whatsapp-Bot/
├── src/                      # Código fuente del backend
│   ├── bot.js               # Lógica principal del bot
│   ├── index.js             # Servidor Express
│   ├── pre-start.js         # Verificaciones pre-inicio
│   ├── network-start.js     # Inicio en modo red
│   ├── services/            # Servicios modulares
│   │   ├── audioService.js
│   │   ├── classificationService.js
│   │   ├── conversationService.js
│   │   ├── feedbackService.js
│   │   ├── mediaService.js
│   │   ├── notificationService.js
│   │   ├── openaiService.js
│   │   ├── partnerService.js
│   │   ├── phoneService.js
│   │   ├── sheetsService.js
│   │   └── userService.js
│   ├── utils/               # Utilidades
│   │   └── prompts.js       # Prompts del sistema
│   └── routes/              # Rutas adicionales
│       └── update-api.js    # API de actualizaciones
├── routes/                   # Endpoints principales de la API
│   ├── bot.js               # Rutas del bot
│   ├── cervezas.js          # Rutas de productos
│   ├── orders.js            # Rutas de pedidos
│   └── prompts.js           # Rutas de prompts
├── cerveceria-admin-ui/     # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   │   ├── Dashboard.js
│   │   │   ├── OrdersPanel.js
│   │   │   ├── ProductManagement.js
│   │   │   └── PromptsManagement.js
│   │   ├── api.js          # Cliente API
│   │   ├── config.js       # Configuración
│   │   └── App.js          # Componente principal
│   └── public/
├── data/                     # Datos persistentes
│   └── conversations.json   # Historial de conversaciones
├── developer-tools/         # Herramientas de desarrollo
│   └── publish-update.js    # Script de publicación
├── backups/                 # Respaldos automáticos
├── .wwebjs_auth/           # Sesión de WhatsApp (generada)
├── ecosystem.config.cjs     # Configuración PM2
├── package.json            # Dependencias backend
└── README.md               # Este archivo
```

### Componentes Principales

#### Backend (Node.js + Express)
- **whatsapp-web.js**: Conexión con WhatsApp Web
- **OpenAI API**: Procesamiento de lenguaje natural
- **Google Sheets API**: Almacenamiento de datos
- **Express**: Servidor REST API
- **Tesseract.js**: OCR para imágenes
- **pdf-lib**: Procesamiento de PDFs

#### Frontend (React + Material-UI)
- **React 18**: Framework UI
- **Material-UI v5**: Componentes de interfaz
- **Axios**: Cliente HTTP
- **React Hooks**: Gestión de estado

#### Servicios del Backend

| Servicio | Función |
|----------|---------|
| **audioService** | Transcripción de mensajes de voz usando Python |
| **classificationService** | Clasificación de mensajes entrantes |
| **conversationService** | Gestión del historial de conversaciones |
| **feedbackService** | Registro de feedback en Google Sheets |
| **mediaService** | Procesamiento de imágenes y PDFs |
| **notificationService** | Envío de notificaciones por WhatsApp |
| **openaiService** | Integración con OpenAI para respuestas |
| **partnerService** | Información de negocios asociados |
| **phoneService** | Formateo de números telefónicos |
| **sheetsService** | Sincronización con Google Sheets |
| **userService** | Gestión de usuarios y contexto |

### API Endpoints

#### Productos (Cervezas)
- `GET /api/cervezas` - Obtener lista de productos
- `POST /api/cervezas` - Crear producto
- `PUT /api/cervezas/:id` - Actualizar producto
- `DELETE /api/cervezas/:id` - Eliminar producto

#### Pedidos
- `GET /api/orders` - Obtener lista de pedidos
- `GET /api/orders/:id` - Obtener pedido específico
- `POST /api/orders` - Crear pedido
- `PUT /api/orders/:id` - Actualizar pedido

#### Bot
- `GET /api/bot/qr` - Obtener código QR de WhatsApp
- `GET /api/bot/status` - Estado de conexión del bot

#### Prompts
- `GET /api/prompts` - Obtener prompts actuales
- `PUT /api/prompts` - Actualizar prompts

## Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Modo desarrollo con nodemon

# Inicio
npm start                # Iniciar backend
npm run start-network    # Modo red (recomendado)
npm run start-all        # Iniciar con PM2
npm run start-direct     # Inicio directo (Windows)
npm run start-ps         # Inicio con PowerShell
npm run start-windows    # Inicio con batch script

# Gestión PM2
npm run status          # Ver estado de servicios
npm run stop-all        # Detener todos los servicios
npm run restart-all     # Reiniciar todos los servicios

# Actualizaciones
npm run check-updates   # Verificar actualizaciones GitHub
npm run update-ip       # Actualizar configuración IP
npm run github-updater  # Iniciar servicio de auto-actualización

# Servidor de actualizaciones (sistema antiguo)
npm run update-server   # Iniciar servidor de actualizaciones
```

### Configuración de Desarrollo

1. **Modo Desarrollo con Auto-reload**:
   ```bash
   npm run dev
   ```
   Usa nodemon para reiniciar automáticamente al detectar cambios.

2. **Variables de Entorno de Desarrollo**:
   Crea un archivo `.env.development` para configuración específica de desarrollo.

3. **Logs y Debugging**:
   Los logs se muestran en la consola. Para PM2:
   ```bash
   pm2 logs
   ```

### Flujo de Trabajo Recomendado

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza cambios y prueba localmente
3. Commit y push de cambios
4. Crea pull request para revisión
5. Merge a main después de aprobación

### Estructura de Commits

Usa commits descriptivos siguiendo el patrón:
```
tipo: descripción breve

- Detalle 1
- Detalle 2
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Documentación Adicional

### Guías Específicas

- [Acceso en Red Local](./README_NETWORK.md) - Configuración para múltiples dispositivos
- [Actualizaciones Remotas](./README_ACTUALIZACIONES.md) - Sistema de actualización automática
- [Configuración de Túneles](./README_TUNNEL.md) - Setup de Ngrok
- [Servidor Puente](./SERVER_BRIDGE.md) - Alternativa para conexiones permanentes
- [Guía para Desarrolladores](./DEVELOPER_README.md) - Información técnica avanzada
- [Instrucciones de Desarrollo](./INSTRUCCIONES_DESARROLLADOR.md) - Solución de problemas

### Archivos README por Tema

| Archivo | Contenido |
|---------|-----------|
| `README.md` | Este archivo - Guía principal |
| `README_NETWORK.md` | Acceso en red local |
| `README_ACTUALIZACIONES.md` | Sistema de actualizaciones |
| `README_TUNNEL.md` | Configuración de túneles |
| `README_GITHUB.md` | Actualizaciones vía GitHub |
| `README_DESARROLLO.md` | Guía de desarrollo |
| `SERVER_BRIDGE.md` | Servidor puente |
| `DEVELOPER_README.md` | Documentación técnica |

## Solución de Problemas

### El código QR no aparece
1. Verifica que no haya sesión previa en `.wwebjs_auth/`
2. Elimina la carpeta: `rm -rf .wwebjs_auth/`
3. Reinicia la aplicación

### Error de puerto en uso
1. Verifica que los puertos 3000 y 3001 estén libres
2. Cambia los puertos en `.env` si es necesario
3. O detén procesos: `npm run stop-all`

### Error de conexión con Google Sheets
1. Verifica que la Service Account tenga permisos
2. Verifica que las hojas compartan acceso con el email de la Service Account
3. Verifica que los IDs de las hojas sean correctos en `.env`

### Error de OpenAI
1. Verifica que la API Key sea válida
2. Verifica que tengas créditos disponibles
3. Verifica la conectividad a internet

### No puedo acceder desde dispositivos móviles
1. Verifica que estés usando `npm run start-network`
2. Verifica que los dispositivos estén en la misma red WiFi
3. Verifica que el firewall no bloquee el puerto 3001
4. Consulta [README_NETWORK.md](./README_NETWORK.md)

### Conflicto de puertos en servidor de actualizaciones
1. Cambia `DISABLE_UPDATE_SERVER=true` en `.env`
2. O cambia `UPDATE_PORT` a un puerto libre
3. Consulta [README_DESARROLLO.md](./README_DESARROLLO.md)

## Seguridad

- **NO** compartas tu archivo `.env`
- **NO** subas credenciales a repositorios públicos
- Usa `.gitignore` para excluir archivos sensibles
- Rota las API keys periódicamente
- Usa HTTPS en producción

## Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

## Soporte

Para soporte técnico o consultas, contacta al equipo de desarrollo.

---

## Roadmap

### Próximas Características
- [ ] Dashboard con métricas avanzadas
- [ ] Soporte para múltiples idiomas
- [ ] Integración con sistemas de pago
- [ ] App móvil nativa
- [ ] Modo offline con sincronización
- [ ] Analytics y reportes detallados

### Mejoras Técnicas
- [ ] Tests unitarios y de integración
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] Load balancing para alta disponibilidad

---

**Versión**: 1.0.0
**Última actualización**: Diciembre 2025
