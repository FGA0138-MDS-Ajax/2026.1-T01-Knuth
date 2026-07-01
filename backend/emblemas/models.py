from django.conf import settings
from django.db import models


class Emblema(models.Model):
    """
    Catálogo dos emblemas disponíveis no sistema.
    O campo `codigo` deve ser igual ao id usado pelo front-end.
    """
    codigo = models.SlugField(max_length=80, unique=True)
    nome = models.CharField(max_length=120)
    descricao = models.TextField(blank=True, default='')
    criterio = models.CharField(max_length=255)
    imagem = models.CharField(max_length=255, help_text='Caminho da imagem no front-end/public')
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['nome']
        verbose_name = 'Emblema'
        verbose_name_plural = 'Emblemas'

    def __str__(self):
        return f'{self.nome} ({self.codigo})'


class ConquistaUsuario(models.Model):
    """
    Registra quais emblemas cada usuário já conquistou.
    A regra unique_together evita emblemas duplicados para o mesmo usuário.
    """
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conquistas_emblemas',
    )
    emblema = models.ForeignKey(
        Emblema,
        on_delete=models.CASCADE,
        related_name='conquistas',
    )
    desbloqueado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'emblema')
        ordering = ['-desbloqueado_em']
        verbose_name = 'Conquista do Usuário'
        verbose_name_plural = 'Conquistas dos Usuários'

    def __str__(self):
        return f'{self.usuario} conquistou {self.emblema.nome}'
