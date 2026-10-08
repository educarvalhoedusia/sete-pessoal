# Chat com IA do site: passo a passo

## 1. Publicar o site (Cloudflare Pages)
1. Painel do Cloudflare > Workers & Pages > Create > Pages > Connect to Git.
2. Escolha o repositório `sete-pessoal`, branch `main`.
3. Framework: nenhum. Build command: vazio. Output directory: `/` (raiz).
4. Anote o endereço gerado (ex.: `https://sete-pessoal.pages.dev`).

## 2. Publicar o Worker (chat com IA)
Na pasta `worker/`, com Node instalado:
```
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```
- Antes, em `wrangler.toml`, troque `ALLOWED_ORIGINS` pelo endereço do site (passo 1). Use mais de um separando por vírgula.
- Cole sua chave da Anthropic quando o `secret put` pedir (ela fica só no Cloudflare).
- O `deploy` mostra o endereço do Worker (`https://eduardo-assistente.<conta>.workers.dev`).

## 3. Ligar o site ao Worker
Em `chat.js`, troque `COLE-AQUI-O-ENDERECO-DO-WORKER` pelo endereço do Worker, faça commit e push. O Pages publica sozinho.

## Cuidados
- Cada pergunta gasta créditos da API. Configure um limite de gasto na conta da Anthropic e, se quiser, regras de rate limiting no Cloudflare.
- O assistente guiado (botão "Assistente") continua sem IA e sem backend.
