from django.urls import path
from . import views

urlpatterns = [
    path("calcular/", views.calcular_consumo_medio, name="calcular-consumo-medio"),
    path("simulacoes/", views.criar_simulacao_consumo, name="criar-simulacao-consumo"),
    path("simulacoes/minhas/", views.listar_minhas_simulacoes, name="listar-minhas-simulacoes"),
]