import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import readline from 'readline';
import chalk from 'chalk';
import net from 'net';

// Obtener el directorio actual (equivalente a __dirname en CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear interfaz para leer desde la consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Determinar el directorio base
const baseDir = process.cwd();
const frontendDir = path.join(baseDir, 'cerveceria-admin-ui');

// Configuración de puertos
const BACKEND_PORT = 3000;
const FRONTEND_PORT = 3001;

// Colores para los logs
const colors = {
  backend: chalk.blue,
  frontend: chalk.green,
  system: chalk.yellow,
  error: chalk.red,
  success: chalk.cyan,
  warning: chalk.hex('#FFA500')
};

// Verificar si un puerto está en uso
async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Puerto en uso
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false); // Puerto disponible
    });
    
    server.listen(port);
  });
}

// Mostrar instrucciones para liberar puertos en Windows
function showPortInstructions(port) {
  console.log(colors.warning(`\n⚠️ El puerto ${port} está siendo utilizado por otro proceso.`));
  console.log(colors.warning(`Para liberar el puerto, ejecuta estos comandos en una terminal con permisos de administrador:`));
  console.log(colors.warning(`\n1. Encuentra el PID del proceso que usa el puerto ${port}:`));
  console.log(colors.system(`   netstat -ano | findstr :${port}`));
  console.log(colors.warning(`\n2. Finaliza el proceso usando el PID (reemplaza PID_ENCONTRADO):`));
  console.log(colors.system(`   taskkill /F /PID PID_ENCONTRADO`));
  console.log(colors.warning(`\nLuego vuelve a ejecutar este script.\n`));
}

// Obtener la IP local para mostrarla al usuario
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  // Primero buscar interfaces WiFi o Ethernet con IPs en la red 192.168.0.x
  for (const name of Object.keys(interfaces)) {
    // Priorizar interfaces Wi-Fi
    if (name.toLowerCase().includes('wi-fi')) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.168.0.')) {
          console.log(colors.success(`Usando interfaz de red: ${name} (${iface.address})`));
          return iface.address;
        }
      }
    }
  }
  
  // Buscar cualquier interfaz en la red 192.168.0.x
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address.startsWith('192.168.0.')) {
        console.log(colors.success(`Usando interfaz de red: ${name} (${iface.address})`));
        return iface.address;
      }
    }
  }
  
  // Si no encontramos ninguna en 192.168.0.x, usar cualquier interfaz no interna
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(colors.warning(`No se encontró interfaz en la red 192.168.0.x. Usando: ${name} (${iface.address})`));
        return iface.address;
      }
    }
  }
  
  // Fallback a localhost
  console.log(colors.error(`No se pudo determinar la IP local. Usando localhost.`));
  return 'localhost';
}

// Iniciar el backend
function startBackend() {
  console.log(colors.system('🚀 Iniciando el servidor backend...'));
  console.log(colors.system('📝 Verificando archivos de rutas...'));
  
  const routesDir = path.join(baseDir, 'routes');
  if (fs.existsSync(routesDir)) {
    const routesFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));
    console.log(colors.system(`📁 Archivos de rutas encontrados: ${routesFiles.join(', ')}`));
  } else {
    console.log(colors.error('❌ Directorio de rutas no encontrado'));
  }
  
  const backend = spawn('node', ['src/index.js'], {
    cwd: baseDir,
    stdio: 'pipe',
    shell: true
  });

  backend.stdout.on('data', (data) => {
    console.log(colors.backend(`[Backend] ${data.toString().trim()}`));
  });

  backend.stderr.on('data', (data) => {
    console.error(colors.error(`[Backend Error] ${data.toString().trim()}`));
  });

  backend.on('close', (code) => {
    if (code !== 0) {
      console.error(colors.error(`[Backend] El proceso terminó con código ${code}`));
    }
  });

  return backend;
}

// Iniciar el frontend
function startFrontend() {
  console.log(colors.system('🚀 Iniciando la aplicación frontend...'));
  
  // Verificar que el directorio del frontend existe
  if (!fs.existsSync(frontendDir)) {
    console.error(colors.error('⚠️ No se encontró el directorio del frontend. Asegúrate de estar en el directorio correcto.'));
    return null;
  }
  
  // Obtener la IP real de la máquina (no localhost)
  const localIP = getLocalIP();
  console.log(colors.success(`🌐 Usando IP real del servidor: ${localIP}`));
  
  // Variables de entorno para el frontend
  const envVars = {
    ...process.env,
    PORT: FRONTEND_PORT.toString(),
    HOST: '0.0.0.0', // Escuchar en todas las interfaces
    // IMPORTANTE: Usar la IP real, nunca localhost
    REACT_APP_BACKEND_URL: `http://${localIP}:${BACKEND_PORT}`
  };
  
  console.log(colors.system(`ℹ️ Backend configurado en: ${envVars.REACT_APP_BACKEND_URL}`));
  
  // Iniciar el frontend con las variables de entorno
  const frontend = spawn('npm', ['start'], {
    cwd: frontendDir,
    stdio: 'pipe',
    shell: true,
    env: envVars
  });

  frontend.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(colors.frontend(`[Frontend] ${output}`));
    
    // Detectar cuando el frontend está listo
    if (output.includes('Compiled successfully') || output.includes('Local:') || output.includes('On Your Network:')) {
      console.log(colors.success('\n🌐 Aplicación disponible en:'));
      console.log(colors.success(` - Local: http://localhost:${FRONTEND_PORT}`));
      console.log(colors.success(` - Red local: http://${localIP}:${FRONTEND_PORT}`));
      console.log(colors.success('\n💻 Abre cualquiera de estas URLs en tu navegador o dispositivo móvil\n'));
    }
  });

  frontend.stderr.on('data', (data) => {
    console.error(colors.error(`[Frontend Error] ${data.toString().trim()}`));
  });

  frontend.on('close', (code) => {
    if (code !== 0) {
      console.error(colors.error(`[Frontend] El proceso terminó con código ${code}`));
    }
  });

  return frontend;
}

// Variable para mantener las referencias a los procesos
let processes = {
  backend: null,
  frontend: null
};

// Iniciar todos los servicios
async function startAll() {
  try {
    // Verificar si los puertos están disponibles
    const backendPortInUse = await isPortInUse(BACKEND_PORT);
    const frontendPortInUse = await isPortInUse(FRONTEND_PORT);
    
    if (backendPortInUse) {
      showPortInstructions(BACKEND_PORT);
      return;
    }
    
    if (frontendPortInUse) {
      showPortInstructions(FRONTEND_PORT);
      return;
    }
    
    // Primero el backend
    processes.backend = startBackend();
    
    // Esperar un momento antes de iniciar el frontend
    setTimeout(() => {
      processes.frontend = startFrontend();
    }, 3000);

    // Manejar la terminación del programa
    process.on('SIGINT', () => {
      console.log(colors.system('\n👋 Terminando todos los procesos...'));
      
      if (processes.frontend) {
        processes.frontend.kill();
      }
      
      if (processes.backend) {
        processes.backend.kill();
      }
      
      rl.close();
      process.exit(0);
    });
  } catch (error) {
    console.error(colors.error('❌ Error al iniciar los servicios:'), error);
  }
}

// Verificar dependencias y ejecutar
async function checkAndStart() {
  try {
    // Mostrar banner inicial
    console.log(`
============================================================
🍺  CERVECERÍA 6600 - SISTEMA DE ADMINISTRACIÓN  🍺
============================================================
`);
    
    await startAll();
  } catch (error) {
    console.error(colors.error('❌ Error al iniciar la aplicación:'), error);
  }
}

// Iniciar la aplicación
checkAndStart(); 