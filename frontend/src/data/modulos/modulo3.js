export default {
  id: 3,
  titulo: 'Como economizar na prática',
  descricao:
    'Saber quais aparelhos consomem mais é o primeiro passo. O segundo é saber o que fazer com essa informação.',
  duracao: '7 min',
  introducao: [
    {
      tipo: 'paragrafo',
      texto:
        'Saber quais aparelhos consomem mais é o primeiro passo. O segundo é saber o que fazer com essa informação. Neste módulo, você vai aprender dicas práticas e aplicáveis hoje mesmo para reduzir o consumo de energia e pagar menos na conta — sem abrir mão do conforto.',
    },
  ],
  secoes: [
    {
      titulo: 'No banheiro',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'O banheiro é onde mora o maior potencial de economia da casa. O chuveiro elétrico é o campeão de consumo, mas existem formas simples de usar menos energia sem sofrer.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Reduza o tempo de banho.** Um banho de 5 minutos consome menos da metade de um banho de 12 minutos. Parece óbvio, mas a maioria das pessoas não percebe quanto tempo passa no chuveiro.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Use a posição "verão" no chuveiro.** No verão ou em dias quentes, trocar o chuveiro da posição "inverno" para "verão" ou "econômico" reduz a potência usada e o consumo pode cair em até 30%.',
        },
        {
          tipo: 'destaque',
          texto:
            'Trocar um único banho longo (15 min) por um banho curto (5 min) por dia durante um mês economiza, em média, o equivalente a 2 dias inteiros de consumo de toda a residência.',
        },
      ],
    },
    {
      titulo: 'Na cozinha',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'A cozinha concentra vários aparelhos de alta potência. Pequenos hábitos fazem grande diferença.',
        },
        { tipo: 'subtitulo', texto: 'Geladeira' },
        {
          tipo: 'lista',
          itens: [
            'Não deixe a porta aberta por mais de alguns segundos',
            'Aguarde o alimento esfriar antes de colocar na geladeira (alimentos quentes fazem o motor trabalhar mais)',
            'Mantenha a borracha da porta em bom estado — borracha ressecada deixa o ar frio vazar',
            'Afaste a geladeira pelo menos 15 cm da parede para garantir ventilação adequada do motor',
            'Limpe as serpentinas (grades na parte de trás) periodicamente',
          ],
        },
        { tipo: 'subtitulo', texto: 'Micro-ondas vs. fogão' },
        {
          tipo: 'paragrafo',
          texto:
            'Para reaquecer pequenas porções, o micro-ondas consome menos energia do que o fogão elétrico. Para cozinhar do zero, o fogão a gás ainda é a opção mais econômica comparada ao fogão elétrico.',
        },
        { tipo: 'subtitulo', texto: 'Panela de pressão' },
        {
          tipo: 'paragrafo',
          texto:
            'Cozinhar feijão ou arroz na panela de pressão pode reduzir o tempo de cozimento em até 70% — o que significa menos tempo com a chama do fogão ou a resistência elétrica ligada.',
        },
        {
          tipo: 'destaque',
          texto:
            'Descongelar alimentos na geladeira (deixando passar da noite para o dia) em vez de usar o micro-ondas ou água quente ajuda a geladeira a trabalhar menos — ela "aproveita" o frio do alimento congelado.',
        },
      ],
    },
    {
      titulo: 'Na sala e nos quartos',
      blocos: [
        { tipo: 'subtitulo', texto: 'Iluminação' },
        {
          tipo: 'paragrafo',
          texto:
            'Troque todas as lâmpadas incandescentes ou halógenas por **lâmpadas LED**. Uma lâmpada LED de 9W substitui uma incandescente de 60W com a mesma luminosidade, consumindo 85% menos energia e durando até 25 vezes mais.',
        },
        { tipo: 'subtitulo', texto: 'Televisão' },
        {
          tipo: 'lista',
          itens: [
            'Ajuste o brilho da tela para um nível intermediário — telas no brilho máximo consomem significativamente mais',
            'Desligue a TV da tomada quando não estiver usando (não use apenas o controle remoto)',
            'Use o timer automático para desligar a TV caso você adormeça assistindo',
          ],
        },
        { tipo: 'subtitulo', texto: 'Ar-condicionado' },
        {
          tipo: 'lista',
          itens: [
            'Mantenha portas e janelas fechadas enquanto o aparelho está ligado',
            'Limpe o filtro a cada 15 dias — filtros sujos fazem o aparelho trabalhar mais para o mesmo resultado',
            'Prefira temperaturas entre 22°C e 24°C',
            'Use o modo "sleep" ou "timer" para desligar automaticamente à noite',
          ],
        },
        {
          tipo: 'destaque',
          texto:
            'Cada grau a menos no ar-condicionado representa cerca de 8% a mais de consumo. Se você está com o aparelho em 18°C, subir para 23°C pode reduzir o consumo em até 40%.',
        },
      ],
    },
    {
      titulo: 'Hábitos gerais',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            '**Aproveite a luz natural.** Abra as cortinas durante o dia e use a iluminação artificial apenas quando necessário.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Lave roupas com água fria.** A maioria das lavadoras tem a opção de lavar a frio, que é igualmente eficaz para roupas do dia a dia e consome muito menos energia do que o ciclo quente.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Passe mais roupas de uma vez.** O ferro elétrico demora um tempo para esquentar. Juntar as roupas e passar tudo de uma vez é mais eficiente do que ligar e desligar várias vezes.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Desligue o que não está usando.** Estabilizadores, carregadores e extensões continuam consumindo energia mesmo quando não há nada conectado a eles ou quando os aparelhos estão em standby.',
        },
        {
          tipo: 'destaque',
          texto:
            'Em uma casa com 10 aparelhos em standby ao mesmo tempo, o consumo fantasma pode chegar a 50 kWh por mês — o equivalente a deixar uma lâmpada de 70W acesa 24 horas por dia durante 30 dias, sem ninguém usar.',
        },
      ],
    },
  ],
  quiz: [
    {
      pergunta: 'Qual atitude no banheiro mais reduz o consumo de energia?',
      opcoes: [
        { letra: 'a', texto: 'Usar sabonete líquido em vez de barra', correta: false },
        { letra: 'b', texto: 'Reduzir o tempo de banho e usar a posição "verão" no chuveiro', correta: true },
        { letra: 'c', texto: 'Tomar banho de manhã em vez de à noite', correta: false },
        { letra: 'd', texto: 'Usar o chuveiro no brilho máximo', correta: false },
      ],
    },
    {
      pergunta: 'Qual é a vantagem principal das lâmpadas LED?',
      opcoes: [
        { letra: 'a', texto: 'São mais baratas do que as incandescentes', correta: false },
        { letra: 'b', texto: 'Duram menos mas iluminam mais', correta: false },
        { letra: 'c', texto: 'Consomem até 85% menos energia com a mesma luminosidade', correta: true },
        { letra: 'd', texto: 'Funcionam sem eletricidade', correta: false },
      ],
    },
    {
      pergunta: 'Por que se recomenda manter a geladeira afastada da parede?',
      opcoes: [
        { letra: 'a', texto: 'Para facilitar a limpeza', correta: false },
        { letra: 'b', texto: 'Para garantir ventilação do motor e maior eficiência', correta: true },
        { letra: 'c', texto: 'Para evitar curto-circuito', correta: false },
        { letra: 'd', texto: 'Para que a porta abra melhor', correta: false },
      ],
    },
    {
      pergunta: 'O que é o "consumo fantasma"?',
      opcoes: [
        { letra: 'a', texto: 'O consumo de aparelhos que não estão visíveis na conta', correta: false },
        { letra: 'b', texto: 'O consumo de aparelhos em standby ou carregadores conectados sem uso', correta: true },
        { letra: 'c', texto: 'O consumo de aparelhos muito antigos', correta: false },
        { letra: 'd', texto: 'O consumo estimado que a distribuidora calcula sem leitura real', correta: false },
      ],
    },
  ],
  referencias: [
    'ELETROBRAS; PROCEL. **Dicas de economia de energia elétrica**. Rio de Janeiro: Eletrobras/Procel, 2024.',
    'ANEEL. **Uso eficiente da energia elétrica**. Brasília, DF: ANEEL, 2025.',
    'INMETRO. **Lâmpadas de LED: guia do consumidor**. Rio de Janeiro: INMETRO, 2024.',
    'MME. **Programa Nacional de Conservação de Energia Elétrica (Procel)**. Brasília, DF: MME, 2024.',
  ],
};
