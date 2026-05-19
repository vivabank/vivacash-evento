/**
 * Funções utilitárias
 */

import type { FormData, RegistrationData } from '@app-types/index';

/**
 * Cria objeto completo de registro
 */
export function createRegistrationData(formData: FormData, qrCode: string): RegistrationData {
  return {
    ...formData,
    qrCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Valida os dados do formulário
 */
export function validateFormData(formData: FormData): boolean {
  return !!(
    formData.fullName.trim() &&
    formData.document.trim() &&
    formData.company.trim()
  );
}

/**
 * Formata dados para exibição
 */
export function formatRegistrationData(data: RegistrationData): string {
  return `
Dados Registrados:
Nome: ${data.fullName}
Documento: ${data.document}
Empresa: ${data.company}
QR Code: ${data.qrCode}
Data/Hora: ${new Date(data.timestamp).toLocaleString('pt-BR')}
  `.trim();
}
