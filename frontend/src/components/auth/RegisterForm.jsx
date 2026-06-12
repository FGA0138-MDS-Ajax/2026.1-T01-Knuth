import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiUrl } from '../../config/api'

const inputClassName =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30'

export default function RegisterForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')

    if (password !== confirmPassword) {
      setErro('As senhas não coincidem.')
      return
    }

    if (password.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch(apiUrl('/api/cadastro/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      let dados = {}
      try {
        dados = await resposta.json()
      } catch {
        throw new Error('Resposta inválida do servidor.')
      }

      if (!resposta.ok) {
        throw new Error(dados.erro || 'Não foi possível criar a conta.')
      }

      navigate('/login', {
        replace: true,
        state: { cadastroSucesso: true, email },
      })
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
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="name">
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Digite seu nome"
          className={inputClassName}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="seuemail@exemplo.com"
          className={inputClassName}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Mínimo de 8 caracteres"
          className={inputClassName}
          required
          minLength={8}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
          Confirmar senha
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Digite novamente sua senha"
          className={inputClassName}
          required
          minLength={8}
        />
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {erro}
        </div>
      )}

      <button
        type="submit"
        disabled={carregando}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="relative z-10">
          {carregando ? 'Criando conta...' : 'Criar conta gratuita'}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-white/20 transition group-hover:translate-x-full duration-500" />
      </button>

      <p className="text-center text-sm text-slate-500">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-emerald-600 transition hover:text-emerald-500">
          Fazer login
        </Link>
      </p>
    </form>
  )
}
