"""
Management command para popular o banco de dados com os 8 módulos educativos.

Uso:
    python manage.py popular_modulos

- Usa update_or_create por modulo_id, portanto é seguro rodar múltiplas vezes.
- Os dados espelham exatamente os arquivos modulo*.js do front-end
  (id, titulo, descricao, duracao).
"""

from django.core.management.base import BaseCommand
from educacao.models import ModuloEducativo


MODULOS = [
    {
        'modulo_id': 1,
        'titulo': 'Entendendo sua conta de luz',
        'descricao': (
            'Você já olhou para a sua conta de luz e não entendeu nada do que estava '
            'escrito ali? Você não está sozinho.'
        ),
        'duracao': '6 min',
        'ordem': 1,
    },
    {
        'modulo_id': 2,
        'titulo': 'Os vilões do consumo: quais aparelhos mais gastam?',
        'descricao': (
            'Descubra quais eletrodomésticos consomem mais energia e como pequenas '
            'mudanças de hábito podem reduzir sua conta significativamente.'
        ),
        'duracao': '7 min',
        'ordem': 2,
    },
    {
        'modulo_id': 3,
        'titulo': 'Como economizar energia sem abrir mão do conforto',
        'descricao': (
            'Economizar energia não significa passar calor ou viver no escuro. '
            'Conheça estratégias práticas para reduzir o consumo mantendo sua qualidade de vida.'
        ),
        'duracao': '6 min',
        'ordem': 3,
    },
    {
        'modulo_id': 4,
        'titulo': 'Energia solar: vale a pena instalar painéis?',
        'descricao': (
            'A energia solar fotovoltaica chegou ao alcance do consumidor residencial. '
            'Entenda como funciona, quanto custa e quando o investimento se paga.'
        ),
        'duracao': '8 min',
        'ordem': 4,
    },
    {
        'modulo_id': 5,
        'titulo': 'Tarifas, bandeiras e a lógica do preço da energia',
        'descricao': (
            'Por que sua conta de luz muda de valor mesmo quando o consumo é o mesmo? '
            'Entenda o sistema de bandeiras tarifárias e os fatores que afetam o preço.'
        ),
        'duracao': '7 min',
        'ordem': 5,
    },
    {
        'modulo_id': 6,
        'titulo': 'De onde vem a energia que abastece sua casa?',
        'descricao': (
            'Conheça a matriz elétrica brasileira, as fontes de geração de energia e '
            'como a eletricidade percorre centenas de quilômetros até chegar à sua tomada.'
        ),
        'duracao': '7 min',
        'ordem': 6,
    },
    {
        'modulo_id': 7,
        'titulo': 'Impacto ambiental do consumo de energia',
        'descricao': (
            'Cada kWh que você consome tem um custo ambiental. Entenda a relação entre '
            'energia elétrica, emissões de carbono e mudanças climáticas.'
        ),
        'duracao': '6 min',
        'ordem': 7,
    },
    {
        'modulo_id': 8,
        'titulo': 'O futuro da energia e o papel de cada um de nós',
        'descricao': (
            'Neste módulo, vamos falar sobre tendências, o que está por vir e como '
            'cada pessoa pode ser protagonista da transição energética.'
        ),
        'duracao': '7 min',
        'ordem': 8,
    },
]


class Command(BaseCommand):
    help = 'Popula o banco de dados com os 8 módulos educativos do EducaEnergia.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING('Populando módulos educativos...'))

        criados = 0
        atualizados = 0

        for dados in MODULOS:
            modulo_id = dados.pop('modulo_id')
            _, criado = ModuloEducativo.objects.update_or_create(
                modulo_id=modulo_id,
                defaults=dados,
            )
            dados['modulo_id'] = modulo_id  # restaura para eventual reuso

            if criado:
                criados += 1
                self.stdout.write(
                    self.style.SUCCESS(f'  [CRIADO]    Módulo {modulo_id} — {dados["titulo"]}')
                )
            else:
                atualizados += 1
                self.stdout.write(
                    self.style.WARNING(f'  [ATUALIZADO] Módulo {modulo_id} — {dados["titulo"]}')
                )

        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS(
                f'Concluído: {criados} criado(s), {atualizados} atualizado(s).'
            )
        )
