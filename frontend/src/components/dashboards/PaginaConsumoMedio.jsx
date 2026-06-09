import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaginaConsumoMedio() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [numMeses, setNumMeses] = useState(3);
  const [consumos, setConsumos] = useState(Array(3).fill(''));
  const [resultado, setResultado] = useState(null);

  const handleInputChange = (index, value) => {
    const novosConsumos = [...consumos];
    novosConsumos[index] = value;
    setConsumos(novosConsumos);
  };

  const calcular = async () => {
    const response = await fetch('http://localhost:8000/api/consumo/calcular/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consumos: consumos.map(Number) })
    });
    const data = await response.json();
    if (data.ok) setResultado(data.resultado);
  };

  const salvar = async () => {
    const response = await fetch('http://localhost:8000/api/consumo/simulacoes/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, consumos: consumos.map(Number) })
    });
    if (response.ok) navigate('/'); // Volta para o Dashboard
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Nova Simulação de Consumo</h1>
      
      <div className="bg-white p-6 rounded shadow space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Título da simulação" onChange={(e) => setTitulo(e.target.value)} />
        
        <select className="p-2 border rounded" onChange={(e) => {
          const val = parseInt(e.target.value);
          setNumMeses(val);
          setConsumos(Array(val).fill(''));
        }}>
          <option value={3}>3 meses</option>
          <option value={6}>6 meses</option>
          <option value={9}>9 meses</option>
        </select>

        {consumos.map((c, i) => (
          <input key={i} type="number" placeholder={`Consumo Mês ${i + 1} (kWh)`} className="block w-full p-2 border rounded" 
                 value={c} onChange={(e) => handleInputChange(i, e.target.value)} />
        ))}

        <button onClick={calcular} className="bg-blue-600 text-white px-4 py-2 rounded">Calcular Média</button>
      </div>

      {resultado && (
        <div className="mt-6 bg-green-50 p-6 rounded shadow border border-green-200">
          <h2 className="font-bold text-lg">Resultado: {resultado.consumo_medio_mensal_kwh} kWh/mês</h2>
          <button onClick={salvar} className="mt-4 bg-green-600 text-white px-6 py-2 rounded">Salvar Simulação</button>
        </div>
      )}
    </div>
  );
}