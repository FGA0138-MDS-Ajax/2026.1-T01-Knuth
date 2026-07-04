import json
import logging
import unicodedata  # para resolver os problemas de acentos e caracteres especiais na busca de eletrodomésticos
from collections import OrderedDict
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

from django.db import DatabaseError
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import SimulacaoConsumo, Eletrodomestico
from .services import MotorCalculoEnergetico, CalculoEnergeticoError, SimuladorRF05
from emblemas.services import desbloquear_varios, emblemas_por_consumos

logger = logging.getLogger(__name__)

TARIFA_REFERENCIA_KWH = Decimal("0.85")
MESES_PT_BR = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
]


def serializar_decimal(valor):  # função fica
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


def calcular_custo_estimado_reais(consumo_kwh):
    """Calcula e arredonda o gasto estimado mensal para persistência no banco."""
    try:
        consumo = Decimal(str(consumo_kwh))
    except (InvalidOperation, TypeError, ValueError):
        consumo = Decimal("0")

    return (consumo * TARIFA_REFERENCIA_KWH).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )


def rotulo_mes_pt_br(data):
    mes = MESES_PT_BR[data.month - 1]
    ano = str(data.year)[-2:]
    return f"{mes}/{ano}"


def serializar_simulacao(simulacao):
    return {
        "id": simulacao.id,
        "titulo": simulacao.titulo,
        "meses_analisados": simulacao.meses_analisados,
        "total_consumo_mensal_kwh": str(simulacao.total_consumo_mensal_kwh),
        "consumo_medio_mensal_kwh": str(simulacao.consumo_medio_mensal_kwh),
        "custo_estimado_reais": str(simulacao.custo_estimado_reais),
        "status_consumo": simulacao.status_consumo,
        "recomendacao": simulacao.recomendacao,
        "criado_em": simulacao.criado_em.isoformat(),
    }


@csrf_exempt
@require_http_methods(["POST"])
def calcular_media_mensal_view(request):
    try:
        dados = carregar_json(request)
        # chama o cálculo correto
        consumos = dados.get("consumos")
        resultado = MotorCalculoEnergetico.calcular_media_mensal(
            consumos_mensais_kwh=consumos
        )

        # RF08 — redução de consumo: compara o mês atual com o mês anterior.
        novos_emblemas = emblemas_por_consumos(request.user, consumos or [])

        return JsonResponse(
            {
                "ok": True,
                "mensagem": "Cálculo realizado com sucesso.",
                "resultado": serializar_decimal(resultado),
                "novos_emblemas": novos_emblemas,
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

        consumo_medio = resultado.get("consumo_medio_mensal_kwh", Decimal("0.00"))
        custo_estimado = calcular_custo_estimado_reais(consumo_medio)

        # RF09: a simulação salva recebe data automática pelo campo criado_em
        # e custo estimado persistido, para o relatório refletir dados do banco.
        simulacao = SimulacaoConsumo.objects.create(
            usuario=request.user,
            titulo=titulo,
            meses_analisados=resultado.get("meses_analisados", len(consumos) if consumos else 0),
            total_consumo_mensal_kwh=resultado.get("consumo_total_kwh", Decimal("0.00")),
            consumo_medio_mensal_kwh=consumo_medio,
            custo_estimado_reais=custo_estimado,
            status_consumo=resultado.get("status_consumo", "nao_avaliado"),
            recomendacao=resultado.get("recomendacao", "Simulação de média gerada com sucesso."),
        )

        resultado["custo_estimado_reais"] = custo_estimado
        resultado["tarifa_utilizada"] = TARIFA_REFERENCIA_KWH

        # RF08 — login para salvar simulação de consumo médio + redução de consumo.
        novos_emblemas = desbloquear_varios(request.user, ["simulacao_salva"])
        novos_emblemas += emblemas_por_consumos(request.user, consumos or [])

        return JsonResponse(
            {
                "ok": True,
                "mensagem": "Simulação salva com sucesso.",
                "simulacao_id": simulacao.id,
                "resultado": serializar_decimal(resultado),
                "novos_emblemas": novos_emblemas,
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
    dados = [serializar_simulacao(simulacao) for simulacao in simulacoes]

    return JsonResponse(
        {
            "ok": True,
            "simulacoes": dados,
        },
        status=200,
    )


def normalizar_texto(texto):  # função para normalizar o texto de busca, removendo acentos e caracteres especiais, e convertendo para minúsculas
    texto = texto or ""
    texto = texto.strip().lower()

    texto_normalizado = unicodedata.normalize("NFD", texto)

    texto_sem_acento = "".join(
        caractere for caractere in texto_normalizado
        if unicodedata.category(caractere) != "Mn"
    )

    return texto_sem_acento


# listar eletrodomesticos atualizado para RF04
@require_http_methods(["GET"])
def listar_eletrodomesticos(request):
    # Lê o parâmetro "busca" — mesmo nome que o frontend envia
    busca = request.GET.get("busca", "").strip()
    todos_param = request.GET.get("todos", "false").lower() == "true"

    if busca:
        # Busca em todo o catálogo com normalização de acentos/case
        busca_normalizada = normalizar_texto(busca)
        todos = Eletrodomestico.objects.all()
        eletrodomesticos = [
            e for e in todos
            if busca_normalizada in normalizar_texto(e.nome)
        ]

        if not eletrodomesticos:
            return JsonResponse(
                {
                    "ok": True,
                    "mensagem": "Não temos informações energéticas sobre este eletrodoméstico.",
                    "eletrodomesticos": [],
                },
                status=200,
            )
    elif todos_param:
        eletrodomesticos = list(Eletrodomestico.objects.all())
    else:
        # Sem busca: exibe apenas os destaques (Top 10 da tela inicial)
        eletrodomesticos = list(Eletrodomestico.objects.filter(destaque=True)[:10])

    dados = []
    for eletrodomestico in eletrodomesticos:
        calculo = MotorCalculoEnergetico.calcular_consumo_eletrodomestico(
            potencia_watts=eletrodomestico.potencia_media_watts,
            tempo_minutos=eletrodomestico.tempo_medio_uso_minutos,
            tarifa_kwh=TARIFA_REFERENCIA_KWH,
        )

        dados.append(
            {
                "id": eletrodomestico.id,
                "nome": eletrodomestico.nome,
                "potencia_media_watts": eletrodomestico.potencia_media_watts,
                "descricao_uso": eletrodomestico.descricao_uso,
                "tempo_medio_uso_minutos": eletrodomestico.tempo_medio_uso_minutos,
                "destaque": eletrodomestico.destaque,
                "consumo_estimado_kwh": str(calculo["consumo_estimado_kwh"]),
                "custo_estimado_reais": str(calculo["custo_estimado_reais"]),
                "tarifa_utilizada": str(calculo["tarifa_utilizada"]),
                "bandeira_tarifaria": calculo["bandeira_tarifaria"],
                "observacao": calculo["observacao"],
            }
        )

    # RF08 — NÃO desbloquear o emblema aqui.
    #
    # Esta rota também é usada pela RF05 (Análise de Consumo) para carregar a
    # lista de aparelhos com ?todos=true. Se o backend liberar o emblema nesta
    # rota, o usuário ganha "Detetive de Aparelhos" apenas por abrir/usar a
    # análise, mesmo sem visitar a tela de Eletrodomésticos.
    #
    # O desbloqueio correto já está no frontend da página de Eletrodomésticos:
    # frontend/src/components/dashboards/PaginaEletrodomesticos.jsx
    #   desbloquearEmblema('detetive_de_aparelhos')
    novos_emblemas = []

    return JsonResponse(
        {
            "ok": True,
            "eletrodomesticos": dados,
            "novos_emblemas": novos_emblemas,
        },
        status=200,
    )


@csrf_exempt
@require_http_methods(["POST"])
def analise_consumo_rf05(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {"ok": False, "erro": "Faça login para salvar e analisar seu consumo."},
            status=401,
        )

    try:
        dados = carregar_json(request)
        consumo_real_kwh = dados.get("consumo_real_kwh")
        ids_eletrodomesticos = dados.get("eletrodomesticos_selecionados", [])

        # vazio ou nulo
        if consumo_real_kwh is None or not ids_eletrodomesticos:
            return JsonResponse(
                {"ok": False, "erro": "Por favor, informe o consumo real e selecione pelo menos um aparelho."},
                status=400,
            )

        try:
            consumo_real_decimal = Decimal(str(consumo_real_kwh))
        except (InvalidOperation, TypeError, ValueError):
            return JsonResponse(
                {"ok": False, "erro": "Consumo inválido. Por favor, digite apenas valores entre 1 e 999 kWh"},
                status=400,
            )

        # se é negativo, zero ou está fora do intervalo esperado
        if consumo_real_decimal <= 0:
            return JsonResponse(
                {"ok": False, "erro": "O valor da conta de luz deve ser maior que zero."},
                status=400,
            )

        # se tudo certo, entra no cálculo
        resultado = SimuladorRF05.gerar_analise_e_recomendacoes(
            consumo_real_kwh=consumo_real_decimal,
            ids_eletrodomesticos=ids_eletrodomesticos,
        )

        custo_estimado = calcular_custo_estimado_reais(consumo_real_decimal)

        # RF09: toda análise da RF05 passa a ser persistida com criado_em.
        # O relatório usa apenas registros vinculados ao request.user.
        simulacao = SimulacaoConsumo.objects.create(
            usuario=request.user,
            titulo=dados.get("titulo") or "Análise de consumo",
            meses_analisados=1,
            total_consumo_mensal_kwh=consumo_real_decimal.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            consumo_medio_mensal_kwh=consumo_real_decimal.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP),
            custo_estimado_reais=custo_estimado,
            status_consumo=resultado.get("status_consumo", "nao_avaliado"),
            recomendacao=resultado.get("recomendacao", ""),
        )

        resultado["consumo_real_kwh"] = consumo_real_decimal.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        resultado["custo_estimado_reais"] = custo_estimado
        resultado["tarifa_utilizada"] = TARIFA_REFERENCIA_KWH

        # RF08 — uso do simulador / análise de consumo.
        novos_emblemas = desbloquear_varios(request.user, ["simulador_em_acao"])

        return JsonResponse(
            {
                "ok": True,
                "resultado": serializar_decimal(resultado),
                "simulacao_id": simulacao.id,
                "novos_emblemas": novos_emblemas,
            },
            status=201,
        )

    except ValueError:
        # se não for número real, ultrapassar ou ser menor que o mínimo no kWh
        return JsonResponse(
            {"ok": False, "erro": "Consumo inválido. Por favor, digite apenas valores entre 1 e 999 kWh"},
            status=400,
        )
    except CalculoEnergeticoError as erro:
        return JsonResponse({"ok": False, "erro": str(erro)}, status=400)
    except DatabaseError:
        logger.exception("Falha ao persistir análise de consumo RF05")
        return JsonResponse(
            {"ok": False, "erro": "Erro interno ao salvar a análise de consumo."},
            status=500,
        )
    except Exception as erro:
        logger.exception("Falha inesperada na análise de consumo RF05")
        return JsonResponse({"ok": False, "erro": str(erro)}, status=500)


@require_http_methods(["GET"])
def relatorio_gastos_view(request):
    """
    RF09 — Relatório de Gastos.

    Retorna um JSON já pronto para gráficos:
    - séries mensais de consumo;
    - séries mensais de gasto estimado;
    - variação percentual em relação ao mês anterior;
    - histórico detalhado das simulações persistidas.

    Segurança/QA: a consulta filtra sempre por usuario=request.user.
    Assim, o Usuário A nunca recebe dados do Usuário B.
    """
    if not request.user.is_authenticated:
        return JsonResponse(
            {"ok": False, "erro": "Faça login para visualizar seu relatório."},
            status=401,
        )

    simulacoes = list(
        SimulacaoConsumo.objects
        .filter(usuario=request.user)
        .order_by("criado_em", "id")
    )

    meses = OrderedDict()

    for simulacao in simulacoes:
        criado_local = timezone.localtime(simulacao.criado_em)
        chave = criado_local.strftime("%Y-%m")
        rotulo = rotulo_mes_pt_br(criado_local)

        if chave not in meses:
            meses[chave] = {
                "chave": chave,
                "rotulo": rotulo,
                "quantidade_simulacoes": 0,
                "consumo_total": Decimal("0.00"),
                "gasto_total": Decimal("0.00"),
            }

        meses[chave]["quantidade_simulacoes"] += 1
        meses[chave]["consumo_total"] += Decimal(str(simulacao.consumo_medio_mensal_kwh or 0))
        meses[chave]["gasto_total"] += Decimal(str(simulacao.custo_estimado_reais or 0))

    series_mensais = []
    consumo_mes_anterior = None

    for mes in meses.values():
        quantidade = Decimal(mes["quantidade_simulacoes"])
        consumo_mensal = (mes["consumo_total"] / quantidade).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )
        gasto_estimado = (mes["gasto_total"] / quantidade).quantize(
            Decimal("0.01"),
            rounding=ROUND_HALF_UP,
        )

        if consumo_mes_anterior and consumo_mes_anterior > 0:
            variacao = ((consumo_mensal - consumo_mes_anterior) / consumo_mes_anterior * Decimal("100")).quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP,
            )
        else:
            variacao = None

        series_mensais.append(
            {
                "chave": mes["chave"],
                "rotulo": mes["rotulo"],
                "quantidade_simulacoes": mes["quantidade_simulacoes"],
                "consumo_mensal_kwh": str(consumo_mensal),
                "gasto_estimado_reais": str(gasto_estimado),
                "variacao_percentual": str(variacao) if variacao is not None else None,
            }
        )
        consumo_mes_anterior = consumo_mensal

    historico = [serializar_simulacao(simulacao) for simulacao in reversed(simulacoes)]
    ultimo_mes = series_mensais[-1] if series_mensais else None

    return JsonResponse(
        {
            "ok": True,
            "resumo": {
                "total_simulacoes": len(simulacoes),
                "total_meses_com_registro": len(series_mensais),
                "consumo_ultimo_mes_kwh": ultimo_mes["consumo_mensal_kwh"] if ultimo_mes else "0.00",
                "gasto_ultimo_mes_reais": ultimo_mes["gasto_estimado_reais"] if ultimo_mes else "0.00",
                "variacao_ultimo_mes_percentual": ultimo_mes["variacao_percentual"] if ultimo_mes else None,
            },
            "graficos": {
                "meses": [mes["rotulo"] for mes in series_mensais],
                "consumo_mensal_kwh": [mes["consumo_mensal_kwh"] for mes in series_mensais],
                "gastos_estimados_reais": [mes["gasto_estimado_reais"] for mes in series_mensais],
                "variacao_percentual": [mes["variacao_percentual"] for mes in series_mensais],
            },
            "series_mensais": series_mensais,
            "historico": historico,
            "tarifa_referencia_kwh": str(TARIFA_REFERENCIA_KWH),
        },
        status=200,
    )
