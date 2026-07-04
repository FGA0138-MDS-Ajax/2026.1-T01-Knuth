import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Exibe um toast animado sempre que um emblema é desbloqueado.
 *
 * Ouve o evento de janela 'emblema-desbloqueado' (disparado por
 * config/emblemas.js → desbloquearEmblema). Cada toast some sozinho após alguns
 * segundos. Como é montado dentro da Navbar, fica disponível em todas as telas
 * autenticadas sem precisar de provider global.
 */

const DURACAO_MS = 5000;

export default function EmblemaToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function aoDesbloquear(evento) {
      const emblema = evento.detail;
      if (!emblema) return;

      const idToast = `${emblema.id}-${Date.now()}`;
      setToasts((atuais) => [...atuais, { ...emblema, idToast }]);

      setTimeout(() => {
        setToasts((atuais) => atuais.filter((t) => t.idToast !== idToast));
      }, DURACAO_MS);
    }

    window.addEventListener('emblema-desbloqueado', aoDesbloquear);
    return () => window.removeEventListener('emblema-desbloqueado', aoDesbloquear);
  }, []);

  const removerToast = (idToast) =>
    setToasts((atuais) => atuais.filter((t) => t.idToast !== idToast));

  if (toasts.length === 0) return null;

  // Portal no body: a Navbar usa backdrop-blur, que cria um containing block e
  // quebraria o posicionamento `fixed` do toast.
  return createPortal(
    <div className="fixed top-20 right-4 z-[60] flex flex-col gap-3 max-w-[90vw]">
      {toasts.map((toast) => (
        <div
          key={toast.idToast}
          role="status"
          className="flex items-center gap-4 w-96 max-w-full rounded-2xl border border-emerald-200 bg-white/95 p-4 pr-5 shadow-xl shadow-emerald-500/10 backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-500"
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-md" />
            <img
              src={toast.imagem}
              alt={toast.nome}
              className="relative h-20 w-20 object-contain drop-shadow"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-600">
              Emblema desbloqueado!
            </p>
            <p className="truncate text-base font-bold text-slate-800">{toast.nome}</p>
            <p className="truncate text-sm text-slate-500">{toast.comoDesbloquear}</p>
          </div>
          <button
            type="button"
            onClick={() => removerToast(toast.idToast)}
            aria-label="Fechar"
            className="shrink-0 self-start text-slate-300 hover:text-slate-500 transition-colors"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}
