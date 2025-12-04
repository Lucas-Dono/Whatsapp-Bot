# Guía de Acceso en Red Local

Documentación completa para acceder al sistema desde dispositivos móviles y otros equipos conectados a la misma red WiFi que el servidor.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Inicio Rápido](#inicio-rápido)
- [Configuración de Red](#configuración-de-red)
- [Acceso desde Dispositivos](#acceso-desde-dispositivos)
- [Actualización de IP](#actualización-de-ip)
- [Solución de Problemas](#solución-de-problemas)
- [Configuración Avanzada](#configuración-avanzada)

## Descripción General

El sistema permite acceso desde cualquier dispositivo en la red local (celulares, tablets, otras computadoras) sin necesidad de configuración manual. La detección y configuración de IP es completamente automática.

### Ventajas del Modo Red

- ✅ Acceso desde múltiples dispositivos simultáneamente
- ✅ Interfaz móvil responsive para celulares y tablets
- ✅ Actualización automática de IP al cambiar de red
- ✅ No requiere configuración manual de direcciones
- ✅ Funciona en cualquier red WiFi local

### Arquitectura de Red

```
┌─────────────────────────────────────────────┐
│           Router WiFi (192.168.X.1)         │
└─────────────┬───────────────────────────────┘
              │
    ┌─────────┴──────────┬──────────┬──────────┐
    │                    │          │          │
┌───┴────┐         ┌─────┴───┐  ┌──┴───┐  ┌───┴────┐
│Servidor│         │Celular 1│  │Tablet│  │Laptop 2│
│Backend │         │         │  │      │  │        │
│.X.110  │         │  .X.120 │  │.X.130│  │ .X.140 │
│:3000   │         └─────────┘  └──────┘  └────────┘
│:3001   │         Acceden a http://.X.110:3001
└────────┘
```

## Inicio Rápido

### Método Recomendado

```bash
npm run start-network
```

Este comando:
1. Detecta automáticamente tu IP local en la red WiFi
2. Actualiza la configuración del frontend con esa IP
3. Inicia backend (puerto 3000) y frontend (puerto 3001)
4. Muestra las URLs de acceso para otros dispositivos

### Salida Esperada

```
🔍 Detectando configuración de red...

📡 Interfaces de red detectadas:
   - WiFi (192.168.1.110) ✓ SELECCIONADA
   - Ethernet (disconnected)
   - VirtualBox (10.0.2.15)

✅ Configuración actualizada:
   - IP del servidor: 192.168.1.110
   - Backend: http://192.168.1.110:3000
   - Frontend: http://192.168.1.110:3001

🚀 Iniciando servicios...

════════════════════════════════════════════════════════
  🌐 ACCESO EN RED LOCAL
════════════════════════════════════════════════════════

  Para acceder desde otros dispositivos:

  1. Conecta tus dispositivos a la misma red WiFi
  2. Abre un navegador e ingresa:

     📱 http://192.168.1.110:3001

  Puertos:
  - Backend (API): :3000
  - Frontend (Panel): :3001

════════════════════════════════════════════════════════
```

## Configuración de Red

### Detección Automática de IP

El sistema detecta automáticamente la mejor interfaz de red:

1. **Prioridad 1**: Interfaz WiFi activa
2. **Prioridad 2**: Interfaz Ethernet activa
3. **Prioridad 3**: Primera interfaz IPv4 no localhost

#### Interfaces Excluidas

El sistema ignora automáticamente:
- Interfaces de loopback (127.x.x.x)
- Interfaces virtuales (VirtualBox, VMware, Docker)
- Interfaces sin conexión
- Direcciones APIPA (169.254.x.x)

### Actualización Automática

La configuración de IP se actualiza automáticamente:

- ✅ Al ejecutar `npm run start-network`
- ✅ Al ejecutar `npm start` (si pre-start está configurado)
- ✅ Al ejecutar `npm run update-ip` manualmente
- ✅ Al reiniciar la aplicación

### Archivos de Configuración

#### `cerveceria-admin-ui/src/config.js`

Este archivo se genera/actualiza automáticamente:

```javascript
const config = {
  BACKEND_URL: 'http://192.168.1.110:3000'
};

export default config;
```

**IMPORTANTE**: No edites este archivo manualmente, se sobrescribe automáticamente.

## Acceso desde Dispositivos

### Desde Celulares y Tablets

#### iOS (iPhone/iPad)

1. Conecta tu dispositivo a la misma red WiFi que el servidor
2. Abre Safari, Chrome o tu navegador preferido
3. Ingresa la URL mostrada al iniciar (ej: `http://192.168.1.110:3001`)
4. Agrega a Inicio para acceso rápido (Safari > Compartir > Agregar a Inicio)

#### Android

1. Conecta tu dispositivo a la misma red WiFi que el servidor
2. Abre Chrome, Firefox o tu navegador preferido
3. Ingresa la URL mostrada al iniciar (ej: `http://192.168.1.110:3001`)
4. Agrega a pantalla de inicio (Menú > Agregar a pantalla de inicio)

### Desde Otras Computadoras

1. Conecta la computadora a la misma red WiFi
2. Abre cualquier navegador moderno
3. Ingresa la URL del frontend
4. Funciona en Windows, macOS y Linux

### Navegadores Compatibles

| Navegador | Versión Mínima | Soporte |
|-----------|----------------|---------|
| Chrome | 90+ | ✅ Completo |
| Firefox | 88+ | ✅ Completo |
| Safari | 14+ | ✅ Completo |
| Edge | 90+ | ✅ Completo |
| Opera | 76+ | ✅ Completo |
| Samsung Internet | 14+ | ✅ Completo |

## Actualización de IP

### Cuándo Actualizar

Actualiza la configuración de IP cuando:

- Cambias de red WiFi
- Tu router asigna una nueva IP DHCP
- Mueves el servidor a otra ubicación
- Experimentas errores de conexión

### Comando de Actualización

```bash
npm run update-ip
```

Este comando:
1. Detecta la IP actual
2. Actualiza `config.js` del frontend
3. No reinicia los servicios (solo actualiza configuración)

### Actualización Completa

Si prefieres reiniciar todo con la nueva configuración:

```bash
npm run stop-all        # Detener servicios actuales
npm run start-network   # Reiniciar con nueva configuración
```

## Solución de Problemas

### No puedo conectarme desde otros dispositivos

#### Verificar conectividad de red

1. **Misma red WiFi**:
   ```bash
   # En el servidor
   ipconfig    # Windows
   ifconfig    # Linux/Mac

   # Verifica que la IP sea del rango de tu red (ej: 192.168.1.x)
   ```

2. **Ping entre dispositivos**:
   ```bash
   # Desde otro dispositivo, hacer ping al servidor
   ping 192.168.1.110
   ```

   Si el ping no funciona, hay un problema de red (firewall, aislamiento AP, etc.)

#### Firewall bloqueando conexiones

**Windows**:
1. Abre "Windows Defender Firewall"
2. Click en "Configuración avanzada"
3. Reglas de entrada > Nueva regla
4. Tipo: Puerto
5. Protocolo: TCP
6. Puertos: 3000, 3001
7. Acción: Permitir conexión
8. Perfil: Privado, Dominio
9. Nombre: "Cervecería Bot - Backend y Frontend"

**Linux** (usando ufw):
```bash
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw reload
```

**macOS**:
1. Preferencias del Sistema > Seguridad y Privacidad
2. Firewall > Opciones de Firewall
3. Agregar Node.js a aplicaciones permitidas

#### Aislamiento de puntos de acceso (AP Isolation)

Algunas redes WiFi públicas o empresariales tienen "AP Isolation" activado, que impide que los dispositivos se comuniquen entre sí.

**Síntomas**:
- Ping no funciona entre dispositivos
- Ambos dispositivos tienen internet
- Misma red WiFi

**Soluciones**:
- Usa una red WiFi doméstica
- Desactiva AP Isolation en el router (si tienes acceso)
- Usa un hotspot personal desde el celular

### Error "Connection Refused" o "Network Error"

#### Backend no está ejecutándose

Verifica el estado:
```bash
npm run status
```

Si no está corriendo:
```bash
npm run start-all
```

#### Puerto incorrecto

Verifica que el frontend use el puerto correcto:
```bash
# Ver configuración actual
cat cerveceria-admin-ui/src/config.js
```

Debe mostrar:
```javascript
BACKEND_URL: 'http://[TU-IP]:3000'
```

Si es incorrecto:
```bash
npm run update-ip
```

#### Backend escuchando en localhost solamente

Verifica que el backend escuche en todas las interfaces:

En `src/index.js`, debe tener:
```javascript
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
```

### La IP cambia constantemente (DHCP)

#### Configurar IP estática en el router

1. Accede a tu router (generalmente http://192.168.1.1)
2. Busca "DHCP Reservation" o "Reserva DHCP"
3. Asigna una IP fija a la MAC address del servidor
4. Reinicia el router

#### Configurar IP estática en el sistema

**Windows**:
1. Panel de Control > Redes e Internet > Conexiones de red
2. Click derecho en tu adaptador > Propiedades
3. Protocolo de Internet versión 4 (TCP/IPv4) > Propiedades
4. Usar la siguiente dirección IP:
   - IP: 192.168.1.110 (o la que prefieras)
   - Máscara: 255.255.255.0
   - Gateway: 192.168.1.1 (IP de tu router)
   - DNS: 8.8.8.8 (Google DNS)

**Linux**:
```bash
# Editar configuración de red (Ubuntu/Debian)
sudo nano /etc/netplan/01-network-manager-all.yaml
```

**macOS**:
1. Preferencias del Sistema > Red
2. Seleccionar WiFi > Avanzado
3. TCP/IP > Configurar IPv4: Manualmente

### Dispositivo móvil no carga la página

#### Verificar URL

Asegúrate de usar HTTP (no HTTPS):
```
✅ http://192.168.1.110:3001
❌ https://192.168.1.110:3001
```

#### Limpiar caché del navegador

- **Chrome (Android/iOS)**: Menú > Configuración > Privacidad > Borrar datos
- **Safari (iOS)**: Ajustes > Safari > Borrar historial y datos

#### Modo incógnito

Prueba en modo incógnito/privado para descartar problemas de caché.

### Frontend carga pero no muestra datos

#### CORS (Cross-Origin Resource Sharing)

Verifica que el backend tenga CORS configurado en `src/index.js`:

```javascript
import cors from 'cors';

app.use(cors({
  origin: '*',  // En producción, especifica orígenes permitidos
  credentials: true
}));
```

#### Verificar conexión al backend

Abre la consola del navegador (F12) y busca errores como:
```
Failed to fetch
ERR_CONNECTION_REFUSED
CORS error
```

## Configuración Avanzada

### Cambiar puertos predeterminados

Edita `.env`:
```bash
PORT=4000              # Puerto del backend (default: 3000)
```

Para el frontend, edita `cerveceria-admin-ui/package.json`:
```json
{
  "scripts": {
    "start": "cross-env PORT=4001 HOST=0.0.0.0 react-scripts start"
  }
}
```

### Usar hostname en lugar de IP

Si tienes un servidor DNS local o archivo hosts configurado:

1. Edita `/etc/hosts` (Linux/Mac) o `C:\Windows\System32\drivers\etc\hosts` (Windows):
   ```
   192.168.1.110  cerveceria.local
   ```

2. Edita manualmente `cerveceria-admin-ui/src/config.js`:
   ```javascript
   BACKEND_URL: 'http://cerveceria.local:3000'
   ```

### Múltiples interfaces de red

Si tienes múltiples interfaces y quieres especificar una:

Edita `src/network-start.js` o `src/update-frontend-config.js` para priorizar tu interfaz preferida.

### Acceso desde internet (no solo red local)

Para acceso desde fuera de tu red local:

1. **Opción 1: Port Forwarding**
   - Configura port forwarding en tu router para puertos 3000 y 3001
   - Usa tu IP pública para acceder desde internet
   - Configura HTTPS para seguridad

2. **Opción 2: Túnel Ngrok**
   - Consulta [README_TUNNEL.md](./README_TUNNEL.md)
   - Ideal para desarrollo y pruebas

3. **Opción 3: VPN**
   - Configura una VPN (WireGuard, OpenVPN, etc.)
   - Accede como si estuvieras en la red local

### Monitoreo de conexiones

Para ver dispositivos conectados:

**Usando PM2**:
```bash
pm2 logs backend    # Ver logs del backend
pm2 monit          # Monitor en tiempo real
```

**Logs de acceso**:
Los logs muestran IPs de clientes conectados en la consola del backend.

## Seguridad en Red Local

### Recomendaciones

- ✅ Usa solo en redes WiFi de confianza (casa, oficina)
- ✅ No expongas a redes públicas sin protección
- ✅ Considera usar contraseñas en el frontend
- ✅ Mantén el firewall activo
- ✅ Actualiza regularmente las dependencias

### Para producción

Si vas a usar esto en producción con acceso real:

1. **Implementa autenticación**
2. **Usa HTTPS con certificados SSL**
3. **Configura rate limiting**
4. **Habilita logs de seguridad**
5. **Usa variables de entorno seguras**

## Scripts de Red

### `src/network-start.js`

Script principal para iniciar en modo red. Detecta IP y configura todo automáticamente.

### `src/update-frontend-config.js`

Actualiza la configuración del frontend con la IP actual. Puede ejecutarse independientemente.

### `src/pre-start.js`

Ejecutado antes de iniciar servicios. Incluye actualización automática de IP.

## Preguntas Frecuentes

### ¿Puedo acceder desde múltiples dispositivos simultáneamente?

Sí, el sistema soporta múltiples conexiones simultáneas sin limitaciones.

### ¿Funciona sin internet?

Sí, solo necesitas red WiFi local. La conexión a internet solo es necesaria para:
- APIs de OpenAI
- Google Sheets
- Actualizaciones automáticas

### ¿Qué pasa si reinicio el router?

Si tu IP cambia, ejecuta `npm run update-ip` o reinicia con `npm run start-network`.

### ¿Puedo usar un cable Ethernet en lugar de WiFi?

Sí, el sistema detecta automáticamente interfaces Ethernet. Funciona exactamente igual.

### ¿Necesito configurar algo en el router?

No para red local. Solo si quieres acceso desde internet (port forwarding).

## Recursos Adicionales

- [README Principal](./README.md)
- [Configuración de Túneles](./README_TUNNEL.md)
- [Sistema de Actualizaciones](./README_ACTUALIZACIONES.md)
- [Guía de Desarrollo](./DEVELOPER_README.md)

---

**Última actualización**: Diciembre 2025
