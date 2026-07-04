import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../config/adminApi.js'
import { getNomeUsuario } from '../config/auth.js'

// Lê um valor de estatística tolerando nomes alternativos vindos do backend.
function ler(dados, ...chaves) {
  for (const c of chaves) {
    if (dados && dados[c] != null) return dados[c]
  }
  return null
}

const atalhos = [
  { rota: '/admin/bandeiras', label: 'Bandeiras tarifárias', icone: '🚦' },
  { rota: '/admin/eletrodomesticos', label: 'Eletrodomésticos', icone: '🔌' },
  { rota: '/admin/modulos', label: 'Módulos educativos', icone: '📚' },
  { rota: '/admin/quizzes', label: 'Quizzes', icone: '❓' },
]

function CardEstatistica({ icone, label, valor, carregando }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <span aria-hidden>{icone}</span>
        {label}
      </div>
      <p className="mt-2 text-3xl font-bold text-slate-900">
        {carregando ? '…' : valor != null ? valor : '—'}
      </p>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const nome = getNomeUsuario()

  useEffect(() => {
    let ativo = true
    adminApi
      .estatisticas()
      .then((d) => ativo && setStats(d))
      .catch((e) => ativo && setErro(e.message || 'Não foi possível carregar as estatísticas.'))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [])

  const cards = [
    {
      icone: '👥',
      label: 'Usuários cadastrados',
      valor: ler(stats, 'total_usuarios', 'usuarios'),
    },
    {
      icone: '⚡',
      label: 'Simulações realizadas',
      valor: ler(stats, 'total_simulacoes', 'simulacoes'),
    },
    {
      icone: '📚',
      label: 'Módulos ativos',
      valor: ler(stats, 'total_modulos', 'modulos', 'modulos_ativos'),
    },
    {
      icone: '✅',
      label: 'Módulos concluídos',
      valor: ler(stats, 'total_conclusoes', 'conclusoes', 'modulos_concluidos'),
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Olá, {nome || 'Administrador'} 👋
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Visão geral da plataforma e acesso rápido à gestão de conteúdo.
        </p>
      </div>

      {erro && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
        >
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <CardEstatistica key={c.label} {...c} carregando={carregando} />
        ))}
      </div>

      <h3 className="mb-3 mt-10 text-sm font-bold uppercase tracking-wide text-slate-500">
        Gerenciar conteúdo
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {atalhos.map((a) => (
          <Link
            key={a.rota}
            to={a.rota}
            className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <span
              aria-hidden
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl transition group-hover:bg-slate-900 group-hover:text-white"
            >
              {a.icone}
            </span>
            <span className="text-sm font-semibold text-slate-800">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
