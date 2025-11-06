# 🚀 Guia de Deploy - HC BRIDGE

## Deploy na Vercel

### Passo 1: Preparar o Repositório

1. Certifique-se de que todo o código está commitado e na branch `main`:
   ```bash
   git add .
   git commit -m "feat: preparação para deploy Sprint 04"
   git push origin main
   ```

### Passo 2: Conectar à Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `challenge-hc-front-end`
4. A Vercel detectará automaticamente que é um projeto Vite

### Passo 3: Configurar Variáveis de Ambiente

Na tela de configuração do projeto, adicione as variáveis de ambiente:

- **VITE_API_BASE_URL**: URL da sua API Java remota
  - Exemplo: `https://sua-api.herokuapp.com/api` ou `https://sua-api.railway.app/api`
  
- **VITE_API_TIMEOUT**: `10000` (opcional)

### Passo 4: Configurações de Build

A Vercel detectará automaticamente:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Se necessário, ajuste manualmente ou use o arquivo `vercel.json` já criado.

### Passo 5: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (geralmente 1-2 minutos)
3. Após o sucesso, você receberá uma URL como: `https://challenge-hc-front-end.vercel.app`

### Passo 6: Atualizar README.md

1. Copie a URL do deploy
2. Atualize o README.md com a URL:
   ```markdown
   ### Deploy
   🌐 **Vercel**: https://seu-projeto.vercel.app
   ```

### Passo 7: Domínio Personalizado (Opcional)

Se desejar um domínio personalizado:
1. Vá em **Settings** > **Domains**
2. Adicione seu domínio
3. Siga as instruções de configuração DNS

## Verificações Pós-Deploy

✅ A aplicação carrega corretamente  
✅ As rotas funcionam (teste navegação entre páginas)  
✅ A integração com API funciona (teste criar/listar emergências)  
✅ A responsividade está funcionando em diferentes dispositivos  
✅ O favicon aparece corretamente  

## Troubleshooting

### Erro: "Module not found"
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para garantir que não há erros

### Erro: "Environment variable not found"
- Verifique se as variáveis de ambiente estão configuradas na Vercel
- Lembre-se: variáveis devem começar com `VITE_` para serem expostas no frontend

### Erro: "Build failed"
- Verifique os logs de build na Vercel
- Teste o build localmente: `npm run build`
- Corrija os erros antes de fazer novo deploy

### API não conecta
- Verifique se a URL da API está correta
- Verifique se a API está acessível publicamente (não apenas localhost)
- Verifique CORS na API Java

## Deploy Automático

A Vercel faz deploy automático sempre que você faz push na branch `main`.

Para desabilitar:
1. Vá em **Settings** > **Git**
2. Desabilite **"Automatic deployments from Git"**

## Rollback

Se precisar voltar para uma versão anterior:
1. Vá em **Deployments**
2. Encontre o deployment desejado
3. Clique nos três pontos (...) > **"Promote to Production"**

## Monitoramento

A Vercel fornece:
- Analytics de performance
- Logs de erro
- Métricas de uso

Acesse em **Analytics** no dashboard do projeto.

