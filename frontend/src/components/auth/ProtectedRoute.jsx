import { Navigate } from 'react-router-dom'
import { estaLogado } from '../config/auth.js'

// Protege rotas privadas: se o usuário não estiver logado, manda para o login.
export default function ProtectedRoute({ children }) {
  if (!estaLogado()) {
    return <Navigate to="/login" replace />
  }
  return children
}
