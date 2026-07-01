# Generated manually for RF08 - Sistema de Emblemas

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Emblema',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo', models.SlugField(max_length=80, unique=True)),
                ('nome', models.CharField(max_length=120)),
                ('descricao', models.TextField(blank=True, default='')),
                ('criterio', models.CharField(max_length=255)),
                ('imagem', models.CharField(help_text='Caminho da imagem no front-end/public', max_length=255)),
                ('ativo', models.BooleanField(default=True)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('atualizado_em', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Emblema',
                'verbose_name_plural': 'Emblemas',
                'ordering': ['nome'],
            },
        ),
        migrations.CreateModel(
            name='ConquistaUsuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('desbloqueado_em', models.DateTimeField(auto_now_add=True)),
                ('emblema', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conquistas', to='emblemas.emblema')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conquistas_emblemas', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Conquista do Usuário',
                'verbose_name_plural': 'Conquistas dos Usuários',
                'ordering': ['-desbloqueado_em'],
                'unique_together': {('usuario', 'emblema')},
            },
        ),
    ]
