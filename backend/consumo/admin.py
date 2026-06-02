from django.contrib import admin
from .models import SimulacaoConsumo, ItemSimulacaoConsumo

class ItemSimulacaoConsumoInline(admin.TabularInline):
    model = ItemSimulacaoConsumo
    extra = 0
    readonly_fields = (
        "consumo_diario_kwh",
        "consumo_mensal_kwh",
        "custo_mensal_estimado",
    )

@admin.register(SimulacaoConsumo)
class SimulacaoConsumoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "titulo",
        "usuario",
        "quantidade_eletrodomesticos",
        "total_consumo_mensal_kwh",
        "total_custo_mensal",
        "criado_em",
    )

    search_fields = (
        "titulo",
        "usuario__username",
        "usuario__email",
    )

    list_filter = ("criado_em",)
    inlines = [ItemSimulacaoConsumoInline]

@admin.register(ItemSimulacaoConsumo)
class ItemSimulacaoConsumoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "nome_eletrodomestico",
        "potencia_watts",
        "horas_uso_dia",
        "dias_uso_mes",
        "consumo_mensal_kwh",
        "custo_mensal_estimado",
    )

    search_fields = ("nome_eletrodomestico",)