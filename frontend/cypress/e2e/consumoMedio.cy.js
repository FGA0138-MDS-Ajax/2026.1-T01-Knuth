describe('Módulo de Consumo Médio Mensal (Testes de Sistema E2E)', () => {

  beforeEach(() => {
    // 1. O robô entra na página de login primeiro
    cy.visit('http://localhost:5173/login');

    // 2. Preenche os campos utilizando as credenciais fornecidas
    cy.get('input[type="text"]').first().type('teste1@gmail.com');
    cy.get('input[type="password"]').type('novotestando1');

    // 3. Envia o formulário clicando no botão com o texto exato do componente LoginForms
    cy.get('button[type="submit"]').contains('Entrar na plataforma').click();

    // 4. Garante que o login passou (a URL mudou) e navega para a tela privada de consumo
    cy.url().should('not.include', '/login');
    cy.visit('http://localhost:5173/consumo-medio');
  });

  // ==============================================================================
  // 1. CAMINHO CORRETO - FLUXO PRINCIPAL DE USO DO MÓDULO DE CONSUMO MÉDIO
  // ==============================================================================
  it('Deve preencher os dados, calcular a média com sucesso e renderizar o gráfico', () => {
    // 1. Digita o título da simulação (baseado no placeholder do seu PaginaConsumoMedio.jsx)
    cy.get('input[placeholder="Ex.: Casa - 1º semestre"]').type('Minha Casa UnB');

    // 2. Garante que o período padrão é de 3 meses e preenche os inputs numéricos correspondentes
    cy.get('select').should('have.value', '3');
    cy.get('input[placeholder="Mês 1"]').type('150');
    cy.get('input[placeholder="Mês 2"]').type('200');
    cy.get('input[placeholder="Mês 3"]').type('250');

    // 3. Clicar no botão de Calcular Média para gerar os dados visuais
    cy.get('button').contains('Calcular Média').click();

    // 4. Validações Visuais do resultado gerado em tela
    cy.get('p').contains('Consumo médio mensal').should('be.visible');
    cy.get('p').contains('200.00').should('be.visible');

    // Busca o texto do total contido dentro da tag <p> do componente
    cy.get('span').contains('Total: ').should('be.visible').and('contain', '600.00 kWh');

    // 5. Garante que o gráfico do Chart.js (tag <canvas>) foi renderizado na árvore DOM
    cy.get('canvas').should('be.visible');

    // 6. Clica no botão para Salvar Simulação
    cy.get('button').contains('Salvar Simulação').click();

    // 7. Valida se a mensagem de sucesso do seu React apareceu em tela antes do redirecionamento
    cy.get('div').contains('Simulação salva com sucesso! Redirecionando...').should('be.visible');
  });

  // ==============================================================================
  // 2. CAMINHOS ALTERNATIVOS E DE ERRO
  // ==============================================================================
  it('Deve mostrar erro se o usuário tentar enviar campos vazios', () => {
    // Preenche apenas dois meses e deixa o segundo vazio de propósito
    cy.get('input[placeholder="Mês 1"]').type('150');
    cy.get('input[placeholder="Mês 3"]').type('200');

    // Clica primeiro para disparar a validação local do React
    cy.get('button').contains('Calcular Média').click();

    // Valida a mensagem disparada localmente pelo seu estado setErro
    cy.get('div')
      .contains('Preencha o consumo de todos os meses com valores numéricos.')
      .should('be.visible');
  });

  it('Deve mostrar o erro de negócio vindo do Backend quando o valor for menor que 10 kWh', () => {
    // Preenche todos os campos, mas coloca um valor abaixo do limite aceito pela regra (< 10)
    cy.get('input[placeholder="Mês 1"]').type('5');
    cy.get('input[placeholder="Mês 2"]').type('150');
    cy.get('input[placeholder="Mês 3"]').type('200');

    // Força o clique para enviar a requisição e aguarda o erro da API backend
    cy.get('button').contains('Calcular Média').click();

    // Captura o alerta vermelho que renderiza o texto exato retornado pelo seu backend
    cy.get('div')
      .should('be.visible')
      .and('contain', 'O consumo mínimo aceito é de 10 kWh.');
  });

  it('Deve alterar dinamicamente a quantidade de inputs na tela ao mudar o select de meses', () => {
    // Seleciona a opção de 6 meses no dropdown
    cy.get('select').select('6');

    // Valida se o laço de repetição .map() do seu React gerou os novos campos em tempo real
    cy.get('input[placeholder="Mês 1"]').should('be.visible');
    cy.get('input[placeholder="Mês 4"]').should('be.visible');
    cy.get('input[placeholder="Mês 6"]').should('be.visible');

    // Garante que o input do Mês 7 não existe na interface
    cy.get('input[placeholder="Mês 7"]').should('not.exist');
  });
});