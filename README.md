# 🚨 HC BRIDGE - Assistente Virtual para Emergências Médicas

<div align="center">

![HC BRIDGE](public/favicon.svg)

**Sprint 04 - Front-End Design Engineering**

Aplicação SPA (Single Page Application) desenvolvida com React + Vite + TypeScript para facilitar o acesso às ferramentas de saúde digital do Hospital das Clínicas.

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Execução](#-instalação-e-execução)
- [Integração com API](#-integração-com-api)
- [Deploy](#-deploy)
- [Integrantes](#-integrantes)
- [Links Importantes](#-links-importantes)
- [Imagens do Projeto](#-imagens-do-projeto)

---

## 🎯 Sobre o Projeto

O **HC BRIDGE** é uma solução integrada ao Portal do Paciente HC que facilita o acesso às ferramentas de saúde digital. A aplicação oferece:

- 🚨 **Sistema de Emergências 24/7**: Assistência imediata para situações críticas
- 🤖 **Chatbot Inteligente**: Assistente virtual para orientações de saúde
- 🏥 **Gestão de Serviços**: Visualização e solicitação de serviços médicos
- 📋 **FAQ Interativo**: Respostas para perguntas frequentes
- 📞 **Canais de Contato**: Múltiplos canais para comunicação

---

## 🛠 Tecnologias

### Core
- **React 19.1.1** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.8.3** - Superset JavaScript com tipagem estática
- **Vite 6.4.1** - Build tool e dev server de alta performance

### Roteamento
- **React Router DOM 7.9.1** - Roteamento para aplicações React SPA

### Estilização
- **TailwindCSS 4.1.13** - Framework CSS utility-first
- **PostCSS** - Processador CSS

### Formulários
- **React Hook Form 7.62.0** - Biblioteca para gerenciamento de formulários

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para JavaScript/TypeScript
- **TypeScript ESLint** - Linter específico para TypeScript

---

## ✨ Funcionalidades

### Páginas Obrigatórias

✅ **Home** (`/`) - Página inicial com visão geral dos serviços  
✅ **Emergências** (`/emergencias`) - Sistema de emergências médicas  
✅ **Chatbot** (`/chatbot`) - Assistente virtual interativo  
✅ **Serviços** (`/servicos`) - Listagem e detalhes de serviços médicos  
✅ **Sobre** (`/sobre`) - Informações sobre o projeto  
✅ **FAQ** (`/faq`) - Perguntas frequentes  
✅ **Contato** (`/contato`) - Formulário de contato  
✅ **Integrantes** (`/integrantes`) - Informações da equipe  

### Rotas Dinâmicas

- **Serviço Detalhe** (`/servicos/:id`) - Página dinâmica com parâmetros de rota

### Recursos Técnicos

- ✅ Rotas estáticas e dinâmicas com React Router
- ✅ Tipagem completa com TypeScript (Union Types, Intersection Types, Interfaces)
- ✅ Responsividade completa (XS, SM, MD, LG, XL)
- ✅ Integração com API RESTful (GET, POST, PUT, DELETE)
- ✅ Tratamento de erros e feedback ao usuário
- ✅ Acessibilidade (ARIA labels, navegação por teclado)

---

## 📁 Estrutura do Projeto

```
challenge-hc-front-end/
├── public/
│   ├── favicon.svg          # Favicon do projeto
│   └── membros/             # Fotos dos integrantes
│       ├── membro1.png
│       ├── membro2.png
│       └── membro3.png
├── src/
│   ├── assets/              # Assets estáticos
│   ├── components/          # Componentes reutilizáveis
│   │   ├── FaqItem.tsx
│   │   └── ServiceCard.tsx
│   ├── data/                # Dados mockados
│   │   ├── emergency.ts
│   │   └── services.ts
│   ├── pages/               # Páginas da aplicação
│   │   ├── Home.tsx
│   │   ├── Emergencias.tsx
│   │   ├── Chatbot.tsx
│   │   ├── Servicos.tsx
│   │   ├── ServicoDetalhe.tsx
│   │   ├── Sobre.tsx
│   │   ├── FAQ.tsx
│   │   ├── Contato.tsx
│   │   ├── Integrantes.tsx
│   │   └── NotFound.tsx
│   ├── services/            # Serviços de API
│   │   ├── api.ts           # Cliente HTTP base
│   │   ├── emergencyService.ts
│   │   └── README.md
│   ├── types/               # Tipos TypeScript
│   │   └── api.ts           # Tipos, Union Types, Intersection Types
│   ├── App.tsx              # Componente principal (Layout)
│   ├── App.css              # Estilos globais (TailwindCSS)
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Tipos do Vite
├── .env                     # Variáveis de ambiente (não commitado)
├── .gitignore
├── eslint.config.js
├── package.json
├── postcss.config.cjs       # Configuração PostCSS/Tailwind
├── tailwind.config.js       # Configuração TailwindCSS
├── tsconfig.json            # Configuração TypeScript
├── vite.config.ts           # Configuração Vite
└── README.md                # Este arquivo
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ (recomendado: Node.js 22.14.0)
- npm ou yarn

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/challange-hc-1TDSPH-2-sem/Sprint-4-Challenge-HC.git
   cd challenge-hc-front-end
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   VITE_API_BASE_URL=https://sprint4java564969.onrender.com
   VITE_API_TIMEOUT=15000
   ```
   
   **Nota**: A API já está configurada por padrão. Você só precisa criar o `.env` se quiser usar uma URL diferente.

4. **Execute o projeto em desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse no navegador**
   ```
   https://sprint-4-challenge-hc.vercel.app/
   ```

### Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Preview do build de produção
npm run lint     # Executa o linter
```

---

## 🔌 Integração com API

O projeto está preparado para integração com API RESTful desenvolvida em Java (Domain Driven Design).

### Configuração

1. **Defina a URL da API** no arquivo `.env`:
   ```env
   VITE_API_BASE_URL=https://sua-api-remota.com/api
   ```

2. **Use os serviços de API** nos componentes:
   ```typescript
   import emergencyService from './services/emergencyService'
   
   // GET - Listar emergências
   const emergencies = await emergencyService.getAll()
   
   // POST - Criar emergência
   const newEmergency = await emergencyService.create({
     tipo: 'cardiaco',
     descricao: 'Dor no peito',
     contato: '11999999999'
   })
   
   // PUT - Atualizar emergência
   await emergencyService.update(1, { status: 'atendido' })
   
   // DELETE - Deletar emergência
   await emergencyService.delete(1)
   ```

### Endpoints Implementados

#### Teleconsulta (API Java - Render)
- `GET /teleconsulta` - Lista todas as teleconsultas
- `GET /teleconsulta/:id` - Busca teleconsulta por ID (codigo)
- `POST /teleconsulta` - Marca nova teleconsulta
- `PUT /teleconsulta/:id` - Atualiza teleconsulta
- `DELETE /teleconsulta/:id` - Desmarca teleconsulta

**URL da API**: [https://sprint4java564969.onrender.com](https://sprint4java564969.onrender.com)

#### Emergências (Exemplo)
- `GET /api/emergencias` - Lista todas as emergências
- `GET /api/emergencias/:id` - Busca emergência por ID
- `POST /api/emergencias` - Cria nova emergência
- `PUT /api/emergencias/:id` - Atualiza emergência
- `DELETE /api/emergencias/:id` - Deleta emergência

### Tratamento de Erros

O cliente API trata automaticamente:
- ✅ Timeouts de requisição
- ✅ Erros HTTP (400, 401, 404, 500, etc.)
- ✅ Erros de rede
- ✅ Erros de parsing JSON

---
### URL de Produção

🔗 **URL do Projeto**: [https://sprint-4-challenge-hc.vercel.app]

---

## 👥 Integrantes

| Nome | RM | Turma | GitHub |
|------|----|----|--------|
| **Pedro De Matos** | 564184 | 1TDSPH | [@PedroPrevitali](https://github.com/PedroPrevitali) |
| **João Vitor Lacerda** | 565565 | 1TDSPH | [@joaolacerdaconsorte](https://github.com/joaolacerdaconsorte) |
| **Murilo Fernandes Carapia** | 564969 | 1TDSPH | [@MurilloFernandesCarapia](https://github.com/MurilloFernandesCarapia) |

### Fotos dos Integrantes

<div align="center">

![João Vitor Lacerda](public/membros/membro1.png)
*João Vitor Lacerda - RM: 565565*

![Murilo Fernandes Carapia](public/membros/membro2.png)
*Murilo Fernandes Carapia - RM: 564969*

![Pedro De Matos](public/membros/membro3.png)
*Pedro De Matos - RM: 564184*

</div>

---

## 🔗 Links Importantes

### Repositório
🔗 **GitHub**: [https://github.com/challange-hc-1TDSPH-2-sem/Sprint-4-Challenge-HC.git](https://github.com/challange-hc-1TDSPH-2-sem/Sprint-4-Challenge-HC.git)

### Vídeo de Apresentação
🎥 **YouTube**: [https://www.youtube.com/watch?v=W6WYKu_Qmog](https://www.youtube.com/watch?v=W6WYKu_Qmog)

### Deploy
🌐 **Vercel**: [https://sprint-4-challenge-hc.vercel.app]

**URL da API**: [https://sprint4java564969.onrender.com](https://sprint4java564969.onrender.com)

---

## 📸 Imagens do Projeto

### Favicon
![Favicon](public/favicon.svg)

---

## 🎨 Design System

### Cores Principais

- **Brand (Vermelho)**: `#dc2626` - Emergências e ações críticas
- **Secondary (Azul)**: `#2563eb` - Ações secundárias
- **Accent (Verde)**: `#059669` - Sucesso e confirmações

### Breakpoints (TailwindCSS)

- **XS**: `< 640px` - Mobile pequeno
- **SM**: `≥ 640px` - Mobile grande
- **MD**: `≥ 768px` - Tablet
- **LG**: `≥ 1024px` - Desktop
- **XL**: `≥ 1280px` - Desktop grande

---

## 📝 TypeScript - Tipos Avançados

O projeto demonstra o uso de:

### Tipos Básicos
- `number`, `string`, `boolean`, `object`

### Union Types
```typescript
type EmergencyStatus = 'pendente' | 'em_atendimento' | 'resolvida' | 'cancelada'
type Priority = 'baixa' | 'media' | 'alta' | 'critica'
```

### Intersection Types
```typescript
type Emergency = EmergencyBase & EmergencyMetadata
type UserWithPermissions = UserBase & UserPermissions
```

### Interfaces
```typescript
interface ApiResponse<T> {
  data?: T
  success?: boolean
  status?: number
}
```

Este projeto foi desenvolvido para fins acadêmicos como parte da disciplina **Front-End Design Engineering** da FIAP.

---

## 🙏 Agradecimentos

- FIAP - Faculdade de Informática e Administração Paulista
- Hospital das Clínicas (HC) - Referência para o projeto

---

<div align="center">

**Desenvolvido com ❤️ pela equipe HC BRIDGE**

🚨 **HC BRIDGE** - Assistente Virtual para Emergências Médicas 24/7

</div>
