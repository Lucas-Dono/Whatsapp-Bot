/**
 * Script de inicio para entorno de red
 * 
 * Este script detecta automáticamente la IP de la máquina en la red local
 * y configura la aplicación para que sea accesible desde otros dispositivos
 */

import { networkInterfaces } from 'os';
import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import updateFrontendConfig from './update-frontend-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Función para ejecutar comandos con promesas
function execPromise(command, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Ejecutando: ${command}`);
    
    exec(command, options, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      
      if (error) {
        reject(error);
        return;
      }
      
      resolve({ stdout, stderr });
    });
  });
}

// Función para detener procesos que utilizan puertos específicos
async function killProcessOnPorts(ports) {
  console.log(`Deteniendo procesos en puertos: ${ports.join(', ')}`);
  
  try {
    if (process.platform === 'win32') {
      // En Windows, usar netstat para encontrar los procesos que usan estos puertos
      for (const port of ports) {
        try {
          // Encontrar PIDs usando los puertos específicos
          const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
          
          if (stdout) {
            // Extraer PIDs
            const lines = stdout.split('\n');
            for (const line of lines) {
              if (line.includes(`LISTENING`)) {
                const pid = line.trim().split(/\s+/).pop();
                if (pid && !isNaN(parseInt(pid))) {
                  console.log(`Deteniendo proceso ${pid} en puerto ${port}`);
                  await execPromise(`taskkill /F /PID ${pid}`);
                }
              }
            }
          }
        } catch (err) {
          // Ignorar errores si no se encuentra el proceso
          console.log(`No se encontraron procesos usando el puerto ${port}`);
        }
      }
    } else {
      // En Linux/Mac, usar lsof
      for (const port of ports) {
        try {
          const { stdout } = await execPromise(`lsof -i :${port} -t`);
          if (stdout) {
            const pids = stdout.trim().split('\n');
            for (const pid of pids) {
              if (pid) {
                console.log(`Deteniendo proceso ${pid} en puerto ${port}`);
                await execPromise(`kill -9 ${pid}`);
              }
            }
          }
        } catch (err) {
          // Ignorar errores si no se encuentra el proceso
          console.log(`No se encontraron procesos usando el puerto ${port}`);
        }
      }
    }
  } catch (error) {
    console.error('Error al intentar detener procesos:', error);
  }
}

// Función para detectar la IP en la red local
function getLocalIpAddress() {
  const nets = networkInterfaces();
  const results = [];

  // Recorrer todas las interfaces de red
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Saltamos las interfaces que no son IPv4 o están en estado "down"
      if (net.family === 'IPv4' && !net.internal) {
        results.push({
          name,
          address: net.address
        });
      }
    }
  }

  return results;
}

// Función para seleccionar la mejor interfaz de red
function selectBestInterface(interfaces) {
  // Si no hay interfaces, retornar localhost
  if (interfaces.length === 0) {
    return 'localhost';
  }
  
  // Priorizar interfaces con nombre que contenga "Wi-Fi" o "Wireless"
  const wifiInterfaces = interfaces.filter(
    iface => iface.name.toLowerCase().includes('wi-fi') || 
             iface.name.toLowerCase().includes('wireless') ||
             iface.name.toLowerCase().includes('wlan')
  );
  
  if (wifiInterfaces.length > 0) {
    // Si hay interfaces Wi-Fi, usar la primera
    return wifiInterfaces[0].address;
  }
  
  // Si no hay interfaces Wi-Fi, buscar interfaces con IP que empiecen con 192.168.0 o 192.168.1
  // que son comunes en redes domésticas
  const homeNetworkInterfaces = interfaces.filter(
    iface => iface.address.startsWith('192.168.0.') || iface.address.startsWith('192.168.1.')
  );
  
  if (homeNetworkInterfaces.length > 0) {
    return homeNetworkInterfaces[0].address;
  }
  
  // Si todo lo demás falla, usar la primera interfaz disponible
  return interfaces[0].address;
}

// Función principal
async function startNetwork() {
  try {
    // Detener cualquier proceso que esté usando los puertos que necesitamos
    await killProcessOnPorts([3000, 3001, 5000]);
    
    // Esperar un poco para asegurar que los puertos se liberen
    console.log('Esperando 2 segundos para que los puertos se liberen...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Obtener posibles direcciones IP
    const interfaces = getLocalIpAddress();

    // Mostrar información sobre interfaces de red
    console.log('\n===== DETECTANDO INTERFACES DE RED =====\n');

    if (interfaces.length === 0) {
      console.log('⚠️ No se detectaron interfaces de red. Usando localhost.');
      console.log('❗ La aplicación solo será accesible desde esta máquina.\n');
    } else {
      console.log('✅ Interfaces de red detectadas:');
      interfaces.forEach((net, idx) => {
        console.log(`   ${idx + 1}. ${net.name}: ${net.address}`);
      });
      console.log('\n');
    }

    // Seleccionar la mejor interfaz de red
    const selectedIP = selectBestInterface(interfaces);
    console.log(`✅ IP seleccionada para conexiones: ${selectedIP}`);
    
    if (selectedIP === 'localhost') {
      console.log('⚠️ ADVERTENCIA: Usando localhost. La aplicación solo será accesible desde esta máquina.');
    }

    // Actualizar la configuración del frontend con la IP seleccionada
    console.log('\n===== ACTUALIZANDO CONFIGURACIÓN DEL FRONTEND =====\n');
    await updateFrontendConfig();
    console.log('\n===== CONFIGURACIÓN ACTUALIZADA =====\n');

    // Banner informativo
    console.log('===== INICIANDO APLICACIÓN EN MODO RED =====\n');
    console.log(`🌐 URL del Backend: http://${selectedIP}:3000`);
    console.log(`🌐 URL del Frontend: http://${selectedIP}:3001`);
    console.log('\n⚠️ IMPORTANTE: Para acceder desde otros dispositivos:');
    console.log(`1. Conéctalos a la misma red WiFi que esta computadora`);
    console.log(`2. Abre la URL http://${selectedIP}:3001 en el navegador del dispositivo`);
    console.log('\n=========================================\n');

    // Iniciar backend con la IP correcta
    console.log('Iniciando Backend (WhatsApp Bot)...');
    const backend = spawn('node', ['src/index.js'], {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        // Usar un puerto diferente para el servidor de actualizaciones
        UPDATE_PORT: '5500',
        // Configurar el servidor para que escuche en la IP seleccionada
        HOST: '0.0.0.0',
        SERVER_IP: selectedIP
      }
    });

    backend.on('error', (err) => {
      console.error('Error al iniciar el backend:', err);
    });

    // Iniciar frontend con la variable de entorno configurada
    console.log('\nIniciando Frontend (Panel de Administración)...');
    const frontend = spawn(
      process.platform === 'win32' ? 'npm.cmd' : 'npm', 
      ['start'], 
      {
        cwd: path.join(rootDir, 'cerveceria-admin-ui'),
        stdio: 'inherit',
        shell: true,
        env: {
          ...process.env,
          PORT: '3001',
          // Configurar la URL del backend correctamente
          REACT_APP_BACKEND_URL: `http://${selectedIP}:3000`,
          HOST: '0.0.0.0'
        }
      }
    );

    frontend.on('error', (err) => {
      console.error('Error al iniciar el frontend:', err);
    });

    process.on('SIGINT', () => {
      console.log('\nDeteniendo servicios...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
startNetwork(); 