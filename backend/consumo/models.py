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
    tarifa_kwh = models.DecimalField(max_digits=10, decimal_places=4)
    dias_referencia = models.PositiveSmallIntegerField(default=30)

    quantidade_eletrodomesticos = models.PositiveSmallIntegerField(default=0)
    total_consumo_mensal_kwh = models.DecimalField(max_digits=12, decimal_places=4)
    consumo_medio_mensal_kwh = models.DecimalField(max_digits=12, decimal_places=4)
    total_custo_mensal = models.DecimalField(max_digits=12, decimal_places=2)
    custo_medio_mensal = models.DecimalField(max_digits=12, decimal_places=2)

    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-criado_em"]

    def __str__(self):
        return f"{self.titulo} - {self.total_consumo_mensal_kwh} kWh"

class ItemSimulacaoConsumo(models.Model):
    simulacao = models.ForeignKey(
        SimulacaoConsumo,
        on_delete=models.CASCADE,
        related_name="itens",
    )

    nome_eletrodomestico = models.CharField(max_length=120)
    potencia_watts = models.DecimalField(max_digits=10, decimal_places=2)
    horas_uso_dia = models.DecimalField(max_digits=5, decimal_places=2)
    dias_uso_mes = models.PositiveSmallIntegerField(default=30)

    consumo_diario_kwh = models.DecimalField(max_digits=12, decimal_places=4)
    consumo_mensal_kwh = models.DecimalField(max_digits=12, decimal_places=4)
    custo_mensal_estimado = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        ordering = ["-consumo_mensal_kwh"]

    def __str__(self):
        return f"{self.nome_eletrodomestico} - {self.consumo_mensal_kwh} kWh"