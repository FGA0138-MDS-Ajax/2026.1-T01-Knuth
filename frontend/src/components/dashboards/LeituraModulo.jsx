import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import { modulos, getModuloById, getModuloAnterior, getProximoModulo } from '../../data/modulos/index.js';
import {
  marcarModuloConcluido,
  moduloEstaConcluido,
  getModulosConcluidos,
} from '../config/progressoModulos.js';
import { desbloquearEmblema } from '../config/emblemas.js';
import { BlocoConteudo, QuizModulo, renderTextoComNegrito } from './ConteudoModulo';

export default function LeituraModulo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modulo = getModuloById(id);
  const proximoModulo = getProximoModulo(id);
  const moduloAnterior = getModuloAnterior(id);
  const [concluido, setConcluido] = useState(() => moduloEstaConcluido(id));

  useEffect(() => {
    setConcluido(moduloEstaConcluido(id));
  }, [id]);

  // ── Guarda de acesso: módulo bloqueado ──────────────────────────────────────
  // O módulo 1 nunca é bloqueado. Os demais requerem que o anterior esteja concluído.
  const bloqueado = moduloAnterior !== null && !moduloEstaConcluido(moduloAnterior.id);

  if (!modulo) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-800">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Módulo não encontrado</h1>
          <Link to="/ListaModulos" className="mt-6 inline-block text-emerald-600 hover:underline">
            Voltar para a listagem
          </Link>
        </main>
      </div>
    );
  }

  // Tela de bloqueio — exibida se o módulo anterior não foi concluído
  if (bloqueado) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-800">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="bg-white/80 border border-slate-200 rounded-2xl p-10 shadow-sm backdrop-blur-sm">
            <div className="text-5xl mb-6">🔒</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Módulo bloqueado</h1>
            <p className="text-slate-500 mb-2">
              Você precisa concluir o <strong className="text-slate-700">Módulo {moduloAnterior.id}</strong> antes de
              acessar este.
            </p>
            <p className="text-sm text-slate-400 mb-8">
              Complete os módulos em ordem para avançar na trilha de aprendizagem.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={`/modulo-educativo/${moduloAnterior.id}`}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-sm transition-all"
              >
                Ir para o Módulo {moduloAnterior.id}
              </Link>
              <Link
                to="/ListaModulos"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Ver todos os módulos
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Leitura normal ──────────────────────────────────────────────────────────

  function handleMarcarConcluido() {
    marcarModuloConcluido(modulo.id);
    setConcluido(true);

    // RF08 — concluiu qualquer módulo educativo.
    desbloquearEmblema('primeiro_modulo');

    // RF08 — concluiu todos os 8 módulos da trilha.
    // marcarModuloConcluido já gravou este módulo no localStorage de forma
    // síncrona, mas incluímos modulo.id no conjunto por segurança.
    const concluidos = new Set([...getModulosConcluidos(), Number(modulo.id)]);
    if (modulos.every((m) => concluidos.has(m.id))) {
      desbloquearEmblema('trilha_completa');
    }
  }

  function handleProximoModulo() {
    if (proximoModulo) {
      navigate(`/modulo-educativo/${proximoModulo.id}`);
    } else {
      navigate('/ListaModulos');
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-800">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 pb-32">
        <Link
          to="/ListaModulos"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600 mb-6"
        >
          ← Voltar aos módulos
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
              Módulo {modulo.id}
            </span>
            <span className="text-xs text-slate-500">{modulo.duracao} de leitura</span>
            {concluido && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                Concluído
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{modulo.titulo}</h1>
        </header>

        <article className="bg-white/80 border border-emerald-100 rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-sm space-y-4">
          {modulo.introducao.map((bloco, i) => (
            <BlocoConteudo key={`intro-${i}`} bloco={bloco} />
          ))}

          {modulo.secoes.map((secao) => (
            <section key={secao.titulo}>
              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4 pt-4 border-t border-slate-100 first:border-0 first:pt-0">
                {secao.titulo}
              </h2>
              <div className="space-y-4">
                {secao.blocos.map((bloco, i) => (
                  <BlocoConteudo key={`${secao.titulo}-${i}`} bloco={bloco} />
                ))}
              </div>
            </section>
          ))}

          <section className="mt-10 pt-6 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Quiz</h2>
            <QuizModulo key={modulo.id} perguntas={modulo.quiz} />
          </section>

          {modulo.referencias?.length > 0 && (
            <section className="mt-10 pt-6 border-t border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Referências</h2>
              <ul className="space-y-2 text-xs text-slate-500 leading-relaxed">
                {modulo.referencias.map((ref, i) => (
                  <li key={i}>{renderTextoComNegrito(ref)}</li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-wrap gap-3 justify-between items-center">
          <Link
            to="/ListaModulos"
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
          >
            Voltar
          </Link>

          <div className="flex flex-wrap gap-3">
            {!concluido ? (
              <button
                type="button"
                onClick={handleMarcarConcluido}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-sm"
              >
                Marcar como Concluído
              </button>
            ) : (
              <>
                <span className="px-4 py-2 text-sm font-semibold text-emerald-700">
                  Módulo concluído ✓
                </span>
                {proximoModulo ? (
                  <button
                    type="button"
                    onClick={handleProximoModulo}
                    className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-sm"
                  >
                    Próximo Módulo →
                  </button>
                ) : (
                  <Link
                    to="/ListaModulos"
                    className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-sm"
                  >
                    Ver todos os módulos
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
