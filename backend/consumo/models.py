from django.conf import settings
from django.db import models

class SimulacaoConsumo(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="simulacoes_consumo",
        null=True,
        blank=True,
    )

    titulo = models.CharField(max_length=120, default="Simulação de consumo")
    meses_analisados = models.PositiveBigIntegerField(default=3)
    total_consumo_mensal_kwh = models.DecimalField(max_digits=12, decimal_places=2)
    consumo_medio_mensal_kwh = models.DecimalField(max_digits=12, decimal_places=2)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-criado_em"]

    def __str__(self):
        return f"{self.titulo} - {self.total_consumo_mensal_kwh} kWh"

##inserindo a RF03
#unico objetivo e termos a lista 
#coloquei o watts para agilizar e facilitar a inserção da RF04
class Eletrodomestico(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    potencia_media_watts = models.PositiveIntegerField(help_text="Potência média em Watts")
    destaque = models.BooleanField(default=False, help_text="Aparece no Top 10 inicial da tela")

    class Meta:
        ordering = ["nome"]

    def __str__(self):
        return f"{self.nome} ({self.potencia_media_watts}W)"