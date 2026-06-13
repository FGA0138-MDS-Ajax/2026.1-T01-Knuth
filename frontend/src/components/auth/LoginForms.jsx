import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiUrl } from '../../config/api'
import { salvarSessao } from '../../config/auth'

export default function LoginForms() {
  const navigate = useNavigate()
  const location = useLocation()
  const cadastroSucesso = location.state?.cadastroSucesso
  const [username, setUsername] = useState(location.state?.username ?? location.state?.email ?? '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const resposta = await fetch(apiUrl('/api/login/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao fazer login.')
      }

      // Salva o nome real vindo do backend
      salvarSessao(dados.usuario.nome || dados.usuario.username)
      navigate('/home', { replace: true })
    } catch (error) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {cadastroSucesso && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Conta criada com sucesso!</div>}
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">E-mail</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Senha</label>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 text-xs text-slate-400">
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        </div>
      </div>

      {erro && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{erro}</div>}

      <button type="submit" disabled={carregando} className="w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-white">
        {carregando ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}