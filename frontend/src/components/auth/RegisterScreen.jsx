import RegisterForm from './RegisterForm'
import EducaEnergiaLogo from './EducaEnergiaLogo'

export default function RegisterScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-lg items-center justify-center px-4 py-10 sm:px-8">
        <div className="animate-fade-in w-full rounded-[32px] border border-emerald-100 bg-white/80 p-8 shadow-xl shadow-emerald-900/5 backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <EducaEnergiaLogo className="h-28 w-auto animate-float drop-shadow" />
            <p className="mt-3 text-xl font-bold text-slate-900">EducaEnergia</p>
            <p className="text-xs text-emerald-600">Cadastro gratuito</p>

            <h1 className="mt-6 text-2xl font-bold text-slate-900">Crie sua conta</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Cadastre-se para simular consumo energético e acessar os módulos educativos da
              plataforma.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
