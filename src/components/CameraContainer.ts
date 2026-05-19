/**
 * Componente da câmera para leitura de QR Code
 */

export interface CameraContainerCallbacks {
  onCancel: () => void;
  onContinue: () => void;
}

export function createCameraContainer(callbacks: CameraContainerCallbacks): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'camera-section hidden';
  
  container.innerHTML = `
    <h2>Escanear QR Code</h2>
    <div class="camera-container">
      <video id="qrVideo" autoplay playsinline></video>
      <canvas id="canvas" hidden></canvas>
      <div class="scan-frame"></div>
    </div>
    
    <div id="qrResult" class="qr-result hidden">
      <h3>QR Code Lido!</h3>
      <p id="qrData"></p>
    </div>

    <div class="camera-buttons">
      <button id="cancelBtn" class="btn-secondary">Cancelar</button>
      <button id="continueBtn" class="btn-submit hidden">Continuar</button>
    </div>
  `;

  const cancelBtn = container.querySelector<HTMLButtonElement>('#cancelBtn');
  const continueBtn = container.querySelector<HTMLButtonElement>('#continueBtn');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => callbacks.onCancel());
  }

  if (continueBtn) {
    continueBtn.addEventListener('click', () => callbacks.onContinue());
  }

  return container;
}

/**
 * Mostra o resultado do QR Code lido
 */
export function showQRResult(container: HTMLDivElement, qrData: string): void {
  const resultDiv = container.querySelector<HTMLDivElement>('#qrResult');
  const resultDataEl = container.querySelector<HTMLParagraphElement>('#qrData');
  const continueBtn = container.querySelector<HTMLButtonElement>('#continueBtn');

  if (resultDiv && resultDataEl && continueBtn) {
    resultDataEl.textContent = qrData;
    resultDiv.classList.remove('hidden');
    continueBtn.classList.remove('hidden');
  }
}

/**
 * Reseta a câmera
 */
export function resetCamera(container: HTMLDivElement): void {
  const resultDiv = container.querySelector<HTMLDivElement>('#qrResult');
  const continueBtn = container.querySelector<HTMLButtonElement>('#continueBtn');
  const qrData = container.querySelector<HTMLParagraphElement>('#qrData');

  if (resultDiv && continueBtn && qrData) {
    resultDiv.classList.add('hidden');
    continueBtn.classList.add('hidden');
    qrData.textContent = '';
  }
}

/**
 * Obtém elementos da câmera
 */
export function getCameraElements(container: HTMLDivElement): {
  video: HTMLVideoElement | null;
  canvas: HTMLCanvasElement | null;
} {
  return {
    video: container.querySelector<HTMLVideoElement>('#qrVideo'),
    canvas: container.querySelector<HTMLCanvasElement>('#canvas'),
  };
}
