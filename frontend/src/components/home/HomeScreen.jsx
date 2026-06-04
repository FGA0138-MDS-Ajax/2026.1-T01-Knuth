import React from 'react';
import Navbar from '../common/Navbar';

function HomeScreen() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* O conteúdo do seu dashboard virá aqui */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                <div className="flex items-center justify-center h-full">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Dashboard Principal
                    </h1>
                </div>
            </div>
          </div>
          {/* Fim do conteúdo do dashboard */}
        </div>
      </main>
    </div>
  );
}

export default HomeScreen;