import LoginForms from './LoginForms'
import EducaEnergiaLogo from './EducaEnergiaLogo'

const features = [
  {
    title: 'Simulação de consumo',
    description: 'Estime gastos em kWh e reais com base nas tarifas regionais.',
  },
  {
    title: 'Educação ambiental',
    description: 'Aprenda sobre eficiência energética e fontes renováveis.',
  },
  {
    title: 'ODS 7 — Energia limpa',
    description: 'Conteúdo alinhado ao Objetivo de Desenvolvimento Sustentável da ONU.',
  },
]

export default function AuthScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl animate-pulse-glow" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden flex-col justify-between border-r border-emerald-100 px-12 py-10 lg:flex">
          <div className="flex items-center gap-4">
            <EducaEnergiaLogo className="h-28 w-auto shrink-0 drop-shadow" />
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">EducaEnergia</p>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">
                Energia consciente
              </p>
            </div>
          </div>

          <div className="max-w-lg space-y-6">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-100/70 px-3 py-1 text-xs font-medium text-emerald-700">
                Plataforma educativa gratuita
              </span>
              <h1 className="text-4xl font-bold leading-tight text-slate-900">
                Entenda, simule e economize energia na sua casa
              </h1>
              <p className="text-base leading-relaxed text-slate-600">
                O EducaEnergia ajuda consumidores residenciais, estudantes e educadores a
                compreender o consumo elétrico e adotar práticas mais sustentáveis no dia a dia.
              </p>
            </div>

            <div className="space-y-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-emerald-100 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm"
                >
                  <p className="text-sm font-semibold text-emerald-700">{feature.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Desenvolvido pela equipe Knuth · MDS 2026.1 · UnB
          </p>
        </section>

        <section className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
          <div className="mb-8 flex items-center gap-4 lg:hidden">
            <EducaEnergiaLogo className="h-24 w-auto shrink-0 drop-shadow" />
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">EducaEnergia</p>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">
                Energia consciente
              </p>
            </div>
          </div>

          <div className="animate-fade-in w-full max-w-md rounded-[32px] border border-emerald-100 bg-white/80 p-8 shadow-xl shadow-emerald-900/5 backdrop-blur-xl sm:p-10">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Acesse sua conta para continuar simulando consumo e explorando os módulos
                educativos da plataforma.
              </p>
            </div>

            <LoginForms />
          </div>
        </section>
      </div>
    </div>
  )
}
