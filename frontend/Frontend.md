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


frontend/


É dentro dessa pasta que você deve rodar os comandos de instalação e execução.

## Passo a passo para rodar pela primeira vez

### 1. Abrir o terminal na pasta do frontend

No Windows, você pode abrir o PowerShell ou o terminal do VS Code e entrar na pasta do frontend:

```bash
cd "c:\seu-computador\\frontend"
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
- `http://localhost:5173/register`

## O que cada rota faz hoje

- `/` redireciona para `/login`.
- `/login` mostra a tela de login.
- `/register` mostra uma tela simples de registro.
- qualquer rota desconhecida também cai em `/login`.

## Comandos úteis no dia a dia

### Rodar o projeto

```bash
npm run dev
```


## Resumo rápido

Se você for pegar este projeto do zero, faça exatamente isto:

```bash
cd "c:\seu-computador\frontend"
npm install
npm run dev
```

Depois abra `http://localhost:5173/login`.

