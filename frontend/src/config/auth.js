// Controle simples de sessão no frontend.
// A autenticação "de verdade" é a sessão do Django (cookie). Aqui guardamos
// apenas um indicador local para decidir o que mostrar e proteger rotas.

import { limparProgressoLocal } from './progressoModulos'
import { limparEmblemasLocais } from './emblemas'

const CHAVE_USUARIO = 'user_name'
const CHAVE_ADMIN = 'user_is_admin'

export function estaLogado() {
  return Boolean(localStorage.getItem(CHAVE_USUARIO))
}

export function getNomeUsuario() {
  return localStorage.getItem(CHAVE_USUARIO) || ''
}

// Indica se o usuário logado é administrador.
// A fonte de verdade é o backend (403 nas rotas de admin). Aqui guardamos
// apenas um indicador local para decidir o que mostrar/esconder na interface.
export function ehAdmin() {
  return localStorage.getItem(CHAVE_ADMIN) === 'true'
}

// Aceita tanto a flag explícita `is_admin` quanto os campos padrão do Django
// (`is_staff` / `is_superuser`), para não depender de um nome específico.
export function extrairFlagAdmin(usuario) {
  if (!usuario) return false
  return Boolean(usuario.is_admin ?? usuario.is_staff ?? usuario.is_superuser)
}

export function salvarSessao(nomeUsuario, isAdmin = false) {
  if (nomeUsuario) {
    localStorage.setItem(CHAVE_USUARIO, nomeUsuario)
  }
  localStorage.setItem(CHAVE_ADMIN, isAdmin ? 'true' : 'false')
}

export function encerrarSessao() {
  localStorage.removeItem(CHAVE_USUARIO)
  localStorage.removeItem(CHAVE_ADMIN)
  // Limpa o cache de progresso e de emblemas para não vazar para o próximo usuário
  limparProgressoLocal()
  limparEmblemasLocais()
}
