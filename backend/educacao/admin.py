from django.contrib import admin
from .models import ModuloEducativo, ProgressoModulo


@admin.register(ModuloEducativo)
class ModuloEducativoAdmin(admin.ModelAdmin):
    list_display = ('modulo_id', 'titulo', 'duracao', 'ordem', 'ativo', 'criado_em')
    list_filter = ('ativo',)
    ordering = ('ordem',)
    search_fields = ('titulo', 'descricao')


@admin.register(ProgressoModulo)
class ProgressoModuloAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'modulo', 'concluido_em')
    list_filter = ('modulo',)
    ordering = ('-concluido_em',)
    search_fields = ('usuario__username', 'usuario__email')
