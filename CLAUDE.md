# vivacash-evento — Contexto do Projeto

## Idioma

**Mensagens sempre em português (pt-BR).**

## O que é este projeto

**Aplicação de evento do VIVA.cash** — front leve de leitura de QR Code, usado em ações
presenciais. É o par do **`vivacash-evento-qrcode`** (que tem `CLAUDE.md` próprio).

Repositório: `github.com/vivabank/vivacash-evento`.

---

## Stack

- **React + TypeScript + Vite**, MUI v5
- **`jsqr`** — leitura de QR Code pela câmera
- **pnpm** (`pnpm-lock.yaml`) — diferente do `vivacash-front`, que usa Yarn 4

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm type-check
```

---

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| `src/components/`, `src/utils/` | UI e leitura de QR |
| `src/services/` | Cliente HTTP |
| `src/types.ts`, `src/theme.ts` | Tipos e tema |
| `infra/` | `cloudfront-router.js`, `SETUP.md`, `GITHUB_VARIABLES.md`, `CHANGELOG.md` |

Variável: **`VITE_API_BASE_URL`** (ver `.env.example`).

⚠️ Existe um **`.env` versionado na árvore** — conferir o conteúdo antes de commitar
qualquer coisa aqui, e não acrescentar valor real a ele. Antes de commitar:
`gitleaks detect`.

---

## Branches e deploy

`main` e `develop` (trabalho ativo em `develop`); há também `develop-code`.
**⚠️ O merge para `main` é o deploy de produção, sem portão manual.**

Workflows: `develop.yaml` e `main.yaml`. O roteamento por domínio é feito por uma
**CloudFront Function própria** (`infra/cloudfront-router.js`), que serve deploys
versionados a partir dos hosts `dev.meuvivacash` / `www.meuvivacash`. É outra função que
a `TenantVersionRouter` do vivatech — não confundir.

---

## Relação com os outros repositórios

- Backend: **`cashservice`** (+ **`cashservice-infra`**)
- Par direto: **`vivacash-evento-qrcode`** · App principal: **`vivacash-front`**
- Contexto de segurança e arquitetura: **`~/vivatech/viva-seguranca`**
