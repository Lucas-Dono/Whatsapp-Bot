import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Función para reiniciar el backend
const restartBackend = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/restart');
    console.log('✅ Backend reiniciado:', response.data.message);
  } catch (error) {
    console.error('❌ Error al reiniciar el backend:', error);
  }
};

// Exportamos la función para que pueda ser utilizada en otras partes del frontend
export { restartBackend };
