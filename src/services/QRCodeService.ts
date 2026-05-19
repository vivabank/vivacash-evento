/**
 * Serviço para leitura de QR Code
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsQR: any;
}

export class QRCodeService {
  private static scanning = false;

  /**
   * Inicia a leitura de QR Code a partir de um vídeo
   */
  static startScanning(
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement,
    onCodeDetected: (code: string) => void
  ): void {
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
      throw new Error('Não foi possível obter contexto do canvas');
    }

    this.scanning = true;

    videoElement.onloadedmetadata = () => {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      this.scanFrame(ctx, videoElement, canvasElement, onCodeDetected);
    };
  }

  /**
   * Escaneia um frame do vídeo
   */
  private static scanFrame(
    ctx: CanvasRenderingContext2D,
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement,
    onCodeDetected: (code: string) => void
  ): void {
    if (!this.scanning) return;

    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      this.scanning = false;
      onCodeDetected(code.data);
    } else {
      requestAnimationFrame(() =>
        this.scanFrame(ctx, videoElement, canvasElement, onCodeDetected)
      );
    }
  }

  /**
   * Para a leitura de QR Code
   */
  static stopScanning(): void {
    this.scanning = false;
  }

  /**
   * Para a stream de mídia
   */
  static stopMediaStream(stream: MediaStream): void {
    stream.getTracks().forEach((track) => track.stop());
  }
}
