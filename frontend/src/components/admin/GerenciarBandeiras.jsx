import RecursoCrud from './RecursoCrud'
import { adminApi } from '../config/adminApi.js'

const brl = (v) =>
  v == null || v === ''
    ? '—'
    : `R$ ${Number(v).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`

const corPorNome = {
  verde: 'bg-emerald-100 text-emerald-700',
  amarela: 'bg-amber-100 text-amber-700',
  vermelha_1: 'bg-red-100 text-red-700',
  vermelha_2: 'bg-red-200 text-red-800',
}

const rotuloBandeira = {
  verde: 'Verde',
  amarela: 'Amarela',
  vermelha_1: 'Vermelha — Patamar 1',
  vermelha_2: 'Vermelha — Patamar 2',
}

const colunas = [
  {
    chave: 'nome',
    label: 'Bandeira',
    formato: (v) => (
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          corPorNome[v] || 'bg-slate-100 text-slate-600'
        }`}
      >
        {rotuloBandeira[v] || v}
      </span>
    ),
  },
  {
    chave: 'valor_adicional_reais',
    label: 'Adicional / 100 kWh',
    formato: (v) => brl(v),
  },
  { chave: 'descricao', label: 'Descrição' },
  {
    chave: 'ativa',
    label: 'Vigente',
    formato: (v) => (v ? '✅ Sim' : 'Não'),
  },
]

const campos = [
  {
    chave: 'nome',
    label: 'Bandeira',
    tipo: 'select',
    obrigatorio: true,
    opcoes: [
      { valor: 'verde', label: 'Verde' },
      { valor: 'amarela', label: 'Amarela' },
      { valor: 'vermelha_1', label: 'Vermelha — Patamar 1' },
      { valor: 'vermelha_2', label: 'Vermelha — Patamar 2' },
    ],
  },
  {
    chave: 'valor_adicional_reais',
    label: 'Valor adicional (R$ por 100 kWh)',
    tipo: 'number',
    obrigatorio: true,
    ajuda: 'Acréscimo cobrado na tarifa a cada 100 kWh consumidos.',
  },
  {
    chave: 'descricao',
    label: 'Descrição',
    tipo: 'textarea',
    placeholder: 'Ex.: Condições favoráveis de geração de energia.',
  },
  {
    chave: 'ativa',
    label: 'Bandeira vigente atualmente',
    tipo: 'checkbox',
  },
]

const registroPadrao = {
  nome: '',
  valor_adicional_reais: '',
  descricao: '',
  ativa: false,
}

export default function GerenciarBandeiras() {
  return (
    <RecursoCrud
      titulo="Bandeiras tarifárias"
      subtitulo="Valores adicionais aplicados à tarifa conforme a bandeira vigente."
      icone="🚦"
      api={adminApi.bandeiras}
      colunas={colunas}
      campos={campos}
      registroPadrao={registroPadrao}
      rotuloItem={(item) => rotuloBandeira[item.nome] || item.nome}
    />
  )
}
