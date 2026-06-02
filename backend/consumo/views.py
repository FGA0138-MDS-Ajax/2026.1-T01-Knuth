import json
from decimal import Decimal
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import SimulacaoConsumo, ItemSimulacaoConsumo
from .services import MotorCalculoEnergetico, CalculoEnergeticoError

def serializar_decimal(valor):
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
def calcular_consumo_medio(request):
    try:
        dados = carregar_json(request)

        resultado = MotorCalculoEnergetico.calcular_consumo_medio(
            eletrodomesticos=dados.get("eletrodomesticos"),
            tarifa_kwh=dados.get("tarifa_kwh"),
            dias_padrao=dados.get("dias_referencia", 30),
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
def criar_simulacao_consumo(request):
    try:
        dados = carregar_json(request)

        titulo = dados.get("titulo") or "Simulação de consumo"
        tarifa_kwh = dados.get("tarifa_kwh")
        dias_referencia = dados.get("dias_referencia", 30)
        eletrodomesticos = dados.get("eletrodomesticos")

        resultado = MotorCalculoEnergetico.calcular_consumo_medio(
            eletrodomesticos=eletrodomesticos,
            tarifa_kwh=tarifa_kwh,
            dias_padrao=dias_referencia,
        )

        simulacao = SimulacaoConsumo.objects.create(
            usuario=request.user if request.user.is_authenticated else None,
            titulo=titulo,
            tarifa_kwh=Decimal(str(tarifa_kwh)),
            dias_referencia=dias_referencia,
            quantidade_eletrodomesticos=resultado["quantidade_eletrodomesticos"],
            total_consumo_mensal_kwh=resultado["total_consumo_mensal_kwh"],
            consumo_medio_mensal_kwh=resultado["consumo_medio_mensal_kwh"],
            total_custo_mensal=resultado["total_custo_mensal"],
            custo_medio_mensal=resultado["custo_medio_mensal"],
        )

        for item in resultado["itens"]:
            ItemSimulacaoConsumo.objects.create(
                simulacao=simulacao,
                nome_eletrodomestico=item["nome"],
                potencia_watts=item["potencia_watts"],
                horas_uso_dia=item["horas_uso_dia"],
                dias_uso_mes=item["dias_uso_mes"],
                consumo_diario_kwh=item["consumo_diario_kwh"],
                consumo_mensal_kwh=item["consumo_mensal_kwh"],
                custo_mensal_estimado=item["custo_mensal_estimado"],
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

    simulacoes = SimulacaoConsumo.objects.filter(usuario=request.user).prefetch_related("itens")
    dados = []

    for simulacao in simulacoes:
        dados.append(
            {
                "id": simulacao.id,
                "titulo": simulacao.titulo,
                "tarifa_kwh": str(simulacao.tarifa_kwh),
                "dias_referencia": simulacao.dias_referencia,
                "quantidade_eletrodomesticos": simulacao.quantidade_eletrodomesticos,
                "total_consumo_mensal_kwh": str(simulacao.total_consumo_mensal_kwh),
                "consumo_medio_mensal_kwh": str(simulacao.consumo_medio_mensal_kwh),
                "total_custo_mensal": str(simulacao.total_custo_mensal),
                "custo_medio_mensal": str(simulacao.custo_medio_mensal),
                "criado_em": simulacao.criado_em.isoformat(),
                "itens": [
                    {
                        "id": item.id,
                        "nome_eletrodomestico": item.nome_eletrodomestico,
                        "potencia_watts": str(item.potencia_watts),
                        "horas_uso_dia": str(item.horas_uso_dia),
                        "dias_uso_mes": item.dias_uso_mes,
                        "consumo_diario_kwh": str(item.consumo_diario_kwh),
                        "consumo_mensal_kwh": str(item.consumo_mensal_kwh),
                        "custo_mensal_estimado": str(item.custo_mensal_estimado),
                    }
                    for item in simulacao.itens.all()
                ],
            }
        )

    return JsonResponse(
        {
            "ok": True,
            "simulacoes": dados,
        },
        status=200,
    )