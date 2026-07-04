# EducaEnergia

O projeto está alocado na branch developer.

Plataforma web responsiva voltada para **simulação de consumo energético residencial** e **educação ambiental**, desenvolvida na disciplina **Métodos de Desenvolvimento de Software (MDS)** – Turma 01, 2026.1.

O projeto integra dois pilares principais:
-  **Simulação e Controle**: cálculo de consumo e custo de aparelhos elétricos.
-  **Educação Ambiental**: conteúdos interativos sobre eficiência energética e fontes renováveis.
  
---

## Objetivos

-   Permitir que famílias brasileiras compreendam e controlem seu consumo de energia elétrica.
-   Apoiar educadores e estudantes com recursos pedagógicos práticos e interativos.
-   Incentivar hábitos sustentáveis por meio de gamificação e feedback visual.
-   Garantir acessibilidade e responsividade em qualquer dispositivo.

---

## Tecnologias Utilizadas

-   **Frontend**: HTML, CSS, JavaScript
-   **Backend**: Python (Flask/Django)
-   **Banco de Dados**: PostgreSQL / MySQL (dependendo da fase do projeto)
-   **Infraestrutura**: Hospedagem em nuvem (AWS, Azure, Vercel)
-   **Arquitetura**: MVC (Model-View-Controller) + camada de Services
-   **DevOps**: Docker (para conteinerização e deploy)

---

## Arquitetura

O sistema segue o padrão **MVC**:
- **Model**: gerenciamento de dados (usuários, aparelhos, consumo, conteúdos, quizzes).  
- **View**: interface responsiva para usuários desktop e mobile.  
- **Controller**: lógica de autenticação, rotas e coordenação entre camadas.  
- **Services**: motor de cálculo energético e regras de negócio.

Fluxo básico:

1.  Usuário cadastra aparelho →
2.  Controller recebe requisição →
3.  Model salva no banco →
4.  Service calcula consumo/custo →
5.  Resultado exibido na View.

---

## Equipe

-   **Alicia Doralice de Medeiros Maia** – Product Owner (PO)
-   **Angeline Izaura de Lima Melo** – Analista de Qualidade
-   **Beatriz Brandão Fidelis Batista** – Desenvolvedora Backend
-   **Bruno Ferreira Dornelas** – Desenvolvedor Backend
-   **Caio Breno De Souza Bezerra** – Desenvolvedor Frontend
-   **Danielly Reis dos Santos** – Desenvolvedora Backend
-   **Gabriel Martins de Jesus da Silva** – Desenvolvedor Backend
-   **Giovana Ferreira dos Santos** – Desenvolvedora Frontend
-   **Jônatas Davi Oliveira Farias** – Desenvolvedor Backend
-   **Jorge Henrique Torres Gargalhone** – Desenvolvedor Backend
-   **Kalebe Davi Sarmento da Silva** – Desenvolvedor Backend
-   **Leonardo Lopes Cruz** – Desenvolvedor Frontend

---

## Backlog (Resumo)

-   Cadastro de usuários e autenticação.
-   Cadastro de aparelhos e simulação de consumo.
-   Módulo educativo com conteúdos e quizzes.
-   Sistema de pontuação e emblemas.
-   Relatórios de consumo e sugestões de economia.

---

## Testes

-   Testes funcionais (cálculo de consumo, cadastro, login).
-   Testes de usabilidade (interface responsiva e intuitiva).
-   Testes de compatibilidade (navegadores e dispositivos móveis).

---

## Instalação e Execução

### Pré-requisitos

-   [Python 3.10+](https://www.python.org/downloads/)
-   [Node.js](https://nodejs.org/)
-   [PostgreSQL](https://www.postgresql.org/download/) ou MySQL
-   [Docker](https://www.docker.com/) (opcional)
-   Git

---

### Clonando o projeto

```bash
git clone https://github.com/FGA0138-MDS-Ajax/2026.1-T01-Knuth.git
cd 2026.1-T01-Knuth
```
