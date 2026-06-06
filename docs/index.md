# 📖 Guia de Configuração do Repositório de Documentação (MkDocs)

Este guia padroniza o ambiente de desenvolvimento, garantindo que todos os membros da equipe possam editar, visualizar e publicar o conteúdo Markdown usando o **MkDocs com o tema Material**.

Link do site: https://FGA0138-MDS-Ajax.github.io/2026.1-T01-Knuth

## 1. ⚙️ Pré-Requisitos

Certifique-se de ter instalado no seu sistema:

* **Python 3:** Instalado e no seu `PATH`.
* **Git:** Instalado.

### 1.1. 🔽 Clonando o Repositório

Antes de configurar o ambiente, clone a branch de documentação do repositório para a sua máquina e entre na pasta:

```bash
git clone -b docs https://github.com/FGA0138-MDS-Ajax/2026.1-T01-Knuth.git
cd 2026.1-T01-Knuth
```

-----

## 2. 🐍 Configuração do Ambiente Python (Venv)

É crucial isolar as dependências em um Ambiente Virtual (`venv`) para evitar conflitos com o Python do sistema.

### 2.1. Criação do Venv

Abra o terminal na raiz do repositório (`2026.1-T01-Knuth`) e execute:

```bash
# Cria a pasta 'venv' para isolamento
python3 -m venv venv
```

### 2.2. Ativação do Venv

**Atenção:** O prompt do seu terminal deve mostrar **`(venv)`** após a ativação.

| Sistema Operacional | Terminal (Shell) | Comando de Ativação |
| :--- | :--- | :--- |
| **Windows** | PowerShell (PS) | `.\venv\Scripts\activate` |
| **Windows** | CMD / Git Bash | `.\venv\Scripts\activate` |
| **Linux/macOS** | Bash / Zsh | `source venv/bin/activate` |

-----

## 3. 📦 Instalação das Dependências

Com o ambiente virtual **ativo** (`(venv)` visível), instale as bibliotecas necessárias.

### 3.1. Instalação (Primeiro Desenvolvedor e Demais)

O repositório deve ter um arquivo **`requirements.txt`** contendo apenas as dependências principais (`mkdocs` e `mkdocs-material`).

> **Nota:** Usamos `python -m pip` para garantir que o **pip correto** do ambiente virtual seja chamado, evitando o erro `externally-managed-environment`.

**Se o arquivo `requirements.txt` já existir no repositório:**

```bash
# Instala todas as dependências principais e suas sub-dependências.
(venv) $ python -m pip install -r requirements.txt
```

**Se o arquivo `requirements.txt` NÃO existir:**

```bash
# 1. Instala o MkDocs e o tema Material (e outras extensões necessárias)
(venv) $ python -m pip install mkdocs mkdocs-material mkdocs-get-deps==0.2.0

# 2. CRIA o arquivo requirements.txt com APENAS as dependências principais:
(venv) $ echo "mkdocs" > requirements.txt
(venv) $ echo "mkdocs-material" >> requirements.txt
(venv) $ echo "mkdocs-get-deps==0.2.0" >> requirements.txt
```

-----

## 4. 📝 Fluxo de Trabalho (Escrever e Visualizar)

### 4.1. Edição e Criação

Todos os arquivos de documentação devem ser escritos em formato **Markdown (`.md`)** e salvos dentro da pasta `docs/`.

### 4.2. Configuração do Menu (Exemplo Prático)

Sempre que um novo arquivo for criado, edite o arquivo **`mkdocs.yml`** (na raiz do repositório) para incluí-lo na seção `nav:` e garantir que ele apareça no menu de navegação do site.

**Passo 1:** Crie o arquivo dentro da pasta `docs/`. Exemplo: `docs/arquitetura/visao-geral.md`.

**Passo 2:** Abra o `mkdocs.yml` e adicione o caminho relativo à pasta `docs/`.

Se a estrutura original do seu `mkdocs.yml` for esta:
```yaml
nav:
  - Home: index.md
  - Exemplo: exemplo.md
```

Para adicionar a nova página dentro de uma subseção chamada "Arquitetura", modifique o arquivo para:
```yaml
nav:
  - Home: index.md
  - Exemplo: exemplo.md
  - PastaExemplo:
    - SubPastaExemplo: SubPastaExemplo/SubPastaExemplo.md
```

> ⚠️ **Atenção com a Indentação:** O formato YAML é extremamente sensível a espaços. Use sempre **espaços** e nunca a tecla *Tab* para fazer o alinhamento dos submenus.

### 4.3. Visualização Local (Servidor de Desenvolvimento)

Para ver as alterações em tempo real no seu navegador, execute:

```bash
(venv) $ mkdocs serve
```

O servidor iniciará (geralmente em `http://127.0.0.1:8000/`). O MkDocs monitora arquivos e recarrega automaticamente. Para parar o servidor, volte ao terminal e pressione **`Ctrl + C`**.

-----

## 5. 🚀 Publicação e Versionamento (Git)

Depois de verificar a documentação localmente e garantir que está pronta para ser compartilhada:

### 5.1. Publicar no GitHub Pages (Deploy)

Este comando gera o site HTML final e o envia para a *branch* de publicação (`gh-pages`).

```bash
(venv) $ python -m mkdocs gh-deploy --force
```

### 5.2. Comitar o Conteúdo Fonte (Markdown)

É crucial que os arquivos Markdown fonte (`.md` e o `mkdocs.yml`) sejam comitados na *branch* /docs:

```bash
# Adiciona todos os arquivos novos e modificados (exceto os ignorados pelo .gitignore)
git add .

# Usa Conventional Commits (tipo 'docs' para documentação)
git commit -m "docs(feature): Adiciona [Breve descrição]"

# Envia para o repositório
git push origin docs
```