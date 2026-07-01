import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .services import desbloquear_emblema, listar_emblemas_do_usuario, serializar_emblema


def carregar_json(request):
    try:
        return json.loads(request.body.decode('utf-8') or '{}')
    except json.JSONDecodeError:
        raise ValueError('JSON inválido.')


@require_http_methods(['GET'])
def listar_emblemas(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {
                'ok': False,
                'erro': 'Faça login para visualizar seus emblemas.',
                'emblemas': [],
                'desbloqueados': [],
            },
            status=401,
        )

    dados = listar_emblemas_do_usuario(request.user)
    return JsonResponse({'ok': True, **dados}, status=200)


@csrf_exempt
@require_http_methods(['POST'])
def desbloquear(request):
    """
    Endpoint usado pelo front para registrar eventos que acontecem só na interface,
    como conclusão de quiz. É idempotente: repetir o mesmo emblema não duplica.
    Body: { "emblema_id": "mente_curiosa" }
    """
    if not request.user.is_authenticated:
        return JsonResponse(
            {'ok': False, 'erro': 'Faça login para salvar seus emblemas.'},
            status=401,
        )

    try:
        dados = carregar_json(request)
        codigo = dados.get('emblema_id') or dados.get('codigo') or dados.get('id')
        if not codigo:
            return JsonResponse(
                {'ok': False, 'erro': "O campo 'emblema_id' é obrigatório."},
                status=400,
            )

        emblema, criado = desbloquear_emblema(request.user, codigo)
        if not emblema:
            return JsonResponse(
                {'ok': False, 'erro': f"Emblema '{codigo}' não encontrado."},
                status=404,
            )

        dados_usuario = listar_emblemas_do_usuario(request.user)
        return JsonResponse(
            {
                'ok': True,
                'desbloqueado_agora': criado,
                'emblema': serializar_emblema(emblema, conquistado=True),
                'novos_emblemas': [serializar_emblema(emblema, conquistado=True)] if criado else [],
                'desbloqueados': dados_usuario['desbloqueados'],
            },
            status=201 if criado else 200,
        )

    except ValueError as erro:
        return JsonResponse({'ok': False, 'erro': str(erro)}, status=400)
