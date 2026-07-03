describe('Fluxo Sequencial de Autenticação (E2E) - Foco Visual', () => {

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Deve registrar, logar e testar o fluxo visual de recuperar senha', () => {

    // --- 1. CRIAR A CONTA ---
    cy.visit('http://localhost:5173/login');
    cy.contains('Criar conta').click();
    cy.url().should('include', '/register');

    cy.get('input[type="text"]').first().clear().type('Gabriel Silva');
    cy.get('input[type="email"]').clear().type('gabriel@aluno.unb.br');
    cy.get('input[type="password"]').first().clear().type('SenhaMestre123!');
    cy.get('input[type="password"]').eq(1).clear().type('SenhaMestre123!');

    // Botão conforme identificado no RegisterForm.jsx
    cy.get('button[type="submit"]').contains('Criar conta gratuita').click();

    // O sistema redireciona para o login após sucesso
    cy.url().should('include', '/login');


    // --- 2. LOGAR ---
    cy.get('#username').clear().type('gabriel@aluno.unb.br');
    cy.get('input[type="password"]').clear().type('SenhaMestre123!');
    cy.get('button[type="submit"]').contains('Entrar na plataforma').click();

    // Confirmamos que logou (saiu da tela de login)
    cy.url().should('not.include', '/login');


    // --- 3. RECUPERAR A SENHA (TESTE VISUAL) ---
    cy.visit('http://localhost:5173/login');
    cy.get('a[href="/esqueceu-sua-senha"]').contains('Esqueceu sua senha?').click();
    cy.url().should('include', '/esqueceu-sua-senha');

    cy.get('input[type="email"]').clear().type('gabriel@aluno.unb.br');

    // Clique no botão de envio
    cy.get('button[type="submit"]').contains('Enviar instruções').click();

    // Como o seu React muda o estado local 'enviado' para true,
    // validamos se a mensagem de sucesso aparece na tela (comportamento visual)
    cy.contains('E-mail enviado com sucesso!').should('be.visible');
    cy.contains('Verifique sua caixa de entrada para redefinir sua senha.').should('be.visible');

    // O formulário original deve ter sumido (não deve mais existir o botão "Enviar instruções")
    cy.contains('Enviar instruções').should('not.exist');
  });
});