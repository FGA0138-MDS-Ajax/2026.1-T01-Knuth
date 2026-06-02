# Backend - Guia de Execução
Este arquivo explica, passo a passo, como preparar o ambiente e rodar o backend deste projeto em uma máquina nova.

## O que este backend usa

- `Python` para a aplicação.
- `Django` como framework web.
- `PostgreSQL` como banco de dados.
- `django-cors-headers` para permitir que o frontend acesse a API.
- `Docker` para padronização do ambiente.
- `Docker Compose` para orquestração dos serviços (backend + banco de dados).

## O que você precisa ter instalado antes

1. **Docker**.
2. **Docker compose**. (Geralmente já incluso no Docker Desktop).
3. **Python 3.12** (Caso queira rodar localmente).
4. **pip** (Para instalar as dependências).
5. **PostgreSQL** (Caso queira rodar localmente sem Docker).
6. Um terminal de sua preferência.


## Onde fica o projeto
O backend fica na pasta:

2026.1-T01-Knuth/backend/

É dentro dessa pasta que você deve rodar os comandos de instalação e execução.

```bash
#Windows
cd c:\seuComputador\2026.1-T01-Knuth\backend

#Linux/masOS
cd ~/2026.1-T01-Knuth/backend
```

## Arquivos importantes
- **Dockerfile**: define como construir a imagem do backend.
- **docker-compose.yml**: orquestra os serviços (banco de dados e backend).
- **.env**: contém as variáveis de ambiente (opcional, pois o compose já define algumas).
- **requirements.txt**: lista as dependências Python.


## Rodando via o Docker Compose
Este método é o mais rápido, pois você não precisa instalar Python ou PostgreSQL na sua máquina física. O Docker resolve tudo.

### 1. Configurar o arquivo `.env`
Crie um arquivo chamado .env na raiz da pasta backend/ e adicione as configurações do banco (o Docker usará essas variáveis para criar o banco automaticamente):

```env
DB_NAME=banco_de_dados
DB_USER=seu_user
DB_PASSWORD=sua_senha
DB_HOST=host.docker.internal
DB_PORT=5432
```
Isso significa, na prática:
- `DB_NAME`: nome do banco que o Django vai usar;
- `DB_USER`: usuário do PostgreSQL;
- `DB_PASSWORD`: senha desse usuário;
- `DB_PORT`: porta do banco.


### 2. Configurar `docker-compose.yml`
Para que o comando `docker-compose up` funcione corretamente, certifique-se de que o arquivo `docker-compose.yml` na raiz do backend esteja estruturado da seguinte forma:

```yml
services:
  db:
    image: postgres:17
    restart: always
    environment:
      POSTGRES_DB: seu_banco_de_dados
      POSTGRES_USER: seu_user
      POSTGRES_PASSWORD: sua_senha
    ports:
      - "5432:5432"

  web:
    build: .
    depends_on:
      - db
    environment:
      DB_NAME: seu_banco_de_dados
      DB_USER: seu_user
      DB_PASSWORD: sua_senha
      DB_HOST: db
      DB_PORT: 5432
    ports:
      - "8000:8000"
```

### 3. Subir os containers
```Bash
docker-compose up --build
```

## Rodando Localmente
Use este método se preferir rodar o Python diretamente na sua máquina. Você precisará de um banco PostgreSQL ativo localmente.

### 1. Ativar o ambiente virtual

Se o ambiente virtual já existir, ative com:

```bash
#Windows
.\.venv\Scripts\Activate.ps1

#Linux/macOS
source .venv/bin/activate
```

Se a pasta `.venv` ainda não existir, crie antes com:

```bash
python -m venv .venv
```

### 2. Instalar as dependências

Depois de ativar o ambiente virtual, instale os pacotes do projeto:

```powershell
pip install -r requirements.txt
```

O que isso faz:

- lê o arquivo `requirements.txt`;
- instala `Django`, `psycopg2-binary`, `python-dotenv`, `django-cors-headers` e as outras dependências;
- deixa o ambiente pronto para rodar o servidor.

### 3. Garantir que o PostgreSQL esteja rodando

O backend precisa conseguir se conectar ao banco configurado no `.env`.

### 4. Aplicar as migrations
Antes de subir o servidor, crie as tabelas padrão do Django:
```powershell
python manage.py migrate
```

### 6. Rodar o servidor de desenvolvimento

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