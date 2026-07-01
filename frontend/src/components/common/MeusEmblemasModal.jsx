import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  EMBLEMAS,
  getEmblemasDesbloqueados,
  sincronizarEmblemasDoServidor,
} from '../../config/emblemas';

/**
 * Modal "Meus Emblemas" — grade com todos os emblemas do RF08.
 *
 * - Emblemas conquistados aparecem coloridos.
 * - Emblemas bloqueados aparecem como silhueta, junto com a dica de como
 *   desbloqueá-los.
 *
 * Ao abrir, sincroniza com o servidor (best-effort) e relê o cache local.
 */
export default function MeusEmblemasModal({ aberto, onFechar }) {
  const [desbloqueados, setDesbloqueados] = useState(() => getEmblemasDesbloqueados());

  // Sincroniza ao abrir. sincronizarEmblemasDoServidor() sempre resolve com a
  // lista correta (retorna o cache local quando offline ou sem endpoint), então
  // o .then também cobre a releitura do localStorage — sem setState síncrono.
  useEffect(() => {
    if (!aberto) return;

    let ativo = true;
    sincronizarEmblemasDoServidor().then((ids) => {
      if (ativo) setDesbloqueados(ids);
    });

    return () => {
      ativo = false;
    };
  }, [aberto]);

  // Fecha com a tecla Esc.
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e) => {
      if (e.key === 'Escape') onFechar();
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  const total = EMBLEMAS.length;
  const conquistados = desbloqueados.length;
  const percentual = total > 0 ? Math.round((conquistados / total) * 100) : 0;

  // Renderiza via portal no body: a Navbar (<nav>) usa backdrop-blur, que cria
  // um containing block e quebraria o posicionamento `fixed` do modal.
  return createPortal(
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onFechar}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Painel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Meus emblemas"
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Cabeçalho */}
        <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Meus Emblemas</h2>
              <p className="mt-1 text-sm text-slate-500">
                Conquiste emblemas usando o EducaEnergia.
              </p>
            </div>
            <button
              type="button"
              onClick={onFechar}
              aria-label="Fechar"
              className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-white/70 hover:text-slate-600 transition-colors"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          {/* Progresso */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
              <span>
                {conquistados} de {total} conquistados
              </span>
              <span>{percentual}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${percentual}%` }}
              />
            </div>
          </div>
        </div>

        {/* Grade de emblemas */}
        <div className="grid grid-cols-2 gap-4 overflow-y-auto p-6 sm:grid-cols-3">
          {EMBLEMAS.map((emblema) => {
            const conquistado = desbloqueados.includes(emblema.id);
            return (
              <div
                key={emblema.id}
                title={conquistado ? emblema.comoDesbloquear : undefined}
                className={`group relative flex flex-col items-center rounded-2xl border p-4 text-center transition ${
                  conquistado
                    ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/60 to-white shadow-sm'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="relative mb-3 flex h-20 w-20 items-center justify-center">
                  <img
                    src={emblema.imagem}
                    alt={emblema.nome}
                    className={`h-20 w-20 object-contain transition ${
                      conquistado
                        ? 'drop-shadow'
                        : '[filter:brightness(0)] opacity-20'
                    }`}
                  />
                  {!conquistado && (
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-xs shadow-sm">
                      🔒
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm font-bold ${
                    conquistado ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  {emblema.nome}
                </p>

                {conquistado ? (
                  <>
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Conquistado
                    </span>
                    {/* Tooltip no hover: o que o usuário fez para conquistar.
                        Fica dentro do card para não ser cortado pelo scroll da grade. */}
                    <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10 translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="rounded-lg bg-slate-800/95 px-3 py-2 text-[11px] font-medium leading-snug text-white shadow-lg">
                        {emblema.comoDesbloquear}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="mt-1.5 text-[11px] leading-snug text-slate-400">
                    {emblema.comoDesbloquear}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
