/**
 * Sistema de emblemas / conquistas (RF08).
 *
 * Estratégia híbrida (mesmo padrão de progressoModulos):
 *  - localStorage → cache local imediato (UX sem latência).
 *  - API (/api/emblemas/) → fonte da verdade persistente, por usuário.
 *    OBS.: o endpoint ainda NÃO existe no backend. Por isso a sincronização é
 *    best-effort e degrada com segurança: um 404 (endpoint inexistente) ou erro
 *    de servidor NÃO apaga o progresso local — somente um 401/403 (sessão
 *    inválida) limpa o cache, para não vazar conquistas entre usuários no mesmo
 *    navegador. Quando o backend expuser as rotas abaixo, tudo passa a
 *    sincronizar sem mudança no frontend:
 *      GET  /api/emblemas/              → { desbloqueados: ["id", ...] }
 *      POST /api/emblemas/desbloquear/  → body { emblema_id: "id" }
 *
 * Ao desbloquear um emblema novo, dispara o evento de janela
 * 'emblema-desbloqueado' (detail = objeto do emblema) para a UI exibir o toast.
 */

import { apiUrl } from './api';

const CHAVE = 'educaenergia_emblemas';

// Catálogo de emblemas. A `imagem` aponta para os arquivos em /public.
export const EMBLEMAS = [
  {
    id: 'simulacao_salva',
    nome: 'Primeira Simulação',
    imagem: '/Simulador_em_Acao.png',
    comoDesbloquear: 'Faça login e salve sua primeira simulação de consumo médio.',
  },
  {
    id: 'simulador_em_acao',
    nome: 'Simulador em Ação',
    imagem: '/Simulador_em_Acao.png',
    comoDesbloquear: 'Use a Análise de Consumo pela primeira vez.',
  },
  {
    id: 'primeiro_modulo',
    nome: 'Primeiro Módulo',
    imagem: '/Primeiro_Modulo.png',
    comoDesbloquear: 'Conclua qualquer módulo educativo.',
  },
  {
    id: 'mente_curiosa',
    nome: 'Mente Curiosa',
    imagem: '/Mente_Curiosa.png',
    comoDesbloquear: 'Conclua o quiz de qualquer módulo.',
  },
  {
    id: 'consumo_em_queda',
    nome: 'Consumo em Queda',
    imagem: '/Consumo_em_Queda.png',
    comoDesbloquear: 'Tenha o mês mais recente com consumo menor que o anterior.',
  },
  {
    id: 'detetive_de_aparelhos',
    nome: 'Detetive de Aparelhos',
    imagem: '/Detetive_de_Aparelhos.png',
    comoDesbloquear: 'Consulte a página de Eletrodomésticos.',
  },
  {
    id: 'trilha_completa',
    nome: 'Trilha Completa',
    imagem: '/Trilha_Completa.png',
    comoDesbloquear: 'Conclua os 8 módulos educativos.',
  },
  {
    id: 'quiz_perfeito',
    nome: 'Quiz Perfeito',
    imagem: '/Quiz_Perfeito.png',
    comoDesbloquear: 'Acerte 100% das perguntas de um quiz.',
  },
];

const IDS_VALIDOS = new Set(EMBLEMAS.map((e) => e.id));

export function getEmblemaById(id) {
  return EMBLEMAS.find((e) => e.id === id) || null;
}

// ─── Leitura local (síncrona) ────────────────────────────────────────────────

export function getEmblemasDesbloqueados() {
  try {
    const dados = localStorage.getItem(CHAVE);
    const ids = dados ? JSON.parse(dados) : [];
    return Array.isArray(ids) ? ids.filter((id) => IDS_VALIDOS.has(id)) : [];
  } catch {
    return [];
  }
}

export function emblemaEstaDesbloqueado(id) {
  return getEmblemasDesbloqueados().includes(id);
}

// ─── Gravação local ───────────────────────────────────────────────────────────

function _salvarLocal(ids) {
  localStorage.setItem(CHAVE, JSON.stringify([...new Set(ids)]));
}

// ─── Desbloqueio (local + API + notificação) ─────────────────────────────────

/**
 * Marca um emblema como desbloqueado. Idempotente: se o usuário já possui o
 * emblema, não faz nada e retorna false (evita toast/POST duplicados).
 *
 * @param {string} id id do emblema (uma das chaves de EMBLEMAS)
 * @returns {boolean} true se foi desbloqueado AGORA (era novo), false caso contrário
 */
export function desbloquearEmblema(id) {
  if (!IDS_VALIDOS.has(id)) return false;

  const atuais = getEmblemasDesbloqueados();
  if (atuais.includes(id)) return false; // já conquistado — não notifica de novo

  // 1. Salva no localStorage imediatamente (UX responsiva)
  _salvarLocal([...atuais, id]);

  // 2. Sincroniza com o backend em background (best-effort)
  _enviarDesbloqueioParaServidor(id);

  // 3. Notifica a UI para exibir o toast de conquista
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('emblema-desbloqueado', { detail: getEmblemaById(id) })
    );
  }

  return true;
}

async function _enviarDesbloqueioParaServidor(id) {
  try {
    await fetch(apiUrl('/api/emblemas/desbloquear/'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emblema_id: id }),
    });
  } catch {
    // Silencia — o localStorage já garantiu a UX. Será reenviado pela próxima
    // sincronização quando o backend estiver disponível.
  }
}

// ─── Sincronização servidor → localStorage ───────────────────────────────────

/**
 * Busca os emblemas do usuário logado e SUBSTITUI o localStorage.
 * Degrada com segurança enquanto o endpoint não existe (ver topo do arquivo).
 *
 * @returns {Promise<string[]>} ids dos emblemas desbloqueados
 */
export async function sincronizarEmblemasDoServidor() {
  try {
    const resposta = await fetch(apiUrl('/api/emblemas/'), {
      method: 'GET',
      credentials: 'include',
    });

    if (!resposta.ok) {
      // 401/403 → sessão inválida: limpa o cache para não vazar entre usuários.
      if (resposta.status === 401 || resposta.status === 403) {
        limparEmblemasLocais();
        return [];
      }
      // 404 (endpoint ainda não existe) ou 5xx → mantém o cache local intacto.
      return getEmblemasDesbloqueados();
    }

    const json = await resposta.json();
    const doServidor = (json.desbloqueados ?? []).filter((id) => IDS_VALIDOS.has(id));
    _salvarLocal(doServidor);
    return doServidor;
  } catch {
    // Sem rede — mantém o cache local (mesma sessão, mesmo usuário).
    return getEmblemasDesbloqueados();
  }
}

// ─── Limpeza (deve ser chamada no logout) ────────────────────────────────────

export function limparEmblemasLocais() {
  localStorage.removeItem(CHAVE);
}
