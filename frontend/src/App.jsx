import './App.css'
import AuthScreen from './components/auth/AuthScreen'
import RegisterForm from './components/auth/RegisterForm'
import { Navigate, Route, Routes } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Home</h1>
        <p className="text-slate-300">A tela de login fica em /login.</p>
      </div>
    </div>
  )
}

function RegisterScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#051a2c] p-4 text-white">
      <div className="w-full max-w-110 rounded-[40px] border border-white/5 bg-[#0b2842]/40 p-10 shadow-2xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Criar conta</h1>
          <p className="text-sm text-gray-400">Preencha os dados abaixo para visualizar o formulário de cadastro.</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
