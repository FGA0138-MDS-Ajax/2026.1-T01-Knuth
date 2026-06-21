from django.contrib import admin
from .models import Eletrodomestico, SimulacaoConsumo


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

@admin.register(Eletrodomestico)#registrando a classe EletrodomesticoAdmin para o modelo Eletrodomestico
class EletrodomesticoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "nome",
        "potencia_media_watts",
        "tempo_medio_uso_minutos",
        "destaque",
    )

    search_fields = ("nome",)
    list_filter = ("destaque",)