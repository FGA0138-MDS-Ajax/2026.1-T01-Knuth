import './App.css'
import AuthScreen from './components/auth/AuthScreen.jsx'
import RegisterScreen from './components/auth/RegisterScreen.jsx'
import HomeScreen from './components/home/HomeScreen.jsx'
import PainelScreen from './components/home/PainelScreen.jsx'
import PaginaConsumoMedio from './components/dashboards/PaginaConsumoMedio.jsx'
import PaginaEletrodomesticos from './components/dashboards/PaginaEletrodomesticos.jsx'
import AnaliseConsumo from './components/dashboards/AnaliseConsumo.jsx'
import RelatorioGastos from './components/dashboards/RelatorioGastos.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import AdminRoute from './components/auth/AdminRoute.jsx'
import EsqueceuSuaSenha from './components/auth/EsqueceuSuaSenha.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import { estaLogado } from './components/config/auth.js'
import ListaModulos from './components/dashboards/ListaModulos.jsx'
import LeituraModulo from './components/dashboards/LeituraModulo.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import GerenciarBandeiras from './components/admin/GerenciarBandeiras.jsx'
import GerenciarEletrodomesticos from './components/admin/GerenciarEletrodomesticos.jsx'
import GerenciarModulos from './components/admin/GerenciarModulos.jsx'
import GerenciarQuizzes from './components/admin/GerenciarQuizzes.jsx'


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
        path="/relatorios"
        element={
          <ProtectedRoute>
            <RelatorioGastos />
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
       <Route path="/esqueceu-sua-senha" element={<EsqueceuSuaSenha />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
