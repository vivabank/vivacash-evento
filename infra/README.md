# Infraestrutura - VivaCash Frontend

## CloudFront Functions Router

Este diretório contém a função CloudFront que roteia requisições baseado em domínios para deploys versionados.

### Arquivos

- **`cloudfront-router.js`**: Template da CloudFront Function
- **Documentação completa**: Veja [DEPLOY_README.md](../DEPLOY_README.md) na raiz do projeto

---

## Arquitetura

```
┌─────────────────────┐
│  dev.meuvivacash    │──┐
│  www.meuvivacash    │  │
└─────────────────────┘  │
                         │
                         ▼
              ┌──────────────────┐
              │   CloudFront     │
              │  Distribution    │
              │  E1PQ2RJZYTOCQ9  │
              └──────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  CloudFront Function │
              │   VivaCashRouter     │
              │  (viewer-request)    │
              └──────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    /develop-latest  /main-latest   /develop-v{N}
         │               │               │
         └───────────────┴───────────────┘
                         │
                         ▼
               ┌─────────────────┐
               │  S3 Bucket      │
               │ vivacash-frontend│
               │  (us-east-2)    │
               └─────────────────┘
```

---

## CloudFront Function vs Lambda@Edge

**Por que CloudFront Functions?**

| Característica        | CloudFront Functions | Lambda@Edge      |
| --------------------- | -------------------- | ---------------- |
| **Latência**          | Sub-milissegundos    | Milissegundos    |
| **Custo**             | ~1/6 do Lambda       | Mais caro        |
| **Deploy**            | Inline via CLI       | Deploy de Lambda |
| **Limite de código**  | 10KB                 | 1MB              |
| **Região**            | Global (edge)        | us-east-1 apenas |
| **Caso de uso ideal** | Routing simples      | Lógica complexa  |

Para nosso caso (roteamento baseado em domínio), CloudFront Functions é **ideal**.

---

## Como funciona

### 1. Build e Deploy (GitHub Actions)

```bash
# Workflow develop.yaml
1. Build: pnpm run build
2. Deploy S3:
   - s3://vivacash-frontend/develop-v{run_number}/
   - s3://vivacash-frontend/develop-latest/
3. Update CloudFront Function:
   - Substituir placeholders no template
   - aws cloudfront update-function
   - aws cloudfront publish-function
4. Invalidate Cache: aws cloudfront create-invalidation
```

### 2. Roteamento (CloudFront Function)

```
Requisição: https://dev.meuvivacash.com/dashboard
              ↓
CloudFront Function verifica host
              ↓
dev.meuvivacash.com → /develop-latest/
              ↓
Verifica se URI tem extensão
              ↓
Não tem → É rota SPA → /develop-latest/index.html
              ↓
S3 retorna index.html
              ↓
React Router renderiza /dashboard
```

### 3. Arquivos Estáticos vs Rotas SPA

```javascript
// URL tem extensão? → É arquivo estático
/assets/logo.svg → /develop-latest/assets/logo.svg

// URL sem extensão? → É rota do React
/dashboard → /develop-latest/index.html
/login → /develop-latest/index.html
```

---

## Deploy Manual da Lambda

Se precisar atualizar a Lambda manualmente:

```bash
# Exporta as variáveis
export DEVELOP_VERSION="develop-v125"
export MAIN_VERSION="main-v42"
export DEVELOP_TENANTS="dev,staging"
export MAIN_TENANTS="www,app"
export LAMBDA_FUNCTION_NAME="VivaCashCloudFrontRouter"

# Executa o deploy
chmod +x infra/deploy-lambda.sh
./infra/deploy-lambda.sh
```

---

## Estrutura do S3

```
vivacash-frontend/
├── develop-v1/
│   ├── index.html
│   ├── assets/
│   └── ...
├── develop-v2/
│   └── ...
├── main-v1/
│   ├── index.html
│   ├── assets/
│   └── ...
└── main-v2/
    └── ...
```

---

## Checklist de Configuração Inicial

### 1. GitHub Organization Variables

- [ ] `VIVACASH_DEV` = `dev`
- [ ] `VIVACASH_MAIN` = `www`

### 2. GitHub Secrets

- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `AWS_REGION` (ex: `us-east-1`)

### 3. AWS Lambda

- [ ] Criar função Lambda no `us-east-1` (Lambda@Edge requer essa região)
- [ ] Nome: `VivaCashCloudFrontRouter` ou configurar variável
- [ ] Runtime: Node.js 18.x ou superior
- [ ] Permissões: `lambda:PublishVersion`, `cloudfront:UpdateDistribution`

### 4. AWS CloudFront

- [ ] Criar Distribution apontando para S3 bucket `vivacash-frontend`
- [ ] Anotar Distribution ID (ex: `E32446P2D2XVAK`)
- [ ] Configurar Lambda@Edge no Viewer Request
- [ ] Configurar CNAMEs: `*.meuvivacash.com`, `meuvivacash.com`
- [ ] Configurar certificado SSL

---

## Troubleshooting

### 403 Forbidden

**Causa:** Domínio não está na lista de permitidos.  
**Solução:** Adicione o tenant nas variáveis `VIVACASH_*_TENANTS`

### Erro 404 em arquivos estáticos

**Causa:** Path incorreto no S3.  
**Solução:** Verifique se `VERSION_PATH` está correto no workflow

### Lambda não atualiza

**Causa:** CloudFront cache ou versão da Lambda não publicada.  
**Solução:**

1. Invalide cache: `aws cloudfront create-invalidation`
2. Verifique se publicou versão: `aws lambda publish-version`

---

## Próximos Passos

- [ ] Terraform para provisionamento automático
- [ ] Blue/Green deployment
- [ ] Rollback automático
- [ ] Monitoramento com CloudWatch
- [ ] Testes automatizados da Lambda
