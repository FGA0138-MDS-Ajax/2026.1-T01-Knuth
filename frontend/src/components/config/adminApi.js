// Cliente HTTP do Painel Administrativo (RF10).
//
// Todas as rotas abaixo são protegidas no backend e devem exigir permissão de
// administrador. Para usuários comuns o backend responde 403 Forbidden — este
// cliente traduz isso em um erro claro (ErroAcessoNegado) para a interface.
//
// O contrato completo está documentado em: frontend/ADMIN_API_CONTRATO.md

import { apiUrl } from './api'

export class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

export class ErroAcessoNegado extends ErroApi {
  constructor(mensagem = 'Acesso negado: esta ação é exclusiva de administradores.') {
    super(mensagem, 403)
    this.name = 'ErroAcessoNegado'
  }
}

async function requisitar(caminho, { metodo = 'GET', corpo } = {}) {
  let resposta
  try {
    resposta = await fetch(apiUrl(caminho), {
      method: metodo,
      credentials: 'include',
      headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
    })
  } catch {
    throw new ErroApi(
      'Não foi possível conectar ao servidor. Verifique se o backend está rodando.',
      0,
    )
  }

  if (resposta.status === 403) {
    throw new ErroAcessoNegado()
  }

  // DELETE costuma responder 204 sem corpo.
  if (resposta.status === 204) return null

  let dados = null
  try {
    dados = await resposta.json()
  } catch {
    // Resposta sem corpo JSON — segue com dados = null.
  }

  if (!resposta.ok) {
    const mensagem =
      (dados && (dados.erro || dados.detail || dados.mensagem)) ||
      'Ocorreu um erro ao processar a requisição.'
    throw new ErroApi(mensagem, resposta.status)
  }

  return dados
}

// Alguns endpoints Django devolvem { resultados: [...] } ou { results: [...] };
// outros devolvem a lista direta. Normalizamos para sempre retornar um array.
function normalizarLista(dados) {
  if (Array.isArray(dados)) return dados
  if (Array.isArray(dados?.resultados)) return dados.resultados
  if (Array.isArray(dados?.results)) return dados.results
  if (Array.isArray(dados?.dados)) return dados.dados
  return []
}

// Fábrica de um CRUD REST padrão sobre um recurso.
// Gera: listar(), criar(dados), atualizar(id, dados), remover(id).
function criarRecurso(base) {
  const raiz = `/api/admin/${base}/`
  return {
    async listar() {
      return normalizarLista(await requisitar(raiz))
    },
    criar(dados) {
      return requisitar(raiz, { metodo: 'POST', corpo: dados })
    },
    atualizar(id, dados) {
      return requisitar(`${raiz}${id}/`, { metodo: 'PUT', corpo: dados })
    },
    remover(id) {
      return requisitar(`${raiz}${id}/`, { metodo: 'DELETE' })
    },
  }
}

export const adminApi = {
  bandeiras: criarRecurso('bandeiras'),
  eletrodomesticos: criarRecurso('eletrodomesticos'),
  modulos: criarRecurso('modulos'),
  quizzes: criarRecurso('quizzes'),

  // Estatísticas gerais da plataforma (visão admin).
  async estatisticas() {
    return requisitar('/api/admin/estatisticas/')
  },
}
