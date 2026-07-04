import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { apiUrl } from '../config/api.js';
import Navbar from '../common/Navbar.jsx';
import { desbloquearEmblema } from '../config/emblemas.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

export default function PaginaConsumoMedio() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [numMeses, setNumMeses] = useState(3);
  const [consumos, setConsumos] = useState(Array(3).fill(''));
  const [resultado, setResultado] = useState(null);
  // Guarda os consumos usados no último cálculo, para alimentar o gráfico.
  const [consumosCalculados, setConsumosCalculados] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [calculando, setCalculando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const handleInputChange = (index, value) => {
    const novosConsumos = [...consumos];
    novosConsumos[index] = value;
    setConsumos(novosConsumos);
  };

  const trocarNumMeses = (val) => {
    setNumMeses(val);
    setConsumos(Array(val).fill(''));
    setResultado(null);
    setConsumosCalculados([]);
    setErro('');
    setSucesso('');
  };

  const calcular = async () => {
    setErro('');
    setSucesso('');
    setResultado(null);
    setCalculando(true);

    const valores = consumos.map(Number);

    if (consumos.some((c) => c === '' || Number.isNaN(Number(c)))) {
      setErro('Preencha o consumo de todos os meses com valores numéricos.');
      setCalculando(false);
      return;
    }

    try {
      const response = await fetch(apiUrl('/api/consumo/calcular/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ consumos: valores }),
      });
      const data = await response.json();
      if (data.ok) {
        setResultado(data.resultado);
        setConsumosCalculados(valores);

        // RF08 — "Consumo em Queda": mês mais recente menor que o anterior.
        if (valores.length >= 2 && valores[valores.length - 1] < valores[valores.length - 2]) {
          desbloquearEmblema('consumo_em_queda');
        }
      } else {
        setErro(data.erro || 'Não foi possível calcular a média.');
      }
    } catch (e) {
      setErro('Falha de conexão com o servidor. Verifique se o backend está rodando.');
    } finally {
      setCalculando(false);
    }
  };

  const salvar = async () => {
    setErro('');
    setSucesso('');
    setSalvando(true);
    try {
      const response = await fetch(apiUrl('/api/consumo/simulacoes/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          titulo: titulo.trim() || 'Simulação de consumo',
          consumos: consumosCalculados,
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok && data.ok) {
        // RF08 — fez login e salvou a primeira simulação de consumo médio.
        desbloquearEmblema('simulacao_salva');
        setSucesso('Simulação salva com sucesso! Redirecionando...');
        setTimeout(() => navigate('/home'), 900);
      } else {
        setErro(data.erro || 'Não foi possível salvar a simulação. Faça login novamente.');
      }
    } catch (e) {
      setErro('Falha de conexão com o servidor. Verifique se o backend está rodando.');
    } finally {
      setSalvando(false);
    }
  };

  const media = resultado ? parseFloat(resultado.consumo_medio_mensal_kwh) : 0;

  const chartData = {
    labels: consumosCalculados.map((_, i) => `Mês ${i + 1}`),
    datasets: [
      {
        type: 'bar',
        label: 'Consumo mensal (kWh)',
        data: consumosCalculados,
        backgroundColor: 'rgba(16, 185, 129, 0.65)',
        hoverBackgroundColor: 'rgba(16, 185, 129, 0.9)',
        borderRadius: 8,
        maxBarThickness: 56,
        order: 2,
      },
      {
        type: 'line',
        label: 'Média mensal',
        data: consumosCalculados.map(() => media),
        borderColor: 'rgb(6, 182, 212)',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        order: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#334155' } },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y} kWh` } },
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
        title: { display: true, text: 'kWh', color: '#64748b' },
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
        <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Simulação do Consumo Médio</h1>
            <p className="mt-1 text-slate-500">
              Informe o consumo (kWh) dos últimos meses para visualizar sua média mensal.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Título da simulação
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                  placeholder="Ex.: Casa - 1º semestre"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Período de análise
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                  value={numMeses}
                  onChange={(e) => trocarNumMeses(parseInt(e.target.value))}
                >
                  <option value={3}>3 meses</option>
                  <option value={6}>6 meses</option>
                  <option value={9}>9 meses</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Consumo por mês (kWh)
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {consumos.map((c, i) => (
                    <input
                      key={i}
                      type="number"
                      min={10}
                      max={999}
                      placeholder={`Mês ${i + 1}`}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                      value={c}
                      onChange={(e) => handleInputChange(i, e.target.value)}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400">Cada mês aceita valores de 10 a 999 kWh.</p>
              </div>

              <button
                onClick={calcular}
                disabled={calculando}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {calculando ? 'Calculando...' : 'Calcular Média'}
              </button>

              {erro && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {erro}
                </div>
              )}
              {sucesso && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {sucesso}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
              {resultado ? (
                <div className="space-y-5">
                  <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-5 text-white shadow-lg shadow-emerald-500/20">
                    <p className="text-sm text-white/80">Consumo médio mensal</p>
                    <p className="mt-1 text-3xl font-bold">
                      {resultado.consumo_medio_mensal_kwh}
                      <span className="ml-1 text-base font-medium text-white/80">kWh/mês</span>
                    </p>
                    <div className="mt-3 flex gap-6 text-sm text-white/90">
                      <span>Total: {resultado.consumo_total_kwh} kWh</span>
                      <span>{resultado.meses_analisados} meses</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-3 text-sm font-semibold text-slate-700">
                      Consumo por mês
                    </h2>
                    <Bar data={chartData} options={chartOptions} />
                  </div>

                  <button
                    onClick={salvar}
                    disabled={salvando}
                    className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {salvando ? 'Salvando...' : 'Salvar Simulação'}
                  </button>
                </div>
              ) : (
                <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center text-slate-400">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
                    ⚡
                  </div>
                  <p className="text-sm">
                    Preencha os dados e clique em <strong>Calcular Média</strong> para ver
                    o gráfico do seu consumo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
