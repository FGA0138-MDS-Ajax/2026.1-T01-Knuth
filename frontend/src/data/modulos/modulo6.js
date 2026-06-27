export default {
  id: 6,
  titulo: 'Sustentabilidade e impacto ambiental',
  descricao:
    'Neste módulo, você vai entender a relação entre energia, meio ambiente e sustentabilidade, e por que as escolhas que fazemos no dia a dia têm consequências muito além da nossa conta de luz.',
  duracao: '7 min',
  introducao: [
    {
      tipo: 'paragrafo',
      texto:
        'Quando falamos em economizar energia, o foco costuma ser financeiro — e faz sentido, já que as contas de luz impactam o orçamento de milhões de famílias. Mas existe uma dimensão ainda maior por trás dessa questão: o impacto do nosso consumo de energia sobre o planeta.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Neste módulo, você vai entender a relação entre energia, meio ambiente e sustentabilidade, e por que as escolhas que fazemos no dia a dia têm consequências muito além da nossa conta de luz.',
    },
  ],
  secoes: [
    {
      titulo: 'O que é aquecimento global e o que ele tem a ver com energia?',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'O aquecimento global é o aumento gradual da temperatura média da Terra, causado principalmente pelo acúmulo de **gases de efeito estufa** (GEE) na atmosfera — em especial o dióxido de carbono (CO₂), o metano (CH₄) e o óxido nitroso (N₂O).',
        },
        {
          tipo: 'paragrafo',
          texto:
            'Esses gases formam uma espécie de "cobertor" ao redor da Terra: eles permitem que a luz solar entre, mas impedem que o calor escape. Quanto mais gases acumulados, maior o efeito.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'A queima de combustíveis fósseis — carvão, petróleo e gás natural — para gerar eletricidade, mover veículos e alimentar indústrias é a principal fonte de CO₂ na atmosfera. Por isso, o setor de energia tem papel central nas discussões sobre mudanças climáticas.',
        },
        {
          tipo: 'destaque',
          texto:
            'O Brasil tem uma vantagem importante: por gerar grande parte da sua eletricidade por fontes renováveis (hidrelétricas, eólica e solar), emite muito menos CO₂ por kWh gerado do que países que dependem de carvão ou gás. Isso faz do Brasil um dos países com a matriz elétrica mais limpa do mundo.',
        },
      ],
    },
    {
      titulo: 'O que são os Objetivos de Desenvolvimento Sustentável (ODS)?',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'Em 2015, os países membros da ONU — incluindo o Brasil — assinaram a **Agenda 2030**, um conjunto de 17 Objetivos de Desenvolvimento Sustentável (ODS) para orientar o mundo em direção a um futuro mais justo e sustentável.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'O **ODS 7** trata diretamente da energia: **"Energia limpa e acessível"**. Seu objetivo é garantir que, até 2030, todas as pessoas tenham acesso a serviços de energia acessíveis, confiáveis, sustentáveis e modernos.',
        },
        {
          tipo: 'paragrafo',
          texto: 'Isso inclui:',
        },
        {
          tipo: 'lista',
          itens: [
            'Aumentar a participação de energias renováveis na matriz global',
            'Melhorar a eficiência energética',
            'Ampliar o acesso à energia em regiões que ainda não têm eletricidade',
          ],
        },
        {
          tipo: 'paragrafo',
          texto:
            'Mais de 750 milhões de pessoas no mundo ainda não têm acesso à eletricidade. No Brasil, o programa Luz Para Todos conectou mais de 3 milhões de famílias rurais à rede elétrica nos últimos anos, mas ainda existem áreas remotas sem acesso.',
        },
      ],
    },
    {
      titulo: 'Desperdício de energia e seus impactos',
      blocos: [
        { tipo: 'paragrafo', texto: 'Quando desperdiçamos energia elétrica, as consequências são múltiplas:' },
        {
          tipo: 'paragrafo',
          texto:
            '**Financeiras:** pagamos mais na conta sem necessidade.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Ambientais:** quando o sistema elétrico fica sobrecarregado, as distribuidoras precisam ligar usinas termelétricas a diesel ou gás, que emitem mais CO₂. O desperdício residencial contribui indiretamente para esse aumento de emissões.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Sociais:** o desperdício de quem pode pagar influencia as tarifas de todo o sistema — inclusive de famílias de baixa renda que já têm dificuldade em pagar a conta.',
        },
        {
          tipo: 'destaque',
          texto:
            'Se cada família brasileira reduzisse o consumo em apenas 10%, o Brasil poderia evitar o acionamento de várias usinas termelétricas, reduzindo emissões e economizando bilhões de reais em combustíveis que hoje são pagos por todos os consumidores via conta de luz.',
        },
      ],
    },
    {
      titulo: 'O que cada pessoa pode fazer?',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'A mudança começa no comportamento individual, mas seu impacto é coletivo. Algumas ações com maior impacto:',
        },
        {
          tipo: 'lista',
          itens: [
            '**Usar energia de forma eficiente** (como vimos nos módulos anteriores)',
            '**Preferir aparelhos mais eficientes** ao fazer compras (Selo Procel A)',
            '**Apoiar e exigir políticas públicas** que ampliem o acesso às energias renováveis',
            '**Compartilhar o conhecimento** — educar pessoas próximas sobre consumo consciente multiplica o impacto',
            '**Adotar mobilidade elétrica ou transporte público** quando possível, reduzindo emissões de veículos',
          ],
        },
      ],
    },
  ],
  quiz: [
    {
      pergunta: 'Qual é a principal causa humana do aquecimento global?',
      opcoes: [
        { letra: 'a', texto: 'O desmatamento de florestas tropicais apenas', correta: false },
        { letra: 'b', texto: 'A queima de combustíveis fósseis, que libera CO₂ na atmosfera', correta: true },
        { letra: 'c', texto: 'O uso de ar-condicionado residencial', correta: false },
        { letra: 'd', texto: 'A produção de plástico', correta: false },
      ],
    },
    {
      pergunta: 'O que estabelece o ODS 7 da Agenda 2030 da ONU?',
      opcoes: [
        { letra: 'a', texto: 'Eliminar toda a geração de energia nuclear até 2030', correta: false },
        { letra: 'b', texto: 'Garantir acesso universal a energia limpa, acessível e sustentável', correta: true },
        { letra: 'c', texto: 'Proibir o uso de combustíveis fósseis nos países desenvolvidos', correta: false },
        { letra: 'd', texto: 'Reduzir o consumo global de energia em 50%', correta: false },
      ],
    },
    {
      pergunta: 'Por que o desperdício de energia residencial impacta o meio ambiente?',
      opcoes: [
        { letra: 'a', texto: 'Porque cria ondas de calor artificiais', correta: false },
        { letra: 'b', texto: 'Porque sobrecarrega a rede e pode levar ao acionamento de usinas termelétricas mais poluentes', correta: true },
        { letra: 'c', texto: 'Porque a eletricidade residencial não vem de fontes renováveis', correta: false },
        { letra: 'd', texto: 'Porque destrói as baterias da rede elétrica', correta: false },
      ],
    },
    {
      pergunta: 'Qual característica torna o Brasil diferenciado em termos de matriz elétrica?',
      opcoes: [
        { letra: 'a', texto: 'O Brasil não usa combustíveis fósseis em nenhuma situação', correta: false },
        { letra: 'b', texto: 'O Brasil tem a maior usina nuclear do mundo', correta: false },
        { letra: 'c', texto: 'Grande parte da eletricidade brasileira vem de fontes renováveis, tornando a matriz mais limpa', correta: true },
        { letra: 'd', texto: 'O Brasil exporta toda a sua energia elétrica para outros países', correta: false },
      ],
    },
  ],
  referencias: [
    'NAÇÕES UNIDAS BRASIL. **Objetivo de Desenvolvimento Sustentável 7: energia limpa e acessível**. Brasília, DF: ONU, 2023.',
    'IPCC. **Sixth Assessment Report: Climate Change 2023 — Synthesis Report**. Geneva: IPCC, 2023.',
    'EPE. **Inventário de emissões de CO₂ do setor energético brasileiro**. Rio de Janeiro: EPE, 2024.',
    'MME. **Programa Luz Para Todos: relatório de resultados**. Brasília, DF: MME, 2024.',
  ],
};
