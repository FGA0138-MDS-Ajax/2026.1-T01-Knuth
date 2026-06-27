import { Link } from 'react-router-dom';

export default function HomeCtaFooter() {
  return (
    <footer className="mt-24 md:mt-28 lg:mt-32">
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-cyan-600 px-5 sm:px-8 lg:px-12 xl:px-16 py-14 md:py-16 lg:py-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Pronto para começar?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-emerald-50/95 leading-relaxed">
              Explore os módulos, simule o consumo da sua casa e descubra onde há espaço para
              melhorar — no bolso e no planeta.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/ListaModulos"
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm hover:bg-emerald-50 transition-colors"
            >
              Explorar módulos
            </Link>
            <Link
              to="/consumo-medio"
              className="rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Nova simulação
            </Link>
            <Link
              to="/painel"
              className="rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Meu painel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
