from django.urls import path

from . import views

urlpatterns = [
    path('', views.listar_emblemas, name='listar-emblemas'),
    path('desbloquear/', views.desbloquear, name='desbloquear-emblema'),
]
