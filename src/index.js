import express from 'express';
import cors from 'cors';
import { startBot, getQrImage } from './bot.js';
import dotenv from 'dotenv';
import cervezasRoutes from '../routes/cervezas.js';
import ordersRoutes from '../routes/orders.js';
import botRoutes from '../routes/bot.js';
import { exec } from "child_process";
import promptsRoutes from '../routes/prompts.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import net from 'net';
import { startGitHubUpdater, setWhatsAppClient as setGitHubWhatsAppClient } from './github-updater.js';
import githubUpdateRoutes from './routes/update-api.js';
import { preStartResult } from './pre-start.js';

// Cargar las variables de entorno primero
dotenv.config();

// Variable para controlar si se debe iniciar el servidor de actualizaciones
const DISABLE_UPDATE_SERVER = process.env.DISABLE_UPDATE_SERVER === 'true';
const UPDATE_PORT = process.env.UPDATE_PORT || 3333;

// Función para verificar si un puerto está en uso
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => {
        // El puerto está en uso
        resolve(true);
      })
      .once('listening', () => {
        // El puerto está libre
        server.close();
        resolve(false);
      })
      .listen(port);
  });
}

// Iniciar el servidor de actualizaciones como un proceso separado (solo si no está deshabilitado)
async function startUpdateServer() {
  if (DISABLE_UPDATE_SERVER) {
    console.log('Servidor de actualizaciones deshabilitado por configuración.');
    return;
  }

  try {
    // Comprobar si el puerto ya está en uso
    const portInUse = await isPortInUse(UPDATE_PORT);
    
    if (portInUse) {
      console.log(`El puerto ${UPDATE_PORT} ya está en uso. Asumiendo que el servidor de actualizaciones ya está en ejecución.`);
      return;
    }
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const updateServerPath = path.join(__dirname, 'update-server.js');

    console.log('Iniciando servidor de actualizaciones...');
    const updateServer = spawn('node', [updateServerPath], {
      detached: true,
      stdio: 'inherit'
    });

    updateServer.on('error', (error) => {
      console.error('Error al iniciar servidor de actualizaciones:', error);
    });
  } catch (error) {
    console.error('Error al verificar el puerto o iniciar el servidor de actualizaciones:', error);
  }
}

// Iniciar el servidor de actualizaciones
startUpdateServer();

// Continuar con la inicialización normal de la aplicación
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/orders', ordersRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/cervezas', cervezasRoutes);
app.use('/api/prompts', promptsRoutes);
app.use('/api/github', githubUpdateRoutes);

// 🔄 Ruta para reiniciar el backend
app.post("/api/restart", (req, res) => {
  console.log("🔄 Reiniciando el servidor...");

  // Detectar si se ejecuta con nodemon
  const isNodemon = process.env.NODE_ENV === 'development' || process.argv.some(arg => arg.includes('nodemon'));

  res.json({ message: "Backend en proceso de reinicio..." });

  setTimeout(() => {
    if (isNodemon) {
      console.log("♻ Reinicio con nodemon en modo desarrollo...");
      process.exit(0); // Nodemon detectará el cierre y reiniciará el servidor
    } else {
      console.log("🚀 Reinicio con PM2...");
      exec("pm2 restart backend", (err, stdout, stderr) => {
        if (err) {
          console.error("❌ Error al reiniciar el backend:", err);
          return;
        }
        if (stderr) console.error("⚠ Advertencia:", stderr);
        console.log("✅ Backend reiniciado correctamente:\n", stdout);
      });
    }
  }, 1000);
});

// ✅ Rutas para el bot
app.get('/', (req, res) => {
  res.send('¡Hola! Esta es la raíz de la app. Ve a <a href="/qr">/qr</a> para escanear el código.');
});

app.get('/qr', (req, res) => {
  const qrImg = getQrImage();
  if (!qrImg) {
    return res.send('QR no generado aún. Espera un momento...');
  }
  res.send(`
    <html>
      <body>
        <h1>Escanea el QR para iniciar sesión</h1>
        <img src="${qrImg}" />
      </body>
    </html>
  `);
});

// Inicia el bot de WhatsApp
startBot()
  .then(() => {
    console.log('🤖 Bot iniciado correctamente');
    
    // Obtener el cliente de WhatsApp para notificaciones de GitHub
    import('./bot.js').then(botModule => {
      if (botModule.getBotStatus) {
        const status = botModule.getBotStatus();
        if (status.clientState === 'ready') {
          setGitHubWhatsAppClient(status.client);
        }
      }
    }).catch(err => {
      console.error('❌ No se pudo obtener el cliente de WhatsApp para GitHub:', err.message);
    });
    
    // Iniciar sistema de actualizaciones basado en GitHub si está habilitado en .env
    if (process.env.ENABLE_GITHUB_UPDATES === 'true') {
      console.log('🔄 Iniciando sistema de actualizaciones basado en GitHub...');
      startGitHubUpdater();
    }
    
    // Verificar si necesitamos reiniciar después de actualizaciones críticas
    preStartResult.then(result => {
      if (result && result.updatesApplied && global.requiresRestart) {
        console.log('\n🔄 Se detectaron actualizaciones críticas aplicadas durante el inicio.');
        console.log('👉 El sistema se reiniciará automáticamente en 10 segundos para aplicar todos los cambios.');
        console.log('👉 No se preocupe, esto es normal cuando hay actualizaciones importantes.');
        
        // Programar reinicio automático después de 10 segundos
        setTimeout(() => {
          console.log('\n🔄 Reiniciando el sistema para aplicar actualizaciones...');
          
          // Determinar el script de reinicio según el entorno
          let restartCommand;
          
          if (process.platform === 'win32') {
            // En Windows, usar start-windows.bat
            restartCommand = spawn('cmd', ['/c', 'npm', 'run', 'start-windows'], {
              detached: true,
              stdio: 'ignore'
            });
          } else {
            // En Linux/Mac, usar start-all
            restartCommand = spawn('npm', ['run', 'start-all'], {
              detached: true,
              stdio: 'ignore'
            });
          }
          
          // Desconectar el proceso hijo para que siga ejecutándose después de salir
          restartCommand.unref();
          
          // Terminar el proceso actual después de un segundo
          setTimeout(() => {
            process.exit(0);
          }, 1000);
        }, 10000);
      }
    }).catch(err => {
      console.error('Error al verificar estado de actualizaciones:', err);
    });
  })
  .catch(err => console.error('❌ Error al iniciar el bot:', err));

// Inicia el servidor
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces de red

app.listen(PORT, HOST, async () => {
  // Obtener la IP local para mostrarla en el log
  const os = await import('os');
  const interfaces = os.networkInterfaces();
  
  // Usar la IP proporcionada desde variable de entorno si está disponible
  let localIP = process.env.SERVER_IP || '';

  // Si no se proporcionó una IP específica, detectarla automáticamente
  if (!localIP) {
    // Buscar la interfaz WiFi primero (más probable que sea la que se usa para la red local)
    for (const name of Object.keys(interfaces)) {
      if (name.toLowerCase().includes('wi-fi')) {
        for (const iface of interfaces[name]) {
          if (iface.family === 'IPv4' && !iface.internal) {
            localIP = iface.address;
          }
        }
      }
    }

    // Si no encontramos WiFi, buscar cualquier interfaz no interna
    if (!localIP) {
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
          if (iface.family === 'IPv4' && !iface.internal) {
            localIP = iface.address;
            break;
          }
        }
        if (localIP) break;
      }
    }
  }

  console.log(`============================================`);
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`🌐 Accesible en la red: http://${localIP}:${PORT}`);
  console.log(`============================================`);
});
