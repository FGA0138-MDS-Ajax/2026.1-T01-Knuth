/**
 * Gerencia o progresso do usuário nos módulos educativos.
 *
 * Estratégia híbrida:
 *  - localStorage → cache local imediato (UX sem latência)
 *  - API (/api/educacao/) → fonte da verdade persistente, por usuário
 *
 * Fluxo:
 *  1. O estado local é lido do localStorage (síncrono, sem espera de rede).
 *  2. Ao concluir um módulo, o localStorage é atualizado imediatamente E a API é
 *     chamada em background (best-effort — falha de rede não quebra a UX).
 *  3. Ao carregar a ListaModulos, `sincronizarProgressoDoServidor()` SUBSTITUI o
 *     localStorage pelo progresso do servidor para o usuário logado.
 *     IMPORTANTE: nunca mescla localStorage com servidor — o servidor é a fonte
 *     da verdade por usuário. Mesclar causaria contaminação entre usuários no
 *     mesmo navegador.
 *  4. Ao fazer logout, `limparProgressoLocal()` deve ser chamada para apagar o
 *     cache do navegador antes que outro usuário faça login.
 */

import { apiUrl } from './api';

const CHAVE = 'educaenergia_modulos_concluidos';

// ─── Leitura local (síncrona) ────────────────────────────────────────────────

export function getModulosConcluidos() {
  try {
    const dados = localStorage.getItem(CHAVE);
    return dados ? JSON.parse(dados) : [];
  } catch {
    return [];
  }
}

export function moduloEstaConcluido(id) {
  return getModulosConcluidos().includes(Number(id));
}

// ─── Gravação local ───────────────────────────────────────────────────────────

function _salvarLocal(ids) {
  localStorage.setItem(CHAVE, JSON.stringify(ids));
}

// ─── Conclusão de módulo (local + API) ───────────────────────────────────────

export async function marcarModuloConcluido(id) {
  const moduloId = Number(id);

  // 1. Salva no localStorage imediatamente (UX responsiva)
  const local = getModulosConcluidos();
  if (!local.includes(moduloId)) {
    _salvarLocal([...local, moduloId]);
  }

  // 2. Sincroniza com o backend (best-effort — não bloqueia a UI em caso de erro)
  try {
    await fetch(apiUrl('/api/educacao/progresso/concluir/'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modulo_id: moduloId }),
    });
  } catch {
    // Silencia — o localStorage já garantiu a UX local.
    // O progresso será sincronizado na próxima visita via sincronizarProgressoDoServidor().
  }
}

// ─── Sincronização servidor → localStorage ───────────────────────────────────

/**
 * Busca o progresso do usuário logado no servidor e SUBSTITUI o localStorage.
 * Nunca mescla com o cache local — o servidor é a fonte da verdade por usuário.
 * Deve ser chamada ao montar a ListaModulos.
 *
 * @returns {Promise<number[]>} Lista de modulo_id concluídos pelo usuário logado
 */
export async function sincronizarProgressoDoServidor() {
  try {
    const resposta = await fetch(apiUrl('/api/educacao/progresso/'), {
      method: 'GET',
      credentials: 'include',
    });

    if (!resposta.ok) {
      // Usuário não autenticado (401) — limpa o cache local para não vazar
      // progresso de uma sessão anterior para um novo usuário.
      limparProgressoLocal();
      return [];
    }

    const json = await resposta.json();
    const doServidor = json.concluidos ?? [];

    // SUBSTITUI o localStorage pelo progresso exato do servidor para este usuário.
    // NÃO faz merge — isso evitava que o progresso de um usuário anterior
    // contaminasse o novo usuário no mesmo navegador.
    _salvarLocal(doServidor);
    return doServidor;
  } catch {
    // Sem rede — retorna o cache local sem quebrar (mesma sessão, mesmo usuário)
    return getModulosConcluidos();
  }
}

// ─── Limpeza (deve ser chamada no logout) ────────────────────────────────────

/**
 * Apaga o cache de progresso do localStorage.
 * Deve ser chamada ao fazer logout para evitar que o próximo usuário
 * que logar no mesmo navegador veja o progresso do usuário anterior.
 */
export function limparProgressoLocal() {
  localStorage.removeItem(CHAVE);
}
