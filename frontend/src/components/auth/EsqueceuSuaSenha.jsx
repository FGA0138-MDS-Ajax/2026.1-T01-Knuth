import { useState } from 'react'
import { Link } from 'react-router-dom'
import EducaEnergiaLogo from './EducaEnergiaLogo'

export default function EsqueceuSuaSenha() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    // Aqui você implementaria a lógica de envio pro backend no futuro
    setEnviado(true)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-lg items-center justify-center px-4 py-10 sm:px-8">
        <div className="animate-fade-in w-full rounded-[32px] border border-emerald-100 bg-white/80 p-8 shadow-xl shadow-emerald-900/5 backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <EducaEnergiaLogo className="h-28 w-auto animate-float drop-shadow" />
            <p className="mt-3 text-xl font-bold text-slate-900">EducaEnergia</p>

            <h1 className="mt-6 text-2xl font-bold text-slate-900">Recuperar Senha</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Digite seu e-mail para receber as instruções de recuperação de senha.
            </p>
          </div>

          {!enviado ? (
            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                  E-mail cadastrado
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Digite seu e-mail"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                  required
                />
              </div>

              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
              >
                <span className="relative z-10">Enviar instruções</span>
                <span className="absolute inset-0 -translate-x-full bg-white/20 transition group-hover:translate-x-full duration-500" />
              </button>
            </form>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-center">
              <p className="text-emerald-800 font-medium mb-2">E-mail enviado com sucesso!</p>
              <p className="text-sm text-emerald-600">
                Verifique sua caixa de entrada para redefinir sua senha.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            Lembrou sua senha?{' '}
            <Link to="/login" className="font-medium text-emerald-600 transition hover:text-emerald-500">
              Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}