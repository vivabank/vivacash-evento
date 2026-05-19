/**
 * Componente do formulário de registro
 */

import type { FormData } from '@app-types/index';

export interface FormContainerCallbacks {
  onSubmit: (formData: FormData) => void;
}

export function createFormContainer(callbacks: FormContainerCallbacks): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'form-section';

  container.innerHTML = `
    <h1>VIVA.cash</h1>
    <h2>Registro do Evento</h2>
    <form id="registrationForm">
      <div class="form-group">
        <label for="fullName">Nome Completo</label>
        <input 
          type="text" 
          id="fullName" 
          name="fullName" 
          placeholder="Digite seu nome completo"
          required
        />
      </div>

      <div class="form-group">
        <label for="document">Documento (CPF/CNPJ)</label>
        <input 
          type="text" 
          id="document" 
          name="document" 
          placeholder="Digite seu CPF ou CNPJ"
          required
        />
      </div>

      <div class="form-group">
        <label for="company">Empresa</label>
        <input 
          type="text" 
          id="company" 
          name="company" 
          placeholder="Digite o nome da Empresa"
          required
        />
      </div>

      <button type="submit" class="btn-submit">
        Continuar com QR Code
      </button>
    </form>
  `;

  const form = container.querySelector<HTMLFormElement>('#registrationForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData: FormData = {
        fullName: container.querySelector<HTMLInputElement>('#fullName')?.value || '',
        document: container.querySelector<HTMLInputElement>('#document')?.value || '',
        company: container.querySelector<HTMLInputElement>('#company')?.value || '',
      };

      callbacks.onSubmit(formData);
    });
  }

  return container;
}
