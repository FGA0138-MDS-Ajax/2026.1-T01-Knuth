describe('Módulo de Análise de Consumo - RF05 (Testes de Sistema E2E)', () => {

  beforeEach(() => {
    // 1. O robô entra na página de login primeiro
    cy.visit('http://localhost:5173/login');

    // 2. Preenche os campos utilizando as credenciais fornecidas
    cy.get('input[type="text"]').first().type('teste1@gmail.com');
    cy.get('input[type="password"]').type('novotestando1');

    // 3. Envia o formulário clicando no botão para entrar
    cy.get('button[type="submit"]').contains('Entrar na plataforma').click();

    // 4. Garante que o login passou esperando o painel carregar
    cy.url().should('include', '/home');
    cy.contains('Painel de Consumo').should('be.visible');

    // 5. Navega clicando no elemento do menu superior
    cy.get('nav, header').contains('Análise de Consumo').click();

    // 6. Certifica-se de que a página de análise carregou o cabeçalho correto
    cy.get('h1').contains('Análise de Consumo').should('be.visible');
  });

  // ==============================================================================
  // 1. CAMINHO CORRETO - FLUXO PRINCIPAL DE USO DA ANÁLISE DE CONSUMO
  // ==============================================================================
  it('Deve preencher o consumo real, selecionar aparelhos, calcular metas e exibir impacto financeiro', () => {
    // 1. Digita o consumo real (Ex: 500 kWh para garantir cenário de excesso/acima do ideal)
    cy.get('input[placeholder="Ex.: 250"]').type('500');

    // 2. CORREÇÃO DO CHECKBOX: Usamos Regex ignorando maiúsculas/minúsculas e hífens para clicar na label
    cy.contains('label', /ar condicionado/i).find('input[type="checkbox"]').check();
    cy.contains('label', /chuveiro/i).find('input[type="checkbox"]').check();

    // 3. Valida se o bloco intermediário de estimativas individuais por aparelho apareceu na tela
    cy.contains('h3', 'Estimativa de Uso por Aparelho Selecionado').should('be.visible');

    // 4. Clica no botão de submissão para chamar o motor de cálculo do Backend
    cy.contains('button', 'Analisar consumo').should('not.be.disabled').click();

    // 5. Validações Visuais do Diagnóstico retornado pelo Backend
    // Se o seu backend retornar acima_do_ideal, o front renderiza como "acima do ideal"
    cy.contains('span', /acima do ideal/i).should('be.visible');

    // 6. Valida se os cards de impacto financeiro baseados no useMemo renderizaram os valores
    cy.contains('p', 'Custo Atual Estimado').parent().should('contain', 'R$ 425.00');
    cy.contains('p', 'Economia Possível').parent().should('contain', '- R$');
    cy.contains('p', 'Novo Custo Estimado').parent().should('contain', 'R$');
  });

  // ==============================================================================
  // 2. CAMINHOS ALTERNATIVOS E DE ERRO
  // ==============================================================================
  it('Deve manter o botão de analisar desabilitado até que as condições mínimas do formulário sejam cumpridas', () => {
    // 1. Inicia desabilitado (tudo vazio)
    cy.contains('button', 'Analisar consumo').should('be.disabled');

    // 2. Preenche apenas o consumo, mas sem aparelhos -> continua desabilitado
    cy.get('input[placeholder="Ex.: 250"]').type('250');
    cy.contains('button', 'Analisar consumo').should('be.disabled');

    // 3. Limpa o consumo e marca apenas um aparelho -> continua desabilitado
    cy.get('input[placeholder="Ex.: 250"]').clear();
    cy.contains('label', /geladeira/i).find('input[type="checkbox"]').check();
    cy.contains('button', 'Analisar consumo').should('be.disabled');
  });
});