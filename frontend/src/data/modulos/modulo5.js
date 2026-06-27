export default {
  id: 5,
  titulo: 'Outras fontes de energia renovável',
  descricao:
    'Neste módulo, você vai conhecer as principais fontes de energia renovável, como elas funcionam e qual o papel de cada uma na nossa vida cotidiana.',
  duracao: '7 min',
  introducao: [
    {
      tipo: 'paragrafo',
      texto:
        'A energia solar é apenas uma das formas de gerar eletricidade a partir de fontes naturais e renováveis. O Brasil tem uma das matrizes energéticas mais limpas do mundo, e isso não é por acaso — o país tem uma combinação rara de recursos naturais que possibilitam gerar energia de várias formas diferentes.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Neste módulo, você vai conhecer as principais fontes de energia renovável, como elas funcionam e qual o papel de cada uma na nossa vida cotidiana.',
    },
  ],
  secoes: [
    {
      titulo: 'O que é energia renovável?',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'Energia renovável é aquela gerada a partir de fontes que se renovam naturalmente, em uma escala de tempo humana. Diferente dos combustíveis fósseis (petróleo, carvão, gás natural), que levaram milhões de anos para se formar e se esgotam com o uso, as fontes renováveis se repõem constantemente pela natureza.',
        },
      ],
    },
    {
      titulo: 'Energia hidrelétrica',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'A energia hidrelétrica é obtida pelo aproveitamento da **força da água** em movimento — geralmente rios com grandes quedas d\'água, onde são construídas barragens e usinas.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'No Brasil, as hidrelétricas respondem por cerca de **60% da energia elétrica gerada** no país. Isso torna nossa matriz bastante limpa em emissões de CO₂ durante a geração, mas também cria uma vulnerabilidade: em períodos de seca prolongada, os reservatórios baixam e o risco de falta de energia aumenta — é exatamente quando as bandeiras tarifárias vermelhas aparecem.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'As maiores usinas do país incluem Itaipu (entre Brasil e Paraguai), Belo Monte (Pará) e Tucuruí (Pará).',
        },
        {
          tipo: 'destaque',
          texto:
            'A Usina de Itaipu foi a maior usina hidrelétrica do mundo em geração de energia por muitos anos. Ela abastece cerca de 17% de toda a energia consumida no Brasil e 76% da energia do Paraguai.',
        },
      ],
    },
    {
      titulo: 'Energia eólica',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'A energia eólica é gerada a partir do **vento**, que faz girar as hélices de torres chamadas aerogeradores ou turbinas eólicas. O movimento das hélices aciona um gerador que produz eletricidade.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'O Brasil tem um dos maiores potenciais eólicos do mundo, especialmente na região Nordeste, onde ventos constantes e fortes sopram durante todo o ano. Estados como Rio Grande do Norte e Ceará são líderes nacionais na geração eólica.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'Uma característica interessante da energia eólica no Nordeste: os ventos são mais fortes justamente na época de seca, quando os reservatórios das hidrelétricas estão baixos. As duas fontes se **complementam** ao longo do ano.',
        },
        {
          tipo: 'destaque',
          texto:
            'O Brasil é o 7º maior produtor de energia eólica do mundo. Cerca de 12% de toda a nossa eletricidade já vem do vento — e esse número tem crescido rapidamente a cada ano.',
        },
      ],
    },
    {
      titulo: 'Biomassa',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'Biomassa é a energia obtida a partir de **matéria orgânica**: resíduos agrícolas, madeira, bagaço de cana-de-açúcar, resíduos urbanos e até esterco animal.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'No Brasil, a biomassa de cana-de-açúcar tem papel especial: as usinas sucroenergéticas queimam o bagaço da cana (o que sobra depois de extrair o caldo) para gerar vapor, que movimenta turbinas e gera eletricidade. Boa parte dessa energia é consumida pela própria usina, e o excedente é vendido para a rede elétrica.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'O **biogás** é outra forma de biomassa: gás produzido pela decomposição de resíduos orgânicos (como lixo e dejetos animais), que pode ser usado para gerar eletricidade ou como substituto do gás natural.',
        },
        {
          tipo: 'destaque',
          texto:
            'O Brasil é pioneiro no uso de biocombustíveis. O etanol produzido da cana-de-açúcar abastece parte significativa da frota de veículos do país e evita a emissão de milhões de toneladas de CO₂ por ano, quando comparado à gasolina convencional.',
        },
      ],
    },
    {
      titulo: 'Energia das marés e do hidrogênio verde',
      blocos: [
        { tipo: 'paragrafo', texto: 'Duas fontes emergentes merecem atenção:' },
        {
          tipo: 'paragrafo',
          texto:
            '**Energia das marés (maremotriz):** aproveita o movimento das marés para girar turbinas. O Brasil tem um litoral extenso com grande potencial, mas a tecnologia ainda está em fase de desenvolvimento e tem alto custo de instalação.',
        },
        {
          tipo: 'paragrafo',
          texto:
            '**Hidrogênio verde:** não é exatamente uma fonte, mas um **portador de energia**. Ele é produzido usando eletricidade gerada por fontes renováveis (como solar e eólica) para separar o hidrogênio da água. Esse hidrogênio pode ser armazenado e transportado, sendo considerado uma das grandes apostas para descarbonizar setores difíceis de eletrificar, como aviação e indústria pesada.',
        },
      ],
    },
  ],
  quiz: [
    {
      pergunta: 'Qual fonte de energia é responsável pela maior parcela da eletricidade gerada no Brasil?',
      opcoes: [
        { letra: 'a', texto: 'Energia solar', correta: false },
        { letra: 'b', texto: 'Energia eólica', correta: false },
        { letra: 'c', texto: 'Energia hidrelétrica', correta: true },
        { letra: 'd', texto: 'Energia nuclear', correta: false },
      ],
    },
    {
      pergunta: 'Por que a energia eólica e a hidrelétrica se complementam no Brasil?',
      opcoes: [
        { letra: 'a', texto: 'Porque ambas são geradas pela água', correta: false },
        { letra: 'b', texto: 'Porque os ventos são mais fortes justamente quando os reservatórios estão baixos, na seca', correta: true },
        { letra: 'c', texto: 'Porque as duas usinas ficam no mesmo lugar', correta: false },
        { letra: 'd', texto: 'Porque têm o mesmo custo de instalação', correta: false },
      ],
    },
    {
      pergunta: 'O que é biomassa?',
      opcoes: [
        { letra: 'a', texto: 'Uma fonte de energia baseada em hidrogênio', correta: false },
        { letra: 'b', texto: 'Energia gerada a partir de matéria orgânica', correta: true },
        { letra: 'c', texto: 'Uma forma de energia solar indireta', correta: false },
        { letra: 'd', texto: 'Energia gerada pelo movimento das marés', correta: false },
      ],
    },
    {
      pergunta: 'O que é o hidrogênio verde?',
      opcoes: [
        { letra: 'a', texto: 'Um combustível fóssil menos poluente', correta: false },
        { letra: 'b', texto: 'Uma cor especial de hidrogênio encontrada na natureza', correta: false },
        { letra: 'c', texto: 'Hidrogênio produzido com eletricidade de fontes renováveis', correta: true },
        { letra: 'd', texto: 'Um tipo de energia solar aplicado ao transporte', correta: false },
      ],
    },
  ],
  referencias: [
    'EPE. **Balanço Energético Nacional 2024: ano base 2023**. Rio de Janeiro: EPE, 2024.',
    'ABEEOLICA. **Boletim anual de geração eólica 2023**. São Paulo: ABEEólica, 2024.',
    'ITAIPU BINACIONAL. **Geração de energia**. Foz do Iguaçu: Itaipu Binacional, 2025.',
    'MME. **Energia de biomassa no Brasil**. Brasília, DF: MME, 2024.',
    'EPE. **Hidrogênio de baixa emissão de carbono**. Rio de Janeiro: EPE, 2023.',
  ],
};
