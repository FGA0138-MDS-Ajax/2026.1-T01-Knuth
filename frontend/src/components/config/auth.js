// Controle simples de sessão no frontend.
// A autenticação "de verdade" é a sessão do Django (cookie). Aqui guardamos
// apenas um indicador local para decidir o que mostrar e proteger rotas.

import { limparProgressoLocal } from './progressoModulos'
import { limparEmblemasLocais } from './emblemas'


const CHAVE_USUARIO = 'user_name'
const CHAVE_ADMIN = 'is_admin' // Adicionada chave para identificar administradores

export function estaLogado() {
  return Boolean(localStorage.getItem(CHAVE_USUARIO))
}

export function getNomeUsuario() {
  return localStorage.getItem(CHAVE_USUARIO) || ''
}

// ✅ Aqui está a função que estava faltando e causando a tela branca!
export function ehAdmin() {
  return localStorage.getItem(CHAVE_ADMIN) === 'true'
}

// Atualizado para receber e salvar também se é admin (útil na hora do login)
export function salvarSessao(nomeUsuario, isAdmin = false) {
  if (nomeUsuario) {
    localStorage.setItem(CHAVE_USUARIO, nomeUsuario)
    localStorage.setItem(CHAVE_ADMIN, String(isAdmin))
  }
}

export function encerrarSessao() {
  localStorage.removeItem(CHAVE_USUARIO)
  localStorage.removeItem(CHAVE_ADMIN) // Garante que o status de admin também seja apagado

  // Limpa o cache de progresso e de emblemas para não vazar para o próximo usuário
  limparProgressoLocal()
  limparEmblemasLocais()
}