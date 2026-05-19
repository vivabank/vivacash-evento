import React from 'react';
import { createRoot } from 'react-dom/client';
import '@styles/main.css';
import { App } from './App';

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Elemento #app nao encontrado');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
