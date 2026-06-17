describe('Módulo de Eletrodomésticos (Testes de Sistema E2E)', () => {

  beforeEach(() => {
    // 1. O robô entra na página de login primeiro
    cy.visit('http://localhost:5173/login'); //

    // 2. Preenche os campos utilizando as credenciais fornecidas
    cy.get('input[type="text"]').first().type('teste1@gmail.com'); //
    cy.get('input[type="password"]').type('novotestando1'); //

    // 3. Envia o formulário clicando no botão de submit
    cy.get('button[type="submit"]').contains('Entrar na plataforma').click(); //

    // 4. Garante que o login passou e navega para a tela de consulta de eletrodomésticos
    cy.url().should('not.include', '/login'); //
    cy.visit('http://localhost:5173/eletrodomesticos');
  });

  // ==============================================================================
  // 1. FLUXO PRINCIPAL - LISTAGEM INICIAL DO TOP 10
  // ==============================================================================
  it('Deve carregar a página e exibir o catálogo inicial dos mais comuns (Top 10)', () => {
    // Garante que o título principal e as instruções estão em tela
    cy.get('h1').contains('Eletrodomésticos').should('be.visible'); //
    cy.get('h2').contains('Top 10 — mais comuns').should('be.visible'); //
    cy.get('span').contains('Destaque').should('be.visible'); //

    // Valida se a estrutura de cards de eletrodomésticos foi renderizada
    // (Garante que a mensagem de "Carregando" já sumiu e há itens visíveis)
    cy.get('p').contains('Carregando eletrodomésticos...').should('not.exist'); //
    cy.get('h3').should('have.length.at.least', 1); //
    cy.get('span').contains('W').should('be.visible'); //
  });

  // ==============================================================================
  // 2. CAMINHOS ALTERNATIVOS - BUSCA, DEBOUNCE E LIMPEZA
  // ==============================================================================
  it('Deve pesquisar um eletrodoméstico, alterar o título da seção e exibir o botão de limpar', () => {
    // Intercepta a requisição para garantir que o front-end chamou o backend após digitar
    cy.intercept('GET', '**/api/consumo/eletrodomesticos/?busca=*').as('requisicaoBusca');

    // Digita o termo no campo de busca utilizando o ID mapeado no html
    cy.get('#busca-eletrodomesticos').type('ventilador'); //

    // Como o seu código possui um setTimeout de 350ms (debounce), aguardamos a chamada da API
    cy.wait('@requisicaoBusca');

    // O cabeçalho deve mudar dinamicamente para "Resultados da busca"
    cy.get('h2').contains('Resultados da busca').should('be.visible'); //
    cy.get('span').contains('Destaque').should('not.exist'); //

    // O botão "Limpar" deve aparecer apenas porque há texto no campo
    cy.get('button').contains('Limpar').should('be.visible').click(); //

    // Após clicar em limpar, o input deve esvaziar e voltar para o Top 10 inicial
    cy.get('#busca-eletrodomesticos').should('have.value', ''); //
    cy.get('h2').contains('Top 10 — mais comuns').should('be.visible'); //
  });

  // ==============================================================================
  // 3. FLUXO DE ERRO/AVISO - BUSCA SEM RESULTADOS
  // ==============================================================================
  it('Deve renderizar o feedback visual de aviso quando nenhum item corresponder à busca', () => {
    cy.intercept('GET', '**/api/consumo/eletrodomesticos/?busca=*').as('buscaVazia');

    // Digita um termo aleatório que sabidamente não existirá no banco de dados
    cy.get('#busca-eletrodomesticos').type('AparelhoInexistenteXYZ123'); //

    cy.wait('@buscaVazia');

    // Valida se o contêiner de mensagem vazia mapeado pelo 'mensagemVazia' ou array vazio renderizou na tela
    // O seu front trata tanto a mensagem vinda da API (data.mensagem) quanto o array zerado.
    cy.get('body').then(($body) => {
      if ($body.text().includes('🔍')) {
        // Se o seu backend mandou uma string personalizada no JSON (ex: "Nenhum item correspondente")
        cy.get('div').contains('🔍').should('be.visible'); //
      } else {
        // Se a API retornou o array vazio puramente
        cy.get('p').contains('Nenhum eletrodoméstico encontrado.').should('be.visible'); //
      }
    });
  });
});