from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.fazer_login, name='login'),
    path('logout/', views.fazer_logout, name='logout'),
    path('cadastro/', views.cadastrar_usuario, name='cadastro'),
    path('esqueceu-sua-senha/', views.esqueci_senha, name='esqueceu_senha'),
    path('reset-senha', views.reseta_senha, name='reseta_senha')
]