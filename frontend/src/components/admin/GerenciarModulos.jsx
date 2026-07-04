import RecursoCrud from './RecursoCrud'
import { adminApi } from '../config/adminApi.js'

const colunas = [
  { chave: 'ordem', label: 'Ordem' },
  { chave: 'modulo_id', label: 'ID Módulo' },
  { chave: 'titulo', label: 'Título' },
  { chave: 'duracao', label: 'Duração' },
  {
    chave: 'ativo',
    label: 'Status',
    formato: (v) =>
      v ? (
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
          Ativo
        </span>
      ) : (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
          Inativo
        </span>
      ),
  },
]

const campos = [
  {
    chave: 'modulo_id',
    label: 'ID do módulo',
    tipo: 'number',
    obrigatorio: true,
    ajuda: 'Deve corresponder ao id do módulo nos arquivos de conteúdo do front (1 a 8).',
  },
  { chave: 'titulo', label: 'Título', tipo: 'text', obrigatorio: true },
  { chave: 'descricao', label: 'Descrição', tipo: 'textarea', obrigatorio: true },
  {
    chave: 'duracao',
    label: 'Duração',
    tipo: 'text',
    obrigatorio: true,
    placeholder: "Ex.: '6 min'",
  },
  {
    chave: 'ordem',
    label: 'Ordem na trilha',
    tipo: 'number',
    obrigatorio: true,
    ajuda: 'Define a sequência na trilha de aprendizagem.',
  },
  {
    chave: 'ativo',
    label: 'Módulo ativo (aparece na listagem pública)',
    tipo: 'checkbox',
  },
]

const registroPadrao = {
  modulo_id: '',
  titulo: '',
  descricao: '',
  duracao: '',
  ordem: '',
  ativo: true,
}

export default function GerenciarModulos() {
  return (
    <RecursoCrud
      titulo="Módulos educativos"
      subtitulo="Metadados dos módulos da trilha de aprendizagem."
      icone="📚"
      api={adminApi.modulos}
      colunas={colunas}
      campos={campos}
      registroPadrao={registroPadrao}
      rotuloItem={(item) => item.titulo}
    />
  )
}
