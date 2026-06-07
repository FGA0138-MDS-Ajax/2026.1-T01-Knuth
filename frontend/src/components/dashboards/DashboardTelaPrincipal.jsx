import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom'; // IMPORTANTE: adicione esta linha
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DashboardTelaPrincipal() {
  const [simulacoes, setSimulacoes] = useState([]); // Inicie vazio []
  const [loading, setLoading] = useState(true); // Começa carregando

  useEffect(() => {
    // Agora que você já tem o backend configurado, 
    // descomente e use o fetch real:
    fetch('http://localhost:8000/api/consumo/simulacoes/minhas/') 
      .then(response => response.json())
      .then(data => {
        setSimulacoes(data.simulacoes); 
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      });
  }, []);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Principal</h1>
        {/* Botão de navegação aparece apenas se já houver simulações */}
        {simulacoes.length > 0 && (
          <Link to="/consumo-medio" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            + Nova Simulação
          </Link>
        )}
      </div>
      
      {loading ? (
        <p>Carregando dados...</p>
      ) : simulacoes.length > 0 ? (
        <div className="bg-white p-6 rounded shadow">
          <Bar data={chartData} />
        </div>
      ) : (
        // ESTA É A TELA DE "VAZIO" COM O BOTÃO DE CHAMADA PARA AÇÃO
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold mb-4">Nenhuma simulação encontrada</h2>
          <p className="text-gray-500 mb-6">Que tal começar calculando o seu consumo médio mensal?</p>
          <Link 
            to="/consumo-medio" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Criar minha primeira simulação
          </Link>
        </div>
      )}
    </div>
  );
}

export default DashboardTelaPrincipal;