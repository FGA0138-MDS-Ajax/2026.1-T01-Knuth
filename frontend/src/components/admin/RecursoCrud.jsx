import { useCallback, useEffect, useMemo, useState } from 'react'
import { ErroAcessoNegado } from '../../config/adminApi'

// Componente genérico de CRUD para o painel admin.
//
// Cada tela de gestão (Bandeiras, Eletrodomésticos, Módulos, Quizzes) apenas
// descreve suas colunas e campos — toda a lógica de listar/criar/editar/excluir
// e a UI (tabela, modal de formulário, confirmação) vive aqui.
//
// Props:
// - titulo, subtitulo, icone
// - api: { listar, criar, atualizar, remover }
// - colunas: [{ chave, label, formato?(valor, item) }]
// - campos:  [{ chave, label, tipo, obrigatorio?, ajuda?, placeholder?,
//               opcoes?: [{ valor, label }], render?({ form, setCampo }) }]
//   tipos suportados: 'text' | 'number' | 'textarea' | 'select' | 'checkbox'
//   (use `render` para campos customizados, ex.: alternativas de quiz)
// - registroPadrao: objeto usado ao criar um novo item
// - rotuloItem(item): texto exibido na confirmação de exclusão
// - chavePrimaria (default 'id')
export default function RecursoCrud({
  titulo,
  subtitulo,
  icone,
  api,
  colunas,
  campos,
  registroPadrao = {},
  rotuloItem = (item) => `#${item.id}`,
  chavePrimaria = 'id',
}) {
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null) // item em edição ou null (criação)
  const [form, setForm] = useState(registroPadrao)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  const [confirmarExclusao, setConfirmarExclusao] = useState(null) // item ou null
  const [excluindo, setExcluindo] = useState(false)

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      setItens(await api.listar())
    } catch (e) {
      setErro(
        e instanceof ErroAcessoNegado
          ? e.message
          : e.message || 'Não foi possível carregar os dados.',
      )
    } finally {
      setCarregando(false)
    }
  }, [api])

  useEffect(() => {
    carregar()
  }, [carregar])

  const setCampo = useCallback((chave, valor) => {
    setForm((atual) => ({ ...atual, [chave]: valor }))
  }, [])

  const abrirCriacao = () => {
    setEditando(null)
    setForm(registroPadrao)
    setErroForm('')
    setModalAberto(true)
  }

  const abrirEdicao = (item) => {
    setEditando(item)
    // Garante que todos os campos declarados existam no form.
    setForm({ ...registroPadrao, ...item })
    setErroForm('')
    setModalAberto(true)
  }

  const fecharModal = () => {
    if (salvando) return
    setModalAberto(false)
  }

  const salvar = async (evento) => {
    evento.preventDefault()
    setErroForm('')

    // Validação simples dos campos obrigatórios.
    const faltando = campos
      .filter((c) => c.obrigatorio)
      .filter((c) => {
        const v = form[c.chave]
        return v === undefined || v === null || v === ''
      })
    if (faltando.length > 0) {
      setErroForm(`Preencha os campos obrigatórios: ${faltando.map((c) => c.label).join(', ')}.`)
      return
    }

    setSalvando(true)
    try {
      if (editando) {
        await api.atualizar(editando[chavePrimaria], form)
      } else {
        await api.criar(form)
      }
      setModalAberto(false)
      await carregar()
    } catch (e) {
      setErroForm(e.message || 'Não foi possível salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const excluir = async () => {
    if (!confirmarExclusao) return
    setExcluindo(true)
    try {
      await api.remover(confirmarExclusao[chavePrimaria])
      setConfirmarExclusao(null)
      await carregar()
    } catch (e) {
      setErro(e.message || 'Não foi possível excluir o item.')
      setConfirmarExclusao(null)
    } finally {
      setExcluindo(false)
    }
  }

  const cabecalho = useMemo(
    () => colunas.map((c) => c.label),
    [colunas],
  )

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            {icone && <span aria-hidden>{icone}</span>}
            {titulo}
          </h2>
          {subtitulo && <p className="mt-1 text-sm text-slate-500">{subtitulo}</p>}
        </div>
        <button
          type="button"
          onClick={abrirCriacao}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <span aria-hidden className="text-base leading-none">+</span>
          Novo
        </button>
      </div>

      {erro && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {erro}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {cabecalho.map((label) => (
                  <th key={label} className="px-4 py-3">
                    {label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={colunas.length + 1} className="px-4 py-10 text-center text-slate-400">
                    Carregando…
                  </td>
                </tr>
              ) : itens.length === 0 ? (
                <tr>
                  <td colSpan={colunas.length + 1} className="px-4 py-10 text-center text-slate-400">
                    Nenhum registro cadastrado ainda.
                  </td>
                </tr>
              ) : (
                itens.map((item) => (
                  <tr
                    key={item[chavePrimaria]}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"
                  >
                    {colunas.map((coluna) => (
                      <td key={coluna.chave} className="px-4 py-3 text-slate-700">
                        {coluna.formato
                          ? coluna.formato(item[coluna.chave], item)
                          : String(item[coluna.chave] ?? '—')}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => abrirEdicao(item)}
                          className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmarExclusao(item)}
                          className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de criação/edição */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
            onClick={fecharModal}
          />
          <form
            onSubmit={salvar}
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-slate-900">
              {editando ? 'Editar registro' : `Novo — ${titulo}`}
            </h3>

            <div className="mt-5 space-y-4">
              {campos.map((campo) => (
                <div key={campo.chave}>
                  {campo.tipo !== 'checkbox' && (
                    <label
                      htmlFor={`campo-${campo.chave}`}
                      className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      {campo.label}
                      {campo.obrigatorio && <span className="ml-0.5 text-red-500">*</span>}
                    </label>
                  )}

                  <CampoForm campo={campo} form={form} setCampo={setCampo} />

                  {campo.ajuda && (
                    <p className="mt-1 text-xs text-slate-400">{campo.ajuda}</p>
                  )}
                </div>
              ))}
            </div>

            {erroForm && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
              >
                {erroForm}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={fecharModal}
                disabled={salvando}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvando ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmação de exclusão */}
      {confirmarExclusao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
            onClick={() => !excluindo && setConfirmarExclusao(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Confirmar exclusão</h3>
            <p className="mt-2 text-sm text-slate-600">
              Tem certeza que deseja excluir{' '}
              <span className="font-semibold text-slate-900">
                {rotuloItem(confirmarExclusao)}
              </span>
              ? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmarExclusao(null)}
                disabled={excluindo}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={excluir}
                disabled={excluindo}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {excluindo ? 'Excluindo…' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Renderiza um campo do formulário conforme o tipo declarado.
function CampoForm({ campo, form, setCampo }) {
  if (campo.render) {
    return campo.render({ form, setCampo })
  }

  const id = `campo-${campo.chave}`
  const valor = form[campo.chave]
  const classeInput =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20'

  if (campo.tipo === 'textarea') {
    return (
      <textarea
        id={id}
        rows={3}
        value={valor ?? ''}
        placeholder={campo.placeholder}
        onChange={(e) => setCampo(campo.chave, e.target.value)}
        className={`${classeInput} resize-y`}
      />
    )
  }

  if (campo.tipo === 'select') {
    return (
      <select
        id={id}
        value={valor ?? ''}
        onChange={(e) => setCampo(campo.chave, e.target.value)}
        className={classeInput}
      >
        <option value="" disabled>
          Selecione…
        </option>
        {campo.opcoes?.map((op) => (
          <option key={op.valor} value={op.valor}>
            {op.label}
          </option>
        ))}
      </select>
    )
  }

  if (campo.tipo === 'checkbox') {
    return (
      <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(valor)}
          onChange={(e) => setCampo(campo.chave, e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400/30"
        />
        <span className="text-sm font-medium text-slate-700">{campo.label}</span>
      </label>
    )
  }

  return (
    <input
      id={id}
      type={campo.tipo === 'number' ? 'number' : 'text'}
      value={valor ?? ''}
      placeholder={campo.placeholder}
      onChange={(e) =>
        setCampo(
          campo.chave,
          campo.tipo === 'number'
            ? e.target.value === ''
              ? ''
              : Number(e.target.value)
            : e.target.value,
        )
      }
      className={classeInput}
    />
  )
}
