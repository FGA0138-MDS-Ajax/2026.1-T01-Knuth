import { useEffect, useState } from 'react'
import RecursoCrud from './RecursoCrud'
import { adminApi } from '../../config/adminApi'

// Editor de alternativas de uma questão de quiz.
// Controla dois campos do formulário ao mesmo tempo:
//   - alternativas: string[]
//   - resposta_correta: índice (number) da alternativa correta
function EditorAlternativas({ form, setCampo }) {
  const alternativas = Array.isArray(form.alternativas) ? form.alternativas : ['', '']
  const corretaIdx = form.resposta_correta ?? 0

  const atualizarTexto = (idx, texto) => {
    const novas = alternativas.map((a, i) => (i === idx ? texto : a))
    setCampo('alternativas', novas)
  }

  const adicionar = () => setCampo('alternativas', [...alternativas, ''])

  const remover = (idx) => {
    if (alternativas.length <= 2) return // mantém no mínimo 2 opções
    const novas = alternativas.filter((_, i) => i !== idx)
    setCampo('alternativas', novas)
    // Reajusta o índice da resposta correta.
    if (corretaIdx === idx) setCampo('resposta_correta', 0)
    else if (corretaIdx > idx) setCampo('resposta_correta', corretaIdx - 1)
  }

  return (
    <div className="space-y-2">
      {alternativas.map((alt, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="radio"
            name="resposta_correta"
            checked={corretaIdx === idx}
            onChange={() => setCampo('resposta_correta', idx)}
            title="Marcar como resposta correta"
            className="h-4 w-4 shrink-0 text-emerald-600 focus:ring-emerald-400/30"
          />
          <input
            type="text"
            value={alt}
            placeholder={`Alternativa ${idx + 1}`}
            onChange={(e) => atualizarTexto(idx, e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20"
          />
          <button
            type="button"
            onClick={() => remover(idx)}
            disabled={alternativas.length <= 2}
            className="shrink-0 rounded-md px-2 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Remover alternativa"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={adicionar}
        className="text-xs font-semibold text-slate-600 transition hover:text-slate-900"
      >
        + Adicionar alternativa
      </button>
      <p className="text-xs text-slate-400">
        Marque o círculo à esquerda para indicar a resposta correta.
      </p>
    </div>
  )
}

const colunas = [
  { chave: 'modulo_id', label: 'Módulo' },
  { chave: 'pergunta', label: 'Pergunta' },
  {
    chave: 'alternativas',
    label: 'Alternativas',
    formato: (v) => (Array.isArray(v) ? `${v.length} opções` : '—'),
  },
]

const registroPadrao = {
  modulo_id: '',
  pergunta: '',
  alternativas: ['', ''],
  resposta_correta: 0,
  explicacao: '',
}

export default function GerenciarQuizzes() {
  const [opcoesModulos, setOpcoesModulos] = useState([])

  // Popula o select de módulos a partir da própria API de admin.
  useEffect(() => {
    let ativo = true
    adminApi.modulos
      .listar()
      .then((lista) => {
        if (!ativo) return
        setOpcoesModulos(
          lista.map((m) => ({
            valor: m.modulo_id ?? m.id,
            label: `Módulo ${m.modulo_id ?? m.id} — ${m.titulo}`,
          })),
        )
      })
      .catch(() => {
        /* select fica vazio; admin ainda pode digitar via fallback */
      })
    return () => {
      ativo = false
    }
  }, [])

  const campos = [
    {
      chave: 'modulo_id',
      label: 'Módulo',
      tipo: opcoesModulos.length > 0 ? 'select' : 'number',
      obrigatorio: true,
      opcoes: opcoesModulos,
      ajuda: 'Módulo ao qual esta questão pertence.',
    },
    {
      chave: 'pergunta',
      label: 'Pergunta',
      tipo: 'textarea',
      obrigatorio: true,
      placeholder: 'Enunciado da questão',
    },
    {
      chave: 'alternativas',
      label: 'Alternativas',
      obrigatorio: true,
      render: EditorAlternativas,
    },
    {
      chave: 'explicacao',
      label: 'Explicação (opcional)',
      tipo: 'textarea',
      placeholder: 'Justificativa mostrada após responder.',
    },
  ]

  return (
    <RecursoCrud
      titulo="Quizzes"
      subtitulo="Questões de múltipla escolha vinculadas aos módulos educativos."
      icone="❓"
      api={adminApi.quizzes}
      colunas={colunas}
      campos={campos}
      registroPadrao={registroPadrao}
      rotuloItem={(item) => item.pergunta || `Questão #${item.id}`}
    />
  )
}
