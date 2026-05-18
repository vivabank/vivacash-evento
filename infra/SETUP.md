# 🚀 Setup Inicial - VivaCash Frontend

Guia rápido para configurar o projeto pela primeira vez com **CloudFront Functions**.

---

## 📋 Pré-requisitos

- [ ] Acesso ao GitHub Organization (permissions de admin)
- [ ] Acesso ao AWS Console (IAM, S3, CloudFront)
- [ ] AWS CLI instalado e configurado localmente

---

## 1️⃣ Configurar Secrets no GitHub (5 min)

### Acesse:

```
https://github.com/YOUR_ORG/YOUR_REPO/settings/secrets/actions
```

### Crie os secrets:

| Nome                    | Valor      | Onde obter |
| ----------------------- | ---------- | ---------- |
| `AWS_ACCESS_KEY_ID`     | `AKIA...`  | AWS IAM    |
| `AWS_SECRET_ACCESS_KEY` | `xxxxx...` | AWS IAM    |

**Permissões IAM necessárias:**

- `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`
- `cloudfront:CreateInvalidation`
- `cloudfront:DescribeFunction`, `cloudfront:UpdateFunction`, `cloudfront:PublishFunction`

**✅ Já configurado!** Seus secrets estão corretos.

---

## 2️⃣ Criar Bucket S3 (2 min)

```bash
# No terminal local
aws s3 mb s3://vivacash-frontend --region us-east-2

# Configurar como website (opcional, CloudFront acessa direto)
aws s3 website s3://vivacash-frontend \
  --index-document index.html \
  --error-document index.html
```

**✅ Já configurado!** Bucket `vivacash-frontend` existe.

---

## 3️⃣ Criar CloudFront Distribution (10 min)

### Via Console AWS:

1. **Origin:**
   - Origin Domain: `vivacash-frontend.s3.us-east-2.amazonaws.com`
   - Origin Path: _(deixe vazio)_
   - Origin Access: Origin Access Control (OAC)

2. **Behavior:**
   - Viewer Protocol: Redirect HTTP to HTTPS
   - Allowed Methods: GET, HEAD, OPTIONS
   - Cache Policy: CachingOptimized

3. **Settings:**
   - Alternate Domain Names (CNAMEs):
     ```
     meuvivacash.com
     *.meuvivacash.com
     ```
   - SSL Certificate: Request or import certificate (ACM)
   - Default Root Object: _(deixe vazio - CloudFront Function gerencia isso)_

4. **Anote o Distribution ID** (ex: `E1PQ2RJZYTOCQ9`)

**✅ Já configurado!** Distribution ID: `E1PQ2RJZYTOCQ9`

---

## 4️⃣ Criar CloudFront Function (5 min)

### Via AWS CLI:

```bash
cd /path/to/vivacash-front

# Criar função inicial (simples, sem roteamento ainda)
cat > /tmp/initial-router.js << 'EOF'
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.indexOf('.') === -1) {
    request.uri = '/index.html';
  }

  return request;
}
EOF

# Criar função
aws cloudfront create-function \
  --name VivaCashRouter \
  --function-config '{"Comment":"VivaCash Router","Runtime":"cloudfront-js-2.0"}' \
  --function-code fileb:///tmp/initial-router.js

# Publicar função
ETAG=$(aws cloudfront describe-function --name VivaCashRouter --stage DEVELOPMENT --query 'ETag' --output text)
aws cloudfront publish-function --name VivaCashRouter --if-match $ETAG
```

**✅ Já configurado!** Função `VivaCashRouter` criada e publicada.

---

## 5️⃣ Associar Função à Distribuição (5 min)

```bash
# Obter configuração atual
aws cloudfront get-distribution-config --id E1PQ2RJZYTOCQ9 > /tmp/cf-config.json

# Extrair ETAG e DistributionConfig
ETAG=$(jq -r '.ETag' /tmp/cf-config.json)
jq '.DistributionConfig' /tmp/cf-config.json > /tmp/cf-config-only.json

# Adicionar CloudFront Function ao DefaultCacheBehavior
cat /tmp/cf-config-only.json | jq '.DefaultCacheBehavior.FunctionAssociations = {
  "Quantity": 1,
  "Items": [
    {
      "FunctionARN": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:function/VivaCashRouter",
      "EventType": "viewer-request"
    }
  ]
}' > /tmp/cf-config-updated.json

# Atualizar distribuição
aws cloudfront update-distribution \
  --id E1PQ2RJZYTOCQ9 \
  --distribution-config file:///tmp/cf-config-updated.json \
  --if-match "$ETAG"
```

**Dica:** Encontre seu Account ID com:

```bash
aws sts get-caller-identity --query 'Account' --output text
```

**✅ Já configurado!** CloudFront Function associada à distribuição.

---

## 6️⃣ Primeiro Deploy

```bash
# Commitar e fazer push
git checkout develop
git add .
git commit -m "chore: setup inicial CloudFront Functions"
git push origin develop
```

O workflow será disparado automaticamente e:

1. ✅ Fará build da aplicação
2. ✅ Enviará para S3 (`develop-v1/` e `develop-latest/`)
3. ✅ Atualizará a CloudFront Function com roteamento completo
4. ✅ Invalidará o cache

---

## 7️⃣ Testar

Aguarde ~1-2 minutos após o deploy e acesse:

```
https://dev.meuvivacash.com
```

Você deve ver a aplicação VivaCash!

---

## 📋 Resumo da Configuração

✅ **Secrets GitHub:**

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

✅ **AWS Resources:**

- Bucket S3: `vivacash-frontend` (us-east-2)
- CloudFront Distribution: `E1PQ2RJZYTOCQ9`
- CloudFront Function: `VivaCashRouter`
- Domínios: `*.meuvivacash.com`, `meuvivacash.com`

✅ **Mapeamento:**

- `dev.meuvivacash.com` → `/develop-latest/`
- `www.meuvivacash.com` → `/main-latest/`

---

## 🔍 Troubleshooting

### Deploy falha com erro 403

**Causa:** Permissões IAM insuficientes

**Solução:** Adicione as policies necessárias ao usuário IAM:

```json
{
  "Effect": "Allow",
  "Action": [
    "s3:PutObject",
    "s3:DeleteObject",
    "s3:ListBucket",
    "cloudfront:CreateInvalidation",
    "cloudfront:DescribeFunction",
    "cloudfront:UpdateFunction",
    "cloudfront:PublishFunction"
  ],
  "Resource": "*"
}
```

### CloudFront serve 403 Forbidden

**Causa:** Domínio não está na lista permitida pela função

**Solução:** Verifique o template `infra/cloudfront-router.js` e os domínios substituídos no workflow.

### Deploy não atualiza o site

**Causa:** Cache do CloudFront

**Solução:** O workflow já faz invalidação automática. Se necessário, force manualmente:

```bash
aws cloudfront create-invalidation --distribution-id E1PQ2RJZYTOCQ9 --paths "/*"
```

---

## 📚 Próximos Passos

- Leia a documentação completa: [DEPLOY_README.md](../DEPLOY_README.md)
- Configure DNS para apontar domínios para o CloudFront
- Configure monitoramento e alertas (CloudWatch)

---

> ⚠️ Pule esta etapa se não precisar de multi-tenant/versionamento avançado

### Via Console AWS (região **us-east-1**):

1. **Lambda → Create function:**
   - Name: `VivaCashCloudFrontRouter`
   - Runtime: Node.js 20.x
   - Architecture: x86_64

2. **Copie o código:**

   ```bash
   cat infra/cloudfront-router.js
   # Copie e cole no editor da Lambda
   ```

3. **Substitua manualmente os placeholders:**

   ```javascript
   var DEVELOP_PREFIX = 'develop-v1';
   var MAIN_PREFIX = 'main-v1';
   var developTenants = ['dev'];
   var mainTenants = ['www'];
   ```

4. **Publish Version** (Actions → Publish new version)

5. **Anexe ao CloudFront:**
   - CloudFront → Sua Distribution → Behaviors → Edit
   - Function Associations:
     - Event: Viewer Request
     - Function: `VivaCashCloudFrontRouter:1` (versão publicada)

6. **Habilite auto-deploy:**
   ```
   UPDATE_LAMBDA_EDGE = true  # no GitHub Variables
   ```

---

## 6️⃣ Primeiro Deploy (2 min)

```bash
# Faça um push qualquer no develop
git checkout develop
git commit --allow-empty -m "chore: trigger deploy"
git push origin develop
```

**Acompanhe:** GitHub Actions → Workflow runs

---

## 7️⃣ Validar Configuração (1 min)

```bash
# No terminal local
cd infra/
export VIVACASH_DEV="dev"
export VIVACASH_MAIN="www"
export AWS_REGION="us-east-1"

./validate-config.sh
```

**Saída esperada:**

```
✅ Configuração perfeita!
```

---

## 8️⃣ Configurar DNS (5 min)

No seu provedor DNS (ex: Route 53, Cloudflare):

### Registros A/CNAME:

| Nome                | Tipo    | Valor                   |
| ------------------- | ------- | ----------------------- |
| `@`                 | A/ALIAS | CloudFront Distribution |
| `www`               | CNAME   | CloudFront Distribution |
| `dev`               | CNAME   | CloudFront Distribution |
| `*.meuvivacash.com` | CNAME   | CloudFront Distribution |

**Exemplo Route 53:**

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  --change-batch file://dns-records.json
```

---

## 9️⃣ Testar Acesso (2 min)

Aguarde propagação DNS (até 10 min) e teste:

```bash
# Produção
curl -I https://www.meuvivacash.com
curl -I https://meuvivacash.com

# Desenvolvimento
curl -I https://dev.meuvivacash.com
```

**Acesse no navegador:**

- https://www.meuvivacash.com
- https://dev.meuvivacash.com

---

## ✅ Checklist Final

- [ ] Variáveis criadas no GitHub
- [ ] Secrets configurados no GitHub
- [ ] Bucket S3 criado
- [ ] CloudFront Distribution criada e configurada
- [ ] SSL/TLS certificado ativo
- [ ] DNS apontando para CloudFront
- [ ] Primeiro deploy com sucesso
- [ ] Lambda@Edge criada (opcional)
- [ ] Sites acessíveis nos domínios

---

## 🆘 Problemas Comuns

### 403 Forbidden ao acessar

- Verifique OAC no CloudFront → S3 bucket policy
- Verifique Lambda@Edge (se configurada)

### Workflow falha no deploy S3

- Verifique AWS credentials no GitHub Secrets
- Verifique permissões IAM

### SSL Certificate pending

- Aguarde validação do domínio (email ou DNS)
- Pode levar até 24h

### CloudFront retorna S3 XML error

- Configure Error Pages no CloudFront:
  - 403 → /index.html (200)
  - 404 → /index.html (200)

---

## 📚 Documentação Adicional

- [README.md](README.md) - Visão geral da infraestrutura
- [GITHUB_VARIABLES.md](GITHUB_VARIABLES.md) - Detalhes das variáveis
- [cloudfront-router.js](cloudfront-router.js) - Lambda@Edge router

---

## 🎯 Próximos Passos

Após setup completo:

1. ✅ Configurar ambiente de staging
2. ✅ Implementar Terraform (IaC)
3. ✅ Configurar monitoramento (CloudWatch)
4. ✅ Implementar testes E2E
5. ✅ Blue/Green deployment
