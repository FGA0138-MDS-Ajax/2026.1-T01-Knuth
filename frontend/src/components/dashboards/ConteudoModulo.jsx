import React from 'react';
import { desbloquearEmblema } from '../../config/emblemas';

export function renderTextoComNegrito(texto) {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g);
  return partes.map((parte, indice) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return (
        <strong key={indice} className="font-semibold text-slate-900">
          {parte.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={indice}>{parte}</React.Fragment>;
  });
}

export function BlocoConteudo({ bloco }) {
  switch (bloco.tipo) {
    case 'paragrafo':
      return (
        <p className="text-slate-700 leading-relaxed">{renderTextoComNegrito(bloco.texto)}</p>
      );
    case 'subtitulo':
      return (
        <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">{bloco.texto}</h3>
      );
    case 'lista':
      return (
        <ul className="list-disc list-inside space-y-2 text-slate-700 leading-relaxed ml-2">
          {bloco.itens.map((item, i) => (
            <li key={i}>{renderTextoComNegrito(item)}</li>
          ))}
        </ul>
      );
    case 'destaque':
      return (
        <aside className="my-6 rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700 mb-2">Dica</p>
          <p className="text-sm text-slate-700 leading-relaxed">{renderTextoComNegrito(bloco.texto)}</p>
        </aside>
      );
    case 'formula':
      return (
        <div className="my-4 rounded-lg bg-slate-100 border border-slate-200 px-4 py-3 text-center font-mono text-sm text-slate-800">
          {renderTextoComNegrito(bloco.texto)}
        </div>
      );
    default:
      return null;
  }
}

export function QuizModulo({ perguntas }) {
  const [respostas, setRespostas] = React.useState({});

  function selecionarResposta(indicePergunta, indiceOpcao) {
    if (respostas[indicePergunta] !== undefined) return;
    setRespostas((prev) => ({ ...prev, [indicePergunta]: indiceOpcao }));
  }

  // RF08 — conquistas do quiz. Avalia sempre que todas as perguntas tiverem
  // sido respondidas (cada pergunta é respondida uma única vez).
  React.useEffect(() => {
    const total = perguntas.length;
    if (total === 0) return;
    if (Object.keys(respostas).length < total) return;

    // "Mente Curiosa" — concluiu o quiz (respondeu todas as perguntas).
    desbloquearEmblema('mente_curiosa');

    // "Quiz Perfeito" — acertou 100% das perguntas.
    const todasCorretas = perguntas.every(
      (pergunta, i) => pergunta.opcoes[respostas[i]]?.correta
    );
    if (todasCorretas) desbloquearEmblema('quiz_perfeito');
  }, [respostas, perguntas]);

  return (
    <div className="space-y-6">
      {perguntas.map((pergunta, indicePergunta) => {
        const respostaSelecionada = respostas[indicePergunta];

        return (
          <div key={indicePergunta} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-semibold text-slate-800 mb-4">
              {indicePergunta + 1}. {pergunta.pergunta}
            </p>
            <div className="space-y-2">
              {pergunta.opcoes.map((opcao, indiceOpcao) => {
                const selecionada = respostaSelecionada === indiceOpcao;
                const revelado = respostaSelecionada !== undefined;
                let estilo = 'border-slate-200 bg-slate-50 hover:bg-slate-100';

                if (revelado && selecionada) {
                  estilo = opcao.correta
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-red-300 bg-red-50 text-red-800';
                } else if (revelado && opcao.correta) {
                  estilo = 'border-emerald-200 bg-emerald-50/50 text-emerald-700';
                }

                return (
                  <button
                    key={opcao.letra}
                    type="button"
                    onClick={() => selecionarResposta(indicePergunta, indiceOpcao)}
                    disabled={revelado}
                    className={`w-full text-left rounded-lg border px-4 py-2.5 text-sm transition-colors ${estilo} ${revelado ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className="font-medium">{opcao.letra})</span> {opcao.texto}
                    {revelado && selecionada && opcao.correta && (
                      <span className="ml-2 text-emerald-600 text-xs font-medium">Correto</span>
                    )}
                    {revelado && selecionada && !opcao.correta && (
                      <span className="ml-2 text-red-500 text-xs font-medium">Incorreto</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
