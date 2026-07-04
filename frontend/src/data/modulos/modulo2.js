export default {
  id: 2,
  titulo: 'Os vilões do consumo',
  descricao:
    'Se a sua conta de luz está alta e você não sabe bem por quê, é provável que algum aparelho esteja consumindo bem mais do que você imagina.',
  duracao: '8 min',
  introducao: [
    {
      tipo: 'paragrafo',
      texto:
        'Se a sua conta de luz está alta e você não sabe bem por quê, é provável que algum aparelho esteja consumindo bem mais do que você imagina. Chamamos esses aparelhos de "vilões do consumo" — não porque sejam ruins, mas porque, se usados sem atenção, podem fazer o valor da sua conta disparar.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Neste módulo, você vai conhecer quais são os equipamentos que mais pesam na conta e entender por quê.',
    },
  ],
  secoes: [
    {
      titulo: 'Por que alguns aparelhos consomem mais do que outros?',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'O consumo de um aparelho depende principalmente da sua **potência**, medida em watts (W) ou quilowatts (kW). Quanto maior a potência, mais energia o aparelho usa por hora.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'Mas a potência sozinha não basta: o **tempo de uso** também faz toda a diferença. Um aparelho de alta potência usado por poucos minutos pode consumir menos do que um aparelho de baixa potência que fica ligado o dia todo.',
        },
      ],
    },
    {
      titulo: 'Os maiores consumidores da casa brasileira',
      blocos: [
        { tipo: 'subtitulo', texto: 'Chuveiro elétrico' },
        {
          tipo: 'paragrafo',
          texto:
            'O chuveiro elétrico é, sozinho, um dos maiores responsáveis pelo consumo de energia nas residências brasileiras. Modelos comuns têm potência entre 4.000W e 7.500W. Um banho de 10 minutos com um chuveiro de 5.500W consome aproximadamente **0,9 kWh**. Se uma família de 4 pessoas tomar banho diariamente, isso representa cerca de **110 kWh por mês** — só no chuveiro.',
        },
        { tipo: 'subtitulo', texto: 'Ar-condicionado' },
        {
          tipo: 'paragrafo',
          texto:
            'O ar-condicionado é o vilão silencioso. Um aparelho de 12.000 BTUs consome em média 1.100W por hora. Usado 8 horas por dia durante 30 dias, gera um consumo de **264 kWh mensais** — praticamente a conta inteira de muitas famílias.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'Modelos mais novos com tecnologia **inverter** são muito mais eficientes: consomem até 35% menos energia para manter o mesmo conforto.',
        },
        {
          tipo: 'destaque',
          texto:
            'Manter o ar-condicionado a 23°C em vez de 18°C pode reduzir o consumo em até 8% por grau de diferença. Parece pouco, mas ao longo do mês faz uma diferença considerável na conta.',
        },
        { tipo: 'subtitulo', texto: 'Geladeira' },
        {
          tipo: 'paragrafo',
          texto:
            'A geladeira é o aparelho que nunca desliga. Ela fica ligada 24 horas por dia, 7 dias por semana. O consumo mensal de uma geladeira comum fica entre **30 e 60 kWh** dependendo do modelo, da idade e dos hábitos de uso.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'Modelos mais antigos (acima de 10 anos) podem consumir o dobro de um modelo novo com a mesma capacidade.',
        },
        { tipo: 'subtitulo', texto: 'Ferro elétrico' },
        {
          tipo: 'paragrafo',
          texto:
            'O ferro elétrico tem uma potência alta (entre 1.000W e 2.000W), mas costuma ser usado por pouco tempo. Uma hora semanal de uso representa cerca de **6 kWh mensais** — não é o maior vilão, mas contribui.',
        },
        { tipo: 'subtitulo', texto: 'Máquina de lavar' },
        {
          tipo: 'paragrafo',
          texto:
            'Uma máquina de lavar de uso comum consome entre **0,3 e 0,5 kWh por ciclo** em modo frio. O consumo aumenta significativamente quando se usa água quente. 4 lavagens por semana representam cerca de **8 kWh mensais**.',
        },
        { tipo: 'subtitulo', texto: 'Televisão' },
        {
          tipo: 'paragrafo',
          texto:
            'Uma TV LED moderna de 42 polegadas consome em média **90W** por hora. Assistir à televisão 6 horas por dia durante 30 dias gera um consumo de **16 kWh mensais** — bem menos do que se imagina. O problema costuma ser deixar a TV em modo standby, que também consome energia.',
        },
      ],
    },
    {
      titulo: 'O que é o Selo Procel?',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'O **Procel** é o Programa Nacional de Conservação de Energia Elétrica, que classifica os aparelhos de acordo com a eficiência energética, do nível A (mais eficiente) ao G (menos eficiente).',
        },
        {
          tipo: 'paragrafo',
          texto:
            'Ao comprar um eletrodoméstico novo, sempre verifique o selo Procel e prefira os que têm a classificação A ou A+. Eles podem consumir até 50% menos energia do que os de menor classificação.',
        },
      ],
    },
  ],
  quiz: [
    {
      pergunta: 'Qual fator mais influencia o consumo de energia de um aparelho?',
      opcoes: [
        { letra: 'a', texto: 'A cor do aparelho', correta: false },
        { letra: 'b', texto: 'A marca do aparelho', correta: false },
        { letra: 'c', texto: 'A potência e o tempo de uso', correta: true },
        { letra: 'd', texto: 'O ano de fabricação', correta: false },
      ],
    },
    {
      pergunta: 'Qual aparelho costuma ser o maior vilão no consumo energético residencial?',
      opcoes: [
        { letra: 'a', texto: 'Televisão', correta: false },
        { letra: 'b', texto: 'Geladeira', correta: false },
        { letra: 'c', texto: 'Chuveiro elétrico', correta: true },
        { letra: 'd', texto: 'Ferro elétrico', correta: false },
      ],
    },
    {
      pergunta: 'O que significa um aparelho com Selo Procel nível A?',
      opcoes: [
        { letra: 'a', texto: 'Que o aparelho é muito potente', correta: false },
        { letra: 'b', texto: 'Que o aparelho é o mais eficiente energeticamente', correta: true },
        { letra: 'c', texto: 'Que o aparelho é o mais barato', correta: false },
        { letra: 'd', texto: 'Que o aparelho é nacional', correta: false },
      ],
    },
    {
      pergunta: 'Um ar-condicionado com tecnologia inverter é:',
      opcoes: [
        { letra: 'a', texto: 'Mais barateado mas gasta mais energia', correta: false },
        { letra: 'b', texto: 'Mais caro e gasta mais energia', correta: false },
        { letra: 'c', texto: 'Mais eficiente e consome menos energia', correta: true },
        { letra: 'd', texto: 'Igual aos modelos convencionais em consumo', correta: false },
      ],
    },
  ],
  referencias: [
    'ELETROBRAS; PROCEL. **Pesquisa de Posse e Hábitos de Uso de Equipamentos Elétricos na Classe Residencial**. Rio de Janeiro: Eletrobras/Procel, 2019.',
    'INMETRO. **Programa Brasileiro de Etiquetagem (PBE): eficiência energética de produtos**. Rio de Janeiro: INMETRO, 2025.',
    'ANEEL. **Eficiência energética: consumo residencial**. Brasília, DF: ANEEL, 2025.',
    'ELETROBRAS; PROCEL. **Selo Procel de Economia de Energia**. Rio de Janeiro: Eletrobras, 2025.',
  ],
};
