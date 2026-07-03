import './App.css'
import AuthScreen from './components/auth/AuthScreen'
import RegisterScreen from './components/auth/RegisterScreen'
import HomeScreen from './components/home/HomeScreen'
import PainelScreen from './components/home/PainelScreen'
import PaginaConsumoMedio from './components/dashboards/PaginaConsumoMedio'
import PaginaEletrodomesticos from './components/dashboards/PaginaEletrodomesticos'
import AnaliseConsumo from './components/dashboards/AnaliseConsumo'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import { Navigate, Route, Routes } from 'react-router-dom'
import { estaLogado } from './config/auth'
import ListaModulos from './components/dashboards/ListaModulos'
import LeituraModulo from './components/dashboards/LeituraModulo'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import GerenciarBandeiras from './components/admin/GerenciarBandeiras'
import GerenciarEletrodomesticos from './components/admin/GerenciarEletrodomesticos'
import GerenciarModulos from './components/admin/GerenciarModulos'
import GerenciarQuizzes from './components/admin/GerenciarQuizzes'


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
        path="/painel"
        element={
          <ProtectedRoute>
            <PainelScreen />
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
      <Route
        path="/eletrodomesticos"
        element={
          <ProtectedRoute>
            <PaginaEletrodomesticos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rf05"
        element={
          <ProtectedRoute>
            <AnaliseConsumo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ListaModulos"
        element={
          <ProtectedRoute>
            <ListaModulos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/modulo-educativo/:id"
        element={
          <ProtectedRoute>
            <LeituraModulo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="bandeiras" element={<GerenciarBandeiras />} />
        <Route path="eletrodomesticos" element={<GerenciarEletrodomesticos />} />
        <Route path="modulos" element={<GerenciarModulos />} />
        <Route path="quizzes" element={<GerenciarQuizzes />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
