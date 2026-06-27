const CHAVE = 'educaenergia_modulos_concluidos';

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

export function marcarModuloConcluido(id) {
  const modulosConcluidos = getModulosConcluidos();
  const moduloId = Number(id);

  if (!modulosConcluidos.includes(moduloId)) {
    localStorage.setItem(CHAVE, JSON.stringify([...modulosConcluidos, moduloId]));
  }

  // TODO: integrar com API quando o backend estiver pronto
  // POST /api/educacao/modulos/:id/concluir/
}
