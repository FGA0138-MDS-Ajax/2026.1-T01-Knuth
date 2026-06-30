import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config/api';
import { encerrarSessao, getNomeUsuario } from '../../config/auth';
import EducaEnergiaLogo from '../auth/EducaEnergiaLogo';

const containerNav = 'w-full px-5 sm:px-8 lg:px-12 xl:px-16';

const gruposMenu = [
  {
    titulo: 'Início',
    itens: [{ label: 'Home', rota: '/home' }],
  },
  {
    titulo: 'Simular',
    itens: [
      { label: 'Nova simulação', rota: '/consumo-medio' },
      { label: 'Eletrodomésticos', rota: '/eletrodomesticos' },
      { label: 'Análise de consumo', rota: '/rf05' },
    ],
  },
  {
    titulo: 'Aprender',
    itens: [{ label: 'Módulos educativos', rota: '/ListaModulos' }],
  },
  {
    titulo: 'Conta',
    itens: [{ label: 'Meu painel', rota: '/painel' }],
  },
];

const linksDesktop = [
  { label: 'Início', rota: '/home' },
  { label: 'Painel', rota: '/painel' },
  { label: 'Simulação', rota: '/consumo-medio' },
  { label: 'Eletrodomésticos', rota: '/eletrodomesticos' },
  { label: 'Análise', rota: '/rf05' },
  { label: 'Aprendizagem', rota: '/ListaModulos' },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const nomeUsuario = getNomeUsuario() || 'Visitante';
  const inicial = nomeUsuario.charAt(0).toUpperCase();

  const fecharMenu = () => setMenuAberto(false);

  const sair = async () => {
    fecharMenu();
    try {
      await fetch(apiUrl('/api/logout/'), {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    encerrarSessao();
    navigate('/login', { replace: true });
  };

  const linkAtivo = (rota) => location.pathname === rota;

  return (
    <nav className="sticky top-0 z-30 border-b border-emerald-100/80 bg-white/90 backdrop-blur-xl">
      <div className={`${containerNav} flex items-center justify-between gap-6 h-[4.5rem]`}>
        <Link
          to="/home"
          className="flex shrink-0 items-center gap-2.5"
          onClick={fecharMenu}
        >
          <EducaEnergiaLogo className="h-9 w-auto" />
          <span className="hidden sm:inline font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            EducaEnergia
          </span>
        </Link>

        <div className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2">
          {linksDesktop.map((link) => (
            <Link
              key={link.rota}
              to={link.rota}
              className={`relative px-3 xl:px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                linkAtivo(link.rota)
                  ? 'text-emerald-800'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80'
              }`}
            >
              {link.label}
              {linkAtivo(link.rota) && (
                <span className="absolute inset-x-3 -bottom-[1.125rem] h-0.5 rounded-full bg-emerald-500" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-3 pr-2 border-r border-slate-200">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-semibold text-xs">{inicial}</span>
            </div>
            <span className="text-sm font-medium text-slate-700 max-w-[140px] truncate">
              {nomeUsuario}
            </span>
          </div>

          <button
            type="button"
            onClick={sair}
            className="hidden sm:inline-flex text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
          >
            Sair
          </button>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
          >
            <span className="sr-only">{menuAberto ? 'Fechar' : 'Menu'}</span>
            {menuAberto ? (
              <span className="text-lg font-light leading-none text-slate-700">×</span>
            ) : (
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 bg-slate-700 rounded-full" />
                <span className="block h-0.5 w-5 bg-slate-700 rounded-full" />
                <span className="block h-0.5 w-4 bg-slate-700 rounded-full" />
              </span>
            )}
          </button>
        </div>
      </div>

      {menuAberto && (
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 top-[4.5rem] bg-slate-900/25 backdrop-blur-[1px] z-40"
            onClick={fecharMenu}
            aria-label="Fechar menu"
          />
          <div className="lg:hidden fixed top-[4.5rem] right-0 z-50 h-[calc(100vh-4.5rem)] w-80 max-w-[90vw] bg-white border-l border-slate-200 shadow-2xl overflow-y-auto">
            <div className="p-6 space-y-8">
              {gruposMenu.map((grupo) => (
                <div key={grupo.titulo}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                    {grupo.titulo}
                  </p>
                  <div className="space-y-0.5">
                    {grupo.itens.map((item) => (
                      <Link
                        key={item.rota}
                        to={item.rota}
                        onClick={fecharMenu}
                        className={`block rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                          linkAtivo(item.rota)
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-slate-100 pt-6 space-y-3">
                <p className="text-sm font-medium text-slate-700">{nomeUsuario}</p>
                <button
                  type="button"
                  onClick={sair}
                  className="w-full text-left rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sair da conta
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
