import json
import logging
from decimal import Decimal

from django.db import DatabaseError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import SimulacaoConsumo
from .services import MotorCalculoEnergetico, CalculoEnergeticoError

logger = logging.getLogger(__name__)

def serializar_decimal(valor): #função fica
    if isinstance(valor, Decimal):
        return str(valor)
    if isinstance(valor, dict):
        return {
            chave: serializar_decimal(item)
            for chave, item in valor.items()
        }
    if isinstance(valor, list):
        return [serializar_decimal(item) for item in valor]
    return valor

def carregar_json(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        raise CalculoEnergeticoError("JSON inválido.")

@csrf_exempt
@require_http_methods(["POST"])
def calcular_media_mensal_view(request):
    try:
        dados = carregar_json(request)
        ##chama o calculo correto
        resultado = MotorCalculoEnergetico.calcular_media_mensal(
            consumos_mensais_kwh=dados.get("consumos")
        )

        return JsonResponse(
            {
                "ok": True,
                "mensagem": "Cálculo realizado com sucesso.",
                "resultado": serializar_decimal(resultado),
            },
            status=200,
        )

    except CalculoEnergeticoError as erro:
        return JsonResponse(
            {
                "ok": False,
                "erro": str(erro),
            },
            status=400,
        )

@csrf_exempt
@require_http_methods(["POST"])
def criar_simulacao_view(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "ok": False,
                "erro": "Faça login para salvar simulações.",
            },
            status=401,
        )

    try:
        dados = carregar_json(request)

        titulo = dados.get("titulo") or "Simulação de consumo"
        consumos = dados.get("consumos")

        resultado = MotorCalculoEnergetico.calcular_media_mensal(
            consumos_mensais_kwh=consumos
        )

        simulacao = SimulacaoConsumo.objects.create(
            usuario=request.user,
            titulo=titulo,
            meses_analisados=resultado["meses_analisados"],
            total_consumo_mensal_kwh=resultado["consumo_total_kwh"],
            consumo_medio_mensal_kwh=resultado["consumo_medio_mensal_kwh"],
        )

        return JsonResponse(
            {
                "ok": True,
                "mensagem": "Simulação salva com sucesso.",
                "simulacao_id": simulacao.id,
                "resultado": serializar_decimal(resultado),
            },
            status=201,
        )

    except CalculoEnergeticoError as erro:
        return JsonResponse(
            {
                "ok": False,
                "erro": str(erro),
            },
            status=400,
        )
    except DatabaseError:
        logger.exception("Falha ao persistir simulação de consumo")
        return JsonResponse(
            {
                "ok": False,
                "erro": "Erro interno ao salvar a simulação. Verifique se as migrations foram aplicadas.",
            },
            status=500,
        )


@require_http_methods(["GET"])
def listar_minhas_simulacoes(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "ok": True,
                "simulacoes": [],
            },
            status=200,
        )

    simulacoes = SimulacaoConsumo.objects.filter(usuario=request.user)

    dados = []

    for simulacao in simulacoes:
        dados.append(
            {
                "id": simulacao.id,
                "titulo": simulacao.titulo,
                "meses_analisados": simulacao.meses_analisados,
                "total_consumo_mensal_kwh": str(simulacao.total_consumo_mensal_kwh),
                "consumo_medio_mensal_kwh": str(simulacao.consumo_medio_mensal_kwh),
                "criado_em": simulacao.criado_em.isoformat(),
            }
        )

    return JsonResponse(
        {
            "ok": True,
            "simulacoes": dados,
        },
        status=200,
    )