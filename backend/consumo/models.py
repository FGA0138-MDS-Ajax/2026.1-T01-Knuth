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
