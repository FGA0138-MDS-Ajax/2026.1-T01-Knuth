// Resolve a URL base da API.
//
// O cookie de sessão do Django depende do host ser o mesmo entre frontend e API.
// Se o frontend roda em "localhost" e a API em "127.0.0.1" (ou vice-versa),
// o navegador trata como sites diferentes e NÃO envia o cookie de sessão.
// Sem o cookie, o backend não associa a simulação ao usuário logado.
function resolverApiUrl() {
  const configurado = import.meta.env.VITE_API_URL

  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname } = window.location

    if (configurado) {
      try {
        const parsed = new URL(configurado)
        parsed.hostname = hostname
        return parsed.origin
      } catch {
        // Ignora URL inválida e usa fallback abaixo.
      }
    }

    return `${protocol}//${hostname}:8000`
  }

  if (configurado) return configurado.replace(/\/$/, '')
  return 'http://127.0.0.1:8000'
}

const API_URL = resolverApiUrl()

export function apiUrl(path) {
  return `${API_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}
