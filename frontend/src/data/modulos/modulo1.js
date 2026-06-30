export default {
  id: 1,
  titulo: 'Entendendo sua conta de luz',
  descricao:
    'Você já olhou para a sua conta de luz e não entendeu nada do que estava escrito ali? Você não está sozinho.',
  duracao: '6 min',
  introducao: [
    {
      tipo: 'paragrafo',
      texto:
        'Você já olhou para a sua conta de luz e não entendeu nada do que estava escrito ali? Você não está sozinho. A maioria das pessoas paga a conta todo mês sem saber exatamente o que está pagando — e isso é um problema, porque o que a gente não entende, a gente não consegue controlar.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Neste módulo, vamos descomplicar tudo. Ao final, você vai saber ler a sua conta, entender de onde vem o valor cobrado e identificar os principais fatores que fazem ela subir ou descer.',
    },
  ],
  secoes: [
    {
      titulo: 'O que é quilowatt-hora (kWh)?',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'Toda vez que você liga um aparelho elétrico, ele consome energia. A unidade usada para medir essa energia é o **quilowatt-hora**, representado pela sigla **kWh**.',
        },
        { tipo: 'paragrafo', texto: 'Mas o que isso significa na prática?' },
        {
          tipo: 'paragrafo',
          texto:
            'Imagine que você tem um chuveiro que consome 5.500 watts (5,5 kW) de potência. Se você tomar banho por 1 hora com esse chuveiro, ele vai consumir **5,5 kWh** de energia. É isso que a distribuidora registra e cobra na sua conta.',
        },
        {
          tipo: 'formula',
          texto: '**Consumo (kWh) = Potência do aparelho (kW) × Tempo de uso (horas)**',
        },
        {
          tipo: 'destaque',
          texto:
            '1 kWh é a energia necessária para manter 10 lâmpadas de 100 watts acesas durante 1 hora. Para ter noção, uma família brasileira consome em média 166 kWh por mês.',
        },
      ],
    },
    {
      titulo: 'O que é a tarifa de energia?',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'A tarifa é o **preço** que você paga por cada kWh consumido. No Brasil, ela é regulada pela **ANEEL** (Agência Nacional de Energia Elétrica) e varia dependendo da sua distribuidora, da sua região e do tipo de contrato.',
        },
        {
          tipo: 'paragrafo',
          texto:
            'No Distrito Federal, a distribuidora responsável é a **Neoenergia Brasília**. A tarifa muda pelo menos uma vez por ano, geralmente com reajuste autorizado pela ANEEL.',
        },
        {
          tipo: 'paragrafo',
          texto: 'Além da tarifa básica, existem os componentes extras que aparecem na sua conta:',
        },
        {
          tipo: 'lista',
          itens: [
            '**ICMS**: imposto estadual sobre o serviço de energia',
            '**PIS/COFINS**: impostos federais',
            '**Contribuição de Iluminação Pública (CIP)**: cobrada pelo município para custear a iluminação das ruas',
            '**Encargos setoriais**: contribuições para programas como o Tarifa Social e fundos de energia renovável',
          ],
        },
        {
          tipo: 'destaque',
          texto:
            'Os impostos podem representar até 40% do valor da sua conta de luz. Ou seja, para cada R$ 100,00 que você paga, cerca de R$ 40,00 são impostos e encargos — e não o serviço em si.',
        },
      ],
    },
    {
      titulo: 'O que é a bandeira tarifária?',
      blocos: [
        {
          tipo: 'paragrafo',
          texto:
            'Além da tarifa fixa, existe um sistema de **bandeiras tarifárias** que funciona como um semáforo: ele indica a situação do sistema elétrico no país e pode adicionar um valor extra na sua conta.',
        },
        {
          tipo: 'lista',
          itens: [
            '**Bandeira Verde**: tudo bem com a geração de energia. Sem acréscimo.',
            '**Bandeira Amarela**: situação de atenção. Acréscimo moderado por kWh.',
            '**Bandeira Vermelha (patamar 1 e 2)**: situação crítica, geralmente causada por pouca chuva nas usinas hidrelétricas. Acréscimo maior.',
          ],
        },
        {
          tipo: 'paragrafo',
          texto: 'A bandeira é definida mensalmente pela ANEEL e deve aparecer na sua conta.',
        },
      ],
    },
    {
      titulo: 'Como calcular o valor aproximado da sua conta?',
      blocos: [
        { tipo: 'paragrafo', texto: 'Agora que você já entende os conceitos, veja como estimar o valor:' },
        {
          tipo: 'lista',
          itens: [
            'Some o consumo em kWh de todos os seus aparelhos no mês',
            'Multiplique pelo valor da tarifa vigente da sua distribuidora',
            'Some os impostos',
            'Verifique se há acréscimo de bandeira tarifária',
          ],
        },
        {
          tipo: 'paragrafo',
          texto:
            'O simulador do EducaEnergia faz exatamente esse cálculo por você, de forma automática e visual.',
        },
      ],
    },
  ],
  quiz: [
    {
      pergunta: 'O que o quilowatt-hora (kWh) mede?',
      opcoes: [
        { letra: 'a', texto: 'A potência máxima de um aparelho', correta: false },
        { letra: 'b', texto: 'A energia consumida por um aparelho ao longo do tempo', correta: true },
        { letra: 'c', texto: 'O preço da energia elétrica', correta: false },
        { letra: 'd', texto: 'A tensão da rede elétrica', correta: false },
      ],
    },
    {
      pergunta: 'Se uma lâmpada de 100W ficar acesa por 10 horas, quanto ela consome?',
      opcoes: [
        { letra: 'a', texto: '100 kWh', correta: false },
        { letra: 'b', texto: '10 kWh', correta: false },
        { letra: 'c', texto: '1 kWh', correta: true },
        { letra: 'd', texto: '0,1 kWh', correta: false },
      ],
    },
    {
      pergunta: 'O que significa a bandeira tarifária vermelha?',
      opcoes: [
        { letra: 'a', texto: 'Que a distribuidora aumentou o preço da tarifa', correta: false },
        {
          letra: 'b',
          texto: 'Que o sistema elétrico está em situação crítica e há acréscimo na conta',
          correta: true,
        },
        { letra: 'c', texto: 'Que a energia vai acabar em breve', correta: false },
        { letra: 'd', texto: 'Que há desconto para quem economizar energia', correta: false },
      ],
    },
    {
      pergunta: 'Qual órgão regula as tarifas de energia elétrica no Brasil?',
      opcoes: [
        { letra: 'a', texto: 'Ministério das Minas e Energia', correta: false },
        { letra: 'b', texto: 'Prefeitura Municipal', correta: false },
        { letra: 'c', texto: 'ANEEL', correta: true },
        { letra: 'd', texto: 'IBGE', correta: false },
      ],
    },
  ],
  referencias: [
    'AGÊNCIA NACIONAL DE ENERGIA ELÉTRICA (ANEEL). **Tarifas de energia elétrica**. Brasília, DF: ANEEL, 2026.',
    'AGÊNCIA NACIONAL DE ENERGIA ELÉTRICA (ANEEL). **Bandeiras tarifárias**. Brasília, DF: ANEEL, 2026.',
    'AGÊNCIA NACIONAL DE ENERGIA ELÉTRICA (ANEEL). **Como é composta a tarifa de energia elétrica?** Brasília, DF: ANEEL, 2025.',
    'EMPRESA DE PESQUISA ENERGÉTICA (EPE). **Balanço Energético Nacional 2024: ano base 2023**. Rio de Janeiro: EPE, 2024.',
    'NEOENERGIA BRASÍLIA. **Entenda sua conta de energia**. Brasília, DF: Neoenergia, 2025.',
  ],
};
