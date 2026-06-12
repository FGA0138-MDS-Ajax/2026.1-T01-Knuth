// Controle simples de sessão no frontend.
// A autenticação "de verdade" é a sessão do Django (cookie). Aqui guardamos
// apenas um indicador local para decidir o que mostrar e proteger rotas.

const CHAVE_USUARIO = 'user_name'

export function estaLogado() {
  return Boolean(localStorage.getItem(CHAVE_USUARIO))
}

export function getNomeUsuario() {
  return localStorage.getItem(CHAVE_USUARIO) || ''
}

export function salvarSessao(nomeUsuario) {
  if (nomeUsuario) {
    localStorage.setItem(CHAVE_USUARIO, nomeUsuario)
  }
}

export function encerrarSessao() {
  localStorage.removeItem(CHAVE_USUARIO)
}
