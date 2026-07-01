import json
import logging

from django.db import DatabaseError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import ModuloEducativo, ProgressoModulo
from emblemas.services import desbloquear_varios

logger = logging.getLogger(__name__)


def carregar_json(request):
    try:
        return json.loads(request.body.decode('utf-8') or '{}')
    except json.JSONDecodeError:
        raise ValueError('JSON inválido.')


# ──────────────────────────────────────────────
# GET /api/educacao/modulos/
# ──────────────────────────────────────────────

@require_http_methods(['GET'])
def listar_modulos(request):
    """
    Lista todos os módulos educativos ativos, ordenados pela trilha.
    Se o usuário estiver autenticado, inclui o campo 'concluido' para cada módulo.
    Rota pública — não exige login.
    """
    modulos = ModuloEducativo.objects.filter(ativo=True)

    # Pré-carrega os IDs concluídos pelo usuário logado (evita N queries)
    ids_concluidos = set()
    if request.user.is_authenticated:
        ids_concluidos = set(
            ProgressoModulo.objects.filter(usuario=request.user)
            .values_list('modulo_id', flat=True)
        )

    dados = []
    for modulo in modulos:
        dados.append({
            'modulo_id': modulo.modulo_id,
            'titulo': modulo.titulo,
            'descricao': modulo.descricao,
            'duracao': modulo.duracao,
            'ordem': modulo.ordem,
            'concluido': modulo.pk in ids_concluidos,
        })

    return JsonResponse({'ok': True, 'modulos': dados}, status=200)


# ──────────────────────────────────────────────
# GET /api/educacao/progresso/
# ──────────────────────────────────────────────

@require_http_methods(['GET'])
def listar_progresso(request):
    """
    Retorna a lista de modulo_id já concluídos pelo usuário logado.
    Usado pelo front-end para sincronizar o localStorage com o servidor.
    """
    if not request.user.is_authenticated:
        return JsonResponse({'ok': True, 'concluidos': []}, status=200)

    ids_concluidos = list(
        ProgressoModulo.objects.filter(usuario=request.user)
        .values_list('modulo__modulo_id', flat=True)
    )

    return JsonResponse({'ok': True, 'concluidos': ids_concluidos}, status=200)


# ──────────────────────────────────────────────
# POST /api/educacao/progresso/concluir/
# ──────────────────────────────────────────────

@csrf_exempt
@require_http_methods(['POST'])
def marcar_concluido(request):
    """
    Marca um módulo como concluído para o usuário logado.
    Idempotente: chamar duas vezes com o mesmo modulo_id não duplica o registro.
    Body: { "modulo_id": <int> }
    """
    if not request.user.is_authenticated:
        return JsonResponse(
            {'ok': False, 'erro': 'Faça login para salvar seu progresso.'},
            status=401,
        )

    try:
        dados = carregar_json(request)
        modulo_id = dados.get('modulo_id')

        if modulo_id is None:
            return JsonResponse(
                {'ok': False, 'erro': "O campo 'modulo_id' é obrigatório."},
                status=400,
            )

        try:
            modulo = ModuloEducativo.objects.get(modulo_id=int(modulo_id), ativo=True)
        except ModuloEducativo.DoesNotExist:
            return JsonResponse(
                {'ok': False, 'erro': f"Módulo {modulo_id} não encontrado ou inativo."},
                status=404,
            )

        _, criado = ProgressoModulo.objects.get_or_create(
            usuario=request.user,
            modulo=modulo,
        )

        # RF08 — conclusão de 1 módulo e conclusão da trilha completa.
        novos_emblemas = []
        if criado:
            novos_emblemas += desbloquear_varios(request.user, ['primeiro_modulo'])

            total_modulos_ativos = ModuloEducativo.objects.filter(ativo=True).count()
            total_concluidos = ProgressoModulo.objects.filter(
                usuario=request.user,
                modulo__ativo=True,
            ).count()

            if total_modulos_ativos > 0 and total_concluidos >= total_modulos_ativos:
                novos_emblemas += desbloquear_varios(request.user, ['trilha_completa'])

        return JsonResponse(
            {
                'ok': True,
                'mensagem': f"Módulo {modulo_id} marcado como concluído.",
                'ja_concluido': not criado,
                'novos_emblemas': novos_emblemas,
            },
            status=200,
        )

    except ValueError as erro:
        return JsonResponse({'ok': False, 'erro': str(erro)}, status=400)
    except DatabaseError:
        logger.exception('Falha ao registrar progresso de módulo educativo')
        return JsonResponse(
            {'ok': False, 'erro': 'Erro interno ao salvar o progresso. Tente novamente.'},
            status=500,
        )
