from django.contrib import admin
from .models import SimulacaoConsumo


@admin.register(SimulacaoConsumo)
class SimulacaoConsumoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "titulo",
        "usuario",
        "total_consumo_mensal_kwh",
        "criado_em",
    )

    search_fields = (
        "titulo",
        "usuario__username",
        "usuario__email",
    )

    list_filter = ("criado_em",)
