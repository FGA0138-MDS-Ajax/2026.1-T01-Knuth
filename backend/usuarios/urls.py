from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.fazer_login, name='login'),
    path('cadastro/', views.cadastrar_usuario, name='cadastro'),
]