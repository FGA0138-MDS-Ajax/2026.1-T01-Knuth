import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiUrl } from '../../config/api';
import { getNomeUsuario } from '../../config/auth';
import { getModulosConcluidos } from '../../config/progressoModulos';
import { modulos } from '../../data/modulos';

const linkInline =
  'font-medium text-emerald-700 underline decoration-emerald-300/80 underline-offset-[3px] decoration-1 hover:text-emerald-900 hover:decoration-emerald-500 transition-colors';

const btnPrimario =
  'inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/15 transition hover:shadow-lg hover:brightness-105';

const btnSecundario =
  'inline-flex items-center justify-center rounded-lg border border-slate-300/90 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-900';

const temasEnergia = [
  {
    titulo: 'Entendendo a conta de luz',
    texto:
      'A conta de energia reúne conceitos que pouca gente domina: quilowatt-hora (kWh), tarifa, impostos e bandeiras tarifárias. Saber o que cada item significa é o primeiro passo para deixar de pagar no escuro.',
    rota: '/modulo-educativo/1',
    linkLabel: 'Ler módulo 1',
  },
  {
    titulo: 'Os vilões do consumo',
    texto:
      'O chuveiro elétrico e o ar-condicionado podem representar quase metade do consumo de uma residência típica. Conhecer quais aparelhos mais gastam ajuda a priorizar mudanças de hábito.',
    rota: '/modulo-educativo/2',
    linkLabel: 'Ler módulo 2',
  },
  {
    titulo: 'Energia limpa e renovável',
    texto:
      'O Brasil tem uma das matrizes elétricas mais limpas do mundo. Entender de onde vem a eletricidade conecta o uso diário à sustentabilidade e ao ODS 7.',
    rota: '/modulo-educativo/5',
    linkLabel: 'Ler módulo 5',
  },
  {
    titulo: 'Economia sem abrir mão do conforto',
    texto:
      'Trocar lâmpadas por LED, encurtar o banho ou desligar aparelhos em standby geram economia real sem sacrificar qualidade de vida.',
    rota: '/modulo-educativo/3',
    linkLabel: 'Ler módulo 3',
  },
];

const ferramentas = [
  {
    titulo: 'Módulos educativos',
    descricao: 'Oito trilhas de leitura com quizzes sobre eficiência, renováveis e sustentabilidade.',
    rota: '/ListaModulos',
    linkLabel: 'Ver módulos',
  },
  {
    titulo: 'Simulação de consumo',
    descricao: 'Calcule o consumo médio mensal da sua residência com base nas tarifas da região.',
    rota: '/consumo-medio',
    linkLabel: 'Nova simulação',
  },
  {
    titulo: 'Eletrodomésticos',
    descricao: 'Consulte potência e consumo estimado dos principais aparelhos da casa.',
    rota: '/eletrodomesticos',
    linkLabel: 'Consultar aparelhos',
  },
  {
    titulo: 'Análise de consumo',
    descricao: 'Compare simulações e identifique oportunidades de economia com gráficos.',
    rota: '/rf05',
    linkLabel: 'Analisar consumo',
  },
  {
    titulo: 'Meu painel',
    descricao: 'Acompanhe simulações salvas, médias de consumo e histórico pessoal.',
    rota: '/painel',
    linkLabel: 'Abrir painel',
  },
];

function RotuloSecao({ children }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600/90 mb-3">
      {children}
    </p>
  );
}

function TituloSecao({ children, className = '' }) {
  return (
    <h2
      className={`text-2xl sm:text-[1.75rem] lg:text-3xl font-bold tracking-tight text-slate-900 leading-tight ${className}`}
    >
      {children}
    </h2>
  );
}

function Secao({ children, className = '' }) {
  return (
    <section className={`pt-20 md:pt-24 lg:pt-28 border-t border-slate-200/70 ${className}`}>
      {children}
    </section>
  );
}

export default function HomePageContent() {
  const nomeUsuario = getNomeUsuario();
  const modulosConcluidos = getModulosConcluidos().length;
  const totalModulos = modulos.length;
  const [totalSimulacoes, setTotalSimulacoes] = useState(null);

  useEffect(() => {
    fetch(apiUrl('/api/consumo/simulacoes/minhas/'), { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok !== false) {
          setTotalSimulacoes((data.simulacoes || []).length);
        } else {
          setTotalSimulacoes(0);
        }
      })
      .catch(() => setTotalSimulacoes(0));
  }, []);

  const progressoModulos = Math.round((modulosConcluidos / totalModulos) * 100);

  return (
    <div>
      <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.25fr_0.75fr] lg:gap-20 xl:gap-24 items-start pt-4 lg:pt-8">
        <div className="max-w-3xl">
          <RotuloSecao>Bem-vindo</RotuloSecao>
          <h1 className="text-4xl sm:text-5xl xl:text-[3.4rem] font-bold leading-[1.08] tracking-tight text-slate-900 text-balance">
            Entenda, simule e economize{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-600 bg-clip-text text-transparent">
              energia na sua casa
            </span>
          </h1>
          <p className="mt-7 text-lg sm:text-xl text-slate-600 leading-relaxed">
            O EducaEnergia é uma plataforma web gratuita para famílias brasileiras, estudantes e
            educadores — unindo{' '}
            <Link to="/ListaModulos" className={linkInline}>
              conteúdo educativo
            </Link>{' '}
            e{' '}
            <Link to="/consumo-medio" className={linkInline}>
              ferramentas de simulação
            </Link>{' '}
            para transformar informação em economia real.
          </p>
          {nomeUsuario && (
            <p className="mt-5 text-base text-emerald-800/90 font-medium">
              Olá, {nomeUsuario}. Bem-vindo de volta.
            </p>
          )}
          <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
            <Link to="/ListaModulos" className={btnPrimario}>
              Começar a aprender
            </Link>
            <Link to="/consumo-medio" className={btnSecundario}>
              Simular meu consumo
            </Link>
          </div>
        </div>

        <aside className="lg:pt-14 xl:pt-16 border-t border-slate-200/80 pt-10 lg:border-t-0 lg:pt-0 lg:border-l lg:border-slate-200/80 lg:pl-10 xl:pl-14">
          <RotuloSecao>Acesso rápido</RotuloSecao>
          <ul className="divide-y divide-slate-200/80">
            {ferramentas.map((item) => (
              <li key={item.rota}>
                <Link
                  to={item.rota}
                  className="group flex items-center justify-between gap-6 py-4 transition-colors"
                >
                  <span className="text-slate-800 font-medium group-hover:text-emerald-800 transition-colors">
                    {item.titulo}
                  </span>
                  <span className="shrink-0 text-sm font-medium text-emerald-700 group-hover:text-emerald-900">
                    {item.linkLabel} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <Secao>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-28">
          <div>
            <RotuloSecao>Sobre a plataforma</RotuloSecao>
            <TituloSecao>O que é o EducaEnergia?</TituloSecao>
            <p className="mt-6 text-base sm:text-[1.05rem] text-slate-600 leading-[1.75]">
              Muita gente paga a conta de luz todo mês sem saber exatamente o que está pagando —
              quanto é consumo, quanto é imposto, por que o valor sobe em determinados meses. Esse
              desconhecimento dificulta qualquer tentativa de economia e torna invisível o impacto
              ambiental do uso diário de eletricidade.
            </p>
            <p className="mt-5 text-base sm:text-[1.05rem] text-slate-600 leading-[1.75]">
              A plataforma reúne dois pilares:{' '}
              <strong className="font-semibold text-slate-800">educação ambiental</strong> — com
              módulos sobre eficiência, fontes renováveis e o ODS 7 — e{' '}
              <strong className="font-semibold text-slate-800">simulação de consumo</strong> — para
              calcular e analisar o gasto da sua casa com dados reais.
            </p>
          </div>
          <div className="lg:pt-9">
            <p className="text-base sm:text-[1.05rem] text-slate-600 leading-[1.75]">
              O objetivo é construir{' '}
              <strong className="font-semibold text-slate-800">letramento energético</strong>: a
              capacidade de ler, interpretar e agir sobre o próprio consumo, com benefício para o
              bolso e para o planeta. Você pode começar pela{' '}
              <Link to="/ListaModulos" className={linkInline}>
                trilha de aprendizagem
              </Link>{' '}
              ou pela{' '}
              <Link to="/consumo-medio" className={linkInline}>
                primeira simulação
              </Link>
              .
            </p>
            <p className="mt-5 text-base sm:text-[1.05rem] text-slate-600 leading-[1.75]">
              Para consumidores residenciais, estudantes e educadores que buscam material prático
              sobre energia e sustentabilidade — acessível em computador e celular, sem custo.
            </p>
          </div>
        </div>
      </Secao>

      <Secao>
        <RotuloSecao>Contexto</RotuloSecao>
        <TituloSecao className="max-w-2xl">
          Por que a energia consciente importa?
        </TituloSecao>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12 xl:gap-16">
          <p className="text-base text-slate-600 leading-[1.75]">
            A eletricidade está em tudo — do banho quente à geladeira que nunca desliga. Quando
            desperdiçamos energia, pagamos mais e contribuímos para sobrecarregar o sistema elétrico,
            o que pode acionar usinas mais poluentes e elevar tarifas para todos.
          </p>
          <p className="text-base text-slate-600 leading-[1.75]">
            No Brasil, onde grande parte da eletricidade vem de fontes renováveis, cada gesto de
            economia preserva recursos e reduz emissões — mas depende do comportamento de milhões de
            consumidores para o sistema funcionar bem.
          </p>
          <p className="text-base text-slate-600 leading-[1.75] sm:col-span-2 lg:col-span-1">
            Compreender energia é habilidade prática: afeta o orçamento familiar, o meio ambiente e
            metas globais de sustentabilidade.{' '}
            <Link to="/ListaModulos" className={linkInline}>
              Conheça os módulos
            </Link>
            .
          </p>
        </div>
      </Secao>

      <Secao>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10 lg:mb-12">
          <div>
            <RotuloSecao>Conteúdo</RotuloSecao>
            <TituloSecao>Temas que você vai encontrar</TituloSecao>
          </div>
          <Link to="/ListaModulos" className={`text-sm shrink-0 ${linkInline}`}>
            Ver todos os 8 módulos
          </Link>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {temasEnergia.map((tema) => (
            <article
              key={tema.titulo}
              className="group border-l-[3px] border-emerald-400/80 pl-5 hover:border-emerald-600 transition-colors"
            >
              <h3 className="font-semibold text-slate-900 text-[1.05rem] leading-snug">
                {tema.titulo}
              </h3>
              <p className="mt-3 text-sm sm:text-[0.95rem] text-slate-600 leading-relaxed">
                {tema.texto}
              </p>
              <Link
                to={tema.rota}
                className={`mt-4 inline-block text-sm ${linkInline}`}
              >
                {tema.linkLabel}
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-12 text-base text-slate-600 leading-[1.75] max-w-3xl">
          Cada módulo tem leitura estimada de 6 a 8 minutos, quiz ao final e referências. Siga na
          ordem sugerida ou vá direto ao assunto que mais interessa — o progresso fica salvo na sua
          conta.
        </p>
      </Secao>

      <Secao>
        <RotuloSecao>Ferramentas</RotuloSecao>
        <TituloSecao>Ferramentas da plataforma</TituloSecao>
        <p className="mt-5 text-base sm:text-[1.05rem] text-slate-600 leading-[1.75] max-w-3xl">
          Além de aprender, você pode colocar em números o que leu: simular consumo, consultar
          aparelhos, comparar resultados e acompanhar tudo no painel pessoal.
        </p>
        <div className="mt-12 grid gap-x-16 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {ferramentas.map((item) => (
            <div key={item.rota} className="group">
              <h3 className="font-semibold text-slate-900 text-[1.05rem] group-hover:text-emerald-800 transition-colors">
                {item.titulo}
              </h3>
              <p className="mt-2.5 text-sm sm:text-[0.95rem] text-slate-600 leading-relaxed">
                {item.descricao}
              </p>
              <Link to={item.rota} className={`mt-4 inline-block text-sm ${linkInline}`}>
                {item.linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </Secao>

      <Secao>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 xl:gap-28">
          <div>
            <RotuloSecao>Na prática</RotuloSecao>
            <TituloSecao>Como aprendizado e simulação se conectam</TituloSecao>
            <p className="mt-6 text-base sm:text-[1.05rem] text-slate-600 leading-[1.75]">
              Depois de ler sobre os vilões do consumo, você pode{' '}
              <Link to="/eletrodomesticos" className={linkInline}>
                consultar quanto cada aparelho gasta
              </Link>{' '}
              e{' '}
              <Link to="/consumo-medio" className={linkInline}>
                montar uma simulação
              </Link>{' '}
              da sua residência. Depois de entender bandeiras tarifárias, fica mais fácil interpretar
              os valores da fatura.
            </p>
            <p className="mt-5 text-base sm:text-[1.05rem] text-slate-600 leading-[1.75]">
              Use o{' '}
              <Link to="/rf05" className={linkInline}>
                comparativo de consumo
              </Link>{' '}
              para ver evolução ao longo do tempo e o{' '}
              <Link to="/painel" className={linkInline}>
                painel pessoal
              </Link>{' '}
              para reunir tudo em um só lugar.
            </p>
          </div>

          <div className="lg:pl-6 xl:pl-10 lg:border-l lg:border-slate-200/80">
            <RotuloSecao>Progresso</RotuloSecao>
            <TituloSecao>Sua jornada até aqui</TituloSecao>
            <div className="mt-8 space-y-10">
              <div>
                <div className="flex items-end justify-between gap-4 mb-3">
                  <p className="text-sm font-medium text-slate-500">Módulos concluídos</p>
                  <p className="text-3xl font-bold tabular-nums text-emerald-700 leading-none">
                    {modulosConcluidos}
                    <span className="text-lg font-medium text-slate-400"> / {totalModulos}</span>
                  </p>
                </div>
                <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressoModulos}%` }}
                  />
                </div>
                <Link to="/ListaModulos" className={`mt-4 inline-block text-sm ${linkInline}`}>
                  {modulosConcluidos === 0 ? 'Iniciar primeiro módulo' : 'Continuar aprendendo'}
                </Link>
              </div>

              <div className="pt-8 border-t border-slate-200/80">
                <div className="flex items-end justify-between gap-4 mb-2">
                  <p className="text-sm font-medium text-slate-500">Simulações salvas</p>
                  <p className="text-3xl font-bold tabular-nums text-cyan-700 leading-none">
                    {totalSimulacoes === null ? '—' : totalSimulacoes}
                  </p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {totalSimulacoes === null
                    ? 'Carregando...'
                    : totalSimulacoes === 0
                      ? 'Nenhuma simulação ainda.'
                      : `${totalSimulacoes} simulação(ões) no seu painel.`}
                </p>
                <Link
                  to={totalSimulacoes ? '/painel' : '/consumo-medio'}
                  className={`mt-4 inline-block text-sm ${linkInline}`}
                >
                  {totalSimulacoes ? 'Ver painel' : 'Criar simulação'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Secao>
    </div>
  );
}
