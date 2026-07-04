import React, { useEffect, useState, useMemo, useRef } from 'react';
import Navbar from '../common/Navbar.jsx';
import { apiUrl } from '../config/api.js';
import { desbloquearEmblema } from '../config/emblemas.js';

export default function AnaliseConsumo() {
  const [consumo, setConsumo] = useState('');
  const [selecionados, setSelecionados] = useState([]);

  const [aparelhos, setAparelhos] = useState([]);
  const [carregandoAparelhos, setCarregandoAparelhos] = useState(true);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  
  const resultadoRef = useRef(null);

  useEffect(() => {
    if (resultado && resultadoRef.current) {
      // Pequeno delay para garantir que a animação inicial do Tailwind não afete o cálculo de posição
      setTimeout(() => {
        resultadoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [resultado]);

  useEffect(() => {
    let ativo = true;
    setCarregandoAparelhos(true);
    setErro('');

    fetch(apiUrl('/api/consumo/eletrodomesticos/?todos=true'), { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (!ativo) return;
        if (data.ok) setAparelhos(data.eletrodomesticos || []);
        else {
          setErro(data.erro || 'Falha ao carregar aparelhos.');
          setAparelhos([]);
        }
      })
      .catch(() => {
        if (!ativo) return;
        setErro('Falha de conexão ao carregar aparelhos.');
        setAparelhos([]);
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

  const impactoFinanceiro = useMemo(() => {
    if (!resultado || !resultado.recomendacao || !consumo) return null;
    
    let excesso = 0;
    // Tenta extrair o número de kWh excedente da string da recomendação
    const match1 = resultado.recomendacao.match(/reduzir cerca de (\d+(?:\.\d+)?) kWh/);
    const match2 = resultado.recomendacao.match(/excesso de aproximadamente (\d+(?:\.\d+)?) kWh/);
    
    if (match1) excesso = Number(match1[1]);
    if (match2) excesso = Number(match2[1]);

    const tarifa = 0.85; // Tarifa base estipulada pela regra de negócio
    const custoAtual = Number(consumo) * tarifa;
    
    if (excesso > 0) {
      const economia = excesso * tarifa;
      const custoFuturo = Math.max(0, custoAtual - economia);
      return { excesso, economia, custoAtual, custoFuturo };
    }
    
    return { excesso: 0, economia: 0, custoAtual, custoFuturo: custoAtual };
  }, [resultado, consumo]);

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
                  min="10"
                  max="999"
                  className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-emerald-400"
                  placeholder="Ex.: 250"
                  value={consumo}
                  onChange={(e) => setConsumo(e.target.value)}
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col max-h-[400px]">
                <label className="block text-sm font-medium text-slate-700 mb-3">Selecione aparelhos</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
                  {carregandoAparelhos ? (
                    <p className="text-sm text-slate-400">Carregando aparelhos...</p>
                  ) : erro ? (
                    <p className="text-sm text-red-600">{erro}</p>
                  ) : aparelhos.length === 0 ? (
                    <p className="text-sm text-slate-400">Nenhum aparelho disponível.</p>
                  ) : (
                    aparelhos.map((item) => (
                      <label 
                        key={item.nome} 
                        className={`flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                          selecionados.includes(item.nome)
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selecionados.includes(item.nome)}
                          onChange={() => toggleSelecionado(item.nome)}
                          className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="truncate flex-1 font-medium">{item.nome}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            {selecionados.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Estimativa de Uso por Aparelho Selecionado</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                   {selecionados.map(nome => {
                     const ap = aparelhos.find(a => a.nome === nome);
                     if (!ap) return null;
                     return (
                       <div key={ap.nome} className="rounded-lg border border-slate-100 bg-slate-50 p-3 shadow-sm hover:shadow-md transition-shadow">
                         <p className="font-semibold text-slate-800 text-sm truncate" title={ap.nome}>{ap.nome}</p>
                         <div className="mt-2 flex justify-between items-center text-xs">
                           <span className="text-slate-500">Consumo base:</span>
                           <span className="font-medium text-slate-700">{ap.consumo_estimado_kwh || '0'} kWh</span>
                         </div>
                         <div className="mt-1 flex justify-between items-center text-xs">
                           <span className="text-slate-500">Custo base:</span>
                           <span className="font-medium text-emerald-600">R$ {ap.custo_estimado_reais || '0.00'}</span>
                         </div>
                       </div>
                     );
                   })}
                </div>
              </div>
            )}

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
                      // RF08 — usou a Análise de Consumo pela primeira vez.
                      desbloquearEmblema('simulador_em_acao');
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
            </div>
            {resultado && (
              <div ref={resultadoRef} className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      resultado.status_consumo === 'dentro_do_ideal' ? 'bg-emerald-200 text-emerald-800' :
                      resultado.status_consumo === 'na_media' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {resultado.status_consumo.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {resultado.recomendacao}
                  </p>
                </div>

                {impactoFinanceiro && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custo Atual Estimado</p>
                       <p className="mt-1 text-2xl font-black text-slate-700">R$ {impactoFinanceiro.custoAtual.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center shadow-sm">
                       <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Economia Possível</p>
                       <p className="mt-1 text-2xl font-black text-emerald-600">- R$ {impactoFinanceiro.economia.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-center shadow-sm">
                       <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">Novo Custo Estimado</p>
                       <p className="mt-1 text-2xl font-black text-cyan-600">R$ {impactoFinanceiro.custoFuturo.toFixed(2)}</p>
                    </div>
                  </div>
                )}
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