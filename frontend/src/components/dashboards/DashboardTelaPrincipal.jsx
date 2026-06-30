import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Link, useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { apiUrl } from '../../config/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DashboardTelaPrincipal() {
  const [simulacoes, setSimulacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const carregarDados = () => {
    setLoading(true);
    fetch(apiUrl('/api/consumo/simulacoes/minhas/'), { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        setSimulacoes(data.simulacoes || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarDados();
  }, [location]);

  const totalSimulacoes = simulacoes.length;
  const mediaGeral =
    totalSimulacoes > 0
      ? (
          simulacoes.reduce(
            (acc, s) => acc + parseFloat(s.consumo_medio_mensal_kwh || 0),
            0
          ) / totalSimulacoes
        ).toFixed(2)
      : '0.00';
  const maiorConsumo =
    totalSimulacoes > 0
      ? Math.max(
          ...simulacoes.map((s) => parseFloat(s.consumo_medio_mensal_kwh || 0))
        ).toFixed(2)
      : '0.00';

  const chartData = {
    labels: simulacoes.map((s) => s.titulo),
    datasets: [
      {
        label: 'Consumo médio mensal (kWh)',
        data: simulacoes.map((s) => parseFloat(s.consumo_medio_mensal_kwh)),
        backgroundColor: 'rgba(16, 185, 129, 0.65)',
        hoverBackgroundColor: 'rgba(16, 185, 129, 0.9)',
        borderRadius: 8,
        maxBarThickness: 64,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#334155' } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} kWh/mês`,
        },
      },
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { display: false } },
      y: {
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
        title: { display: true, text: 'kWh / mês', color: '#64748b' },
      },
    },
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meu Painel de Consumo</h1>
          <p className="mt-1 text-slate-500">
            Acompanhe a média mensal de uso de energia das suas simulações.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/home"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            ← Voltar à home
          </Link>
          <Link
          to="/consumo-medio"
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
          >
            + Nova Simulação
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-emerald-100 bg-white/70 p-12 text-center text-slate-500">
          Carregando dados...
        </div>
      ) : simulacoes.length > 0 ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard titulo="Simulações salvas" valor={totalSimulacoes} unidade="" />
            <StatCard titulo="Média geral" valor={mediaGeral} unidade="kWh/mês" />
            <StatCard titulo="Maior média" valor={maiorConsumo} unidade="kWh/mês" />
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Comparativo do consumo médio mensal
            </h2>
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Minhas simulações</h2>
            <div className="divide-y divide-slate-100">
              {simulacoes.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-slate-800">{s.titulo}</p>
                    <p className="text-xs text-slate-400">
                      {s.meses_analisados} meses analisados
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">
                      {s.consumo_medio_mensal_kwh} kWh/mês
                    </p>
                    <p className="text-xs text-slate-400">
                      Total: {s.total_consumo_mensal_kwh} kWh
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-100 bg-white/80 p-12 text-center shadow-sm backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">
            Nenhuma simulação encontrada
          </h2>
          <p className="text-slate-500 mb-6">
            Que tal começar calculando o seu consumo médio mensal?
          </p>
          <Link
            to="/consumo-medio"
            className="inline-block rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
          >
            Criar minha primeira simulação
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ titulo, valor, unidade }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
      <p className="text-sm text-slate-500">{titulo}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">
        {valor}
        {unidade && <span className="ml-1 text-sm font-medium text-slate-400">{unidade}</span>}
      </p>
    </div>
  );
}

export default DashboardTelaPrincipal;
