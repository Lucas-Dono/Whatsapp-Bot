/**
 * Script para actualizar automáticamente la configuración del frontend
 * con la IP correcta de la máquina en la red WiFi
 */

import { networkInterfaces } from 'os';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Función para detectar la mejor interfaz de red (priorizando WiFi)
function getBestNetworkIP() {
  const interfaces = networkInterfaces();
  const results = [];

  // Recopilar todas las interfaces de red IPv4 no internas
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        results.push({
          name,
          address: iface.address
        });
      }
    }
  }

  // Si no hay interfaces, retornar localhost
  if (results.length === 0) {
    return 'localhost';
  }
  
  // Priorizar interfaces con nombre que contenga "Wi-Fi" o "Wireless"
  const wifiInterfaces = results.filter(
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
  const homeNetworkInterfaces = results.filter(
    iface => iface.address.startsWith('192.168.0.') || iface.address.startsWith('192.168.1.')
  );
  
  if (homeNetworkInterfaces.length > 0) {
    return homeNetworkInterfaces[0].address;
  }
  
  // Si todo lo demás falla, usar la primera interfaz disponible
  return results[0].address;
}

/**
 * Actualiza el archivo de configuración del frontend con la IP detectada
 */
export async function updateFrontendConfig() {
  try {
    // Detectar la mejor IP disponible
    const ip = getBestNetworkIP();
    
    console.log(`ℹ️ Actualizando configuración del frontend con IP: ${ip}`);
    
    // Ruta al archivo de configuración
    const configPath = path.join(rootDir, 'cerveceria-admin-ui', 'src', 'config.js');
    
    // Contenido del nuevo archivo de configuración
    const configContent = `/**
 * Configuración global del frontend
 * Este archivo se actualiza automáticamente con la IP correcta
 * NO EDITAR MANUALMENTE - Se sobrescribirá en el próximo inicio
 */

// URL del backend (actualizada automáticamente: ${new Date().toISOString()})
export const BACKEND_URL = 'http://${ip}:3000';
`;
    
    // Escribir el archivo
    await fs.writeFile(configPath, configContent, 'utf8');
    console.log(`✅ Archivo de configuración actualizado correctamente`);
    
    return ip;
  } catch (error) {
    console.error('❌ Error al actualizar la configuración del frontend:', error);
    throw error;
  }
}

// Si se ejecuta como script independiente
if (import.meta.url === `file://${process.argv[1]}`) {
  updateFrontendConfig()
    .then(ip => {
      console.log(`✅ Archivo de configuración actualizado correctamente con IP: ${ip}`);
      process.exit(0);
    })
    .catch(error => {
      console.error(`❌ Error al actualizar archivo de configuración: ${error.message}`);
      process.exit(1);
    });
} 