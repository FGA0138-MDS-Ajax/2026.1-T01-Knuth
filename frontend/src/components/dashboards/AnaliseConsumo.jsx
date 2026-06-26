import React, { useState } from 'react';
import Navbar from '../common/Navbar';

export default function AnaliseConsumo() {
  const [consumo, setConsumo] = useState('');
  const [selecionados, setSelecionados] = useState([]);

  const exemplos = [
    'Geladeira',
    'Chuveiro Elétrico',
    'Ar Condicionado',
    'Televisão',
    'Computador',
  ];

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
                  {exemplos.map((nome) => (
                    <label key={nome} className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selecionados.includes(nome)}
                        onChange={() => toggleSelecionado(nome)}
                        className="h-4 w-4 rounded border-slate-200"
                      />
                      <span className="text-slate-700">{nome}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <button
                disabled
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60"
              >
                Analisar consumo (em breve)
              </button>
              <p className="mt-2 text-xs text-slate-400">Botão desabilitado: integração com backend na próxima etapa.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}