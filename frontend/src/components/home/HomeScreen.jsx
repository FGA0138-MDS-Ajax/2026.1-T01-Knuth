import React from 'react';
import Navbar from '../common/Navbar';
import DashboardTelaPrincipal from '../dashboards/DashboardTelaPrincipal';

function HomeScreen() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <DashboardTelaPrincipal />
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomeScreen;
