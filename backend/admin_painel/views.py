"""
Painel Administrativo — RF10
Todas as rotas exigem is_staff=True.
Usuário comum autenticado → 403 Forbidden.
"""
import json
import logging

from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from consumo.models import Eletrodomestico, SimulacaoConsumo
from educacao.models import ModuloEducativo, ProgressoModulo
from .models import BandeiraTarifaria, QuizPergunta

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

def _somente_admin(request):
    """
    Retorna um JsonResponse 403 se o usuário não for staff/admin.
    Retorna None quando o acesso é permitido.
    """
    if not request.user.is_authenticated or not request.user.is_staff:
        return JsonResponse(
            {"ok": False, "erro": "Acesso negado. Área restrita a administradores."},
            status=403,
        )
    return None


def _carregar_json(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        raise ValueError("JSON inválido.")


# ──────────────────────────────────────────────
# Bandeiras Tarifárias
# ──────────────────────────────────────────────

def _serializar_bandeira(b):
    return {
        "id": b.id,
        "nome": b.nome,
        "valor_adicional_reais": str(b.valor_adicional_reais),
        "descricao": b.descricao,
        "ativa": b.ativa,
    }


@csrf_exempt
@require_http_methods(["GET", "POST"])
def bandeiras_list(request):
    negado = _somente_admin(request)
    if negado:
        return negado

    if request.method == "GET":
        bandeiras = BandeiraTarifaria.objects.all()
        return JsonResponse(
            {"resultados": [_serializar_bandeira(b) for b in bandeiras]},
            status=200,
        )

    # POST — criar
    try:
        dados = _carregar_json(request)
        bandeira = BandeiraTarifaria.objects.create(
            nome=dados.get("nome", ""),
            valor_adicional_reais=dados.get("valor_adicional_reais", "0.00"),
            descricao=dados.get("descricao", ""),
            ativa=dados.get("ativa", False),
        )
        return JsonResponse(_serializar_bandeira(bandeira), status=201)
    except Exception as exc:
        logger.exception("Erro ao criar bandeira")
        return JsonResponse({"ok": False, "erro": str(exc)}, status=400)


@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def bandeiras_detail(request, pk):
    negado = _somente_admin(request)
    if negado:
        return negado

    try:
        bandeira = BandeiraTarifaria.objects.get(pk=pk)
    except BandeiraTarifaria.DoesNotExist:
        return JsonResponse({"ok": False, "erro": "Bandeira não encontrada."}, status=404)

    if request.method == "DELETE":
        bandeira.delete()
        return JsonResponse({}, status=204)

    # PUT — atualizar
    try:
        dados = _carregar_json(request)
        bandeira.nome = dados.get("nome", bandeira.nome)
        bandeira.valor_adicional_reais = dados.get("valor_adicional_reais", bandeira.valor_adicional_reais)
        bandeira.descricao = dados.get("descricao", bandeira.descricao)
        bandeira.ativa = dados.get("ativa", bandeira.ativa)
        bandeira.save()
        return JsonResponse(_serializar_bandeira(bandeira), status=200)
    except Exception as exc:
        logger.exception("Erro ao atualizar bandeira")
        return JsonResponse({"ok": False, "erro": str(exc)}, status=400)


# ──────────────────────────────────────────────
# Eletrodomésticos
# ──────────────────────────────────────────────

def _serializar_eletrodomestico(e):
    return {
        "id": e.id,
        "nome": e.nome,
        "potencia_media_watts": e.potencia_media_watts,
        "tempo_medio_uso_minutos": e.tempo_medio_uso_minutos,
        "descricao_uso": e.descricao_uso,
        "destaque": e.destaque,
    }


@csrf_exempt
@require_http_methods(["GET", "POST"])
def eletrodomesticos_list(request):
    negado = _somente_admin(request)
    if negado:
        return negado

    if request.method == "GET":
        itens = Eletrodomestico.objects.all()
        return JsonResponse(
            {"resultados": [_serializar_eletrodomestico(e) for e in itens]},
            status=200,
        )

    # POST — criar
    try:
        dados = _carregar_json(request)
        eletro = Eletrodomestico.objects.create(
            nome=dados.get("nome", ""),
            potencia_media_watts=dados.get("potencia_media_watts", 0),
            tempo_medio_uso_minutos=dados.get("tempo_medio_uso_minutos", 60),
            descricao_uso=dados.get("descricao_uso", "Tempo médio de uso"),
            destaque=dados.get("destaque", False),
        )
        return JsonResponse(_serializar_eletrodomestico(eletro), status=201)
    except Exception as exc:
        logger.exception("Erro ao criar eletrodoméstico")
        return JsonResponse({"ok": False, "erro": str(exc)}, status=400)


@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def eletrodomesticos_detail(request, pk):
    negado = _somente_admin(request)
    if negado:
        return negado

    try:
        eletro = Eletrodomestico.objects.get(pk=pk)
    except Eletrodomestico.DoesNotExist:
        return JsonResponse({"ok": False, "erro": "Eletrodoméstico não encontrado."}, status=404)

    if request.method == "DELETE":
        eletro.delete()
        return JsonResponse({}, status=204)

    # PUT
    try:
        dados = _carregar_json(request)
        eletro.nome = dados.get("nome", eletro.nome)
        eletro.potencia_media_watts = dados.get("potencia_media_watts", eletro.potencia_media_watts)
        eletro.tempo_medio_uso_minutos = dados.get("tempo_medio_uso_minutos", eletro.tempo_medio_uso_minutos)
        eletro.descricao_uso = dados.get("descricao_uso", eletro.descricao_uso)
        eletro.destaque = dados.get("destaque", eletro.destaque)
        eletro.save()
        return JsonResponse(_serializar_eletrodomestico(eletro), status=200)
    except Exception as exc:
        logger.exception("Erro ao atualizar eletrodoméstico")
        return JsonResponse({"ok": False, "erro": str(exc)}, status=400)


# ──────────────────────────────────────────────
# Módulos Educativos
# ──────────────────────────────────────────────

def _serializar_modulo(m):
    return {
        "id": m.id,
        "modulo_id": m.modulo_id,
        "titulo": m.titulo,
        "descricao": m.descricao,
        "duracao": m.duracao,
        "ordem": m.ordem,
        "ativo": m.ativo,
    }


@csrf_exempt
@require_http_methods(["GET", "POST"])
def modulos_list(request):
    negado = _somente_admin(request)
    if negado:
        return negado

    if request.method == "GET":
        modulos = ModuloEducativo.objects.all()
        return JsonResponse(
            {"resultados": [_serializar_modulo(m) for m in modulos]},
            status=200,
        )

    # POST — criar
    try:
        dados = _carregar_json(request)
        modulo = ModuloEducativo.objects.create(
            modulo_id=dados['modulo_id'],
            titulo=dados['titulo'],
            descricao=dados.get('descricao', ''),
            duracao=dados.get('duracao', ''),
            ordem=dados.get('ordem', 0),
            ativo=dados.get('ativo', True),
        )
        return JsonResponse(_serializar_modulo(modulo), status=201)
    except Exception as exc:
        logger.exception("Erro ao criar módulo")
        return JsonResponse({"ok": False, "erro": str(exc)}, status=400)


@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def modulos_detail(request, pk):
    negado = _somente_admin(request)
    if negado:
        return negado

    try:
        modulo = ModuloEducativo.objects.get(pk=pk)
    except ModuloEducativo.DoesNotExist:
        return JsonResponse({"ok": False, "erro": "Módulo não encontrado."}, status=404)

    if request.method == "DELETE":
        modulo.delete()
        return JsonResponse({}, status=204)

    # PUT
    try:
        dados = _carregar_json(request)
        modulo.modulo_id = dados.get("modulo_id", modulo.modulo_id)
        modulo.titulo = dados.get("titulo", modulo.titulo)
        modulo.descricao = dados.get("descricao", modulo.descricao)
        modulo.duracao = dados.get("duracao", modulo.duracao)
        modulo.ordem = dados.get("ordem", modulo.ordem)
        if 'ativo' in dados:
            modulo.ativo = dados['ativo']

        modulo.save()
        return JsonResponse(_serializar_modulo(modulo), status=200)
    except Exception as exc:
        logger.exception("Erro ao atualizar módulo")
        return JsonResponse({"ok": False, "erro": str(exc)}, status=400)


# ──────────────────────────────────────────────
# Quiz Perguntas
# ──────────────────────────────────────────────

def _serializar_quiz(q):
    return {
        "id": q.id,
        "modulo_id": q.modulo.modulo_id,
        "pergunta": q.pergunta,
        "alternativas": q.alternativas,
        "resposta_correta": q.resposta_correta,
        "explicacao": q.explicacao,
    }


@csrf_exempt
@require_http_methods(["GET", "POST"])
def quizzes_list(request):
    negado = _somente_admin(request)
    if negado:
        return negado

    if request.method == "GET":
        quizzes = QuizPergunta.objects.select_related("modulo").all()
        return JsonResponse(
            {"resultados": [_serializar_quiz(q) for q in quizzes]},
            status=200,
        )

    # POST — criar
    try:
        dados = _carregar_json(request)
        modulo_id = dados.get("modulo_id")
        try:
            modulo = ModuloEducativo.objects.get(modulo_id=modulo_id)
        except ModuloEducativo.DoesNotExist:
            return JsonResponse(
                {"ok": False, "erro": f"Módulo com modulo_id={modulo_id} não encontrado."},
                status=404,
            )

        pergunta = QuizPergunta.objects.create(
            modulo=modulo,
            pergunta=dados.get("pergunta", ""),
            alternativas=dados.get("alternativas", []),
            resposta_correta=dados.get("resposta_correta", 0),
            explicacao=dados.get("explicacao", ""),
        )
        return JsonResponse(_serializar_quiz(pergunta), status=201)
    except Exception as exc:
        logger.exception("Erro ao criar pergunta de quiz")
        return JsonResponse({"ok": False, "erro": str(exc)}, status=400)


@csrf_exempt
@require_http_methods(["PUT", "DELETE"])
def quizzes_detail(request, pk):
    negado = _somente_admin(request)
    if negado:
        return negado

    try:
        pergunta = QuizPergunta.objects.select_related("modulo").get(pk=pk)
    except QuizPergunta.DoesNotExist:
        return JsonResponse({"ok": False, "erro": "Pergunta não encontrada."}, status=404)

    if request.method == "DELETE":
        pergunta.delete()
        return JsonResponse({}, status=204)

    # PUT
    try:
        dados = _carregar_json(request)

        # Se modulo_id foi passado, resolve o módulo
        novo_modulo_id = dados.get("modulo_id")
        if novo_modulo_id is not None:
            try:
                pergunta.modulo = ModuloEducativo.objects.get(modulo_id=novo_modulo_id)
            except ModuloEducativo.DoesNotExist:
                return JsonResponse(
                    {"ok": False, "erro": f"Módulo com modulo_id={novo_modulo_id} não encontrado."},
                    status=404,
                )

        pergunta.pergunta = dados.get("pergunta", pergunta.pergunta)
        pergunta.alternativas = dados.get("alternativas", pergunta.alternativas)
        pergunta.resposta_correta = dados.get("resposta_correta", pergunta.resposta_correta)
        pergunta.explicacao = dados.get("explicacao", pergunta.explicacao)
        pergunta.save()
        return JsonResponse(_serializar_quiz(pergunta), status=200)
    except Exception as exc:
        logger.exception("Erro ao atualizar pergunta de quiz")
        return JsonResponse({"ok": False, "erro": str(exc)}, status=400)


# ──────────────────────────────────────────────
# Estatísticas Gerais
# ──────────────────────────────────────────────

@require_http_methods(["GET"])
def estatisticas(request):
    negado = _somente_admin(request)
    if negado:
        return negado

    total_usuarios = User.objects.count()
    total_simulacoes = SimulacaoConsumo.objects.count()
    total_modulos = ModuloEducativo.objects.filter(ativo=True).count()
    total_conclusoes = ProgressoModulo.objects.count()

    return JsonResponse(
        {
            "total_usuarios": total_usuarios,
            "total_simulacoes": total_simulacoes,
            "total_modulos": total_modulos,
            "modulos_ativos": total_modulos,          # alias aceito pelo front
            "total_conclusoes": total_conclusoes,
            "modulos_concluidos": total_conclusoes,   # alias aceito pelo front
        },
        status=200,
    )
