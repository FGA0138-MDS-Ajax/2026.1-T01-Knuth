import React, { useState } from 'react';
import Navbar from '../common/Navbar';
import { Link } from 'react-router-dom';

 //depois que o backend fizer os dados reais , bast integrar. No caso, substitui pelos daos reais
// foi criado um mock (dados fake) inicial para desenvolvimento do front.
//o mock foi feito a partir do notion que a Angeline elaborou
const modulosMock = [ 
  { id: 1, titulo: "Entendendo sua conta de luz", descricao: "Você já olhou para a sua conta de luz e não entendeu nada do que estava escrito ali? Você não está sozinho", concluido: true, duracao: "5 min" },
  { id: 2, titulo: "Os vilões do consumo", descricao: "Se a sua conta de luz está alta e você não sabe bem por quê, é provável que algum aparelho esteja consumindo bem mais do que você imagina.", concluido: false, duracao: "8 min" },
  { id: 3, titulo: "Como economizar na prática", descricao: "Saber quais aparelhos consomem mais é o primeiro passo. O segundo é saber o que fazer com essa informação", concluido: false, duracao: "6 min" },
  { id: 4, titulo: "Energia solar: o sol trabalhando por você", descricao: "Neste módulo, você vai entender como funciona a energia solar, se ela faz sentido para a sua realidade e o que o Brasil tem feito nessa área.", concluido: false, duracao: "7 min" },
  { id: 5, titulo: "Outras fontes de energia renovável", descricao: "Neste módulo, você vai conhecer as principais fontes de energia renovável, como elas funcionam e qual o papel de cada uma na nossa vida cotidiana.", concluido: false, duracao: "5 min" },
  { id: 6, titulo: "Sustentabilidade e impacto ambiental", descricao: "Neste módulo, você vai entender a relação entre energia, meio ambiente e sustentabilidade, e por que as escolhas que fazemos no dia a dia têm consequências muito além da nossa conta de luz.", concluido: false, duracao: "4 min" },
  { id: 7, titulo: "Entendendo sua eficiência energética em números", descricao: "Neste módulo, vamos colocar tudo isso em perspectiva com números: como comparar o seu consumo com médias brasileiras, o que é um consumo alto ou baixo para uma família e como usar dados para tomar decisões melhores.", concluido: false, duracao: "10 min" },
  { id: 8, titulo: "O futuro da energia e o papel de cada um de nós", descricao: "Neste módulo, vamos falar sobre tendências, o que está por vir e como cada pessoa pode ser protagonista da transição energética.", concluido: false, duracao: "6 min" }
];
export default function ListaModulos() {
  const [modulos, setModulos] = useState(modulosMock);
 
  const concluidos = modulos.filter(m => m.concluido).length;
  const total = modulos.length;
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
            <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progresso}%` }}></div>
          </div>
          <p className="text-sm text-slate-400 mt-2">Você concluiu {concluidos} de {total} módulos.</p>
        </div>
  
        //parte do conteudo

      </main>
    </div>
  );
}