from django.urls import path
from . import views

urlpatterns = [
    path("calcular/", views.calcular_media_mensal_view, name="calcular-media"),
    path("simulacoes/", views.criar_simulacao_view, name="criar-simulacao"),
    path("simulacoes/minhas/", views.listar_minhas_simulacoes, name="listar-minhas-simulacoes"),
    path("eletrodomesticos/", views.listar_eletrodomesticos, name="listar-eletrodomesticos"),
    path("analise-reducao/", views.analise_consumo_rf05, name="analise-consumo-rf05"),
]
