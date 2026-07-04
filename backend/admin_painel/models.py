from django.db import models


class BandeiraTarifaria(models.Model):
    """
    Representa as bandeiras tarifárias da ANEEL.
    Apenas uma bandeira deve estar ativa por vez (campo `ativa`).
    """
    NOME_CHOICES = [
        ('verde', 'Verde'),
        ('amarela', 'Amarela'),
        ('vermelha_1', 'Vermelha Patamar 1'),
        ('vermelha_2', 'Vermelha Patamar 2'),
    ]

    nome = models.CharField(
        max_length=20,
        choices=NOME_CHOICES,
        unique=True,
        help_text="Identificador da bandeira tarifária.",
    )
    valor_adicional_reais = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        default=0.00,
        help_text="Acréscimo em R$ por 100 kWh consumidos.",
    )
    descricao = models.TextField(
        blank=True,
        default="",
        help_text="Descrição das condições vigentes.",
    )
    ativa = models.BooleanField(
        default=False,
        help_text="Indica a bandeira atualmente vigente.",
    )

    class Meta:
        ordering = ['nome']
        verbose_name = 'Bandeira Tarifária'
        verbose_name_plural = 'Bandeiras Tarifárias'

    def __str__(self):
        return f"Bandeira {self.get_nome_display()} (R$ {self.valor_adicional_reais}/100 kWh)"


class QuizPergunta(models.Model):
    """
    Questão de quiz vinculada a um módulo educativo.
    As alternativas são armazenadas como um array JSON de strings.
    """
    modulo = models.ForeignKey(
        'educacao.ModuloEducativo',
        on_delete=models.CASCADE,
        related_name='quiz_perguntas',
        help_text="Módulo ao qual esta questão pertence.",
    )
    pergunta = models.TextField(help_text="Texto da pergunta.")
    alternativas = models.JSONField(
        default=list,
        help_text="Lista de strings com as alternativas de resposta.",
    )
    resposta_correta = models.PositiveSmallIntegerField(
        help_text="Índice (0-based) da alternativa correta.",
    )
    explicacao = models.TextField(
        blank=True,
        default="",
        help_text="Explicação exibida após a resposta.",
    )

    class Meta:
        ordering = ['modulo', 'id']
        verbose_name = 'Pergunta de Quiz'
        verbose_name_plural = 'Perguntas de Quiz'

    def __str__(self):
        return f"[Módulo {self.modulo.modulo_id}] {self.pergunta[:60]}"
