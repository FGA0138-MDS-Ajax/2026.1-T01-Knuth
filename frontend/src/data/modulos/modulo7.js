export default {
  id: 7,
  titulo: 'Entendendo sua eficiência energética em números',
  descricao:
    'Neste módulo, vamos colocar tudo isso em perspectiva com números: como comparar o seu consumo com médias brasileiras, o que é um consumo alto ou baixo para uma família e como usar dados para tomar decisões melhores.',
  duracao: '6 min',
  introducao: [
    {
      tipo: 'paragrafo',
      texto:
        'Até agora, você aprendeu sobre os tipos de aparelhos, hábitos de consumo e fontes de energia. Neste módulo, vamos colocar tudo isso em perspectiva com **números**: como comparar o seu consumo com médias brasileiras, o que é um consumo alto ou baixo para uma família e como usar dados para tomar decisões melhores.',
    },
  ],
  secoes: [
    {
      titulo: 'O que é eficiência energética?',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'Eficiência energética é fazer **mais com menos energia**. Um aparelho é eficiente quando realiza a mesma função consumindo menos eletricidade do que seus concorrentes. Uma pessoa ou família é eficiente quando mantém seu conforto e qualidade de vida sem desperdiçar energia.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'Não se trata de deixar de usar aparelhos — trata-se de usá-los de forma inteligente.',
        },
        {
          tipo: 'destaque',
          texto:
            'A eficiência energética é considerada a "fonte de energia mais barata" do mundo — porque economizar 1 kWh é sempre mais barato do que gerar 1 kWh novo. Investir em eficiência evita a necessidade de construir novas usinas.',
        },
      ],
    },
    {
      titulo: 'Consumo médio das famílias brasileiras',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'Segundo dados da ANEEL e de pesquisas do setor elétrico, o consumo médio residencial no Brasil fica em torno de **166 kWh por mês** por unidade consumidora. Mas esse número varia bastante dependendo da região e do porte da família.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'Brasília e o Centro-Oeste costumam ter consumo acima da média nacional, principalmente pelo uso intensivo de ar-condicionado nos meses quentes e pela estrutura das residências (muitas casas com área maior do que apartamentos).',
        },
      ],
    },
    {
      titulo: 'Como distribuição típica do consumo em uma casa',
      blocos: [
        { tipo: 'paragrafo', texto: 'Em uma residência média brasileira, o consumo costuma se distribuir assim:' },
        {
          tipo: 'lista',
          itens: [
            'Chuveiro elétrico: **24%**',
            'Ar-condicionado: **22%**',
            'Geladeira: **16%**',
            'Iluminação: **9%**',
            'Máquina de lavar: **6%**',
            'Televisão e eletrônicos: **6%**',
            'Outros (ferro, micro-ondas, computador, etc.): **17%**',
          ],
        },
        {
          tipo: 'paragrafo',
          texto:
            'Essa distribuição mostra por que o chuveiro e o ar-condicionado são os primeiros alvos de qualquer estratégia de economia: juntos, eles representam quase metade do consumo.',
        },
      ],
    },
    {
      titulo: 'Como interpretar a sua conta e comparar com a média',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'Para saber se o seu consumo está alto, médio ou baixo, divida o consumo mensal total pelo número de moradores da sua residência. O resultado é o **consumo per capita** da sua casa.',
        },
        { tipo: 'paragrafo', texto: '**Referências para comparação:**' },
        {
          tipo: 'lista',
          itens: [
            'Abaixo de **50 kWh por pessoa/mês**: consumo muito eficiente',
            'Entre **50 e 80 kWh por pessoa/mês**: consumo eficiente',
            'Entre **80 e 130 kWh por pessoa/mês**: consumo médio',
            'Acima de **130 kWh por pessoa/mês**: consumo alto — há potencial de melhoria',
          ],
        },
        {
          tipo: 'destaque',
          texto:
            'Se você usa o simulador do EducaEnergia, pode identificar exatamente quais aparelhos contribuem mais para o seu consumo e simular quanto você economizaria ao mudar hábitos específicos — sem chute, com cálculo real.',
        },
      ],
    },
    {
      titulo: 'Dicas para monitorar o próprio consumo',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            '**Leia sua conta todos os meses** e anote o consumo em kWh. Comparar meses diferentes revela padrões: meses mais quentes geralmente têm maior consumo por causa do ar-condicionado; meses com mais pessoas em casa (férias, por exemplo) também.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Use o medidor de energia pessoal**. Existem dispositivos simples e baratos (tomadas com medidor embutido) que informam em tempo real quanto um aparelho específico está consumindo. São úteis para identificar "surpresas" no consumo.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Defina uma meta mensal**. Após identificar os principais vilões, estabeleça uma meta de redução — por exemplo, reduzir 20 kWh por mês nos próximos 3 meses. Com o EducaEnergia, você pode acompanhar essa evolução.',
        },
      ],
    },
  ],
  quiz: [
    {
      pergunta: 'O que significa eficiência energética?',
      opcoes: [
        { letra: 'a', texto: 'Usar o mínimo possível de energia, mesmo perdendo conforto', correta: false },
        { letra: 'b', texto: 'Fazer mais com menos energia, mantendo qualidade de vida', correta: true },
        { letra: 'c', texto: 'Substituir todos os aparelhos por modelos mais caros', correta: false },
        { letra: 'd', texto: 'Desligar tudo durante a noite', correta: false },
      ],
    },
    {
      pergunta: 'Qual é o consumo médio mensal por unidade residencial no Brasil?',
      opcoes: [
        { letra: 'a', texto: 'Cerca de 50 kWh', correta: false },
        { letra: 'b', texto: 'Cerca de 166 kWh', correta: true },
        { letra: 'c', texto: 'Cerca de 500 kWh', correta: false },
        { letra: 'd', texto: 'Cerca de 1.000 kWh', correta: false },
      ],
    },
    {
      pergunta: 'Juntos, chuveiro e ar-condicionado representam qual parcela do consumo em uma casa típica?',
      opcoes: [
        { letra: 'a', texto: 'Menos de 10%', correta: false },
        { letra: 'b', texto: 'Cerca de 20%', correta: false },
        { letra: 'c', texto: 'Quase metade do consumo', correta: true },
        { letra: 'd', texto: 'Mais de 80%', correta: false },
      ],
    },
    {
      pergunta: 'Um consumo de 60 kWh por pessoa/mês indica:',
      opcoes: [
        { letra: 'a', texto: 'Consumo muito alto', correta: false },
        { letra: 'b', texto: 'Consumo eficiente', correta: true },
        { letra: 'c', texto: 'Consumo médio', correta: false },
        { letra: 'd', texto: 'Consumo em nível crítico', correta: false },
      ],
    },
  ],
  referencias: [
    'ANEEL. **Consumo médio residencial de energia elétrica**. Brasília, DF: ANEEL, 2025.',
    'EPE. **Pesquisa de Posse e Hábitos de Uso de Equipamentos Elétricos na Classe Residencial — PPH 2021**. Rio de Janeiro: EPE, 2022.',
    'ELETROBRAS; PROCEL. **Distribuição do consumo de energia elétrica por uso final no setor residencial**. Rio de Janeiro: Eletrobras/Procel, 2022.',
    'INMETRO. **Tabela de consumo e eficiência energética de eletrodomésticos**. Rio de Janeiro: INMETRO, 2025.',
  ],
};
