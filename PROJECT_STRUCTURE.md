vivacash-evento/
├── 📄 index.html                  # HTML principal
├── 📄 tsconfig.json               # Configuração TypeScript
├── 📄 tsconfig.node.json          # TypeScript para Vite
├── 📄 vite.config.ts              # Configuração Vite (TypeScript)
├── 📄 package.json                # Dependências e scripts
├── 📄 .eslintignore               # Ignore do ESLint
├── 📄 .gitignore                  # Ignore do Git
├── 📄 README.md                   # README principal
├── 📄 README_TYPESCRIPT.md        # Documentação TypeScript
├── 📄 DEVELOPMENT.md              # Guia de desenvolvimento
│
├── 📁 src/
│   ├── 📄 main.ts                 # ⭐ Ponto de entrada
│   │
│   ├── 📁 types/
│   │   └── 📄 index.ts            # Interfaces e tipos
│   │
│   ├── 📁 services/
│   │   ├── 📄 DeviceService.ts    # Gerencia dispositivo
│   │   ├── 📄 QRCodeService.ts    # Gerencia QR Code
│   │   └── 📄 index.ts            # Exports
│   │
│   ├── 📁 components/
│   │   ├── 📄 ErrorContainer.ts   # Componente de erro
│   │   ├── 📄 FormContainer.ts    # Componente de formulário
│   │   ├── 📄 CameraContainer.ts  # Componente de câmera
│   │   └── 📄 index.ts            # Exports
│   │
│   ├── 📁 utils/
│   │   └── 📄 index.ts            # Funções utilitárias
│   │
│   └── 📁 styles/
│       └── 📄 main.css            # Estilos globais
│
├── 📁 infra/                      # Infraestrutura CloudFront
│   ├── 📄 README.md
│   ├── 📄 SETUP.md
│   ├── 📄 CHANGELOG.md
│   ├── 📄 GITHUB_VARIABLES.md
│   └── 📄 cloudfront-router.js
│
└── 📁 dist/                       # Build output (gerado)

═══════════════════════════════════════════════════════════════

📊 ESTATÍSTICAS

TypeScript:     6 arquivos de serviço/componente
CSS:            1 arquivo de estilos
Types:          1 arquivo de tipos
Utils:          1 arquivo de funções
HTML:           1 arquivo principal
Config:         4 arquivos de configuração

═══════════════════════════════════════════════════════════════

🎯 FLUXO DE IMPORTS

main.ts
├── @services/DeviceService
├── @services/QRCodeService
├── @components/ErrorContainer
├── @components/FormContainer
├── @components/CameraContainer
├── @utils/index
├── @app-types/index
└── @styles/main.css

═══════════════════════════════════════════════════════════════

📦 COMANDOS DISPONÍVEIS

pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Faz build para produção
pnpm preview      # Visualiza build
pnpm lint         # Verifica linting
pnpm type-check   # Verifica tipos TypeScript

═══════════════════════════════════════════════════════════════
