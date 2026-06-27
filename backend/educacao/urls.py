from django.urls import path
from . import views

urlpatterns = [
    path('modulos/', views.listar_modulos, name='listar-modulos'),
    path('progresso/', views.listar_progresso, name='listar-progresso'),
    path('progresso/concluir/', views.marcar_concluido, name='marcar-concluido'),
]
