import React, { useEffect, useState } from 'react';
import Navbar from '../common/Navbar';
import { apiUrl } from '../../config/api';

export default function AnaliseConsumo() {
  const [consumo, setConsumo] = useState('');
  const [selecionados, setSelecionados] = useState([]);

  const [aparelhos, setAparelhos] = useState([]);
  const [carregandoAparelhos, setCarregandoAparelhos] = useState(true);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    let ativo = true;
    setCarregandoAparelhos(true);
    setErro('');

    const exemplosFallback = [
      { nome: 'Geladeira' },
      { nome: 'Chuveiro Elétrico' },
      { nome: 'Ar Condicionado' },
      { nome: 'Televisão' },
      { nome: 'Computador' },
    ];

    fetch(apiUrl('/api/consumo/eletrodomesticos/'), { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (!ativo) return;
        if (data.ok) setAparelhos(data.eletrodomesticos || []);
        else {
          setErro((data.erro || 'Falha ao carregar aparelhos.') + ' Usando lista de exemplo.');
          setAparelhos(exemplosFallback);
        }
      })
      .catch(() => {
        if (!ativo) return;
        setErro('Falha de conexão ao carregar aparelhos. Usando lista de exemplo.');
        setAparelhos(exemplosFallback);
      })
      .finally(() => {
        if (!ativo) return;
        setCarregandoAparelhos(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const toggleSelecionado = (nome) => {
    setSelecionados((prev) =>
      prev.includes(nome) ? prev.filter((p) => p !== nome) : [...prev, nome]
    );
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
          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm space-y-6">
            <div>
              <p className="text-sm font-medium text-emerald-600">Análise de Consumo</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Análise de Consumo</h1>
              <p className="mt-3 max-w-2xl text-slate-500">
                Informe o seu consumo real e selecione os aparelhos para receber recomendações.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <label className="block text-sm font-medium text-slate-700">Consumo real (kWh)</label>
                <input
                  type="number"
                  min="1"
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400"
                  placeholder="Ex.: 250"
                  value={consumo}
                  onChange={(e) => setConsumo(e.target.value)}
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <label className="block text-sm font-medium text-slate-700">Selecione aparelhos</label>
                <div className="mt-3 grid gap-2">
                  {carregandoAparelhos ? (
                    <p className="text-sm text-slate-400">Carregando aparelhos...</p>
                  ) : erro ? (
                    <p className="text-sm text-red-600">{erro}</p>
                  ) : aparelhos.length === 0 ? (
                    <p className="text-sm text-slate-400">Nenhum aparelho disponível.</p>
                  ) : (
                    aparelhos.map((item) => (
                      <label key={item.nome} className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selecionados.includes(item.nome)}
                          onChange={() => toggleSelecionado(item.nome)}
                          className="h-4 w-4 rounded border-slate-200"
                        />
                        <span className="text-slate-700">{item.nome}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={async () => {
                  setErro('');
                  setResultado(null);
                  setEnviando(true);
                  try {
                    const resp = await fetch(apiUrl('/api/consumo/analise-reducao/'), {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify({
                        consumo_real_kwh: Number(consumo),
                        eletrodomesticos_selecionados: selecionados,
                      }),
                    });
                    const data = await resp.json();
                    if (resp.ok && data.resultado) {
                      setResultado(data.resultado);
                    } else {
                      setErro(data.erro || 'Erro ao analisar consumo.');
                    }
                  } catch (e) {
                    setErro('Falha de comunicação com o servidor.');
                  } finally {
                    setEnviando(false);
                  }
                }}
                disabled={!(Number(consumo) > 0 && selecionados.length > 0) || enviando}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60"
              >
                {enviando ? 'Analisando...' : 'Analisar consumo'}
              </button>
              <p className="mt-2 text-xs text-slate-400">Botão desabilitado: integração com backend na próxima etapa.</p>
            </div>
            {resultado && (
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-slate-700">Status: {resultado.status_consumo}</p>
                <p className="mt-2 text-sm text-slate-800 whitespace-pre-line">{resultado.recomendacao}</p>
              </div>
            )}
            {erro && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{erro}</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}