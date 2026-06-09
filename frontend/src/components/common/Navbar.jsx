import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { encerrarSessao, getNomeUsuario } from '../../config/auth';
import EducaEnergiaLogo from '../auth/EducaEnergiaLogo';

function Navbar() {
  const navigate = useNavigate();
  const nomeUsuario = getNomeUsuario() || 'Visitante';
  const inicial = nomeUsuario.charAt(0).toUpperCase();

  const sair = () => {
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
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-1">
                <Link to="/home" className="text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium transition">
                  Dashboard
                </Link>
                <Link to="/consumo-medio" className="text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium transition">
                  Nova Simulação
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold">{inicial}</span>
              </div>
              <span className="text-sm font-medium text-slate-700 max-w-[160px] truncate">{nomeUsuario}</span>
            </div>
            <button
              onClick={sair}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
