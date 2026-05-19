/**
 * Tipos globais da aplicação
 */

export interface FormData {
  fullName: string;
  document: string;
  company: string;
  role: string;
}

export interface RegistrationData extends FormData {
  qrCode: string;
  timestamp: string;
}

export interface QRCodeResult {
  data: string;
  found: boolean;
}

export interface CameraConstraints {
  video: {
    facingMode: 'user' | 'environment';
    width?: { ideal: number };
    height?: { ideal: number };
  };
  audio: boolean;
}
