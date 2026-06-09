import './App.css'
import AuthScreen from './components/auth/AuthScreen'
import RegisterScreen from './components/auth/RegisterScreen'
import HomeScreen from './components/home/HomeScreen'
import PaginaConsumoMedio from './components/dashboards/PaginaConsumoMedio'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { Navigate, Route, Routes } from 'react-router-dom'
import { estaLogado } from './config/auth'

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={estaLogado() ? '/home' : '/login'} replace />}
      />
      <Route path="/login" element={<AuthScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consumo-medio"
        element={
          <ProtectedRoute>
            <PaginaConsumoMedio />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
