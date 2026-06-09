// Resolve a URL base da API.
//
// IMPORTANTE: o cookie de sessão do Django usa SameSite=Lax. Se o frontend roda
// em "localhost" e a API em "127.0.0.1" (ou vice-versa), o navegador trata como
// sites diferentes e NÃO envia o cookie de sessão nas chamadas fetch. Sem o
// cookie, o backend trata cada requisição como anônima e as simulações são
// salvas sem usuário (e a listagem volta vazia).
//
// Para evitar isso, quando não há VITE_API_URL definido, derivamos o host da API
// a partir do host atual da página, mantendo tudo no mesmo site.
function resolverApiUrl() {
  const configurado = import.meta.env.VITE_API_URL
  if (configurado) return configurado

  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname } = window.location
    return `${protocol}//${hostname}:8000`
  }

  return 'http://127.0.0.1:8000'
}

const API_URL = resolverApiUrl()

export function apiUrl(path) {
  return `${API_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}
