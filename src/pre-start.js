/**
 * Script de pre-inicio que se ejecuta antes de cualquier comando
 * 
 * Este script:
 * 1. Actualiza la configuración de IP para el frontend
 * 2. Verifica e instala actualizaciones automáticamente desde GitHub
 */

import { updateFrontendConfig } from './update-frontend-config.js';
import { checkForUpdates, applyUpdates } from './github-updater.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const ENABLE_GITHUB_UPDATES = process.env.ENABLE_GITHUB_UPDATES === 'true';

/**
 * Actualiza la configuración IP
 */
async function actualizarIP() {
  try {
    console.log('🔄 Pre-inicio: Actualizando configuración IP...');
    await updateFrontendConfig();
    console.log('🚀 Continuando con el inicio de la aplicación...');
  } catch (error) {
    console.error('❌ Error al actualizar configuración IP:', error.message);
    console.log('⚠️ Continuando con el inicio a pesar del error...');
  }
}

/**
 * Verifica e instala actualizaciones automáticamente
 */
async function verificarActualizaciones() {
  // Si las actualizaciones de GitHub no están habilitadas, salir
  if (!ENABLE_GITHUB_UPDATES || !GITHUB_REPO) {
    console.log('ℹ️ Actualizaciones automáticas de GitHub deshabilitadas.');
    return false;
  }
  
  try {
    console.log('\n🔍 Verificando actualizaciones del sistema...');
    
    // Verificar si el repositorio está inicializado
    const gitDir = path.join(__dirname, '..', '.git');
    try {
      await fs.access(gitDir);
    } catch (err) {
      console.log('⚠️ Repositorio Git no inicializado. Omitiendo verificación de actualizaciones.');
      return false;
    }
    
    // Verificar actualizaciones
    const updateInfo = await checkForUpdates();
    
    if (!updateInfo.hasUpdates) {
      console.log('✅ El sistema está actualizado. No se requieren cambios.\n');
      return false;
    }
    
    // Mostrar información sobre actualizaciones disponibles
    console.log('\n🔄 ACTUALIZACIONES DISPONIBLES');
    console.log(`Se encontraron ${updateInfo.behind} nuevos cambios para instalar:`);
    
    if (updateInfo.commits && updateInfo.commits.length > 0) {
      console.log('\nCambios:');
      updateInfo.commits.forEach(commit => console.log(`• ${commit}`));
    }
    
    if (updateInfo.filesByType) {
      const fileCount = Object.values(updateInfo.filesByType).reduce((sum, files) => sum + files.length, 0);
      console.log(`\nArchivos a actualizar: ${fileCount}`);
      
      if (updateInfo.filesByType.added.length > 0) {
        console.log(`• ${updateInfo.filesByType.added.length} archivos nuevos`);
      }
      if (updateInfo.filesByType.modified.length > 0) {
        console.log(`• ${updateInfo.filesByType.modified.length} archivos modificados`);
      }
      if (updateInfo.filesByType.deleted.length > 0) {
        console.log(`• ${updateInfo.filesByType.deleted.length} archivos eliminados`);
      }
    }
    
    console.log('\n⏳ Instalando actualizaciones automáticamente...');
    
    // Aplicar actualizaciones
    const result = await applyUpdates(updateInfo);
    
    if (result.success) {
      if (result.changes && result.changes.length > 0) {
        console.log('\n✅ ACTUALIZACIÓN COMPLETADA EXITOSAMENTE');
        console.log(`Se aplicaron ${result.changes.length} cambios al sistema.`);
        
        // Verificar si se actualizaron archivos críticos que requieren reinicio
        const criticalFiles = ['package.json', 'src/index.js', 'src/bot.js'];
        const changedFiles = result.changedFiles.map(cf => cf.file);
        const requiresRestart = changedFiles.some(file => criticalFiles.includes(file));
        
        if (requiresRestart) {
          console.log('\n⚠️ Se actualizaron archivos críticos que requieren reinicio.');
          console.log('El sistema intentará reiniciarse automáticamente al finalizar el inicio.');
          
          // Marcar que se requiere reinicio
          global.requiresRestart = true;
        }
        
        return true;
      } else {
        console.log('ℹ️ No se aplicaron cambios reales.');
        return false;
      }
    } else {
      console.error('\n❌ ERROR AL APLICAR ACTUALIZACIONES:');
      console.error(result.error || 'Error desconocido');
      console.log('⚠️ Continuando con el inicio del sistema sin actualizar...');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error al verificar actualizaciones:', error.message);
    console.log('⚠️ Continuando con el inicio del sistema sin actualizar...');
    return false;
  }
}

// Función principal
async function main() {
  try {
    // Primero verificar actualizaciones
    const updatesApplied = await verificarActualizaciones();
    
    // Luego actualizar IP
    await actualizarIP();
    
    return { updatesApplied };
  } catch (error) {
    console.error('❌ Error en pre-inicio:', error);
    return { updatesApplied: false, error: error.message };
  }
}

// Ejecutar y exportar resultado para que pueda ser usado en index.js
export const preStartResult = main();

// Si se ejecuta directamente este script (no importado)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
} 