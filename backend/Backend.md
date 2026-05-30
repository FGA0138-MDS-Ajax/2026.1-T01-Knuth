# Backend - Guia de Execução

Este arquivo explica, passo a passo, como preparar o ambiente e rodar o backend deste projeto em uma máquina nova.

## O que este backend usa

- `Python` para a aplicação.
- `Django` como framework web.
- `PostgreSQL` como banco de dados.
- `django-cors-headers` para permitir que o frontend acesse a API.

## O que você precisa ter instalado antes

1. **Python** na versão compatível com o projeto.
2. **pip** para instalar dependências.
3. **PostgreSQL** rodando localmente ou via **Docker**.
4. Um terminal no Windows, como **PowerShell**.

Se você for usar PostgreSQL com Docker, verifique se o Docker está instalado e funcionando.

## Onde fica o projeto

O backend fica na pasta:

backend/

É dentro dessa pasta que você deve rodar os comandos de instalação e execução.

## Arquivo de ambiente

O backend lê as variáveis de conexão com o banco a partir de um arquivo `.env` dentro da pasta `backend/`.

Exemplo:

```env
DB_NAME=exemplo
DB_USER=seuUsuario
DB_PASSWORD=suaSenha
DB_PORT=1234
```

## Passo a passo para rodar pela primeira vez

### 1. Abrir o terminal na pasta do backend

No Windows, abra o PowerShell ou o terminal do VS Code e entre na pasta do backend:

```powershell
cd "c:\seuComputador\backend"
```

### 2. Ativar o ambiente virtual

Se o ambiente virtual já existir, ative com:

```powershell
.\.venv\Scripts\Activate.ps1
```

Se a pasta `.venv` ainda não existir, crie antes com:

```powershell
python -m venv .venv
```

### 3. Instalar as dependências

Depois de ativar o ambiente virtual, instale os pacotes do projeto:

```powershell
pip install -r requirements.txt
```

O que isso faz:

- lê o arquivo `requirements.txt`;
- instala `Django`, `psycopg2-binary`, `python-dotenv`, `django-cors-headers` e as outras dependências;
- deixa o ambiente pronto para rodar o servidor.

### 4. Garantir que o PostgreSQL esteja rodando

O backend precisa conseguir se conectar ao banco configurado no `.env`.

Um exemplo de arquivo `.env` é:

```env
DB_NAME=exemplo
DB_USER=seuUsuario
DB_PASSWORD=suaSenha
DB_PORT=1234
```

Isso significa, na prática:

- `DB_NAME`: nome do banco que o Django vai usar;
- `DB_USER`: usuário do PostgreSQL;
- `DB_PASSWORD`: senha desse usuário;
- `DB_PORT`: porta do banco.

Se você estiver usando Docker, um exemplo de container é:

```powershell
docker run --name exemplo-postgres -e POSTGRES_USER=seuUsuario -e POSTGRES_PASSWORD=suaSenha -e POSTGRES_DB=exemplo -p 1234:5432 -d postgres:16
```

Se você já tiver o PostgreSQL instalado localmente, basta garantir que o serviço esteja ativo e que o banco exista com os mesmos dados definidos no `.env`.

### 5. Aplicar as migrations

Antes de subir o servidor, crie as tabelas padrão do Django:

```powershell
python manage.py migrate
```



### 7. Rodar o servidor de desenvolvimento

Depois de tudo pronto, inicie o backend com:

```powershell
python manage.py runserver 8000
```

O Django vai mostrar algo como:

```text
Starting development server at http://127.0.0.1:8000/
```

## Resumo rápido

Se você for pegar este projeto do zero, faça exatamente isto:

```powershell
cd "C:\Seu computador\backend"
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

