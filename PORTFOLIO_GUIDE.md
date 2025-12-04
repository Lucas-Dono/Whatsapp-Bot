# Guía de Uso como Portafolio

Esta guía explica cómo el proyecto está configurado para ser usado como muestra en portafolio sin exponer la lógica de negocio propietaria.

## Estrategia de Protección

### Archivos Protegidos (No en GitHub)

El `.gitignore` ha sido configurado para **excluir** los siguientes tipos de archivos:

#### 1. Lógica de Negocio Principal
```
✗ src/bot.js                           (Lógica principal del bot)
✗ src/services/*.js                    (Todos los servicios)
✗ src/utils/prompts.js                 (Prompts personalizados)
✗ routes/*.js                          (Endpoints de API)
✗ src/apiroutes.js                     (Rutas de API)
```

#### 2. Frontend con Lógica Específica
```
✗ cerveceria-admin-ui/src/App.js
✗ cerveceria-admin-ui/src/api.js
✗ cerveceria-admin-ui/src/components/*.js
✗ cerveceria-admin-ui/src/hooks/*.js
```

#### 3. Datos y Configuración Sensible
```
✗ .env                                 (Credenciales)
✗ data/                                (Conversaciones)
✗ cervezas.json                        (Catálogo de productos)
✗ src/data/partner_info.json           (Info de socios)
```

#### 4. Sesiones y Cache
```
✗ .wwebjs_auth/                        (Sesión de WhatsApp)
✗ backups/                             (Respaldos)
✗ updates/                             (Archivos de actualización)
```

### Archivos Públicos (Incluidos en GitHub)

Estos archivos **SÍ están** en el repositorio público:

#### 1. Documentación
```
✓ README.md                            (Documentación principal)
✓ README_NETWORK.md                    (Guía de red)
✓ DOCUMENTACION_MEJORADA.md            (Resumen de mejoras)
✓ PORTFOLIO_GUIDE.md                   (Este archivo)
✓ Todos los *.md
```

#### 2. Configuración de Proyecto
```
✓ package.json                         (Dependencias y scripts)
✓ ecosystem.config.cjs                 (Configuración PM2)
✓ .gitignore                           (Reglas de exclusión)
✓ .env.example                         (Plantilla de configuración)
```

#### 3. Scripts de Infraestructura
```
✓ src/index.js                         (Servidor Express básico)
✓ src/pre-start.js                     (Pre-inicio)
✓ src/network-start.js                 (Inicio en red)
✓ src/update-frontend-config.js        (Actualización de IP)
```

#### 4. Estructura Frontend Básica
```
✓ cerveceria-admin-ui/package.json
✓ cerveceria-admin-ui/public/index.html
✓ cerveceria-admin-ui/src/index.js
```

## Verificación de Protección

### Verificar qué se subirá a GitHub

Antes de hacer push, verifica qué archivos se incluirían:

```bash
# Ver archivos que Git trackeará
git status

# Ver todos los archivos ignorados
git status --ignored

# Verificar si un archivo específico está ignorado
git check-ignore -v src/bot.js
```

### Limpiar Archivos Ya Trackeados

Si ya tienes archivos sensibles en tu repositorio Git:

```bash
# Remover archivos del tracking (mantiene archivos locales)
git rm --cached src/bot.js
git rm --cached src/services/*.js
git rm --cached routes/*.js
git rm --cached .env

# Remover directorios completos
git rm -r --cached data/
git rm -r --cached .wwebjs_auth/

# Commit los cambios
git commit -m "Remover archivos sensibles del repositorio"
```

### Limpiar Historial de Git (Avanzado)

Si archivos sensibles ya fueron pusheados en commits anteriores:

```bash
# ADVERTENCIA: Esto reescribe el historial de Git
# Hacer backup antes de ejecutar

# Usar git filter-branch (opción 1)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch src/bot.js' \
  --prune-empty --tag-name-filter cat -- --all

# Usar BFG Repo-Cleaner (opción 2 - más rápido)
# Descargar de: https://rtyley.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-files bot.js
java -jar bfg.jar --delete-folders data

# Forzar push (CUIDADO: sobrescribe historial remoto)
git push origin --force --all
```

## Creación de Archivos de Ejemplo

Para mostrar la estructura sin exponer lógica:

### 1. Crear archivo bot.example.js

```bash
# Crear directorio para ejemplos si no existe
mkdir -p examples
```

Ejemplo de contenido para `src/bot.example.js`:

```javascript
/**
 * ARCHIVO DE EJEMPLO - bot.js
 *
 * Este archivo muestra la estructura del bot de WhatsApp
 * sin incluir la lógica de negocio propietaria.
 *
 * El archivo real (bot.js) incluye:
 * - Inicialización de whatsapp-web.js
 * - Manejo de mensajes entrantes
 * - Procesamiento con OpenAI
 * - Clasificación de consultas
 * - Gestión de pedidos
 * - Integración con Google Sheets
 */

import { Client } from 'whatsapp-web.js';

// Configuración del cliente WhatsApp
export function initializeWhatsAppClient() {
  const client = new Client({
    // Configuración de autenticación y puppeteer
    // ... (implementación propietaria)
  });

  return client;
}

// Manejo de mensajes
export function setupMessageHandlers(client) {
  client.on('message', async (message) => {
    // Lógica de procesamiento de mensajes
    // ... (implementación propietaria)
  });
}

// Iniciar bot
export async function startBot() {
  // Lógica de inicio del bot
  // ... (implementación propietaria)
}

// QR Code para autenticación
export function getQrImage() {
  // Retorna QR code
  // ... (implementación propietaria)
}
```

### 2. Crear prompts.example.js

```javascript
/**
 * ARCHIVO DE EJEMPLO - prompts.js
 *
 * Estructura de prompts del sistema.
 * Los prompts reales contienen lógica de negocio específica.
 */

export const prompts = {
  systemPrompt: "Prompt del sistema para OpenAI...",
  greetingPrompt: "Prompt de saludo...",
  orderPrompt: "Prompt para procesar pedidos...",
  productInfoPrompt: "Prompt para información de productos...",
  // ... más prompts
};

export function getPrompt(type) {
  return prompts[type] || prompts.systemPrompt;
}
```

### 3. Crear README en src/services/

```markdown
# Servicios del Bot

Este directorio contiene servicios modulares (no incluidos en repositorio público):

## audioService.js
- Transcripción de mensajes de voz
- Integración con Python
- Procesamiento de audio

## classificationService.js
- Clasificación de mensajes
- Detección de intención
- Ruteo de consultas

## conversationService.js
- Gestión de historial
- Contexto de conversación
- Persistencia en JSON

[... documentar cada servicio sin mostrar código]
```

## Estrategias para Portafolio

### 1. Documentación Exhaustiva

En lugar de mostrar código, documenta:
- **Funcionalidades**: Qué hace el sistema
- **Tecnologías**: Stack tecnológico usado
- **Arquitectura**: Diagramas y estructura
- **Resultados**: Métricas, capturas de pantalla
- **Desafíos**: Problemas resueltos

### 2. Demos y Capturas

Incluye en el repositorio público:
- Screenshots del panel de administración
- Capturas de conversaciones (datos ficticios)
- Videos demo (opcional)
- Diagramas de arquitectura

```bash
# Crear directorio de assets
mkdir -p docs/assets
mkdir -p docs/screenshots
mkdir -p docs/diagrams
```

### 3. Versión Demo Funcional

Crea una versión demo con:
- Datos de ejemplo (no reales)
- Funcionalidad limitada pero demostrable
- Sin integración con servicios reales

### 4. Caso de Estudio

Escribe un caso de estudio detallado:

```markdown
# Caso de Estudio: Bot de WhatsApp para Cervecería

## Problema
Cervecería recibía 100+ consultas diarias por WhatsApp...

## Solución
Desarrollé un bot automatizado con:
- Atención 24/7
- Procesamiento de pedidos
- Integración con inventario
- Panel de administración web

## Tecnologías
- Node.js + Express
- whatsapp-web.js
- OpenAI GPT-4
- Google Sheets API
- React + Material-UI

## Resultados
- 80% de consultas automatizadas
- Tiempo de respuesta < 5 segundos
- Reducción de 70% en carga de trabajo manual
- 95% satisfacción del cliente

## Arquitectura
[Incluir diagramas]

## Desafíos Técnicos
1. Manejo de sesiones de WhatsApp
2. Clasificación de intención con IA
3. Sincronización con Google Sheets
...
```

## Licencia y Uso

### Agregar Licencia

Crea un archivo `LICENSE`:

```markdown
# Licencia Propietaria

Copyright (c) 2025 [Tu Nombre]

Este software es propietario y confidencial.

La documentación y estructura del proyecto pueden ser visualizadas
con fines de portafolio, pero el código fuente no puede ser copiado,
modificado o distribuido sin autorización expresa del autor.

Para consultas sobre uso comercial, contactar: [tu-email]
```

### Agregar Aviso en README

```markdown
## Licencia y Uso

Este proyecto se comparte como muestra de portafolio.

**IMPORTANTE**:
- ✅ Puedes ver la documentación y estructura
- ✅ Puedes usar como referencia para aprender
- ❌ NO puedes copiar el código
- ❌ NO puedes usar comercialmente sin permiso
- ❌ NO puedes redistribuir

La lógica de negocio propietaria no está incluida en este repositorio.

Para consultas comerciales: [tu-email]
```

## Checklist de Protección

Antes de hacer tu repositorio público:

### Verificación de Archivos

- [ ] Revisar que .gitignore incluye todos los archivos sensibles
- [ ] Ejecutar `git status --ignored` para verificar
- [ ] Confirmar que .env no está trackeado
- [ ] Verificar que src/bot.js no está trackeado
- [ ] Verificar que /data no está trackeado

### Limpieza de Historial

- [ ] Revisar commits previos con `git log`
- [ ] Buscar archivos sensibles en historial con `git log -- src/bot.js`
- [ ] Limpiar historial si es necesario
- [ ] Hacer backup antes de reescribir historial

### Documentación

- [ ] README completo con funcionalidades
- [ ] Screenshots y demos incluidos
- [ ] Caso de estudio escrito
- [ ] Licencia agregada
- [ ] Aviso de protección incluido

### Archivos de Ejemplo

- [ ] Crear *.example.js para archivos críticos
- [ ] Documentar estructura de servicios
- [ ] Incluir diagramas de arquitectura

### Configuración de GitHub

- [ ] Configurar repositorio como público
- [ ] Desactivar Issues si no quieres feedback público
- [ ] Desactivar Wiki si no lo usarás
- [ ] Considerar desactivar Discussions
- [ ] Agregar topics/tags relevantes
- [ ] Crear description clara

## Mantenimiento

### Actualizar Documentación

Cuando agregues funcionalidades:
1. Actualiza README con nuevas features
2. NO subas código propietario
3. Documenta resultados/métricas
4. Actualiza screenshots si cambia UI

### Revisar Periódicamente

```bash
# Cada tanto, revisa qué archivos están trackeados
git ls-files

# Busca archivos sensibles
git ls-files | grep -E "\.env|bot\.js|prompts\.js"

# Si encuentras algo sensible
git rm --cached archivo-sensible
git commit -m "Remover archivo sensible"
```

## Alternativas de Protección

### 1. Repositorio Privado con Acceso Selectivo

```bash
# Crear repo privado en GitHub
# Dar acceso solo a reclutadores específicos
# Incluir código completo pero no hacerlo público
```

### 2. Dos Repositorios

- **Repositorio Privado**: Código completo para desarrollo
- **Repositorio Público**: Solo documentación y estructura

```bash
# Configurar dos remotes
git remote add private git@github.com:user/bot-private.git
git remote add public git@github.com:user/bot-portfolio.git

# Push selectivo
git push private main      # Código completo
git push public main       # Solo archivos permitidos
```

### 3. Git Submodules para Lógica Privada

```bash
# Separar lógica propietaria en submodule privado
git submodule add git@github.com:user/bot-private-logic.git src/private
# src/private está en .gitignore del repo público
```

## Recursos Adicionales

### Herramientas de Verificación

```bash
# Buscar secretos en repo
npm install -g git-secrets
git secrets --scan

# Analizar historial
git filter-repo --analyze
```

### Servicios de Escaneo

- GitHub Secret Scanning (automático en repos públicos)
- GitGuardian (CI/CD integration)
- TruffleHog (escaneo local)

## Contacto para Reclutadores

Incluye en tu README:

```markdown
## Para Reclutadores

Este repositorio muestra la **estructura y documentación** de un proyecto real.

La lógica de negocio propietaria ha sido excluida intencionalmente.

Si deseas ver:
- Código fuente completo
- Demo en vivo
- Métricas detalladas
- Discutir implementación técnica

Por favor contacta:
- Email: [tu-email]
- LinkedIn: [tu-linkedin]
- Portfolio: [tu-portfolio]

Puedo proporcionar acceso privado o realizar una demo en vivo.
```

---

**Versión**: 1.0
**Actualizado**: Diciembre 2025
