import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const nomeUsuario = localStorage.getItem('user_name') || 'Visitante';
  const inicial = nomeUsuario.charAt(0).toUpperCase();



  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* Você pode adicionar sua logo aqui */}
              <span className="font-bold text-xl text-green-600">EducaEnergia</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <Link to="/simulador" className="text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Simulador</Link>
                <Link to="/aprender" className="text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Aprenda</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Ícone do Perfil */}
              <div className="ml-3 relative">
                <div>
                  <button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open user menu</span>
                    {/* Você pode usar uma imagem do usuário aqui */}
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white font-medium">{inicial}</span>
                    </div>
                  </button>
                </div>
                {/* Menu Dropdown (a ser implementado) */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
