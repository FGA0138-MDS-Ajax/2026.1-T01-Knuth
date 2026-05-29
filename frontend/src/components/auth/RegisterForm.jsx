export default function RegisterForm() {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-white" htmlFor="name">
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Digite seu nome"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="seuemail@exemplo.com"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Crie uma senha"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-white" htmlFor="confirmPassword">
          Confirmar senha
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Digite novamente sua senha"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500"
      >
        Criar conta
      </button>
    </form>
  );
}
