import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { apiUrl } from '../config/api.js'
import { encerrarSessao, getNomeUsuario } from '../config/auth.js'

const navItens = [
  { label: 'Visão geral', rota: '/admin', fim: true, icone: '📊' },
  { label: 'Bandeiras tarifárias', rota: '/admin/bandeiras', icone: '🚦' },
  { label: 'Eletrodomésticos', rota: '/admin/eletrodomesticos', icone: '🔌' },
  { label: 'Módulos educativos', rota: '/admin/modulos', icone: '📚' },
  { label: 'Quizzes', rota: '/admin/quizzes', icone: '❓' },
]

function classesLink({ isActive }) {
  const base =
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'
  return isActive
    ? `${base} bg-amber-500/15 text-amber-300`
    : `${base} text-slate-300 hover:bg-white/5 hover:text-white`
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)
  const nomeUsuario = getNomeUsuario() || 'Administrador'
  const inicial = nomeUsuario.charAt(0).toUpperCase()

  const sair = async () => {
    try {
      await fetch(apiUrl('/api/logout/'), { method: 'POST', credentials: 'include' })
    } catch {
      // Ignora falha de rede no logout; a sessão local é limpa em seguida.
    }
    encerrarSessao()
    navigate('/login', { replace: true })
  }

  const conteudoSidebar = (
    <div className="flex h-full flex-col">
      <Link
        to="/admin"
        className="flex items-center gap-2.5 px-2 py-1"
        onClick={() => setMenuAberto(false)}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-lg shadow-lg shadow-amber-500/20">
          ⚡
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">EducaEnergia</p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400">
            Admin
          </p>
        </div>
      </Link>

      <nav className="mt-8 flex-1 space-y-1">
        {navItens.map((item) => (
          <NavLink
            key={item.rota}
            to={item.rota}
            end={item.fim}
            className={classesLink}
            onClick={() => setMenuAberto(false)}
          >
            <span aria-hidden className="text-base">
              {item.icone}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
        <Link
          to="/home"
          onClick={() => setMenuAberto(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <span aria-hidden>↩</span>
          Voltar ao site
        </Link>
        <button
          type="button"
          onClick={sair}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
        >
          <span aria-hidden>⏻</span>
          Sair da conta
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Sidebar fixa (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-slate-900 p-4 lg:flex">
        {conteudoSidebar}
      </aside>

      {/* Drawer (mobile) */}
      {menuAberto && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[1px] lg:hidden"
            onClick={() => setMenuAberto(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 p-4 lg:hidden">
            {conteudoSidebar}
          </aside>
        </>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMenuAberto(true)}
              aria-label="Abrir menu"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
                <span className="block h-0.5 w-5 rounded-full bg-slate-700" />
                <span className="block h-0.5 w-4 rounded-full bg-slate-700" />
              </span>
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                Painel Administrativo
              </h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Gestão de conteúdo e configurações da plataforma
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 sm:inline">
              Administrador
            </span>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                <span className="text-xs font-semibold text-white">{inicial}</span>
              </div>
              <span className="hidden max-w-[140px] truncate text-sm font-medium text-slate-700 sm:inline">
                {nomeUsuario}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
