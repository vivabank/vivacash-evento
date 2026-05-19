# Guia de Desenvolvimento - VivaCash Evento

## 📋 Estrutura Modular

O projeto foi reorganizado em TypeScript com arquitetura modular:

### `src/types/` - Tipos TypeScript
Define todas as interfaces e tipos usados na aplicação.

```typescript
FormData - Dados do formulário
RegistrationData - Dados completos com QR Code
CameraConstraints - Configurações de câmera
```

### `src/services/` - Serviços de Negócio

#### DeviceService
Gerencia funcionalidades do dispositivo:
- Detecção de mobile
- Verificação de suporte WebRTC
- Solicitação de permissões de câmera

#### QRCodeService
Gerencia leitura de QR Codes:
- Iniciar/parar scanning
- Processar frames de vídeo
- Detectar QR Codes usando jsQR

### `src/components/` - Componentes Reutilizáveis

#### ErrorContainer
Mensagem para acesso em desktop.

#### FormContainer
Formulário com validação.

#### CameraContainer
Câmera com frame de scanning e resultado.

### `src/utils/` - Funções Utilitárias
- Validação de dados
- Formatação de saída
- Criação de objetos de registro

### `src/styles/` - Estilos CSS
CSS modular organizado por componente.

## 🔄 Fluxo da Aplicação

```
1. Inicialização
   ↓
2. Verificar se é mobile
   ├─ Sim → Mostrar formulário
   └─ Não → Mostrar erro

3. Usuário preenche formulário
   ↓
4. Mostrar câmera
   ↓
5. Ler QR Code
   ↓
6. Mostrar resultado
   ↓
7. Continuar ou Cancelar
```

## 📚 Path Aliases

Para imports limpos e fáceis de refatorar:

```typescript
@components/  → src/components/
@services/    → src/services/
@app-types/   → src/types/
@styles/      → src/styles/
@utils/       → src/utils/
```

## 🛠️ Principais Decisões Arquiteturais

1. **Separação de Responsabilidades**
   - Serviços: lógica de negócio
   - Componentes: UI
   - Utils: funções reutilizáveis

2. **TypeScript Strict Mode**
   - Tipagem completa
   - Melhor IDE support
   - Menos bugs

3. **Componentes Funcionais**
   - Funções puras
   - Fáceis de testar
   - Sem estado global desnecessário

4. **Gerenciamento de Estado Simples**
   - Estado centralizado em `main.ts`
   - Callbacks para comunicação
   - Sem framework pesado

## 🚀 Próximas Melhorias Possíveis

- [ ] Enviar dados para servidor
- [ ] Adicionar validação mais robusta
- [ ] Implementar cache de dados
- [ ] Adicionar testes unitários
- [ ] Adicionar analytics
- [ ] Implementar PWA

## 📦 Dependências

```json
{
  "devDependencies": {
    "vite": "^5.2.0",
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.57.0",
    "terser": "^5.31.0"
  }
}
```

## ✅ Checklist de Implementação

- [x] Converter para TypeScript
- [x] Criar estrutura modular
- [x] Separar componentes
- [x] Separar serviços
- [x] Criar tipos
- [x] Configurar path aliases
- [x] Documentação
- [ ] Testes
- [ ] Integração com servidor

