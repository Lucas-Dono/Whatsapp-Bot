import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta al archivo de cervezas
const cervezasPath = path.join(__dirname, 'cervezas.json');

// Función para leer el archivo de cervezas
function readCervezasData() {
  const data = fs.readFileSync(cervezasPath, 'utf8');
  return JSON.parse(data);
}

// Función para escribir en el archivo de cervezas
function writeCervezasData(data) {
  fs.writeFileSync(cervezasPath, JSON.stringify(data, null, 2), 'utf8');
}

// Función para mostrar el stock actual
function showStock(data) {
  console.log('=== STOCK ACTUAL ===');
  console.log('Clasicas - Botella de un litro:', data.clasicas.find(c => c.nombre === 'Botella de un litro').stock);
  console.log('Clasicas - Botella de medio litro:', data.clasicas.find(c => c.nombre === 'Botella de medio litro').stock);
  console.log('Lupuladas - Botella de un litro:', data.lupuladas.find(c => c.nombre === 'Botella de un litro').stock);
  console.log('Lupuladas - Botella de medio litro:', data.lupuladas.find(c => c.nombre === 'Botella de medio litro').stock);
}

// Función para simular el procesamiento de una instrucción
function processInstruction(instruction) {
  console.log('=== PROCESANDO INSTRUCCIÓN ===');
  console.log(JSON.stringify(instruction, null, 2));
  
  // Verificar si es un pedido de botellas
  if (instruction.hojaDestino !== 'Barriles' || !instruction.datos || !instruction.datos.tipoBarril) {
    console.log('No es un pedido de botellas válido');
    return;
  }
  
  // Leer datos actuales
  const cervezasData = readCervezasData();
  
  // Verificar si el pedido incluye botellas
  const tipoBarril = instruction.datos.tipoBarril.toLowerCase();
  const litros = instruction.datos.litros;
  let stockActualizado = false;
  
  // Identificar tipo de botella y categoría
  let categoriaArray = [];
  let nombreBottle = '';
  let cantidad = 0;
  
  if (tipoBarril.includes('botella')) {
    if (tipoBarril.includes('clasica') || tipoBarril.includes('clásica')) {
      categoriaArray = cervezasData.clasicas;
      if (tipoBarril.includes('litro')) {
        nombreBottle = tipoBarril.includes('medio') ? 'Botella de medio litro' : 'Botella de un litro';
        cantidad = parseInt(litros);
      }
    } else if (tipoBarril.includes('lupulada')) {
      categoriaArray = cervezasData.lupuladas;
      if (tipoBarril.includes('litro')) {
        nombreBottle = tipoBarril.includes('medio') ? 'Botella de medio litro' : 'Botella de un litro';
        cantidad = parseInt(litros);
      }
    }
    
    // Si encontramos una categoría y nombre de botella válidos
    if (categoriaArray.length > 0 && nombreBottle && cantidad > 0) {
      const bottleIndex = categoriaArray.findIndex(item => item.nombre === nombreBottle);
      
      if (bottleIndex !== -1) {
        const currentStock = parseInt(categoriaArray[bottleIndex].stock);
        
        // Verificar si hay suficiente stock
        if (currentStock >= cantidad) {
          console.log(`Stock suficiente: ${currentStock} >= ${cantidad}`);
          
          // Actualizar el stock
          categoriaArray[bottleIndex].stock = currentStock - cantidad;
          stockActualizado = true;
          
          console.log(`Nuevo stock para ${nombreBottle}: ${categoriaArray[bottleIndex].stock}`);
        } else {
          console.log(`¡ERROR! No hay suficiente stock. Stock actual: ${currentStock}, Solicitado: ${cantidad}`);
        }
      } else {
        console.log(`No se encontró la botella "${nombreBottle}" en la categoría`);
      }
    } else {
      console.log('No se pudo identificar el tipo de botella o la cantidad');
    }
    
    // Guardar cambios si se actualizó el stock
    if (stockActualizado) {
      writeCervezasData(cervezasData);
      console.log('Stock actualizado y guardado en cervezas.json');
    }
  } else {
    console.log('No es un pedido de botellas');
  }
}

// Datos de prueba - Pedido de botellas de un litro clásicas
const testInstruction1 = {
  hojaDestino: 'Barriles',
  datos: {
    nombre: 'Cliente Prueba',
    tipoBarril: 'Botella de un litro Clásica',
    litros: 5, // 5 botellas
    incluyeHielo: false,
    delivery: true,
    direccion: 'Calle de Prueba 123',
    fechaEvento: '2025-07-15',
    seña: 10000,
    total: 25000
  }
};

// Datos de prueba - Pedido de botellas de medio litro lupuladas
const testInstruction2 = {
  hojaDestino: 'Barriles',
  datos: {
    nombre: 'Cliente Prueba 2',
    tipoBarril: 'Botella de medio litro Lupulada',
    litros: 10, // 10 botellas
    incluyeHielo: true,
    delivery: false,
    direccion: '',
    fechaEvento: '2025-07-20',
    seña: 15000,
    total: 30000
  }
};

// Ejecutar pruebas
const cervezasData = readCervezasData();
showStock(cervezasData);

console.log('\n=== PRUEBA 1: PEDIDO DE BOTELLAS DE UN LITRO CLÁSICAS ===');
processInstruction(testInstruction1);

console.log('\n=== PRUEBA 2: PEDIDO DE BOTELLAS DE MEDIO LITRO LUPULADAS ===');
processInstruction(testInstruction2);

console.log('\n=== STOCK DESPUÉS DE LAS PRUEBAS ===');
const cervezasDataUpdated = readCervezasData();
showStock(cervezasDataUpdated); 