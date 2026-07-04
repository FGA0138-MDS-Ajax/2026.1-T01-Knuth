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
import { apiUrl } from '../config/api.js';
import Navbar from '../common/Navbar.jsx';

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

const formatoReais = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatoKwh = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
});

function numeroSeguro(valor) {
  const numero = Number.parseFloat(valor);
  return Number.isFinite(numero) ? numero : 0;
}

function VariacaoBadge({ percentual }) {
  if (percentual === null || percentual === undefined || Number.isNaN(Number(percentual))) {
    return <span className="text-slate-400">—</span>;
  }

  const valor = Number(percentual);
  const subiu = valor > 0;
  const estavel = Math.abs(valor) < 0.05;

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
      {Math.abs(valor).toFixed(1)}%
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
  const [relatorio, setRelatorio] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const response = await fetch(apiUrl('/api/consumo/relatorio-gastos/'), {
          credentials: 'include',
        });
        const data = await response.json();

        if (!ativo) return;

        if (response.ok && data.ok) {
          setRelatorio(data);
          setErro('');
        } else {
          setErro(data.erro || 'Não foi possível carregar o relatório.');
          setRelatorio(null);
        }
      } catch {
        if (ativo) {
          setErro('Falha de conexão com o servidor. Verifique se o backend está rodando.');
          setRelatorio(null);
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

  const historico = relatorio?.historico || [];
  const seriesMensais = relatorio?.series_mensais || [];
  const resumo = relatorio?.resumo || {};
  const graficos = relatorio?.graficos || {};

  const labels = graficos.meses || [];
  const consumoMensal = useMemo(
    () => (graficos.consumo_mensal_kwh || []).map(numeroSeguro),
    [graficos.consumo_mensal_kwh]
  );
  const gastosEstimados = useMemo(
    () => (graficos.gastos_estimados_reais || []).map(numeroSeguro),
    [graficos.gastos_estimados_reais]
  );

  const consumoChart = {
    labels,
    datasets: [
      {
        label: 'Consumo mensal (kWh)',
        data: consumoMensal,
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
    labels,
    datasets: [
      {
        label: 'Gasto estimado (R$/mês)',
        data: gastosEstimados,
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
              Acompanhe sua evolução energética e financeira com base nas simulações salvas no banco.
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

          {!carregando && !erro && historico.length === 0 && (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
                📊
              </div>
              <p className="text-slate-600 font-medium">
                Você ainda não tem simulações salvas.
              </p>
              <p className="mt-1 max-w-sm text-sm text-slate-400">
                Use a Análise de Consumo ou salve uma simulação de consumo médio para iniciar seu histórico.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link
                  to="/rf05"
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
                >
                  Fazer análise de consumo
                </Link>
                <Link
                  to="/consumo-medio"
                  className="rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Nova simulação
                </Link>
              </div>
            </div>
          )}

          {!carregando && !erro && historico.length > 0 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">Simulações salvas</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {resumo.total_simulacoes || 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">Consumo no último mês</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {formatoKwh.format(numeroSeguro(resumo.consumo_ultimo_mes_kwh))}
                    <span className="ml-1 text-sm font-medium text-slate-400">kWh/mês</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">Gasto estimado no último mês</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {formatoReais.format(numeroSeguro(resumo.gasto_ultimo_mes_reais))}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
                  <p className="text-sm text-slate-500">Variação vs. mês anterior</p>
                  <p className="mt-2">
                    <VariacaoBadge percentual={resumo.variacao_ultimo_mes_percentual} />
                  </p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <h2 className="text-sm font-semibold text-slate-700">
                    Consumo mensal ao longo do tempo
                  </h2>
                  <p className="mb-4 text-xs text-slate-400">
                    Série mensal retornada pelo backend a partir dos registros persistidos.
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
                    Valores salvos no banco em cada simulação.
                  </p>
                  <div className="h-64">
                    <Bar data={gastoChart} options={gastoOptions} />
                  </div>
                </div>
              </div>

              {seriesMensais.length === 1 && (
                <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                  Seu relatório já funciona com apenas 1 mês registrado. Continue salvando novas simulações
                  nos próximos meses para visualizar a variação de consumo.
                </div>
              )}

              <div className="rounded-2xl border border-emerald-100 bg-white/80 shadow-sm backdrop-blur-sm">
                <div className="border-b border-emerald-100/80 px-6 py-4">
                  <h2 className="text-sm font-semibold text-slate-700">
                    Resumo mensal
                  </h2>
                  <p className="text-xs text-slate-400">
                    Consumo, gasto estimado e variação agregados por mês.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-wide text-slate-400">
                        <th className="px-6 py-3 font-semibold">Mês</th>
                        <th className="px-6 py-3 font-semibold text-right">Simulações</th>
                        <th className="px-6 py-3 font-semibold text-right">Consumo mensal</th>
                        <th className="px-6 py-3 font-semibold text-right">Gasto estimado</th>
                        <th className="px-6 py-3 font-semibold text-right">Variação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seriesMensais.map((mes) => (
                        <tr
                          key={mes.chave}
                          className="border-t border-slate-100 transition-colors hover:bg-emerald-50/40"
                        >
                          <td className="whitespace-nowrap px-6 py-3.5 font-medium text-slate-700">
                            {mes.rotulo}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3.5 text-right text-slate-500">
                            {mes.quantidade_simulacoes}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3.5 text-right text-slate-700">
                            {formatoKwh.format(numeroSeguro(mes.consumo_mensal_kwh))}{' '}
                            <span className="text-slate-400">kWh/mês</span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3.5 text-right font-medium text-slate-700">
                            {formatoReais.format(numeroSeguro(mes.gasto_estimado_reais))}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3.5 text-right">
                            <VariacaoBadge percentual={mes.variacao_percentual} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

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
                        <th className="px-6 py-3 font-semibold text-right">Consumo médio</th>
                        <th className="px-6 py-3 font-semibold text-right">Gasto estimado</th>
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
                            {formatoKwh.format(numeroSeguro(simulacao.consumo_medio_mensal_kwh))}{' '}
                            <span className="text-slate-400">kWh/mês</span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3.5 text-right font-medium text-slate-700">
                            {formatoReais.format(numeroSeguro(simulacao.custo_estimado_reais))}
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
