import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiUrl } from '../../config/api'

export default function LoginForms() {
  // Mantemos as rotas do colega
  const navigate = useNavigate()
  const location = useLocation()
  const cadastroSucesso = location.state?.cadastroSucesso
  
  // Pegamos a SUA lógica de usar username em vez de e-mail
  const usernameCadastrado = location.state?.username 
  const [username, setUsername] = useState(usernameCadastrado ?? '')
  
  // Mantemos as melhorias de UI do colega
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      // Usamos a URL limpa do colega, mas enviamos o SEU pacote com username
      const resposta = await fetch(apiUrl('/api/login/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }), 
      })

      let dados = {}
      try {
        dados = await resposta.json()
      } catch {
        throw new Error('Resposta inválida do servidor.')
      }

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Nome de usuário ou senha inválidos.')
      }

      // Redirecionamento configurado pelo colega
      navigate('/home', { replace: true, state: { usuario: dados.usuario } })
    } catch (error) {
      setErro(
        error.message === 'Failed to fetch'
          ? 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'
          : error.message
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {cadastroSucesso && (
        <div
          role="status"
          className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
        >
          Conta criada com sucesso! Faça login para continuar.
        </div>
      )}

      {/* Trocamos o campo E-mail do colega pelo seu campo de Username */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-emerald-50/90" htmlFor="username">
          Nome de Usuário
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Digite seu usuário"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-emerald-50/90" htmlFor="password">
          Senha
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite sua senha"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-slate-400 transition hover:text-emerald-300"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        </div>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {erro}
        </div>
      )}

      <button
        type="submit"
        disabled={carregando}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="relative z-10">
          {carregando ? 'Entrando...' : 'Entrar na plataforma'}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-white/20 transition group-hover:translate-x-full duration-500" />
      </button>

      <p className="text-center text-sm text-slate-400">
        Ainda não tem conta?{' '}
        <Link to="/register" className="font-medium text-emerald-300 transition hover:text-emerald-200">
          Criar conta gratuita
        </Link>
      </p>
    </form>
  )
}