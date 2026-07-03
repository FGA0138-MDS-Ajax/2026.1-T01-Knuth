from django.urls import path
from . import views

urlpatterns = [
    # Bandeiras tarifárias
    path('bandeiras/', views.bandeiras_list, name='admin-bandeiras-list'),
    path('bandeiras/<int:pk>/', views.bandeiras_detail, name='admin-bandeiras-detail'),

    # Eletrodomésticos
    path('eletrodomesticos/', views.eletrodomesticos_list, name='admin-eletrodomesticos-list'),
    path('eletrodomesticos/<int:pk>/', views.eletrodomesticos_detail, name='admin-eletrodomesticos-detail'),

    # Módulos educativos
    path('modulos/', views.modulos_list, name='admin-modulos-list'),
    path('modulos/<int:pk>/', views.modulos_detail, name='admin-modulos-detail'),

    # Perguntas de quiz
    path('quizzes/', views.quizzes_list, name='admin-quizzes-list'),
    path('quizzes/<int:pk>/', views.quizzes_detail, name='admin-quizzes-detail'),

    # Estatísticas gerais (visão admin)
    path('estatisticas/', views.estatisticas, name='admin-estatisticas'),
]
