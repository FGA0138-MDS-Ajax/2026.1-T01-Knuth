import React from 'react';
import Navbar from '../common/Navbar.jsx';
import DashboardTelaPrincipal from '../dashboards/DashboardTelaPrincipal.jsx';

export default function PainelScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <div className="relative">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <DashboardTelaPrincipal />
        </main>
      </div>
    </div>
  );
}
