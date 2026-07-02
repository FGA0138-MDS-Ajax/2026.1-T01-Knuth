import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { apiUrl } from '../../config/api';
import Navbar from '../common/Navbar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

// Tarifa de referência (bandeira verde), a mesma usada pelo backend nos
// eletrodomésticos. Simulações antigas foram salvas com custo 0, então o
// gasto é derivado do consumo persistido quando o custo não existe no banco.
const TARIFA_REFERENCIA = 0.85;

const formatoReais = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatoKwh = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
});

function gastoDaSimulacao(simulacao) {
  const custoSalvo = parseFloat(simulacao.custo_estimado_reais);
  if (custoSalvo > 0) return custoSalvo;
  return parseFloat(simulacao.consumo_medio_mensal_kwh) * TARIFA_REFERENCIA;
}

function rotuloMes(data) {
  const mes = data.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  return `${mes}/${String(data.getFullYear()).slice(-2)}`;
}

// Agrega as simulações por mês de criação: consumo médio, gasto estimado
// e variação percentual em relação ao mês anterior.
function agregarPorMes(simulacoes) {
  const porMes = new Map();

  for (const simulacao of simulacoes) {
    const data = new Date(simulacao.criado_em);
    const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;

    if (!porMes.has(chave)) {
      porMes.set(chave, { chave, rotulo: rotuloMes(data), consumos: [], gastos: [] });
    }

    const mes = porMes.get(chave);
    mes.consumos.push(parseFloat(simulacao.consumo_medio_mensal_kwh));
    mes.gastos.push(gastoDaSimulacao(simulacao));
  }

  const media = (valores) =>
    valores.reduce((soma, v) => soma + v, 0) / valores.length;

  const meses = [...porMes.values()]
    .sort((a, b) => a.chave.localeCompare(b.chave))
    .map((mes) => ({
      chave: mes.chave,
      rotulo: mes.rotulo,
      simulacoes: mes.consumos.length,
      consumoMedioKwh: media(mes.consumos),
      gastoEstimado: media(mes.gastos),
    }));

  return meses.map((mes, i) => {
    const anterior = meses[i - 1];
    const variacaoPercentual =
      anterior && anterior.consumoMedioKwh > 0
        ? ((mes.consumoMedioKwh - anterior.consumoMedioKwh) / anterior.consumoMedioKwh) * 100
        : null;
    return { ...mes, variacaoPercentual };
  });
}

function VariacaoBadge({ percentual }) {
  if (percentual === null || Number.isNaN(percentual)) {
    return <span className="text-slate-400">—</span>;
  }

  const subiu = percentual > 0;
  const estavel = Math.abs(percentual) < 0.05;

  if (estavel) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
        estável
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        subiu ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      <span aria-hidden>{subiu ? '▲' : '▼'}</span>
      {Math.abs(percentual).toFixed(1)}%
    </span>
  );
}

const escalaBase = {
  x: { ticks: { color: '#64748b' }, grid: { display: false } },
  y: {
    beginAtZero: true,
    ticks: { color: '#64748b' },
    grid: { color: 'rgba(148, 163, 184, 0.15)' },
  },
};

export default function RelatorioGastos() {
  const [simulacoes, setSimulacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const response = await fetch(apiUrl('/api/consumo/simulacoes/minhas/'), {
          credentials: 'include',
        });
        const data = await response.json();
        if (!ativo) return;
        if (data.ok) {
          setSimulacoes(data.simulacoes || []);
        } else {
          setErro(data.erro || 'Não foi possível carregar o relatório.');
        }
      } catch {
        if (ativo) {
          setErro('Falha de conexão com o servidor. Verifique se o backend está rodando.');
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const meses = useMemo(() => agregarPorMes(simulacoes), [simulacoes]);

  const historico = useMemo(
    () =>
      [...simulacoes].sort(
        (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
      ),
    [simulacoes]
  );

  const mesAtual = meses[meses.length - 1] || null;

  const consumoChart = {
    labels: meses.map((m) => m.rotulo),
    datasets: [
      {
        label: 'Consumo médio (kWh/mês)',
        data: meses.map((m) => m.consumoMedioKwh),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const consumoOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${formatoKwh.format(ctx.parsed.y)} kWh/mês`,
        },
      },
    },
    scales: {
      ...escalaBase,
      y: {
        ...escalaBase.y,
        title: { display: true, text: 'kWh', color: '#64748b' },
      },
    },
  };

  const gastoChart = {
    labels: meses.map((m) => m.rotulo),
    datasets: [
      {
        label: 'Gasto estimado (R$/mês)',
        data: meses.map((m) => m.gastoEstimado),
        backgroundColor: 'rgba(6, 182, 212, 0.65)',
        hoverBackgroundColor: 'rgba(6, 182, 212, 0.9)',
        borderRadius: 6,
        maxBarThickness: 48,
      },
    ],
  };

  const gastoOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${formatoReais.format(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      ...escalaBase,
      y: {
        ...escalaBase.y,
        title: { display: true, text: 'R$', color: '#64748b' },
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <div className="relative">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Relatórios e Histórico</h1>
            <p className="mt-1 text-slate-500">
              Acompanhe a evolução do seu consumo e dos gastos estimados a partir das
              suas simulações salvas.
            </p>
          </div>

          {carregando && (
            <div className="flex min-h-[300px] items-center justify-center text-slate-400">
              <p className="text-sm">Carregando seu relatório...</p>
            </div>
          )}

          {!carregando && erro && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {erro}
            </div>
          )}

          {!carregando && !erro && simulacoes.length === 0 && (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
                📊
              </div>
              <p className="text-slate-600 font-medium">
                Você ainda não tem simulações salvas.
              </p>
              <p className="mt-1 max-w-sm text-sm text-slate-400">
                Salve sua primeira simulação de consumo para começar a acompanhar seu
                histórico financeiro e energético.
              </p>
              <Link
                to="/consumo-medio"
                className="mt-5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
              >
                Fazer minha primeira simulação
              </Link>
            </div>
          )}

          {!carregando && !erro && simulacoes.length > 0 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">Simulações salvas</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {simulacoes.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">Consumo no último mês</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {formatoKwh.format(mesAtual.consumoMedioKwh)}
                    <span className="ml-1 text-sm font-medium text-slate-400">kWh/mês</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">Gasto estimado no último mês</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {formatoReais.format(mesAtual.gastoEstimado)}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">Variação vs. mês anterior</p>
                  <p className="mt-2">
                    <VariacaoBadge percentual={mesAtual.variacaoPercentual} />
                  </p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <h2 className="text-sm font-semibold text-slate-700">
                    Consumo médio ao longo dos meses
                  </h2>
                  <p className="mb-4 text-xs text-slate-400">
                    Média das simulações registradas em cada mês (kWh/mês).
                  </p>
                  <div className="h-64">
                    <Line data={consumoChart} options={consumoOptions} />
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <h2 className="text-sm font-semibold text-slate-700">
                    Gasto estimado por mês
                  </h2>
                  <p className="mb-4 text-xs text-slate-400">
                    Tarifa de referência de {formatoReais.format(TARIFA_REFERENCIA)}/kWh
                    (bandeira verde).
                  </p>
                  <div className="h-64">
                    <Bar data={gastoChart} options={gastoOptions} />
                  </div>
                </div>
              </div>

              {meses.length === 1 && (
                <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                  Você tem simulações em apenas 1 mês. Continue salvando simulações nos
                  próximos meses para visualizar a curva de evolução e a variação.
                </div>
              )}

              <div className="rounded-2xl border border-emerald-100 bg-white/80 shadow-sm backdrop-blur-sm">
                <div className="border-b border-emerald-100/80 px-6 py-4">
                  <h2 className="text-sm font-semibold text-slate-700">
                    Histórico de simulações
                  </h2>
                  <p className="text-xs text-slate-400">
                    Todas as suas simulações salvas, da mais recente para a mais antiga.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-wide text-slate-400">
                        <th className="px-6 py-3 font-semibold">Data</th>
                        <th className="px-6 py-3 font-semibold">Título</th>
                        <th className="px-6 py-3 font-semibold">Período</th>
                        <th className="px-6 py-3 font-semibold text-right">
                          Consumo médio
                        </th>
                        <th className="px-6 py-3 font-semibold text-right">
                          Gasto estimado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {historico.map((simulacao) => (
                        <tr
                          key={simulacao.id}
                          className="border-t border-slate-100 transition-colors hover:bg-emerald-50/40"
                        >
                          <td className="whitespace-nowrap px-6 py-3.5 text-slate-500">
                            {new Date(simulacao.criado_em).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-3.5 font-medium text-slate-700">
                            {simulacao.titulo}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3.5 text-slate-500">
                            {simulacao.meses_analisados}{' '}
                            {simulacao.meses_analisados === 1 ? 'mês' : 'meses'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3.5 text-right text-slate-700">
                            {formatoKwh.format(
                              parseFloat(simulacao.consumo_medio_mensal_kwh)
                            )}{' '}
                            <span className="text-slate-400">kWh/mês</span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3.5 text-right font-medium text-slate-700">
                            {formatoReais.format(gastoDaSimulacao(simulacao))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
