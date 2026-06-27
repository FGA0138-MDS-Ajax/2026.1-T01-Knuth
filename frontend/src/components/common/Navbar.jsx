import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config/api';
import { encerrarSessao, getNomeUsuario } from '../../config/auth';
import EducaEnergiaLogo from '../auth/EducaEnergiaLogo';

function Navbar() {
  const navigate = useNavigate();
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const nomeUsuario = getNomeUsuario() || 'Visitante';
  const inicial = nomeUsuario.charAt(0).toUpperCase();

  const sair = async () => {
    try {
      await fetch(apiUrl('/api/logout/'), {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    encerrarSessao();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="sticky top-0 z-20 border-b border-emerald-100 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/home" className="flex items-center gap-2">
              <EducaEnergiaLogo className="h-9 w-auto" />
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                EducaEnergia
              </span>
            </Link>

            {/* Links Desktop: escondidos em telas pequenas, visíveis em md */}
            <div className="hidden md:flex items-baseline space-x-1">
              <Link to="/home" className="text-slate-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium">Dashboard</Link>
              <Link to="/consumo-medio" className="text-slate-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium">Nova Simulação</Link>
              <Link to="/eletrodomesticos" className="text-slate-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium">Eletrodomésticos</Link>
              <Link to="/rf05" className="text-slate-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium">Análise de Consumo</Link>
              <Link to="/ListaModulos" className= "text-slate-600 hover:bg-emerald-50 px-3 py-2 rounded-lg text-sm font-medium">Aprendizagem</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Botão de Menu Mobile: visível apenas em telas pequenas */}
            <button 
              className="md:hidden p-2 text-slate-600" 
              onClick={() => setMenuMobileAberto(!menuMobileAberto)}
            >
               ≡
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-semibold">{inicial}</span>
              </div>
              <span className="text-sm font-medium text-slate-700">{nomeUsuario}</span>
            </div>
            <button onClick={sair} className="text-sm font-medium text-slate-600 hover:text-red-600">Sair</button>
          </div>
        </div>
      </div>

      {/* Menu Vertical Mobile: aparece apenas se menuMobileAberto for true */}
      {menuMobileAberto && (
        <div className="md:hidden border-t border-emerald-100 bg-white p-4 space-y-2">
          <Link to="/home" className="block text-slate-600 py-2">Dashboard</Link>
          <Link to="/consumo-medio" className="block text-slate-600 py-2">Nova Simulação</Link>
          <Link to="/eletrodomesticos" className="block text-slate-600 py-2">Eletrodomésticos</Link>
          <Link to="/rf05" className="block text-slate-600 py-2">Análise de Consumo</Link>
          <Link to="/ListaModulos" className="block text-slate-600 py-2">Aprendizagem</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;