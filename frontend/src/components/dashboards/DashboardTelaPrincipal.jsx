import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MOCK_DATA = [
  { id: 1, titulo: "Simulação de Teste 1", total_consumo_mensal_kwh: "150.50" },
  { id: 2, titulo: "Simulação de Teste 2", total_consumo_mensal_kwh: "230.75" },
  { id: 3, titulo: "Simulação de Teste 3", total_consumo_mensal_kwh: "190.20" },
];

function DashboardTelaPrincipal() {
  // CONFIGURAÇÃO: Se quiser usar o MOCK, use useState(MOCK_DATA)
  // Se quiser usar o REAL, use useState([])
  const [simulacoes, setSimulacoes] = useState(MOCK_DATA); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Para usar o MOCK, mantenha o useEffect abaixo comentado.
    // Para usar o REAL, descomente todo o bloco do fetch.
    
    /*
    setLoading(true);
    fetch('http://localhost:8000/simulacoes/minhas/') 
      .then(response => response.json())
      .then(data => {
        setSimulacoes(data.simulacoes); 
        setLoading(false);
      })
      .catch(error => console.error("Erro ao buscar dados:", error));
    */
  }, []);

  // O chartData fica aqui fora do return para ser acessível
  const chartData = {
    labels: simulacoes.map(s => s.titulo),
    datasets: [{
      label: 'Consumo Mensal (kWh)',
      data: simulacoes.map(s => parseFloat(s.total_consumo_mensal_kwh)),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }]
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Principal</h1>
      
      {loading ? (
        <p>Carregando dados reais...</p>
      ) : simulacoes.length > 0 ? (
        <div className="bg-white p-6 rounded shadow">
          <Bar data={chartData} />
        </div>
      ) : (
        <p>Nenhuma simulação encontrada.</p>
      )}
    </div>
  );
}

export default DashboardTelaPrincipal;