import './App.css'
import AuthScreen from './components/auth/AuthScreen'
import RegisterScreen from './components/auth/RegisterScreen'
import HomeScreen from './components/home/HomeScreen'
import PaginaConsumoMedio from './components/dashboards/PaginaConsumoMedio' // 1. IMPORTAÇÃO
import { Navigate, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/login" element={<AuthScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/consumo-medio" element={<PaginaConsumoMedio />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}