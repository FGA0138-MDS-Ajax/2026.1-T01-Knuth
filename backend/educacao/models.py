from django.conf import settings
from django.db import models


class ModuloEducativo(models.Model):
    """
    Metadados de cada módulo educativo.
    O conteúdo completo (textos, seções, quiz) permanece nos arquivos JS do front-end.
    Este modelo serve como âncora para o progresso do usuário e como fonte de verdade
    para a listagem via API.
    """
    modulo_id = models.PositiveIntegerField(
        unique=True,
        help_text="ID do módulo — deve corresponder ao 'id' definido nos arquivos JS do front-end (1 a 8)."
    )
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    duracao = models.CharField(
        max_length=20,
        help_text="Tempo estimado de leitura, ex: '6 min'."
    )
    ordem = models.PositiveSmallIntegerField(
        help_text="Define a sequência na trilha de aprendizagem."
    )
    ativo = models.BooleanField(
        default=True,
        help_text="Módulos inativos não aparecem na listagem pública."
    )
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['ordem']
        verbose_name = 'Módulo Educativo'
        verbose_name_plural = 'Módulos Educativos'

    def __str__(self):
        return f"Módulo {self.modulo_id} — {self.titulo}"


class ProgressoModulo(models.Model):
    """
    Registra que um usuário concluiu um módulo educativo.
    A combinação (usuario, modulo) é única — não existem conclusões duplicadas.
    """
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='progressos_modulos',
    )
    modulo = models.ForeignKey(
        ModuloEducativo,
        on_delete=models.CASCADE,
        related_name='progressos',
    )
    concluido_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'modulo')
        ordering = ['modulo__ordem']
        verbose_name = 'Progresso de Módulo'
        verbose_name_plural = 'Progressos de Módulos'

    def __str__(self):
        return f"Usuário {self.usuario_id} — Módulo {self.modulo.modulo_id} ✓"
