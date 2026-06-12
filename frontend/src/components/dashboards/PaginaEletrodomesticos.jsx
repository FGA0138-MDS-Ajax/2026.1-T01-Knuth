import React, { useCallback, useEffect, useState } from 'react';
import { apiUrl } from '../../config/api';
import Navbar from '../common/Navbar';

function CardEletrodomestico({ item, destaque }) {
  return (
    <div
      className={`rounded-xl border p-4 transition hover:shadow-md ${
        destaque
          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800 truncate">{item.nome}</h3>
          <p className="mt-1 text-sm text-slate-500">Potência média</p>
        </div>
        <div className="shrink-0 rounded-lg bg-white/80 px-3 py-1.5 text-right shadow-sm">
          <span className="text-lg font-bold text-emerald-600">{item.potencia_media_watts}</span>
          <span className="ml-0.5 text-xs font-medium text-slate-500">W</span>
        </div>
      </div>
    </div>
  );
}

export default function PaginaEletrodomesticos() {
  const [eletrodomesticos, setEletrodomesticos] = useState([]);
  const [busca, setBusca] = useState('');
  const [modoBusca, setModoBusca] = useState(false);
  const [mensagemVazia, setMensagemVazia] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarEletrodomesticos = useCallback(async (termo = '') => {
    setCarregando(true);
    setErro('');
    setMensagemVazia('');

    const url = termo.trim()
      ? apiUrl(`/api/consumo/eletrodomesticos/?busca=${encodeURIComponent(termo.trim())}`)
      : apiUrl('/api/consumo/eletrodomesticos/');

    try {
      const response = await fetch(url, {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.ok) {
        setEletrodomesticos(data.eletrodomesticos || []);
        setMensagemVazia(data.mensagem || '');
        setModoBusca(Boolean(termo.trim()));
      } else {
        setErro(data.erro || 'Não foi possível carregar os eletrodomésticos.');
        setEletrodomesticos([]);
      }
    } catch {
      setErro('Falha de conexão com o servidor. Verifique se o backend está rodando.');
      setEletrodomesticos([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarEletrodomesticos();
  }, [carregarEletrodomesticos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (busca.trim()) {
        carregarEletrodomesticos(busca);
      } else if (modoBusca) {
        carregarEletrodomesticos();
        setModoBusca(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [busca, carregarEletrodomesticos, modoBusca]);

  const limparBusca = () => {
    setBusca('');
    setModoBusca(false);
    carregarEletrodomesticos();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <div className="relative">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Eletrodomésticos</h1>
            <p className="mt-1 text-slate-500">
              Consulte a potência média dos aparelhos mais comuns ou pesquise outros itens do catálogo.
            </p>
          </div>

          <div className="mb-6 rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <label htmlFor="busca-eletrodomesticos" className="block text-sm font-medium text-slate-700">
              Pesquisar eletrodoméstico
            </label>
            <div className="mt-2 flex gap-3">
              <input
                id="busca-eletrodomesticos"
                type="search"
                placeholder="Ex.: ventilador, fogão, monitor..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
              />
              {busca && (
                <button
                  type="button"
                  onClick={limparBusca}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Limpar
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Os 10 aparelhos em destaque aparecem abaixo. Use a busca para encontrar os demais do catálogo.
            </p>
          </div>

          {erro && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {erro}
            </div>
          )}

          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-800">
                {modoBusca ? 'Resultados da busca' : 'Top 10 — mais comuns'}
              </h2>
              {!modoBusca && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  Destaque
                </span>
              )}
            </div>

            {carregando ? (
              <div className="flex min-h-[200px] items-center justify-center text-slate-400">
                <p className="text-sm">Carregando eletrodomésticos...</p>
              </div>
            ) : mensagemVazia ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl">
                  🔍
                </div>
                <p className="text-sm text-slate-500">{mensagemVazia}</p>
              </div>
            ) : eletrodomesticos.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-center text-slate-400">
                <p className="text-sm">Nenhum eletrodoméstico encontrado.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {eletrodomesticos.map((item) => (
                  <CardEletrodomestico
                    key={item.id}
                    item={item}
                    destaque={!modoBusca && item.destaque}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
