/**
 * Componente de erro para dispositivos não mobile
 */

export function createErrorContainer(): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'container error-container';
  
  container.innerHTML = `
    <h1>📱 Acesso Apenas Mobile</h1>
    <p>Este aplicativo só funciona em dispositivos móveis.</p>
    <p>Abra no seu smartphone para continuar.</p>
  `;

  return container;
}
