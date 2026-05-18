# ✅ Histórico de Mudanças - Infraestrutura

## [2.0.0] - 2026-05-12

### 🚀 BREAKING CHANGES: Migração para CloudFront Functions

**Mudança arquitetural:** Lambda@Edge → CloudFront Functions

**Por que mudar?**

- ⚡ **Latência:** Sub-milissegundos vs milissegundos
- 💰 **Custo:** ~1/6 do preço do Lambda@Edge
- 🔧 **Simplicidade:** Deploy inline via CLI (sem infraestrutura Lambda separada)
- 🌐 **Global:** Executa em todos os edge locations

**O que mudou:**

#### Removido ❌

- `deploy-lambda.sh` - Script de deploy Lambda
- `validate-config.sh` - Validação de variáveis
- `LAMBDA_SETUP.md` - Guia de setup Lambda@Edge
- `VALIDATION_REPORT.md` - Relatório de validação
- Variáveis GitHub: `UPDATE_LAMBDA_EDGE`, `LAMBDA_FUNCTION_NAME`

#### Adicionado ✅

- CloudFront Function: `VivaCashRouter`
- Update inline da função nos workflows
- Documentação completa: [DEPLOY_README.md](../DEPLOY_README.md)

#### Modificado 🔄

- `cloudfront-router.js`: Simplificado para CloudFront Functions (ES5, <10KB)
- `.github/workflows/develop.yaml`: Update + Publish CloudFront Function
- `.github/workflows/main.yaml`: Update + Publish CloudFront Function
- `README.md`: Atualizado para CloudFront Functions
- `SETUP.md`: Guia de setup com CloudFront Functions
- `GITHUB_VARIABLES.md`: Renomeado para foco em Secrets

#### Função CloudFront

```javascript
// Runtime: cloudfront-js-2.0
// Event Type: viewer-request
// Tamanho: ~1KB (muito abaixo do limite de 10KB)

function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;

  // Roteamento baseado em domínio
  if (developDomains.indexOf(host) !== -1) {
    request.uri = '/develop-latest' + uri;
  }

  return request;
}
```

#### Deploy Process

```bash
# Antigo (Lambda@Edge)
./infra/deploy-lambda.sh  # Script separado
aws lambda update-function-code
aws lambda publish-version
aws cloudfront update-distribution  # Associar nova versão

# Novo (CloudFront Functions)
sed -i "s|PLACEHOLDER|/develop-latest|g" current_code.js
aws cloudfront update-function --name VivaCashRouter
aws cloudfront publish-function --name VivaCashRouter
# Já está associado, não precisa update-distribution!
```

---

## [1.1.0] - 2026-05-11

### 🔧 Correção: Nomes de Variáveis GitHub

**Problema:** Variáveis configuradas no GitHub não batiam com as referenciadas nos workflows.

**Mudança:**

- `VIVACASH_DEVELOP_TENANTS` → `VIVACASH_DEV`
- `VIVACASH_MAIN_TENANTS` → `VIVACASH_MAIN`

### Arquivos Atualizados

- [`.github/workflows/develop.yaml`](../.github/workflows/develop.yaml)
- [`.github/workflows/main.yaml`](../.github/workflows/main.yaml)
- [`infra/validate-config.sh`](validate-config.sh) _(removido em v2.0.0)_
- [`infra/GITHUB_VARIABLES.md`](GITHUB_VARIABLES.md)
- [`infra/README.md`](README.md)
- [`infra/SETUP.md`](SETUP.md)

### Configuração GitHub

✅ **Variáveis corretas:**

```
VIVACASH_DEV = 'dev'
VIVACASH_MAIN = 'www'
```

---

## [1.0.0] - 2026-05-10

### 🎉 Release Inicial

**Stack:**

- React 19.2.0 + TypeScript 5.9.3
- Vite 7.3.1 (bundler)
- pnpm 8.x (package manager)
- Material-UI 7.3.9

**Infraestrutura AWS:**

- S3 Bucket: `vivacash-frontend` (us-east-2)
- CloudFront Distribution: `E1PQ2RJZYTOCQ9`
- Lambda@Edge: `VivaCashCloudFrontRouter` (us-east-1) _(removido em v2.0.0)_

**Funcionalidades:**

- ✅ Multi-ambiente (develop/main)
- ✅ Deploy versionado (develop-v{N}, main-v{N})
- ✅ Roteamento por domínio
- ✅ Suporte a SPA routing
- ✅ Invalidação automática de cache

---

## 📋 Checklist de Variáveis

### Obrigatórias

- [x] `VIVACASH_DEV` = `dev`
- [x] `VIVACASH_MAIN` = `www`

### Opcionais (para Lambda@Edge)

- [ ] `UPDATE_LAMBDA_EDGE` = `false` _(recomendado inicialmente)_
- [ ] `LAMBDA_FUNCTION_NAME` = `VivaCashCloudFrontRouter` _(usar quando configurar Lambda)_

### Secrets

- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `AWS_REGION` = `us-east-1`

---

## 🎉 Resultado

Todos os arquivos agora estão alinhados com suas variáveis do GitHub:

- **Workflows**: Usam `vars.VIVACASH_DEV` e `vars.VIVACASH_MAIN`
- **Scripts**: Validam `VIVACASH_DEV` e `VIVACASH_MAIN`
- **Documentação**: Reflete os nomes corretos

Sua infraestrutura está pronta para deploy! 🚀
