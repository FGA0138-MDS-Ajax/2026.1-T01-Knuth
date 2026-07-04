describe('Fluxo do Administrador (Testes de Sistema E2E)', () => {

  beforeEach(() => {
    cy.viewport(1280, 720);
    // 1. O robô entra na página de login usando a URL completa
    cy.visit('http://localhost:5173/login');

    // 2. Preenche os campos usando a exata mesma lógica dos seus outros testes
    cy.get('#username').clear().type('adminKnuth');
    cy.get('input[type="password"]').clear().type('adminKnuth123');

    // 3. Clica no botão de entrar
    cy.get('button[type="submit"]').contains('Entrar na plataforma').click();

    // 4. Garante que o login passou aguardando o redirecionamento
    cy.url().should('include', '/home');

    // Garante que o admin foi reconhecido no localStorage
    cy.window().its('localStorage').invoke('getItem', 'is_admin').should('eq', 'true');
  });

  // ==============================================================================
  // 1. ACESSO AO PAINEL PELO NAVBAR
  // ==============================================================================
  it('Deve acessar o painel administrativo através do Navbar', () => {
    // Procura o link exato do painel e clica
    cy.get('nav').contains('Painel Admin').click();

    // Verifica se a URL mudou
    cy.url().should('include', '/admin');

    // Verifica a mensagem de boas-vindas do Dashboard
    cy.contains('Olá, adminKnuth').should('be.visible');
  });

  // ==============================================================================
  // 2. NAVEGAÇÃO DA SIDEBAR (ASIDE)
  // ==============================================================================
  it('Deve navegar por todas as subpáginas de gestão via Sidebar', () => {
    // Força a URL completa do admin
    cy.visit('http://localhost:5173/admin');

    // 1. Bandeiras tarifárias
    cy.get('aside').contains('Bandeiras tarifárias').click();
    cy.url().should('include', '/admin/bandeiras');
    cy.contains('h2', 'Bandeiras tarifárias').should('be.visible');

    // 2. Eletrodomésticos
    cy.get('aside').contains('Eletrodomésticos').click();
    cy.url().should('include', '/admin/eletrodomesticos');
    cy.contains('h2', 'Eletrodomésticos').should('be.visible');

    // 3. Módulos educativos
    cy.get('aside').contains('Módulos educativos').click();
    cy.url().should('include', '/admin/modulos');
    cy.contains('h2', 'Módulos educativos').should('be.visible');

    // 4. Quizzes
    cy.get('aside').contains('Quizzes').click();
    cy.url().should('include', '/admin/quizzes');
    cy.contains('h2', 'Quizzes').should('be.visible');
  });

  // ==============================================================================
  // 3. FLUXO CRUD (CRIAR E DELETAR)
  // ==============================================================================
  it('Deve criar e excluir um Eletrodoméstico de teste (Fluxo CRUD completo)', () => {
    cy.visit('http://localhost:5173/admin/eletrodomesticos');

    // --- 1. CRIAÇÃO ---
    cy.contains('button', 'Novo').click();
    cy.contains('h3', 'Novo — Eletrodomésticos').should('be.visible');

    cy.wait(500); // Pausa para animação do modal do React

    // Preenche os campos usando as labels
    cy.contains('label', 'Nome').parent().find('input').type('Geladeira de Teste Cypress');
    cy.contains('label', 'Potência média').parent().find('input').type('400');
    cy.contains('label', 'Tempo médio').parent().find('input').clear().type('120');

    // Salva o formulário
    cy.contains('button', 'Salvar').click();

    // Aguarda atualizar a tabela
    cy.contains('td', 'Geladeira de Teste Cypress').should('be.visible');

    // --- 2. EXCLUSÃO ---
    // Busca na linha e exclui
    cy.contains('tr', 'Geladeira de Teste Cypress')
      .contains('button', 'Excluir')
      .click();

    cy.contains('h3', 'Confirmar exclusão').should('be.visible');

    cy.wait(500); // Pausa para o modal de exclusão abrir

    // Confirma no botão vermelho do modal
    cy.get('.bg-red-600').contains('Excluir').click();

    // Verifica que não existe mais na tela
    cy.contains('td', 'Geladeira de Teste Cypress').should('not.exist');
  });
});