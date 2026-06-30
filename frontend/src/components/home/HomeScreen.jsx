import React from 'react';
import Navbar from '../common/Navbar';
import HomePageContent from './HomePageContent';
import HomeCtaFooter from './HomeCtaFooter';

export default function HomeScreen() {
  return (
    <div className="relative bg-[#f8fafb] text-slate-800">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-emerald-200/25 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-[24rem] w-[24rem] rounded-full bg-cyan-200/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-96 rounded-full bg-emerald-100/30 blur-3xl" />
      </div>

      <div className="relative">
        <Navbar />
        <main className="w-full px-5 pt-10 sm:px-8 sm:pt-12 lg:px-12 lg:pt-14 xl:px-16">
          <HomePageContent />
        </main>
        <HomeCtaFooter />
      </div>
    </div>
  );
}
