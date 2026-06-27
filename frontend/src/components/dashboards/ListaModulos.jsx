import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../common/Navbar';
import { Link } from 'react-router-dom';
import { modulos } from '../../data/modulos';
import { getModulosConcluidos, sincronizarProgressoDoServidor } from '../../config/progressoModulos';

export default function ListaModulos() {
  // Estado dos IDs concluídos — inicializa com o cache local (sem latência)
  const [concluidosIds, setConcluidosIds] = useState(() => getModulosConcluidos());

  // Ao montar: sincroniza com o servidor e atualiza o estado se necessário
  useEffect(() => {
    sincronizarProgressoDoServidor().then((ids) => {
      setConcluidosIds(ids);
    });
  }, []);

  const modulosComStatus = useMemo(
    () =>
      modulos.map((modulo) => ({
        ...modulo,
        concluido: concluidosIds.includes(modulo.id),
      })),
    [concluidosIds]
  );

  const concluidos = modulosComStatus.filter((m) => m.concluido).length;
  const total = modulosComStatus.length;
  const progresso = Math.round((concluidos / total) * 100);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-800">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Módulos de Aprendizagem</h1>
          <p className="mt-2 text-slate-500">
            Aprenda sobre energia limpa e descubra como atrelar sustentabilidade à economia na sua conta de luz.
          </p>
        </div>

        <div className="bg-white/80 border border-emerald-100 rounded-2xl p-6 shadow-sm backdrop-blur-sm mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-slate-700">Seu Progresso</h2>
            <span className="text-emerald-600 font-bold">{progresso}% concluído</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p className="text-sm text-slate-400 mt-2">
            Você concluiu {concluidos} de {total} módulos.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modulosComStatus.map((modulo) => (
            <div
              key={modulo.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                  Módulo {modulo.id}
                </span>
                {modulo.concluido ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                    Concluído
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {modulo.duracao}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-800 mb-2">{modulo.titulo}</h3>
              <p className="text-sm text-slate-500 mb-5 flex-1">{modulo.descricao}</p>

              <Link
                to={`/modulo-educativo/${modulo.id}`}
                className={`text-center py-2 rounded-lg text-sm font-semibold transition-colors ${
                  modulo.concluido
                    ? 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {modulo.concluido ? 'Ler Novamente' : 'Começar Leitura'}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
