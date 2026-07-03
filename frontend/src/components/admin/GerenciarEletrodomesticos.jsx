import RecursoCrud from './RecursoCrud'
import { adminApi } from '../../config/adminApi'

const colunas = [
  { chave: 'nome', label: 'Nome' },
  {
    chave: 'potencia_media_watts',
    label: 'Potência',
    formato: (v) => (v != null ? `${v} W` : '—'),
  },
  {
    chave: 'tempo_medio_uso_minutos',
    label: 'Uso médio',
    formato: (v) => (v != null ? `${v} min` : '—'),
  },
  {
    chave: 'destaque',
    label: 'Top 10',
    formato: (v) => (v ? '⭐ Sim' : 'Não'),
  },
]

const campos = [
  { chave: 'nome', label: 'Nome', tipo: 'text', obrigatorio: true, placeholder: 'Ex.: Geladeira' },
  {
    chave: 'potencia_media_watts',
    label: 'Potência média (W)',
    tipo: 'number',
    obrigatorio: true,
    ajuda: 'Potência média do aparelho em Watts.',
  },
  {
    chave: 'tempo_medio_uso_minutos',
    label: 'Tempo médio de uso (min)',
    tipo: 'number',
    ajuda: 'Tempo médio de uso por dia, em minutos.',
  },
  {
    chave: 'descricao_uso',
    label: 'Descrição do uso',
    tipo: 'text',
    placeholder: 'Ex.: Ligada 24h por dia',
  },
  {
    chave: 'destaque',
    label: 'Aparece no Top 10 inicial da tela',
    tipo: 'checkbox',
  },
]

const registroPadrao = {
  nome: '',
  potencia_media_watts: '',
  tempo_medio_uso_minutos: 60,
  descricao_uso: 'Tempo médio de uso',
  destaque: false,
}

export default function GerenciarEletrodomesticos() {
  return (
    <RecursoCrud
      titulo="Eletrodomésticos"
      subtitulo="Cadastro de aparelhos usados nas simulações de consumo."
      icone="🔌"
      api={adminApi.eletrodomesticos}
      colunas={colunas}
      campos={campos}
      registroPadrao={registroPadrao}
      rotuloItem={(item) => item.nome}
    />
  )
}
