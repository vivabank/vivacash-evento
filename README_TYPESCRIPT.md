# VivaCash Evento - Estrutura TypeScript

Projeto de registro com formulário e leitura de QR Code otimizado para dispositivos móveis.

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ErrorContainer.ts
│   ├── FormContainer.ts
│   ├── CameraContainer.ts
│   └── index.ts
├── services/           # Serviços e lógica de negócio
│   ├── DeviceService.ts
│   ├── QRCodeService.ts
│   └── index.ts
├── types/              # Tipos TypeScript
│   └── index.ts
├── utils/              # Funções utilitárias
│   └── index.ts
├── styles/             # Arquivos CSS
│   └── main.css
└── main.ts             # Ponto de entrada
```

## 🎯 Funcionalidades

- ✅ Verificação automática de dispositivo mobile
- ✅ Formulário com 3 campos (Nome, Documento, Empresa)
- ✅ Leitura de QR Code via câmera frontal
- ✅ Tipos TypeScript completos
- ✅ Estrutura modular e escalável
- ✅ Tratamento de erros robusto

## 🚀 Como Usar

```bash
# Instalar dependências
pnpm install

# Desenvolvimento
pnpm dev

# Build
pnpm build

# Type checking
pnpm type-check

# Lint
pnpm lint
```

## 📝 Componentes

### ErrorContainer
Componente exibido quando acessado em computador.

### FormContainer
Formulário com validação de entrada.

### CameraContainer
Câmera para leitura de QR Code.

## 🔧 Serviços

### DeviceService
- `isMobile()` - Verifica se é dispositivo mobile
- `getDeviceType()` - Retorna tipo do dispositivo
- `supportsWebRTC()` - Verifica suporte a câmera
- `requestCameraPermission()` - Solicita acesso à câmera

### QRCodeService
- `startScanning()` - Inicia leitura de QR Code
- `stopScanning()` - Para a leitura
- `stopMediaStream()` - Para a stream de mídia

## 📦 Tipos

```typescript
FormData {
  fullName: string
  document: string
  company: string
}

RegistrationData extends FormData {
  qrCode: string
  timestamp: string
}
```

## ⚙️ Configuração TypeScript

O projeto usa path aliases para imports mais limpos:

```typescript
import { DeviceService } from '@services/DeviceService'
import { FormData } from '@app-types/index'
import { createFormContainer } from '@components/FormContainer'
```

## 📱 Requisitos

- Navegador moderno com suporte a WebRTC
- Dispositivo mobile
- Permissão de acesso à câmera
