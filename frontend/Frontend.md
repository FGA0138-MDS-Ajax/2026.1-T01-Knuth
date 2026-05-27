# Frontend - Guia de Execução

Este arquivo explica, passo a passo, como qualquer pessoa deve preparar o ambiente e rodar o frontend deste projeto em uma máquina nova.

## O que este frontend usa

- `React` para a interface.
- `Vite` como servidor de desenvolvimento e build.
- `react-router-dom` para navegação entre rotas.
- `Tailwind CSS` e `@tailwindcss/vite` para estilos utilitários.

## O que você precisa ter instalado antes

1. **Node.js** na versão LTS recomendada.
2. **npm** junto com o Node.js.
3. Um editor como o **VS Code**.

Se você não tem o Node.js instalado, baixe em:

- https://nodejs.org/

Depois de instalar, confira se está tudo certo com:

```bash
node -v
npm -v
```

## Onde fica o projeto

O frontend fica na pasta:

```text
frontend/
```

É dentro dessa pasta que você deve rodar os comandos de instalação e execução.

## Passo a passo para rodar pela primeira vez

### 1. Abrir o terminal na pasta do frontend

No Windows, você pode abrir o PowerShell ou o terminal do VS Code e entrar na pasta do frontend:

```bash
cd "c:\Users\Leonardo\Documents\2026.1-T01-Knuth\frontend"
```

### 2. Instalar as dependências

Esse comando baixa tudo que o projeto precisa para funcionar localmente:

```bash
npm install
```

O que isso faz:

- lê o `package.json`;
- baixa `react`, `react-dom`, `vite`, `tailwindcss`, `react-router-dom` e outras dependências;
- cria a pasta `node_modules`.

### 3. Rodar o servidor de desenvolvimento

Depois de instalar, inicie o projeto com:

```bash
npm run dev
```

O Vite vai mostrar algo como:

```text
Local: http://localhost:5173/
```

### 4. Abrir no navegador

Abra o endereço mostrado no terminal, normalmente:

- `http://localhost:5173/`
- `http://localhost:5173/login`
- `http://localhost:5173/home`

## O que cada rota faz hoje

- `/` redireciona para `/login`.
- `/login` mostra a tela de autenticação.
- `/home` mostra uma tela simples de exemplo.
- qualquer rota desconhecida também cai em `/login`.

## Comandos úteis no dia a dia

### Rodar o projeto

```bash
npm run dev
```

### Gerar build de produção

```bash
npm run build
```

Esse comando gera a versão otimizada da aplicação em `dist/`.

### Pré-visualizar a build

```bash
npm run preview
```

## Sobre o arquivo `.env`

Hoje, **este frontend ainda não depende de backend**, então **não é obrigatório ter um `.env` agora**.

Mesmo assim, é boa prática preparar o projeto para o futuro. Quando o backend existir, você provavelmente vai usar uma variável como:

```env
VITE_API_URL=http://localhost:3000
```

Essa variável serve para apontar o frontend para a API do backend sem precisar alterar o código toda hora.

### Qual arquivo usar

Para projetos Vite, o mais comum é usar:

- `.env.local` para desenvolvimento local
- `.env.example` para mostrar quais variáveis existem

O arquivo `.env.local` é o ideal para cada pessoa colocar o endereço da sua API sem enviar isso para o Git.

## Exemplo de fluxo quando o backend existir

1. O usuário abre `/login`.
2. Preenche email e senha.
3. O frontend envia os dados para a API.
4. A API valida e responde com sucesso ou erro.
5. O frontend redireciona o usuário para a área logada.

## Estrutura principal do frontend

- `src/main.jsx` monta a aplicação.
- `src/App.jsx` define as rotas.
- `src/components/auth/AuthScreen.jsx` monta a tela de login.
- `src/components/auth/LoginForms.jsx` renderiza o formulário.

## Problemas comuns e como resolver

### O projeto não abre

- Confira se você rodou `npm install` dentro da pasta `frontend`.
- Confira se `npm run dev` está rodando sem erro.
- Veja se a porta `5173` não está sendo usada por outro processo.

### A tela fica em branco

- Abra o console do navegador com `F12`.
- Veja se existe erro de importação ou erro de rota.
- Confirme que você acessou `/login`.

### O login não funciona

- Isso é esperado por enquanto se o backend ainda não foi conectado.
- O foco atual é apenas a tela e a navegação.

## Resumo rápido

Se você for pegar este projeto do zero, faça exatamente isto:

```bash
cd "c:\Users\Leonardo\Documents\2026.1-T01-Knuth\frontend"
npm install
npm run dev
```

Depois abra `http://localhost:5173/login`.

