import { Navigate } from 'react-router-dom'
import { estaLogado, ehAdmin } from '../config/auth.js'

// Protege as rotas do painel administrativo.
// - Não logado  -> vai para o login.
// - Logado, mas usuário comum -> volta para a home (sem acesso à área admin).
//
// IMPORTANTE: esta é apenas a barreira de UX. A segurança de verdade é do
// backend, que deve responder 403 para tokens/sessões sem permissão de admin.
export default function AdminRoute({ children }) {
  if (!estaLogado()) {
    return <Navigate to="/login" replace />
  }
  if (!ehAdmin()) {
    return <Navigate to="/home" replace />
  }
  return children
}
