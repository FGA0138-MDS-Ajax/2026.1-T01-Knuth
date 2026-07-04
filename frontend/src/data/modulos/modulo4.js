export default {
  id: 4,
  titulo: 'Energia solar: o sol trabalhando por você',
  descricao:
    'Neste módulo, você vai entender como funciona a energia solar, se ela faz sentido para a sua realidade e o que o Brasil tem feito nessa área.',
  duracao: '6 min',
  introducao: [
    {
      tipo: 'paragrafo',
      texto:
        'O Brasil é um dos países com maior incidência de luz solar do mundo. Enquanto países europeus como Alemanha — que é líder em energia solar — recebem bem menos sol do que qualquer cidade brasileira, aqui ainda aproveitamos muito pouco esse recurso gratuito, limpo e inesgotável que temos disponível todos os dias.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Neste módulo, você vai entender como funciona a energia solar, se ela faz sentido para a sua realidade e o que o Brasil tem feito nessa área.',
    },
  ],
  secoes: [
    {
      titulo: 'Como funciona um painel solar?',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'Os painéis solares — também chamados de **módulos fotovoltaicos** — são compostos por células feitas de silício, um material que tem uma propriedade especial: quando a luz solar atinge suas células, ela libera elétrons que passam a circular, gerando corrente elétrica.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'Esse processo se chama **efeito fotovoltaico**, e é completamente silencioso, sem peças móveis, sem combustão e sem emissão de gases.',
        },
        { tipo: 'paragrafo', texto: 'O sistema residencial mais comum funciona assim:' },
        {
          tipo: 'lista',
          itens: [
            'Os painéis captam a luz solar e geram corrente elétrica contínua (CC)',
            'Um equipamento chamado **inversor** transforma essa corrente em corrente alternada (CA), que é o tipo que sua casa usa',
            'A energia gerada abastece os aparelhos da casa',
            'O que sobra vai para a rede da distribuidora — e você recebe créditos na conta',
          ],
        },
        {
          tipo: 'paragrafo',
          texto:
            'Esse último passo é o que chamamos de **sistema de compensação de energia** ou **net metering**, regulamentado pela ANEEL.',
        },
        {
          tipo: 'destaque',
          texto:
            'Em Brasília, o sol brilha em média 8 horas por dia. Um sistema solar residencial de 3 kWp (quilowatts-pico) instalado na capital pode gerar cerca de 380 kWh por mês — suficiente para abastecer uma família de 3 a 4 pessoas.',
        },
      ],
    },
    {
      titulo: 'Vale a pena instalar energia solar na minha casa?',
      blocos: [
        { tipo: 'paragrafo', texto: 'Essa resposta depende de alguns fatores:' },
        {
          tipo: 'paragrafo',
          texto:
            '**Quanto você paga na conta de luz?** Em geral, o sistema começa a fazer sentido financeiro para quem paga mais de R$ 200,00 por mês. Abaixo disso, o retorno financeiro é mais lento.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Você tem telhado disponível e com boa orientação?** O ideal é telhado voltado para o norte (no hemisfério sul), sem sombra de árvores ou prédios entre 9h e 15h.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Qual é o seu regime de moradia?** Se você mora em casa própria e pretende ficar por muitos anos, o investimento faz mais sentido. Em apartamentos, sistemas condominiais compartilhados já estão se tornando comuns.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Qual é o investimento inicial?** Um sistema residencial básico custa entre R$ 15.000,00 e R$ 30.000,00 instalado. O retorno médio no Brasil fica entre **4 e 7 anos**, e os painéis têm vida útil de 25 a 30 anos.',
        },
        {
          tipo: 'destaque',
          texto:
            'Desde 2023, o Brasil ultrapassou a marca de 1 milhão de sistemas solares fotovoltaicos instalados em residências, comércio e indústria. O setor solar já gera mais de 30 GW de capacidade instalada no país — mais do que muitas usinas hidrelétricas.',
        },
      ],
    },
    {
      titulo: 'E quem mora em apartamento?',
      blocos: [
        { tipo: 'paragrafo', texto: 'Para quem vive em condomínio, existem duas alternativas crescentes:' },
        {
          tipo: 'paragrafo',
          texto:
            '**Usinas solares comunitárias:** você investe em uma cota de um sistema solar instalado em outro local (como uma fazenda solar) e recebe os créditos na sua conta.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Sistemas em área comum do condomínio:** os painéis são instalados na cobertura ou estacionamento do edifício, gerando energia para as áreas comuns e reduzindo a taxa de condomínio.',
        },
      ],
    },
  ],
  quiz: [
    {
      pergunta: 'O que é o efeito fotovoltaico?',
      opcoes: [
        { letra: 'a', texto: 'O efeito do sol no aquecimento de água', correta: false },
        { letra: 'b', texto: 'A geração de eletricidade a partir da luz solar incidindo em células de silício', correta: true },
        { letra: 'c', texto: 'A reflexão da luz solar em espelhos', correta: false },
        { letra: 'd', texto: 'A conversão de calor em energia mecânica', correta: false },
      ],
    },
    {
      pergunta: 'Qual equipamento transforma a energia dos painéis em corrente utilizável na residência?',
      opcoes: [
        { letra: 'a', texto: 'Transformador', correta: false },
        { letra: 'b', texto: 'Regulador de tensão', correta: false },
        { letra: 'c', texto: 'Inversor', correta: true },
        { letra: 'd', texto: 'Gerador', correta: false },
      ],
    },
    {
      pergunta: 'O que acontece com o excedente de energia gerada por um sistema solar residencial?',
      opcoes: [
        { letra: 'a', texto: 'É desperdiçado', correta: false },
        { letra: 'b', texto: 'É armazenado em baterias obrigatoriamente', correta: false },
        { letra: 'c', texto: 'É enviado para a rede e gera créditos na conta de energia', correta: true },
        { letra: 'd', texto: 'É vendido diretamente para os vizinhos', correta: false },
      ],
    },
    {
      pergunta: 'Para quem a energia solar costuma ser mais vantajosa financeiramente?',
      opcoes: [
        { letra: 'a', texto: 'Quem paga menos de R$ 50,00 de luz por mês', correta: false },
        { letra: 'b', texto: 'Quem mora em apartamento alugado', correta: false },
        { letra: 'c', texto: 'Quem tem telhado próprio e paga mais de R$ 200,00 por mês de energia', correta: true },
        { letra: 'd', texto: 'Quem mora em cidades com clima frio', correta: false },
      ],
    },
  ],
  referencias: [
    'ABSOLAR. **Infográfico ABSOLAR: energia solar fotovoltaica no Brasil**. São Paulo: ABSOLAR, 2024.',
    'ANEEL. **Resolução Normativa nº 1.000, de 7 de dezembro de 2021**. Brasília, DF: ANEEL, 2021.',
    'EPE. **Geração de energia elétrica: fontes solares fotovoltaicas**. Rio de Janeiro: EPE, 2024.',
    'ANEEL. **Micro e minigeração distribuída**. Brasília, DF: ANEEL, 2025.',
  ],
};
