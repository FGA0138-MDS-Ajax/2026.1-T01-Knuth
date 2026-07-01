from django.contrib import admin

from .models import ConquistaUsuario, Emblema


@admin.register(Emblema)
class EmblemaAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'nome', 'ativo')
    search_fields = ('codigo', 'nome')
    list_filter = ('ativo',)


@admin.register(ConquistaUsuario)
class ConquistaUsuarioAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'emblema', 'desbloqueado_em')
    search_fields = ('usuario__username', 'usuario__email', 'emblema__codigo', 'emblema__nome')
    list_filter = ('emblema', 'desbloqueado_em')
