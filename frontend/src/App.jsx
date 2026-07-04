import './App.css'
import AuthScreen from './components/auth/AuthScreen'
import RegisterScreen from './components/auth/RegisterScreen'
import HomeScreen from './components/home/HomeScreen'
import PainelScreen from './components/home/PainelScreen'
import PaginaConsumoMedio from './components/dashboards/PaginaConsumoMedio'
import PaginaEletrodomesticos from './components/dashboards/PaginaEletrodomesticos'
import AnaliseConsumo from './components/dashboards/AnaliseConsumo'
import RelatorioGastos from './components/dashboards/RelatorioGastos'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { Navigate, Route, Routes } from 'react-router-dom'
import { estaLogado } from './config/auth'
import ListaModulos from './components/dashboards/ListaModulos'
import LeituraModulo from './components/dashboards/LeituraModulo'


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
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
