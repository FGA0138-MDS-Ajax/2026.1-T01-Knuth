const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export function apiUrl(path) {
  return `${API_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}
