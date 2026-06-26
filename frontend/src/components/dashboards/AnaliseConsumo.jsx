import React from 'react';
import Navbar from '../common/Navbar';

export default function AnaliseConsumo() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <div className="relative">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-medium text-emerald-600">Análise de Consumo</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Análise de Consumo</h1>
            <p className="mt-3 max-w-2xl text-slate-500">
              Esta é só a tela inicial. O próximo passo será colocar o formulário e conectar ao backend.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}