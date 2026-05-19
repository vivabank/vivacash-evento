/**
 * Serviço para verificar se é dispositivo mobile
 */

export class DeviceService {
  /**
   * Verifica se o dispositivo é mobile
   */
  static isMobile(): boolean {
    const type = this.getDeviceType();
    return type === 'mobile' || type === 'tablet';
  }

  /**
   * Retorna tipo do dispositivo
   */
  static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/mobile|android|iphone|ipod/.test(userAgent)) {
      return 'mobile';
    }

    if (/ipad|android(?!.*mobile)/.test(userAgent)) {
      return 'tablet';
    }

    return 'desktop';
  }

  /**
   * Verifica se o navegador suporta WebRTC
   */
  static supportsWebRTC(): boolean {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    );
  }

  /**
   * Obtém permissão de câmera
   */
  static async requestCameraPermission(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: 'environment' }, // só câmera traseira
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      return stream;
    } catch (error) {
      throw new Error(
        `Erro ao acessar câmera traseira: ${error instanceof Error ? error.message : 'Desconhecido'}`
      );
    }
  }
}
